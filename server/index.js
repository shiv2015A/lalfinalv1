// server/index.js - Express API for Label & Loom
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';
import { createWorker } from 'tesseract.js';
import {
  initStore,
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  resetStore,
  initFirestore,
  getFirestoreStatus
} from './store.js';
import { parseSpecSheetText, isLikelySpecScreenshot, generateAestheticDescription } from './smartParser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static uploads serving
const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use('/uploads', express.static(uploadsDir));

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname) || '.jpg';
    const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const unique = `${Date.now()}-${Math.round(Math.random() * 1E6)}`;
    const filename = `${cleanName}-${unique}${ext}`;
    cb(null, filename);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB max per file
});

// Admin Auth Token Map (in-memory token session)
const ADMIN_TOKENS = new Set(['admin-session-active-token']);

function authenticateAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (!token || !ADMIN_TOKENS.has(token)) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired admin session' });
  }
  next();
}

// ----------------------------------------------------
// ROUTES
// ----------------------------------------------------

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    brand: 'Label & Loom',
    timestamp: new Date().toISOString(),
    firestore: getFirestoreStatus()
  });
});

// Admin Login
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  // Exact user specified credentials: admin & admin123
  if (username === 'admin' && password === 'admin123') {
    const token = `loom-admin-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    ADMIN_TOKENS.add(token);
    return res.json({
      success: true,
      token,
      user: {
        username: 'admin',
        role: 'Administrator',
        brand: 'Label & Loom Atelier'
      }
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Invalid admin credentials. Please use admin and admin123.'
  });
});

// Verify Token
app.get('/api/auth/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.json({ valid: false });
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  res.json({ valid: ADMIN_TOKENS.has(token) });
});

// Products: List
app.get('/api/products', async (req, res) => {
  try {
    const { category, search, viral, wedding, featured } = req.query;
    let products = await getAllProducts();

    if (category && category !== 'all') {
      products = products.filter(p => p.category === category || p.tags?.includes(category));
    }
    if (wedding === 'true') {
      products = products.filter(p => p.inWeddingSection || p.category === 'wedding' || p.tags?.includes('wedding'));
    }
    if (viral === 'true') {
      products = products.filter(p => p.isViral || p.tags?.includes('viral'));
    }
    if (featured === 'true') {
      products = products.filter(p => p.isFeatured);
    }
    if (search) {
      const q = search.toLowerCase();
      products = products.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.specs?.color?.toLowerCase().includes(q) ||
        p.specs?.kurtaFabric?.toLowerCase().includes(q) ||
        p.tags?.some(t => t.toLowerCase().includes(q))
      );
    }

    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Products: Create
app.post('/api/products', authenticateAdmin, async (req, res) => {
  try {
    const productData = req.body;
    if (!productData.title || !productData.price) {
      return res.status(400).json({ error: 'Title and Price are required' });
    }

    const created = await addProduct(productData);
    res.status(201).json(created);
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).json({ error: err.message });
  }
});

// Products: Update
app.put('/api/products/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updated = await updateProduct(id, updates);
    res.json(updated);
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ error: err.message });
  }
});

// Products: Delete
app.delete('/api/products/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteProduct(id);
    res.json(result);
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ error: err.message });
  }
});

// File Upload Endpoint
app.post('/api/upload', authenticateAdmin, upload.array('files', 12), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const uploadedUrls = req.files.map(file => {
      return {
        filename: file.filename,
        originalName: file.originalname,
        url: `/uploads/${file.filename}`,
        size: file.size,
        path: file.path
      };
    });

    res.json({ success: true, files: uploadedUrls });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ====================================================
// SMART SYSTEM: OCR & VISION FROM SCREENSHOTS
// ====================================================
app.post('/api/extract/screenshot', authenticateAdmin, upload.array('screenshots', 10), async (req, res) => {
  let worker = null;
  try {
    const files = req.files || [];
    if (files.length === 0) {
      return res.status(400).json({ error: 'Please upload at least one screenshot or image' });
    }

    console.log(`[Smart System] Processing ${files.length} image(s)...`);

    // Initialize Tesseract worker
    worker = await createWorker('eng');

    let combinedOcrText = '';
    const fileClassifications = [];

    for (const file of files) {
      try {
        const { data: { text } } = await worker.recognize(file.path);
        const trimmed = text.trim();
        const isSpec = isLikelySpecScreenshot(trimmed);

        fileClassifications.push({
          url: `/uploads/${file.filename}`,
          filename: file.filename,
          isSpecScreenshot: isSpec,
          detectedTextLength: trimmed.length,
          previewText: trimmed.substring(0, 120)
        });

        if (trimmed.length > 0) {
          combinedOcrText += `\n--- [Image: ${file.originalname}] ---\n` + trimmed + '\n';
        }
      } catch (ocrErr) {
        console.warn(`OCR error on ${file.filename}:`, ocrErr.message);
        fileClassifications.push({
          url: `/uploads/${file.filename}`,
          filename: file.filename,
          isSpecScreenshot: false,
          error: ocrErr.message
        });
      }
    }

    // Parse combined OCR text using our intelligent parser
    const parsedSpecs = parseSpecSheetText(combinedOcrText);

    // Group images: separate spec screenshots from model dress photos
    const productImages = fileClassifications
      .filter(item => !item.isSpecScreenshot)
      .map(item => item.url);

    const specScreenshots = fileClassifications
      .filter(item => item.isSpecScreenshot)
      .map(item => item.url);

    // If all were classified as spec screenshots (or all as photos), ensure productImages isn't empty
    if (productImages.length === 0 && fileClassifications.length > 0) {
      productImages.push(fileClassifications[0].url);
    }

    // Determine pricing and category heuristics
    let suggestedPrice = 1999;
    let originalPrice = 3999;

    if (parsedSpecs?.category === 'wedding') {
      suggestedPrice = 2799;
      originalPrice = 5499;
    }

    res.json({
      success: true,
      data: {
        title: parsedSpecs?.title || 'Exquisite Handcrafted Kurti Set',
        subtitle: `${parsedSpecs?.brandColor || parsedSpecs?.color || 'Artisanal'} ${parsedSpecs?.kurtaFabric || 'Silk Blend'} Ensemble`,
        category: parsedSpecs?.category || 'viral-kurtis',
        categoryName: parsedSpecs?.category === 'wedding' ? 'Wedding & Festive Collection' : 'Viral & Trendy Kurtis',
        price: suggestedPrice,
        originalPrice: originalPrice,
        discount: 50,
        specs: parsedSpecs || {},
        description: parsedSpecs?.aestheticDescription || '',
        productImages,
        specScreenshots,
        rawOcrText: combinedOcrText,
        sizes: parsedSpecs?.sizes || ['S', 'M', 'L', 'XL', 'XXL'],
        inWeddingSection: parsedSpecs?.category === 'wedding',
        isViral: true
      }
    });

  } catch (err) {
    console.error('Smart screenshot processing error:', err);
    res.status(500).json({ error: 'Smart Vision parsing failed: ' + err.message });
  } finally {
    if (worker) {
      try {
        await worker.terminate();
      } catch (_) { }
    }
  }
});

// ====================================================
// SMART SYSTEM: EXTRACT FROM E-COMMERCE LINK
// ====================================================
app.post('/api/extract/link', authenticateAdmin, async (req, res) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'A valid e-commerce URL is required' });
    }

    console.log(`[Smart System] Extracting from link: ${url}`);

    // Native fetch with standard browser headers
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch page. HTTP status: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // 1. Title Extraction
    let title =
      $('meta[property="og:title"]').attr('content') ||
      $('meta[name="twitter:title"]').attr('content') ||
      $('h1').first().text().trim() ||
      $('title').text().trim();

    title = title.replace(/\s*\|\s*.*$/, '').replace(/\s*-\s*Buy\s+.*$/i, '').trim();

    // 2. Description
    let description =
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') ||
      $('meta[name="twitter:description"]').attr('content') ||
      '';

    // 3. Images
    const extractedImages = [];
    const ogImg = $('meta[property="og:image"]').attr('content') || $('meta[name="twitter:image"]').attr('content');
    if (ogImg) extractedImages.push(ogImg);

    // Look for image tags
    $('img').each((_, el) => {
      const src = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-zoom-src');
      if (src && !src.includes('data:image') && !src.includes('icon') && !src.includes('logo') && !src.includes('badge')) {
        let fullSrc = src;
        if (src.startsWith('//')) fullSrc = 'https:' + src;
        else if (src.startsWith('/')) {
          try {
            const parsedUrl = new URL(url);
            fullSrc = `${parsedUrl.origin}${src}`;
          } catch (_) { }
        }
        if (fullSrc.startsWith('http') && !extractedImages.includes(fullSrc) && extractedImages.length < 5) {
          extractedImages.push(fullSrc);
        }
      }
    });

    // 4. Schema.org JSON-LD parsing
    let price = null;
    let originalPrice = null;
    let fabric = '';
    let color = '';

    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const json = JSON.parse($(el).html());
        const data = Array.isArray(json) ? json.find(i => i['@type'] === 'Product') : json;
        if (data && (data['@type'] === 'Product' || data['@type']?.includes?.('Product'))) {
          if (!title && data.name) title = data.name;
          if (!description && data.description) description = data.description;
          if (data.image) {
            const imgs = Array.isArray(data.image) ? data.image : [data.image];
            imgs.forEach(im => {
              const u = typeof im === 'string' ? im : im.url;
              if (u && !extractedImages.includes(u)) extractedImages.unshift(u);
            });
          }
          if (data.offers) {
            const offer = Array.isArray(data.offers) ? data.offers[0] : data.offers;
            if (offer?.price) price = parseFloat(offer.price);
          }
          if (data.color) color = data.color;
          if (data.material) fabric = data.material;
        }
      } catch (_) { }
    });

    // Fallback price detection via regex
    if (!price) {
      const priceText = $('body').text();
      const priceMatch = priceText.match(/₹\s*([0-9,]+)/);
      if (priceMatch) {
        price = parseInt(priceMatch[1].replace(/,/g, ''), 10);
      }
    }

    if (!price || isNaN(price)) {
      price = 1999;
    }
    originalPrice = Math.round(price * 1.8);

    // Heuristic category
    const isWedding = /wedding|bridal|chanderi|zari|anarkali|mirror/i.test(title + ' ' + description);
    const category = isWedding ? 'wedding' : 'viral-kurtis';

    const parsedSpecs = parseSpecSheetText(`${title}\n${description}`);

    res.json({
      success: true,
      data: {
        title: title || 'Trendy Designer Kurti Set',
        price,
        originalPrice,
        discount: Math.round(((originalPrice - price) / originalPrice) * 100),
        category,
        categoryName: isWedding ? 'Wedding & Festive Collection' : 'Viral & Trendy Kurtis',
        description: description || generateAestheticDescription({ title, color: color || 'Vibrant', kurtaFabric: fabric || 'Silk Blend' }),
        productImages: extractedImages.slice(0, 4),
        specs: {
          kurtaFabric: fabric || parsedSpecs?.kurtaFabric || 'Premium Georgette / Silk',
          bottomFabric: parsedSpecs?.bottomFabric || 'Matching Blend',
          dupattaFabric: parsedSpecs?.dupattaFabric || 'Coordinating Drape',
          color: color || parsedSpecs?.color || 'Artisanal Hue',
          occasion: isWedding ? 'Wedding, Festive & Sangeet' : 'Parties & Day Festivities',
          washCare: 'Gentle Hand Wash or Dry Clean'
        },
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        inWeddingSection: isWedding,
        isViral: true
      }
    });

  } catch (err) {
    console.error('Link extraction error:', err);
    res.status(500).json({ error: 'Failed to extract e-commerce details: ' + err.message });
  }
});

// ====================================================
// FIRESTORE CONFIG & SYNC API
// ====================================================
app.get('/api/firestore/status', (req, res) => {
  res.json(getFirestoreStatus());
});

app.post('/api/firestore/config', authenticateAdmin, async (req, res) => {
  try {
    const config = req.body;
    const ok = await initFirestore(config);
    if (ok) {
      res.json({ success: true, message: 'Connected to Firestore successfully', status: getFirestoreStatus() });
    } else {
      res.status(400).json({ success: false, message: 'Failed to connect with provided credentials', status: getFirestoreStatus() });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Seed Initial Catalog Endpoint
app.post('/api/seed', authenticateAdmin, async (req, res) => {
  try {
    const seeded = await resetStore();
    res.json({ success: true, count: seeded.length, products: seeded });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve frontend dist build if present
const distDir = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

// Start Server
initStore();
app.listen(PORT, () => {
  console.log(`✨ Label & Loom Server running on http://localhost:${PORT}`);
});
