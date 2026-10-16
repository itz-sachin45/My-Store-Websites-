/**
 * Firebase Firestore Seeding Script
 * 
 * Usage:
 *   node scripts/seed.js
 * 
 * Populates Firestore with demo categories and products according to PRD schema.
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

// Parse .env manually without external dependencies
const envPath = resolve(process.cwd(), '.env');
if (existsSync(envPath)) {
  const content = readFileSync(envPath, 'utf-8');
  content.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.substring(0, idx).trim();
        const value = trimmed.substring(idx + 1).trim();
        process.env[key] = value;
      }
    }
  });
}

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const SEED_CATEGORIES = [
  {
    id: 'cat-electronics',
    name: 'Electronics & Audio',
    iconKey: 'Devices',
  },
  {
    id: 'cat-home',
    name: 'Home & Workspace',
    iconKey: 'Chair',
  },
  {
    id: 'cat-fashion',
    name: 'Apparel & Carry',
    iconKey: 'Checkroom',
  },
  {
    id: 'cat-fitness',
    name: 'Fitness & Everyday',
    iconKey: 'FitnessCenter',
  },
  {
    id: 'cat-kitchen',
    name: 'Kitchen & Coffee',
    iconKey: 'Kitchen',
  },
  {
    id: 'cat-gaming',
    name: 'Gaming & Setup',
    iconKey: 'SportsEsports',
  },
];

const SEED_PRODUCTS = [
  {
    id: 'prod-1',
    title: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
    description: 'Industry-leading noise cancellation optimized by dual processors. Magnificent audio reproduction with 30mm carbon fiber drivers and up to 30-hour battery life with quick charging capability.',
    price: 349.99,
    rating: 4.8,
    categoryId: 'cat-electronics',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    affiliateLink: 'https://amazon.com/dp/B09XS7JWHH?tag=mystore-20',
    isPopular: true,
  },
  {
    id: 'prod-2',
    title: 'Keychron Q1 Pro Wireless Custom Mechanical Keyboard',
    description: 'Full aluminum CNC machined 75% layout keyboard with double-gasket design, programmable knob, QMK/VIA support, and hot-swappable tactile mechanical switches.',
    price: 199.00,
    rating: 4.9,
    categoryId: 'cat-electronics',
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    affiliateLink: 'https://keychron.com/products/keychron-q1-pro?ref=mystore',
    isPopular: true,
  },
  {
    id: 'prod-3',
    title: 'Herman Miller Aeron Ergonomic Chair - Graphite Edition',
    description: 'The benchmark for ergonomic seating. Features Pellicle 8Z breathable suspension, fully adjustable PostureFit SL lumbar support, and smooth harmonic tilt mechanism.',
    price: 1295.00,
    rating: 4.9,
    categoryId: 'cat-home',
    imageUrl: 'https://images.unsplash.com/photo-1580481077195-c3a821a58875?auto=format&fit=crop&w=800&q=80',
    affiliateLink: 'https://store.hermanmiller.com/home-office-chairs/aeron-chair/2195368.html?ref=mystore',
    isPopular: true,
  },
  {
    id: 'prod-4',
    title: 'BenQ ScreenBar Pro Monitor Light with Auto-Dimming',
    description: 'Patented asymmetrical optical design prevents screen reflection while delivering uniform illumination across your desktop. Integrated ambient sensor and presence detection.',
    price: 139.00,
    rating: 4.7,
    categoryId: 'cat-home',
    imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80',
    affiliateLink: 'https://benq.com/en-us/lighting/monitor-light/screenbar-pro.html?ref=mystore',
    isPopular: false,
  },
  {
    id: 'prod-5',
    title: 'Fellow Stagg EKG Electric Gooseneck Pour-Over Kettle',
    description: 'Precision pour spout with counterbalanced handle for steady flow control. Variable temperature dial with 60-minute heat hold and LCD display. Matte black finish.',
    price: 165.00,
    rating: 4.8,
    categoryId: 'cat-kitchen',
    imageUrl: 'https://images.unsplash.com/photo-1517668808822-9ebb02ae2a0e?auto=format&fit=crop&w=800&q=80',
    affiliateLink: 'https://fellowproducts.com/products/stagg-ekg-electric-pour-over-kettle?ref=mystore',
    isPopular: true,
  },
  {
    id: 'prod-6',
    title: 'Bellroy Classic Backpack Plus 24L - Water-Resistant Recycled Fabric',
    description: 'Engineered daily commute bag with separate 16-inch laptop compartment, quick-access top valet pocket, contoured lumbar harness, and premium leather accents.',
    price: 179.00,
    rating: 4.6,
    categoryId: 'cat-fashion',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    affiliateLink: 'https://bellroy.com/products/classic-backpack-plus?ref=mystore',
    isPopular: false,
  },
  {
    id: 'prod-7',
    title: 'Logitech MX Master 3S Wireless Performance Mouse',
    description: 'Ultra-fast MagSpeed electromagnetic scrolling, 8K DPI tracking on any glass surface, and quiet click acoustic dampening. Ergonomic silhouette designed for long hours.',
    price: 99.99,
    rating: 4.9,
    categoryId: 'cat-electronics',
    imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
    affiliateLink: 'https://amazon.com/dp/B09HM94VDS?tag=mystore-20',
    isPopular: true,
  },
  {
    id: 'prod-8',
    title: 'Theragun Prime Smart Percussive Therapy Deep Muscle Treatment',
    description: 'QuietForce technology brushless motor delivers deep muscle treatment to relieve aches and accelerate recovery. Customizable speed ranges via Bluetooth companion app.',
    price: 299.00,
    rating: 4.7,
    categoryId: 'cat-fitness',
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
    affiliateLink: 'https://therabody.com/products/theragun-prime?ref=mystore',
    isPopular: false,
  },
  {
    id: 'prod-9',
    title: 'Baratza Encore ESP Conical Burr Espresso & Coffee Grinder',
    description: 'Precision 40-step grind adjustment calibrated for both silky fine espresso extraction and coarse pour-over brew. High torque DC motor with durable alloy M2 burrs.',
    price: 199.95,
    rating: 4.8,
    categoryId: 'cat-kitchen',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    affiliateLink: 'https://baratza.com/product/encore-esp?ref=mystore',
    isPopular: true,
  },
  {
    id: 'prod-10',
    title: 'Elgato Stream Deck MK.2 Custom Studio Controller',
    description: '15 customizable LCD keys to control apps, tools, scene switching, audio levels, and automation macros. Interchangeable faceplates with detachable 45-degree angle stand.',
    price: 149.99,
    rating: 4.8,
    categoryId: 'cat-gaming',
    imageUrl: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=800&q=80',
    affiliateLink: 'https://elgato.com/products/stream-deck-mk2?ref=mystore',
    isPopular: true,
  },
];

async function runSeed() {
  console.log('--- My Store Firestore Database Seeder ---');

  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.warn('[NOTICE] Firebase credentials not configured in .env file.');
    console.warn('The application includes built-in demo data for local development.');
    console.warn('To seed a live Firestore cloud database, configure your Firebase project credentials in .env and run:');
    console.warn('  npm run seed');
    process.exit(0);
  }

  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    console.log(`Connecting to project: ${firebaseConfig.projectId}...`);

    console.log(`Seeding ${SEED_CATEGORIES.length} categories...`);
    for (const cat of SEED_CATEGORIES) {
      const docRef = doc(db, 'categories', cat.id);
      await setDoc(docRef, {
        name: cat.name,
        iconKey: cat.iconKey,
        createdAt: serverTimestamp(),
      });
      console.log(`  + Category [${cat.id}]: ${cat.name}`);
    }

    console.log(`Seeding ${SEED_PRODUCTS.length} products...`);
    for (const prod of SEED_PRODUCTS) {
      const docRef = doc(db, 'products', prod.id);
      await setDoc(docRef, {
        title: prod.title,
        description: prod.description,
        price: prod.price,
        rating: prod.rating,
        categoryId: prod.categoryId,
        imageUrl: prod.imageUrl,
        affiliateLink: prod.affiliateLink,
        isPopular: prod.isPopular,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      console.log(`  + Product [${prod.id}]: ${prod.title}`);
    }

    console.log('--- Seeding completed successfully! ---');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed with error:', err);
    process.exit(1);
  }
}

runSeed();
