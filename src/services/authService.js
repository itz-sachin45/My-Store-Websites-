import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../firebase/firebaseConfig';

const DEMO_USER_KEY = 'mystore_demo_admin_user';

// Listeners for mock auth state
const mockAuthListeners = new Set();

const notifyMockListeners = (user) => {
  mockAuthListeners.forEach((callback) => {
    try {
      callback(user);
    } catch (e) {
      console.error(e);
    }
  });
};

export const authService = {
  // Sign in with email and password
  async login(email, password) {
    if (isFirebaseConfigured && auth) {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    }

    // Fallback demo authentication
    // Default credentials: admin@mystore.com / admin123
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // Allow standard admin demo credentials or any email with 6+ char password for testing
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    const demoUser = {
      uid: 'demo-admin-uid-12345',
      email: email.trim().toLowerCase(),
      displayName: 'Demo Store Admin',
      isDemo: true,
    };

    localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser));
    notifyMockListeners(demoUser);
    return demoUser;
  },

  // Sign out
  async logout() {
    if (isFirebaseConfigured && auth) {
      await firebaseSignOut(auth);
      return;
    }

    localStorage.removeItem(DEMO_USER_KEY);
    notifyMockListeners(null);
  },

  // Subscribe to auth state changes
  onAuthStateChanged(callback) {
    if (isFirebaseConfigured && auth) {
      return firebaseOnAuthStateChanged(auth, callback);
    }

    // Demo mode: read current local storage user immediately
    const raw = localStorage.getItem(DEMO_USER_KEY);
    const currentUser = raw ? JSON.parse(raw) : null;
    mockAuthListeners.add(callback);

    // Call callback asynchronously to match Firebase behavior
    setTimeout(() => {
      callback(currentUser);
    }, 50);

    // Return unsubscribe function
    return () => {
      mockAuthListeners.delete(callback);
    };
  },

  // Get current user synchronously if available
  getCurrentUser() {
    if (isFirebaseConfigured && auth) {
      return auth.currentUser;
    }
    const raw = localStorage.getItem(DEMO_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },

  isLiveFirebase() {
    return isFirebaseConfigured;
  },
};
