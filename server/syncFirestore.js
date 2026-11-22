// server/syncFirestore.js - Overwrites Firestore products with clean seed data (no ratings)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { initialProducts } from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CONFIG_FILE = path.join(__dirname, '..', 'data', 'firebase-config.json');

async function run() {
  if (!fs.existsSync(CONFIG_FILE)) {
    console.error('Config file not found');
    process.exit(1);
  }
  const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
  const app = initializeApp(config);
  const db = getFirestore(app);

  console.log('Writing clean products to Firestore for project:', config.projectId);
  for (const item of initialProducts) {
    // Ensure no rating or reviewsCount exists
    const cleanItem = { ...item };
    delete cleanItem.rating;
    delete cleanItem.reviewsCount;
    await setDoc(doc(db, 'products', cleanItem.id), cleanItem);
    console.log(`Synced ${cleanItem.id}: ${cleanItem.title}`);
  }
  console.log('Successfully synced clean products to Firestore!');
  process.exit(0);
}

run().catch(err => {
  console.error('Sync failed:', err);
  process.exit(1);
});

