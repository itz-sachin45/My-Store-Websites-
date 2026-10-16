import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, isFirebaseConfigured } from '../firebase/firebaseConfig';
import { INITIAL_PRODUCTS } from './mockData';

const LOCAL_STORAGE_KEY = 'mystore_products_data';

// URL normalizer helper: ensures URL has http:// or https:// protocol
export const formatUrl = (string) => {
  if (!string || typeof string !== 'string') return '';
  const trimmed = string.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

// Helper for local mock storage
const getLocalProducts = () => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!data) {
    const initialized = INITIAL_PRODUCTS.map((p) => ({
      ...p,
      affiliateLink: formatUrl(p.affiliateLink),
    }));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialized));
    return initialized;
  }
  try {
    const parsed = JSON.parse(data);
    return parsed.map((p) => ({
      ...p,
      affiliateLink: formatUrl(p.affiliateLink),
    }));
  } catch {
    return [...INITIAL_PRODUCTS];
  }
};

const saveLocalProducts = (prods) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(prods));
};

// Convert File to base64 data URL for demo persistence
const fileToDataUrl = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// URL validation helper
export const isValidUrl = (string) => {
  if (!string || typeof string !== 'string') return false;
  const trimmed = string.trim();
  if (!trimmed) return false;
  try {
    const formatted = formatUrl(trimmed);
    const url = new URL(formatted);
    return (url.protocol === 'http:' || url.protocol === 'https:') && url.hostname.length > 0;
  } catch (_) {
    return false;
  }
};

