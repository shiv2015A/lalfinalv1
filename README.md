# Label & Loom (lalfinalv1)

> **Label & Loom** — Contemporary Indian ethnic wear atelier selling viral aesthetic kurtis and handcrafted wedding collection ensembles for women, featuring both **Buy** and **Rent** (3-day / 7-day) options.

---

## ✨ Features

- **Mobile-First High Density Layout**: Auto-fitting mobile e-commerce design inspired by Meesho and Flipkart (2-column mobile catalog grid, circular category avatars, two-row mobile header, sticky bottom nav).
- **Authentic Curated Catalog**: Features 3 curated artisanal ensembles with zero fake ratings or artificial reviews.
- **Buy & Rent Options**:
  - Purchase outright with instant savings.
  - Flexible rental options (3-day & 7-day duration) with transparent security deposit and dry-clean sanitization.
- **Instagram DM Order System**:
  - Seamless 1-click booking voucher generation (`#LL-xxxxx`) targeting official handle **`@labelandloom.in`**.
  - Copies structured order details to clipboard and redirects to Instagram DM.
- **Admin Atelier Portal**:
  - Authenticated admin access (Username: `admin`, Password: `admin123`).
  - Add new outfits manually or upload product images.
  - **Smart OCR & Vision Extraction**: Upload screenshot images or paste e-commerce links to auto-extract product title, pricing, fabric, and specifications using Tesseract OCR.
  - Live product editing, deletion, and out-of-stock toggles.
- **Cloud Firestore & Local Persistence**:
  - Connected to Cloud Firestore (`labelandloom-store`) with automated fallback and local synchronization.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express.js
- **Database**: Cloud Firestore (Firebase Web SDK v10)
- **Computer Vision / OCR**: Tesseract.js
- **State Management**: React Context (`StoreContext`)

---

## 🚀 Getting Started

### 1. Installation
```bash
git clone https://github.com/shiv2015A/lalfinalv1.git
cd lalfinalv1
npm install
```

### 2. Build Frontend
```bash
npm run build
```

### 3. Start Server
```bash
npm start
```
The server will run on `http://localhost:5000`.

### 4. Development Mode (Vite Dev Server)
```bash
npm run dev
```

---

## 🔐 Admin Credentials
- **Username**: `admin`
- **Password**: `admin123`
- Direct access: Click "Admin Atelier" in the top bar or footer.

---

## 📱 Official Brand Social
- **Instagram**: [@labelandloom.in](https://www.instagram.com/labelandloom.in/)
