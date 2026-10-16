import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/firebaseConfig';
import { INITIAL_CATEGORIES } from './mockData';

const LOCAL_STORAGE_KEY = 'mystore_categories_data';

// Helper for local mock storage
const getLocalCategories = () => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_CATEGORIES));
    return [...INITIAL_CATEGORIES];
  }
  try {
    return JSON.parse(data);
  } catch {
    return [...INITIAL_CATEGORIES];
  }
};

const saveLocalCategories = (cats) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cats));
};

export const categoryService = {
  // Get all categories
  async getAll() {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, 'categories'), orderBy('name', 'asc'));
        const querySnapshot = await getDocs(q);
        const categories = [];
        querySnapshot.forEach((d) => {
          categories.push({ id: d.id, ...d.data() });
        });
        // If Firestore is completely empty, we can return empty or fallback
        return categories;
      } catch (err) {
        console.warn('Firestore getCategories failed, falling back to local storage:', err);
      }
    }
    const local = getLocalCategories();
    return local.sort((a, b) => a.name.localeCompare(b.name));
  },

  // Get single category by ID
  async getById(id) {
    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, 'categories', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return { id: docSnap.id, ...docSnap.data() };
        }
        return null;
      } catch (err) {
        console.warn('Firestore getCategoryById failed:', err);
      }
    }
    const categories = getLocalCategories();
    return categories.find((c) => c.id === id) || null;
  },

  // Create new category
  async create({ name, iconKey }) {
    if (!name || !name.trim()) {
      throw new Error('Category name is required');
    }

    const payload = {
      name: name.trim(),
      iconKey: (iconKey || 'Category').trim(),
      createdAt: isFirebaseConfigured ? serverTimestamp() : new Date().toISOString(),
    };

    if (isFirebaseConfigured && db) {
      const docRef = await addDoc(collection(db, 'categories'), payload);
      return { id: docRef.id, ...payload };
    }

    const categories = getLocalCategories();
    const newCat = {
      id: `cat-${Date.now()}`,
      ...payload,
    };
    categories.push(newCat);
    saveLocalCategories(categories);
    return newCat;
  },

  // Update existing category
  async update(id, { name, iconKey }) {
    if (!name || !name.trim()) {
      throw new Error('Category name is required');
    }

    const updates = {
      name: name.trim(),
      iconKey: (iconKey || 'Category').trim(),
      updatedAt: isFirebaseConfigured ? serverTimestamp() : new Date().toISOString(),
    };

    if (isFirebaseConfigured && db) {
      const docRef = doc(db, 'categories', id);
      await updateDoc(docRef, updates);
      return { id, ...updates };
    }

    const categories = getLocalCategories();
    const index = categories.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error('Category not found');
    }
    categories[index] = { ...categories[index], ...updates };
    saveLocalCategories(categories);
    return categories[index];
  },

  // Delete category
  async delete(id) {
    if (isFirebaseConfigured && db) {
      const docRef = doc(db, 'categories', id);
      await deleteDoc(docRef);
      return true;
    }

    const categories = getLocalCategories();
    const filtered = categories.filter((c) => c.id !== id);
    saveLocalCategories(filtered);
    return true;
  },

  // Reset to initial demo categories
  resetDemo() {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_CATEGORIES));
    return [...INITIAL_CATEGORIES];
  },
};