export const productService = {
  // Upload image to Firebase Storage or convert to Data URL for demo
  async uploadImage(file) {
    if (!file) return null;

    if (isFirebaseConfigured && storage) {
      try {
        const fileExt = file.name.split('.').pop() || 'jpg';
        const fileName = `products/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
        const storageRef = ref(storage, fileName);
        await uploadBytes(storageRef, file, {
          contentType: file.type || 'image/jpeg',
        });
        const downloadUrl = await getDownloadURL(storageRef);
        return downloadUrl;
      } catch (err) {
        console.warn('Firebase Storage upload failed, fallback to data URL:', err);
      }
    }

    // Fallback: convert file to Base64 Data URL for demo testing
    return await fileToDataUrl(file);
  },

  // Get products with filtering, search, sorting, and pagination
  async getProducts({
    categoryId = null,
    search = '',
    minRating = 0,
    minPrice = 0,
    maxPrice = 10000,
    sort = 'newest', // 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'popular'
    page = 1,
    pageSize = 12,
  } = {}) {
    let products = [];

    if (isFirebaseConfigured && db) {
      try {
        const colRef = collection(db, 'products');
        // Retrieve products from Firestore
        const q = query(colRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((d) => {
          const data = d.data();
          // Normalize timestamp to ISO string if needed
          let createdAtStr = data.createdAt;
          if (data.createdAt && typeof data.createdAt.toDate === 'function') {
            createdAtStr = data.createdAt.toDate().toISOString();
          }
          let updatedAtStr = data.updatedAt;
          if (data.updatedAt && typeof data.updatedAt.toDate === 'function') {
            updatedAtStr = data.updatedAt.toDate().toISOString();
          }
          products.push({
            id: d.id,
            ...data,
            createdAt: createdAtStr || new Date().toISOString(),
            updatedAt: updatedAtStr || new Date().toISOString(),
          });
        });
      } catch (err) {
        console.warn('Firestore getProducts failed, using local fallback:', err);
        products = getLocalProducts();
      }
    } else {
      products = getLocalProducts();
    }

    // Client-side filtering (handles category, text search, price, rating)
    let filtered = [...products];

    if (categoryId && categoryId !== 'all') {
      filtered = filtered.filter((p) => p.categoryId === categoryId);
    }

    if (search && search.trim()) {
      const term = search.trim().toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title?.toLowerCase().includes(term) ||
          p.description?.toLowerCase().includes(term)
      );
    }

    if (minRating > 0) {
      filtered = filtered.filter((p) => Number(p.rating || 0) >= minRating);
    }

    filtered = filtered.filter((p) => {
      const price = Number(p.price || 0);
      return price >= minPrice && price <= maxPrice;
    });

    // Sorting
    switch (sort) {
      case 'newest':
      case 'new':
        filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      case 'price-asc':
        filtered.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
        break;
      case 'price-desc':
        filtered.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
        break;
      case 'rating':
        filtered.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
        break;
      case 'popular':
        // Sort by isPopular flag first, then by rating desc
        filtered.sort((a, b) => {
          if (a.isPopular && !b.isPopular) return -1;
          if (!a.isPopular && b.isPopular) return 1;
          return Number(b.rating || 0) - Number(a.rating || 0);
        });
        break;
      default:
        break;
    }

    // Pagination
    const totalCount = filtered.length;
    const startIndex = (page - 1) * pageSize;
    const paginatedProducts = filtered.slice(startIndex, startIndex + pageSize);
    const hasMore = startIndex + pageSize < totalCount;

    return {
      products: paginatedProducts,
      totalCount,
      page,
      pageSize,
      hasMore,
    };
  },

  // Get specific curated lists for Homepage sections
  async getHomeSections() {
    let all = [];
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(50));
        const snap = await getDocs(q);
        snap.forEach((d) => {
          const data = d.data();
          let createdAtStr = data.createdAt;
          if (data.createdAt && typeof data.createdAt.toDate === 'function') {
            createdAtStr = data.createdAt.toDate().toISOString();
          }
          all.push({
            id: d.id,
            ...data,
            createdAt: createdAtStr || new Date().toISOString(),
          });
        });
      } catch (err) {
        console.warn('Firestore getHomeSections failed:', err);
        all = getLocalProducts();
      }
    } else {
      all = getLocalProducts();
    }

    // 1. New Products: sorted by createdAt desc, limit 10
    const newProducts = [...all]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 10);

    // 2. Most Popular: isPopular === true or highest ratings, limit 10
    const mostPopular = [...all]
      .sort((a, b) => {
        if (a.isPopular && !b.isPopular) return -1;
        if (!a.isPopular && b.isPopular) return 1;
        return Number(b.rating || 0) - Number(a.rating || 0);
      })
      .slice(0, 10);

    // 3. All Products: default order, limit 10
    const allProducts = all.slice(0, 10);

    return {
      newProducts,
      mostPopular,
      allProducts,
    };
  },

  // Get single product by ID
  async getById(id) {
    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          let createdAtStr = data.createdAt;
          if (data.createdAt && typeof data.createdAt.toDate === 'function') {
            createdAtStr = data.createdAt.toDate().toISOString();
          }
          let updatedAtStr = data.updatedAt;
          if (data.updatedAt && typeof data.updatedAt.toDate === 'function') {
            updatedAtStr = data.updatedAt.toDate().toISOString();
          }
          return {
            id: docSnap.id,
            ...data,
            createdAt: createdAtStr,
            updatedAt: updatedAtStr,
          };
        }
        return null;
      } catch (err) {
        console.warn('Firestore getById failed:', err);
      }
    }
    const products = getLocalProducts();
    return products.find((p) => p.id === id) || null;
  },

  // Create product
  async create({
    title,
    description,
    price,
    rating,
    categoryId,
    imageUrl,
    affiliateLink,
    isPopular = false,
  }) {
    if (!title || !title.trim()) throw new Error('Product title is required');
    if (price === undefined || price === null || isNaN(price) || price < 0) {
      throw new Error('Valid price (>= 0) is required');
    }
    if (rating === undefined || rating === null || isNaN(rating) || rating < 0 || rating > 5) {
      throw new Error('Rating must be between 0 and 5');
    }
    if (!categoryId) throw new Error('Category selection is required');
    const normalizedLink = formatUrl(affiliateLink);
    if (!normalizedLink || !isValidUrl(normalizedLink)) {
      throw new Error('A valid affiliate URL is required (e.g. https://amazon.com/... or amazon.com/...)');
    }

    const payload = {
      title: title.trim(),
      description: (description || '').trim(),
      price: Number(price),
      rating: Number(rating),
      categoryId,
      imageUrl: (imageUrl || '').trim(),
      affiliateLink: normalizedLink,
      isPopular: Boolean(isPopular),
      createdAt: isFirebaseConfigured ? serverTimestamp() : new Date().toISOString(),
      updatedAt: isFirebaseConfigured ? serverTimestamp() : new Date().toISOString(),
    };

    if (isFirebaseConfigured && db) {
      const docRef = await addDoc(collection(db, 'products'), payload);
      return { id: docRef.id, ...payload };
    }

    const products = getLocalProducts();
    const newProduct = {
      id: `prod-${Date.now()}`,
      ...payload,
    };
    products.unshift(newProduct);
    saveLocalProducts(products);
    return newProduct;
  },

  // Update product
  async update(id, updates) {
    let finalUpdates = { ...updates };
    if (finalUpdates.affiliateLink) {
      finalUpdates.affiliateLink = formatUrl(finalUpdates.affiliateLink);
      if (!isValidUrl(finalUpdates.affiliateLink)) {
        throw new Error('A valid affiliate URL is required (e.g. https://amazon.com/... or amazon.com/...)');
      }
    }
    if (updates.rating !== undefined && (updates.rating < 0 || updates.rating > 5)) {
      throw new Error('Rating must be between 0 and 5');
    }
    if (updates.price !== undefined && updates.price < 0) {
      throw new Error('Price cannot be negative');
    }

    const payload = {
      ...updates,
      price: updates.price !== undefined ? Number(updates.price) : undefined,
      rating: updates.rating !== undefined ? Number(updates.rating) : undefined,
      updatedAt: isFirebaseConfigured ? serverTimestamp() : new Date().toISOString(),
    };

    // Remove undefined keys
    Object.keys(payload).forEach((key) => payload[key] === undefined && delete payload[key]);

    if (isFirebaseConfigured && db) {
      const docRef = doc(db, 'products', id);
      await updateDoc(docRef, payload);
      return { id, ...payload };
    }

    const products = getLocalProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Product not found');
    products[index] = { ...products[index], ...payload };
    saveLocalProducts(products);
    return products[index];
  },

  // Delete product
  async delete(id) {
    if (isFirebaseConfigured && db) {
      const docRef = doc(db, 'products', id);
      await deleteDoc(docRef);
      return true;
    }

    const products = getLocalProducts();
    const filtered = products.filter((p) => p.id !== id);
    saveLocalProducts(filtered);
    return true;
  },

  // Check if any product references a specific categoryId
  async countByCategory(categoryId) {
    const products = isFirebaseConfigured && db ? (await this.getProducts({ categoryId, pageSize: 1000 })).products : getLocalProducts();
    return products.filter((p) => p.categoryId === categoryId).length;
  },

  // Reset to initial demo products
  resetDemo() {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
    return [...INITIAL_PRODUCTS];
  },
};
