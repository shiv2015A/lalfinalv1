// server/store.js - Unified Storage (Firestore with Local Persistent Cache & Serverless Resilience)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeApp, getApps, deleteApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  updateDoc
} from 'firebase/firestore';
import { initialProducts } from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '..', 'data', 'products.json');
const CONFIG_FILE = path.join(__dirname, '..', 'data', 'firebase-config.json');

let firestoreDb = null;
let firebaseApp = null;
let memoryProducts = [...initialProducts];
let firestoreStatus = {
  connected: false,
  usingFallback: true,
  projectId: null,
  lastError: null,
  collectionName: 'products'
};

// Initialize local data file if not present (safe for read-only serverless filesystems)
export function initStore() {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      try {
        fs.mkdirSync(dir, { recursive: true });
      } catch (_) {}
    }

    if (!fs.existsSync(DATA_FILE)) {
      try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(initialProducts, null, 2), 'utf-8');
      } catch (_) {}
    }
  } catch (err) {
    console.warn('Local file store notice:', err.message);
  }

  // Load existing products if available
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
      if (Array.isArray(data) && data.length > 0) {
        memoryProducts = data;
      }
    }
  } catch (_) {}

  // Check if firebase config exists
  if (fs.existsSync(CONFIG_FILE)) {
    try {
      const cfg = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
      initFirestore(cfg);
    } catch (e) {
      console.warn('Could not read existing Firebase config:', e.message);
    }
  }
}

// Initialize Firebase / Firestore
export async function initFirestore(config) {
  try {
    if (!config || !config.projectId) {
      firestoreStatus = {
        connected: false,
        usingFallback: true,
        projectId: null,
        lastError: 'Missing projectId in Firebase configuration',
        collectionName: 'products'
      };
      return false;
    }

    // Clean existing app if any
    const existing = getApps();
    if (existing.length > 0) {
      for (const app of existing) {
        try {
          await deleteApp(app);
        } catch (_) {}
      }
    }

    firebaseApp = initializeApp(config);
    firestoreDb = getFirestore(firebaseApp);

    firestoreStatus = {
      connected: true,
      usingFallback: false,
      projectId: config.projectId,
      lastError: null,
      collectionName: 'products'
    };

    // Save config for persistence (ignore if read-only)
    try {
      fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
    } catch (_) {}

    console.log(`[Firestore] Connected successfully to project: ${config.projectId}`);

    // Sync seed data to Firestore if collection is empty
    try {
      const colRef = collection(firestoreDb, 'products');
      const snap = await getDocs(colRef);
      if (snap.empty) {
        console.log('[Firestore] Collection empty. Seeding initial products...');
        const local = getLocalProducts();
        for (const item of local) {
          await setDoc(doc(firestoreDb, 'products', item.id), item);
        }
      }
    } catch (err) {
      console.warn('[Firestore] Sync check warning:', err.message);
    }

    return true;
  } catch (err) {
    console.error('[Firestore] Initialization error:', err.message);
    firestoreStatus = {
      connected: false,
      usingFallback: true,
      projectId: config?.projectId || null,
      lastError: err.message,
      collectionName: 'products'
    };
    return false;
  }
}

export function getFirestoreStatus() {
  return firestoreStatus;
}

// Local File Read / Write helpers with memory caching
function getLocalProducts() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryProducts = parsed;
        return parsed;
      }
    }
  } catch (err) {
    // Read error fallback
  }
  return memoryProducts && memoryProducts.length > 0 ? memoryProducts : initialProducts;
}

function saveLocalProducts(products) {
  memoryProducts = products;
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2), 'utf-8');
  } catch (err) {
    // Read-only filesystem warning handled gracefully
  }
}

// Product Operations
export async function getAllProducts() {
  if (firestoreStatus.connected && firestoreDb) {
    try {
      const colRef = collection(firestoreDb, 'products');
      const snap = await getDocs(colRef);
      const items = [];
      snap.forEach(docSnap => {
        items.push({ id: docSnap.id, ...docSnap.data() });
      });
      if (items.length > 0) {
        saveLocalProducts(items); // mirror to memory & local cache
        return items;
      }
    } catch (err) {
      console.warn('[Firestore] Query notice, serving local memory store:', err.message);
    }
  }
  return getLocalProducts();
}

export async function addProduct(product) {
  const newProduct = {
    ...product,
    id: product.id || `prod-${Date.now()}`,
    createdAt: product.createdAt || new Date().toISOString()
  };

  // Memory & Local write
  const products = getLocalProducts();
  products.unshift(newProduct);
  saveLocalProducts(products);

  // Firestore write
  if (firestoreStatus.connected && firestoreDb) {
    try {
      await setDoc(doc(firestoreDb, 'products', newProduct.id), newProduct);
    } catch (err) {
      console.warn('[Firestore] Remote add failed:', err.message);
    }
  }

  return newProduct;
}

export async function updateProduct(id, updates) {
  const products = getLocalProducts();
  const index = products.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error('Product not found');
  }

  const updated = {
    ...products[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  products[index] = updated;
  saveLocalProducts(products);

  if (firestoreStatus.connected && firestoreDb) {
    try {
      await updateDoc(doc(firestoreDb, 'products', id), updates);
    } catch (err) {
      console.warn('[Firestore] Remote update failed:', err.message);
    }
  }

  return updated;
}

export async function deleteProduct(id) {
  const products = getLocalProducts();
  const filtered = products.filter(p => p.id !== id);
  saveLocalProducts(filtered);

  if (firestoreStatus.connected && firestoreDb) {
    try {
      await deleteDoc(doc(firestoreDb, 'products', id));
    } catch (err) {
      console.warn('[Firestore] Remote delete failed:', err.message);
    }
  }

  return { success: true, id };
}

export async function resetStore() {
  saveLocalProducts(initialProducts);
  if (firestoreStatus.connected && firestoreDb) {
    try {
      for (const item of initialProducts) {
        await setDoc(doc(firestoreDb, 'products', item.id), item);
      }
      console.log('[Firestore] Re-seeded products in Firestore without fake ratings.');
    } catch (err) {
      console.warn('[Firestore] Remote reset failed:', err.message);
    }
  }
  return initialProducts;
}
