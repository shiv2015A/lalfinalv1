// api/index.js - Vercel Serverless Function Entry Point
import app from '../server/app.js';
import { initStore } from '../server/store.js';

try {
  initStore();
} catch (e) {
  console.warn('Vercel store initialization notice:', e.message);
}

export default app;
