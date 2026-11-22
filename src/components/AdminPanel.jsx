// src/components/AdminPanel.jsx - Comprehensive Admin Studio with Stock Control, Editing, Renting & Instagram DM
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Shield, Lock, LogOut, X, Sparkles, UploadCloud, Link as LinkIcon, 
  Database, Plus, Trash2, Edit3, Check, AlertCircle, RefreshCw, 
  Eye, FileText, Image, Search, Crown, Flame, ChevronRight, ToggleLeft, ToggleRight, Clock, Instagram
} from 'lucide-react';

export default function AdminPanel() {
  const {
    isAdminOpen,
    setIsAdminOpen,
    adminToken,
    loginAdmin,
    logoutAdmin,
    products,
    createProduct,
    editProduct,
    toggleStockStatus,
    removeProduct,
    processScreenshots,
    extractFromLink,
    uploadFiles,
    firestoreStatus,
    saveFirestoreConfig,
    resetToSeedCatalog,
    instagramHandle,
    setInstagramHandle,
    formatPrice,
    showToast
  } = useStore();

  // Clean empty login inputs by default (NO PREFILL)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState('catalog');

  // Search filter for catalog
  const [catalogSearch, setCatalogSearch] = useState('');

  // ----------------------------------------------------
  // EDIT PRODUCT MODAL STATE
  // ----------------------------------------------------
  const [editingProduct, setEditingProduct] = useState(null);

  // ----------------------------------------------------
  // SMART SCREENSHOT VISION STATE
  // ----------------------------------------------------
  const [visionFiles, setVisionFiles] = useState([]);
  const [visionLoading, setVisionLoading] = useState(false);
  const [visionProgress, setVisionProgress] = useState('');
  const [visionResult, setVisionResult] = useState(null);

  // ----------------------------------------------------
  // MANUAL PRODUCT FORM STATE
  // ----------------------------------------------------
  const [manualTitle, setManualTitle] = useState('');
  const [manualPrice, setManualPrice] = useState(1999);
  const [manualOriginalPrice, setManualOriginalPrice] = useState(3999);
  const [manualRentPrice, setManualRentPrice] = useState(599);
  const [manualSecurityDeposit, setManualSecurityDeposit] = useState(899);
  const [manualCategory, setManualCategory] = useState('viral-kurtis');
  const [manualDescription, setManualDescription] = useState('');
  const [manualImages, setManualImages] = useState([]);
  const [manualKurtaFabric, setManualKurtaFabric] = useState('Georgette');
  const [manualBottomFabric, setManualBottomFabric] = useState('Georgette');
  const [manualDupattaFabric, setManualDupattaFabric] = useState('Georgette');
  const [manualNeck, setManualNeck] = useState('V Neck');
  const [manualSleeve, setManualSleeve] = useState('Full Sleeve');
  const [manualBottomType, setManualBottomType] = useState('Palazzo');
  const [manualColor, setManualColor] = useState('Maroon');
  const [manualWork, setManualWork] = useState('Real Mirror Work');
  const [manualOccasion, setManualOccasion] = useState('Festive & Wedding');
  const [manualWashCare, setManualWashCare] = useState('Hand Wash Only');
  const [manualSizes, setManualSizes] = useState(['S', 'M', 'L', 'XL', 'XXL']);
  const [manualInWedding, setManualInWedding] = useState(false);
  const [manualIsViral, setManualIsViral] = useState(true);
  const [manualInStock, setManualInStock] = useState(true);
  const [manualUploading, setManualUploading] = useState(false);

  // ----------------------------------------------------
  // E-COMMERCE LINK IMPORT STATE
  // ----------------------------------------------------
  const [linkUrl, setLinkUrl] = useState('');
  const [linkLoading, setLinkLoading] = useState(false);
  const [linkExtractedData, setLinkExtractedData] = useState(null);

  // ----------------------------------------------------
  // FIRESTORE & INSTAGRAM SETTINGS STATE
  // ----------------------------------------------------
  const [fbApiKey, setFbApiKey] = useState('AIzaSyAYDzuKALSajMjeVKe7Nv7CsN3qoec0_BE');
  const [fbProjectId, setFbProjectId] = useState(firestoreStatus.projectId || 'labelandloom-store');
  const [fbConfigLoading, setFbConfigLoading] = useState(false);
  const [tempIgHandle, setTempIgHandle] = useState(instagramHandle);

  if (!isAdminOpen) return null;

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      showToast('Please enter both username and password', 'error');
      return;
    }
    setLoginLoading(true);
    await loginAdmin(username, password);
    setLoginLoading(false);
  };

  // Smart Vision Drop & Run
  const handleVisionDrop = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) setVisionFiles(files);
  };

  const runSmartVision = async () => {
    if (visionFiles.length === 0) {
      showToast('Please select screenshot(s) or model photos first', 'error');
      return;
    }

    try {
      setVisionLoading(true);
      setVisionProgress('Scanning spec sheets & photos with OCR...');
      const data = await processScreenshots(visionFiles);
      setVisionResult(data);
      showToast('Specs & images extracted successfully! ✨');
    } catch (err) {
      showToast('Smart Vision error: ' + err.message, 'error');
    } finally {
      setVisionLoading(false);
      setVisionProgress('');
    }
  };

  const publishVisionProduct = async () => {
    if (!visionResult) return;
    try {
      const price = Number(visionResult.price) || 1999;
      const rentRate = Math.round(price * 0.28);
      const newProd = {
        title: visionResult.title,
        subtitle: visionResult.subtitle,
        category: visionResult.category,
        categoryName: visionResult.categoryName,
        price,
        originalPrice: Number(visionResult.originalPrice) || 3999,
        rentPrice: rentRate,
        rentDurationDays: 3,
        rentSecurityDeposit: Math.round(price * 0.4),
        rentAvailable: true,
        discount: 50,
        images: visionResult.productImages?.length > 0 ? visionResult.productImages : ['/uploads/product-1-main.jpg'],
        specScreenshots: visionResult.specScreenshots || [],
        description: visionResult.description,
        specs: visionResult.specs || {},
        sizes: visionResult.sizes || ['S', 'M', 'L', 'XL', 'XXL'],
        inStock: true,
        inWeddingSection: visionResult.inWeddingSection || false,
        isViral: visionResult.isViral || true,
        isFeatured: true,
        tags: [visionResult.category, 'viral']
      };

      await createProduct(newProd);
      setVisionResult(null);
      setVisionFiles([]);
      setActiveTab('catalog');
    } catch (err) {
      showToast('Error publishing product: ' + err.message, 'error');
    }
  };

  // Handle Manual Upload
  const handleManualImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    try {
      setManualUploading(true);
      const uploaded = await uploadFiles(files);
      const urls = uploaded.map(u => u.url);
      setManualImages(prev => [...prev, ...urls]);
      showToast(`${files.length} photo(s) uploaded!`);
    } catch (err) {
      showToast('Upload error: ' + err.message, 'error');
    } finally {
      setManualUploading(false);
    }
  };

  const handleBeautifyDescription = () => {
    const title = manualTitle || 'Exquisite Handcrafted Kurti Ensemble';
    const color = manualColor || 'Regal Hue';
    const fabric = manualKurtaFabric || 'Pure Handloom Silk';
    const bottom = manualBottomType || 'Palazzo';
    const work = manualWork || 'Artisanal Embroidery';

    const beautified = `Step into unmatched elegance with the **${title}** from Label & Loom Atelier.\n\n` +
      `Meticulously tailored from luxurious **${fabric}** in a spellbinding shade of **${color}**, this 3-piece designer outfit features a graceful **${manualNeck}** and **${manualSleeve}**, elevated by exquisite **${work}**.\n\n` +
      `Paired with a matching **${bottom}** and a fluid drape dupatta, it is the quintessential choice for **${manualOccasion}**.\n\n` +
      `**Care**: ${manualWashCare}.`;

    setManualDescription(beautified);
    showToast('Description beautified with AI editorial copy! ✨');
  };

  const handleCreateManual = async (e) => {
    e.preventDefault();
    if (!manualTitle || !manualPrice) {
      showToast('Title and Price are required', 'error');
      return;
    }

    try {
      const newProd = {
        title: manualTitle,
        category: manualCategory,
        categoryName: manualCategory === 'wedding' ? 'Wedding & Festive Collection' : 'Viral & Trendy Kurtis',
        price: Number(manualPrice),
        originalPrice: Number(manualOriginalPrice),
        rentPrice: Number(manualRentPrice) || Math.round(manualPrice * 0.28),
        rentDurationDays: 3,
        rentSecurityDeposit: Number(manualSecurityDeposit) || Math.round(manualPrice * 0.4),
        rentAvailable: true,
        discount: Math.round(((manualOriginalPrice - manualPrice) / manualOriginalPrice) * 100) || 50,
        images: manualImages.length > 0 ? manualImages : ['/uploads/product-1-main.jpg'],
        description: manualDescription,
        specs: {
          kurtaFabric: manualKurtaFabric,
          bottomFabric: manualBottomFabric,
          dupattaFabric: manualDupattaFabric,
          neck: manualNeck,
          sleeve: manualSleeve,
          bottomType: manualBottomType,
          color: manualColor,
          ornamentation: manualWork,
          occasion: manualOccasion,
          washCare: manualWashCare
        },
        sizes: manualSizes,
        inStock: manualInStock,
        inWeddingSection: manualInWedding || manualCategory === 'wedding',
        isViral: manualIsViral,
        isFeatured: true,
        tags: [manualCategory, manualColor.toLowerCase(), 'viral', 'ethnic']
      };

      await createProduct(newProd);
      setManualTitle('');
      setManualDescription('');
      setManualImages([]);
      setActiveTab('catalog');
    } catch (err) {
      showToast('Error: ' + err.message, 'error');
    }
  };

  // Handle Edit Save
  const handleSaveEdit = async () => {
    if (!editingProduct) return;
    try {
      await editProduct(editingProduct.id, editingProduct);
      setEditingProduct(null);
    } catch (err) {
      showToast('Error updating product: ' + err.message, 'error');
    }
  };

  // Handle Link Extract
  const handleExtractLink = async (e) => {
    e.preventDefault();
    if (!linkUrl) return;

    try {
      setLinkLoading(true);
      const data = await extractFromLink(linkUrl);
      setLinkExtractedData(data);
      showToast('E-Commerce details scraped successfully! 🎉');
    } catch (err) {
      showToast('Extraction failed: ' + err.message, 'error');
    } finally {
      setLinkLoading(false);
    }
  };

  const publishLinkProduct = async () => {
    if (!linkExtractedData) return;
    try {
      await createProduct(linkExtractedData);
      setLinkExtractedData(null);
      setLinkUrl('');
      setActiveTab('catalog');
    } catch (err) {
      showToast('Error: ' + err.message, 'error');
    }
  };

  // Firestore update
  const handleSaveFirestore = async (e) => {
    e.preventDefault();
    try {
      setFbConfigLoading(true);
      const res = await saveFirestoreConfig({
        apiKey: fbApiKey,
        projectId: fbProjectId,
        authDomain: `${fbProjectId}.firebaseapp.com`,
        storageBucket: `${fbProjectId}.firebasestorage.app`
      });
      if (res.success) {
        showToast('Firestore connected and synchronized! ☁️');
      } else {
        showToast(res.message || 'Firestore connection check failed', 'error');
      }
    } catch (err) {
      showToast('Config error: ' + err.message, 'error');
    } finally {
      setFbConfigLoading(false);
    }
  };

  const handleSaveInstagram = (e) => {
    e.preventDefault();
    const cleaned = tempIgHandle.replace('@', '').trim();
    setInstagramHandle(cleaned);
    showToast(`Instagram DM handle set to @${cleaned}! 📸`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 animate-fadeIn">
      <div 
        className="relative bg-white rounded-3xl max-w-5xl w-full max-h-[94vh] overflow-hidden shadow-2xl border border-gold-400/50 flex flex-col text-charcoal"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header */}
        <div className="p-4 sm:p-6 border-b border-gold-500/20 bg-brand-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gold-500 text-charcoal flex items-center justify-center font-bold shadow">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold flex items-center gap-2">
                <span>Label &amp; Loom Admin Studio</span>
                <span className="text-[10px] bg-brand-700 text-gold-300 font-semibold px-2 py-0.5 rounded-full border border-gold-400/30">
                  Store Management
                </span>
              </h2>
              <p className="text-xs text-brand-200">
                Products • Renting Controls • Instagram Orders • Firestore
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {adminToken && (
              <button
                onClick={logoutAdmin}
                className="px-3 py-1.5 rounded-lg bg-brand-800 hover:bg-brand-700 text-brand-100 text-xs font-semibold flex items-center gap-1.5 transition border border-brand-700"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-2 rounded-full bg-brand-800 hover:bg-brand-700 text-white transition"
              aria-label="Close Admin"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* LOGIN SCREEN IF NOT AUTHENTICATED (NO PREFILLED TEXT)*/}
        {/* ---------------------------------------------------- */}
        {!adminToken ? (
          <div className="p-8 sm:p-12 max-w-md mx-auto w-full my-auto text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-gold-100 text-brand-700 flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-serif text-2xl font-bold text-charcoal">
                Atelier Admin Access
              </h3>
              <p className="text-xs text-charcoal/60 mt-1">
                Enter your administrator credentials to manage products, edit details, and run smart vision ingestion.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Enter username"
                  className="w-full px-3.5 py-2.5 text-sm bg-cream/40 border border-gold-400/40 rounded-xl focus:outline-none focus:border-brand-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter password"
                  className="w-full px-3.5 py-2.5 text-sm bg-cream/40 border border-gold-400/40 rounded-xl focus:outline-none focus:border-brand-600 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl shadow-lg transition flex items-center justify-center gap-2"
              >
                {loginLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Login to Admin Studio</span>
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* ---------------------------------------------------- */
          /* AUTHENTICATED ADMIN DASHBOARD                        */
          /* ---------------------------------------------------- */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Navigation Tabs */}
            <div className="flex border-b border-gold-500/20 bg-cream/30 px-4 sm:px-6 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setActiveTab('catalog')}
                className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 flex items-center gap-2 whitespace-nowrap transition ${
                  activeTab === 'catalog'
                    ? 'border-brand-600 text-brand-700 bg-white'
                    : 'border-transparent text-charcoal/70 hover:text-brand-600'
                }`}
              >
                <FileText className="w-4 h-4 text-brand-600" />
                <span>Catalog ({products.length} Outfits)</span>
              </button>

              <button
                onClick={() => setActiveTab('smart-vision')}
                className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 flex items-center gap-2 whitespace-nowrap transition ${
                  activeTab === 'smart-vision'
                    ? 'border-brand-600 text-brand-700 bg-white'
                    : 'border-transparent text-charcoal/70 hover:text-brand-600'
                }`}
              >
                <Sparkles className="w-4 h-4 text-gold-500" />
                <span>Smart Vision OCR</span>
              </button>

              <button
                onClick={() => setActiveTab('manual')}
                className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 flex items-center gap-2 whitespace-nowrap transition ${
                  activeTab === 'manual'
                    ? 'border-brand-600 text-brand-700 bg-white'
                    : 'border-transparent text-charcoal/70 hover:text-brand-600'
                }`}
              >
                <Plus className="w-4 h-4 text-emerald-600" />
                <span>Manual Add</span>
              </button>

              <button
                onClick={() => setActiveTab('link')}
                className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 flex items-center gap-2 whitespace-nowrap transition ${
                  activeTab === 'link'
                    ? 'border-brand-600 text-brand-700 bg-white'
                    : 'border-transparent text-charcoal/70 hover:text-brand-600'
                }`}
              >
                <LinkIcon className="w-4 h-4 text-blue-600" />
                <span>Link Scraper</span>
              </button>

              <button
                onClick={() => setActiveTab('firestore')}
                className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 flex items-center gap-2 whitespace-nowrap transition ${
                  activeTab === 'firestore'
                    ? 'border-brand-600 text-brand-700 bg-white'
                    : 'border-transparent text-charcoal/70 hover:text-brand-600'
                }`}
              >
                <Database className="w-4 h-4 text-amber-600" />
                <span>Firestore &amp; Instagram Setup</span>
              </button>
            </div>

            {/* TAB CONTENTS */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-ivory/50">
              
              {/* ==================================================== */}
              {/* TAB 1: CATALOG MANAGEMENT (EDIT, DELETE, OUT OF STOCK)*/}
              {/* ==================================================== */}
              {activeTab === 'catalog' && (
                <div className="space-y-4">
                  
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="relative w-full sm:w-72">
                      <input
                        type="text"
                        placeholder="Search outfits..."
                        value={catalogSearch}
                        onChange={(e) => setCatalogSearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-gold-400/40 rounded-xl"
                      />
                      <Search className="w-3.5 h-3.5 text-charcoal/50 absolute left-2.5 top-2.5" />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => setActiveTab('smart-vision')}
                        className="px-3.5 py-1.5 bg-brand-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm hover:bg-brand-700 transition"
                      >
                        <Sparkles className="w-3.5 h-3.5" /> Smart Vision OCR
                      </button>
                      <button
                        onClick={() => setActiveTab('manual')}
                        className="px-3.5 py-1.5 bg-white border border-gold-400 text-charcoal text-xs font-bold rounded-xl flex items-center gap-1.5 hover:bg-gold-50 transition"
                      >
                        <Plus className="w-3.5 h-3.5" /> Manual Add
                      </button>
                    </div>
                  </div>

                  {/* Products Table */}
                  <div className="bg-white rounded-2xl border border-gold-400/30 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-cream/60 border-b border-gold-400/30 text-charcoal/70 uppercase text-[10px] tracking-wider">
                          <tr>
                            <th className="py-3 px-4">Outfit Details</th>
                            <th className="py-3 px-3">Category</th>
                            <th className="py-3 px-3">Buy Price</th>
                            <th className="py-3 px-3">Rent Rate</th>
                            <th className="py-3 px-3">Stock Status</th>
                            <th className="py-3 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gold-400/15">
                          {products
                            .filter(p => p.title.toLowerCase().includes(catalogSearch.toLowerCase()))
                            .map((p) => {
                              const inStock = p.inStock !== false;
                              return (
                                <tr key={p.id} className="hover:bg-cream/20 transition">
                                  <td className="py-2.5 px-4 flex items-center gap-3">
                                    <img
                                      src={p.images?.[0] || '/uploads/product-1-main.jpg'}
                                      alt={p.title}
                                      className="w-10 h-13 object-cover object-top rounded-lg border border-gold-400/30 flex-shrink-0"
                                    />
                                    <div>
                                      <p className="font-serif font-bold text-charcoal line-clamp-1 max-w-xs">
                                        {p.title}
                                      </p>
                                      <p className="text-[10px] text-charcoal/60">
                                        {p.specs?.kurtaFabric || 'Silk Blend'} • {p.specs?.color || 'Maroon'}
                                      </p>
                                    </div>
                                  </td>

                                  <td className="py-2.5 px-3">
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cream text-charcoal border border-gold-400/20">
                                      {p.categoryName || p.category}
                                    </span>
                                  </td>

                                  <td className="py-2.5 px-3 font-bold text-charcoal">
                                    {formatPrice(p.price)}
                                  </td>

                                  <td className="py-2.5 px-3 font-semibold text-rose-700">
                                    {p.rentPrice ? `${formatPrice(p.rentPrice)}/3d` : 'N/A'}
                                  </td>

                                  {/* Quick Stock Toggle */}
                                  <td className="py-2.5 px-3">
                                    <button
                                      type="button"
                                      onClick={() => toggleStockStatus(p.id)}
                                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1 transition ${
                                        inStock
                                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                          : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                                      }`}
                                      title="Click to toggle Stock Status"
                                    >
                                      <span className={`w-1.5 h-1.5 rounded-full ${inStock ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                                      <span>{inStock ? 'In Stock' : 'Out of Stock'}</span>
                                    </button>
                                  </td>

                                  {/* Actions: Edit & Delete */}
                                  <td className="py-2.5 px-4 text-right space-x-1.5">
                                    <button
                                      onClick={() => setEditingProduct({ ...p })}
                                      className="px-2.5 py-1 bg-cream hover:bg-gold-200 text-charcoal rounded-lg font-bold text-[11px] transition inline-flex items-center gap-1"
                                      title="Edit Details"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                      <span>Edit</span>
                                    </button>

                                    <button
                                      onClick={() => {
                                        if (confirm(`Are you sure you want to delete "${p.title}"?`)) {
                                          removeProduct(p.id);
                                        }
                                      }}
                                      className="p-1.5 text-charcoal/40 hover:text-rose-600 transition inline-flex items-center"
                                      title="Delete Product"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ==================================================== */}
              {/* TAB 2: SMART VISION OCR INGESTION                    */}
              {/* ==================================================== */}
              {activeTab === 'smart-vision' && (
                <div className="space-y-6 max-w-4xl mx-auto">
                  
                  <div className="p-4 bg-gradient-to-r from-brand-50 to-gold-50 rounded-2xl border border-gold-400/40 space-y-1.5">
                    <div className="flex items-center gap-2 font-serif font-bold text-brand-800 text-sm">
                      <Sparkles className="w-4 h-4 text-gold-600" />
                      <span>Smart Screenshot Vision Engine</span>
                    </div>
                    <p className="text-xs text-charcoal/80 leading-relaxed">
                      Upload your spec screenshots and model photos. The OCR engine identifies specifications, separates dress photos, generates rental &amp; purchase pricing, and automatically drafts the outfit for publishing!
                    </p>
                  </div>

                  <div className="border-2 border-dashed border-gold-400/60 rounded-3xl p-8 bg-white hover:bg-gold-50/30 transition text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-gold-100 text-brand-700 flex items-center justify-center mx-auto">
                      <UploadCloud className="w-8 h-8" />
                    </div>

                    <div>
                      <h4 className="font-serif text-lg font-bold text-charcoal">
                        Drop Spec Screenshots &amp; Dress Photos
                      </h4>
                      <p className="text-xs text-charcoal/60 mt-1">
                        Select multiple screenshots and model images from your device
                      </p>
                    </div>

                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleVisionDrop}
                      id="vision-upload-input"
                      className="hidden"
                    />

                    <div className="flex items-center justify-center gap-3">
                      <label
                        htmlFor="vision-upload-input"
                        className="px-5 py-2.5 bg-white border border-gold-400 rounded-full text-xs font-bold text-charcoal hover:bg-gold-50 cursor-pointer shadow-sm transition"
                      >
                        Choose Files
                      </label>

                      {visionFiles.length > 0 && (
                        <button
                          onClick={runSmartVision}
                          disabled={visionLoading}
                          className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-full text-xs font-bold shadow-md transition flex items-center gap-2"
                        >
                          {visionLoading ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>{visionProgress || 'Analyzing Images...'}</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Run Smart Extraction ({visionFiles.length} files)</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {visionResult && (
                    <div className="bg-white rounded-3xl p-6 border border-gold-400/50 shadow-lg space-y-5 animate-fadeIn">
                      <div className="flex items-center justify-between pb-3 border-b">
                        <h4 className="font-serif text-lg font-bold">Extraction Preview</h4>
                        <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                          Specs Extracted
                        </span>
                      </div>

                      {visionResult.productImages?.length > 0 && (
                        <div>
                          <label className="block text-xs font-bold uppercase mb-1.5">Model Photos</label>
                          <div className="flex gap-2 overflow-x-auto pb-1">
                            {visionResult.productImages.map((img, i) => (
                              <img key={i} src={img} alt="Model" className="w-20 h-28 object-cover rounded-xl border" />
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="sm:col-span-2">
                          <label className="block font-bold mb-1">Title</label>
                          <input
                            type="text"
                            value={visionResult.title}
                            onChange={(e) => setVisionResult({ ...visionResult, title: e.target.value })}
                            className="w-full px-3 py-1.5 border rounded-lg font-bold font-serif"
                          />
                        </div>
                        <div>
                          <label className="block font-bold mb-1">Buy Price (₹)</label>
                          <input
                            type="number"
                            value={visionResult.price}
                            onChange={(e) => setVisionResult({ ...visionResult, price: e.target.value })}
                            className="w-full px-3 py-1.5 border rounded-lg font-bold"
                          />
                        </div>
                        <div>
                          <label className="block font-bold mb-1">Fabric</label>
                          <input
                            type="text"
                            value={visionResult.specs?.kurtaFabric || ''}
                            onChange={(e) => setVisionResult({
                              ...visionResult,
                              specs: { ...visionResult.specs, kurtaFabric: e.target.value }
                            })}
                            className="w-full px-3 py-1.5 border rounded-lg"
                          />
                        </div>
                      </div>

                      <button
                        onClick={publishVisionProduct}
                        className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow transition"
                      >
                        Publish to Store &amp; Catalog
                      </button>
                    </div>
                  )}

                </div>
              )}

              {/* ==================================================== */}
              {/* TAB 3: MANUAL UPLOAD                                 */}
              {/* ==================================================== */}
              {activeTab === 'manual' && (
                <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 border border-gold-400/40 shadow-sm space-y-5 text-xs">
                  <h4 className="font-serif text-lg font-bold text-charcoal">
                    Manual Outfit Upload &amp; Rental Rate Setup
                  </h4>

                  <form onSubmit={handleCreateManual} className="space-y-4">
                    <div>
                      <label className="block font-bold uppercase mb-1">Upload Outfit Photos</label>
                      <input type="file" multiple accept="image/*" onChange={handleManualImageUpload} />
                      {manualUploading && <p className="text-brand-600 text-xs mt-1">Uploading...</p>}
                      {manualImages.length > 0 && (
                        <div className="flex gap-2 mt-2">
                          {manualImages.map((img, i) => (
                            <img key={i} src={img} alt="Uploaded" className="w-16 h-20 object-cover rounded-lg border" />
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block font-bold mb-1">Outfit Title *</label>
                        <input
                          type="text"
                          required
                          value={manualTitle}
                          onChange={(e) => setManualTitle(e.target.value)}
                          placeholder="e.g. Chinon Mirror Work Suit"
                          className="w-full px-3 py-2 border rounded-xl"
                        />
                      </div>

                      <div>
                        <label className="block font-bold mb-1">Buy Price (₹) *</label>
                        <input
                          type="number"
                          required
                          value={manualPrice}
                          onChange={(e) => setManualPrice(e.target.value)}
                          className="w-full px-3 py-2 border rounded-xl font-bold"
                        />
                      </div>

                      <div>
                        <label className="block font-bold mb-1">Rent Rate (₹ per 3 Days) *</label>
                        <input
                          type="number"
                          value={manualRentPrice}
                          onChange={(e) => setManualRentPrice(e.target.value)}
                          className="w-full px-3 py-2 border rounded-xl font-bold text-rose-700"
                        />
                      </div>

                      <div>
                        <label className="block font-bold mb-1">Refundable Security Deposit (₹)</label>
                        <input
                          type="number"
                          value={manualSecurityDeposit}
                          onChange={(e) => setManualSecurityDeposit(e.target.value)}
                          className="w-full px-3 py-2 border rounded-xl"
                        />
                      </div>

                      <div>
                        <label className="block font-bold mb-1">Category</label>
                        <select
                          value={manualCategory}
                          onChange={(e) => setManualCategory(e.target.value)}
                          className="w-full px-3 py-2 border rounded-xl"
                        >
                          <option value="viral-kurtis">Viral &amp; Trendy Kurtis</option>
                          <option value="wedding">Wedding Collection</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold mb-1">Kurta Fabric</label>
                        <input
                          type="text"
                          value={manualKurtaFabric}
                          onChange={(e) => setManualKurtaFabric(e.target.value)}
                          className="w-full px-3 py-2 border rounded-xl"
                        />
                      </div>

                      <div>
                        <label className="block font-bold mb-1">Salwar / Bottom Fabric</label>
                        <input
                          type="text"
                          value={manualBottomFabric}
                          onChange={(e) => setManualBottomFabric(e.target.value)}
                          className="w-full px-3 py-2 border rounded-xl"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-bold">Description / Notes</label>
                        <button
                          type="button"
                          onClick={handleBeautifyDescription}
                          className="text-[11px] font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3 text-gold-500" /> AI Beautify Copy
                        </button>
                      </div>
                      <textarea
                        rows={3}
                        value={manualDescription}
                        onChange={(e) => setManualDescription(e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl"
                      />
                    </div>

                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer font-bold">
                        <input
                          type="checkbox"
                          checked={manualInStock}
                          onChange={(e) => setManualInStock(e.target.checked)}
                        />
                        <span>In Stock Ready for Orders</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer font-bold">
                        <input
                          type="checkbox"
                          checked={manualInWedding}
                          onChange={(e) => setManualInWedding(e.target.checked)}
                        />
                        <span>Feature in Wedding Section</span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow transition"
                    >
                      Publish Manual Outfit
                    </button>
                  </form>
                </div>
              )}

              {/* ==================================================== */}
              {/* TAB 4: LINK SCRAPER                                  */}
              {/* ==================================================== */}
              {activeTab === 'link' && (
                <div className="max-w-2xl mx-auto space-y-4 text-xs">
                  <div className="p-5 bg-white rounded-2xl border space-y-3">
                    <h4 className="font-serif text-base font-bold">Extract from E-Commerce Link</h4>
                    <form onSubmit={handleExtractLink} className="flex gap-2">
                      <input
                        type="url"
                        required
                        placeholder="Paste Myntra, Meesho, Amazon, or Boutique URL..."
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        className="flex-1 px-3 py-2 border rounded-xl"
                      />
                      <button
                        type="submit"
                        disabled={linkLoading}
                        className="px-4 py-2 bg-brand-600 text-white font-bold rounded-xl"
                      >
                        {linkLoading ? 'Extracting...' : 'Extract'}
                      </button>
                    </form>
                  </div>

                  {linkExtractedData && (
                    <div className="p-4 bg-white rounded-2xl border space-y-3">
                      <p className="font-bold text-sm">{linkExtractedData.title}</p>
                      <p className="font-bold text-brand-700">Price: {formatPrice(linkExtractedData.price)}</p>
                      <button
                        onClick={publishLinkProduct}
                        className="w-full py-2 bg-brand-600 text-white font-bold rounded-xl"
                      >
                        Save to Catalog
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ==================================================== */}
              {/* TAB 5: FIRESTORE & INSTAGRAM SETTINGS               */}
              {/* ==================================================== */}
              {activeTab === 'firestore' && (
                <div className="max-w-2xl mx-auto space-y-5 text-xs">
                  
                  {/* INSTAGRAM DM SETTINGS */}
                  <div className="p-5 bg-white rounded-2xl border border-gold-400/40 shadow-sm space-y-3">
                    <div className="flex items-center gap-2 font-serif font-bold text-base text-charcoal">
                      <Instagram className="w-5 h-5 text-rose-600" />
                      <span>Instagram Direct Order Destination</span>
                    </div>
                    <p className="text-charcoal/70">
                      When customers click "Order via Instagram DM" or "Rent via Instagram DM", their order voucher is copied and they are routed to this Instagram account:
                    </p>

                    <form onSubmit={handleSaveInstagram} className="flex gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-2.5 font-bold text-charcoal/50">@</span>
                        <input
                          type="text"
                          required
                          value={tempIgHandle}
                          onChange={(e) => setTempIgHandle(e.target.value)}
                          placeholder="labelandloom"
                          className="w-full pl-7 pr-3 py-2 border rounded-xl font-bold"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-gradient-to-r from-purple-600 to-rose-600 text-white font-bold rounded-xl"
                      >
                        Save Handle
                      </button>
                    </form>
                    <p className="text-[11px] text-charcoal/60">
                      Current Live DM URL: <a href={`https://ig.me/m/${instagramHandle}`} target="_blank" rel="noreferrer" className="text-brand-600 underline font-semibold">https://ig.me/m/{instagramHandle}</a>
                    </p>
                  </div>

                  {/* FIRESTORE CLI CONNECTION */}
                  <div className="p-5 bg-white rounded-2xl border border-gold-400/40 shadow-sm space-y-3">
                    <div className="flex items-center gap-2 font-serif font-bold text-base text-charcoal">
                      <Database className="w-5 h-5 text-amber-600" />
                      <span>Cloud Firestore Configuration</span>
                    </div>

                    <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 font-semibold flex items-center justify-between">
                      <div>
                        <p className="font-bold">Project ID: labelandloom-store</p>
                        <p className="text-[11px] opacity-80">Created via Firebase CLI on shivanshdubey1108@gmail.com</p>
                      </div>
                      <span className="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded font-bold">
                        CLI Synced
                      </span>
                    </div>

                    <form onSubmit={handleSaveFirestore} className="space-y-3 pt-2">
                      <div>
                        <label className="block font-bold mb-1">Firebase Project ID</label>
                        <input
                          type="text"
                          value={fbProjectId}
                          onChange={(e) => setFbProjectId(e.target.value)}
                          className="w-full px-3 py-1.5 border rounded-lg font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="block font-bold mb-1">API Key</label>
                        <input
                          type="text"
                          value={fbApiKey}
                          onChange={(e) => setFbApiKey(e.target.value)}
                          className="w-full px-3 py-1.5 border rounded-lg font-mono text-xs"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={fbConfigLoading}
                        className="w-full py-2.5 bg-brand-600 text-white font-bold rounded-xl"
                      >
                        {fbConfigLoading ? 'Testing...' : 'Test & Sync Connection'}
                      </button>
                    </form>
                  </div>

                  {/* Seed / Reset to ONLY the 3 uploaded outfits */}
                  <div className="p-4 bg-white rounded-2xl border flex items-center justify-between">
                    <div>
                      <p className="font-bold">Reset strictly to 3 Uploaded Folders</p>
                      <p className="text-charcoal/60 text-[11px]">Removes any extra items and restores only the 3 folders.</p>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm('Reset store catalog strictly to the 3 uploaded outfits?')) {
                          resetToSeedCatalog();
                        }
                      }}
                      className="px-4 py-2 bg-cream hover:bg-gold-200 text-charcoal font-bold rounded-xl border transition"
                    >
                      Reset Now
                    </button>
                  </div>

                </div>
              )}

            </div>
          </div>
        )}

      </div>

      {/* ==================================================== */}
      {/* EDIT EXISTING PRODUCT MODAL                          */}
      {/* ==================================================== */}
      {editingProduct && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 border border-gold-400/50 shadow-2xl text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h4 className="font-serif text-lg font-bold text-charcoal">Edit Outfit Details</h4>
                <p className="text-[11px] text-charcoal/60">ID: {editingProduct.id}</p>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1.5 rounded-full hover:bg-cream text-charcoal/70"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-bold mb-1">Outfit Title</label>
                <input
                  type="text"
                  value={editingProduct.title || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl font-bold font-serif text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold mb-1">Buy Price (₹)</label>
                  <input
                    type="number"
                    value={editingProduct.price || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 border rounded-lg font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Rent Rate (₹/3d)</label>
                  <input
                    type="number"
                    value={editingProduct.rentPrice || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, rentPrice: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 border rounded-lg font-bold text-rose-700"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Deposit (₹)</label>
                  <input
                    type="number"
                    value={editingProduct.rentSecurityDeposit || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, rentSecurityDeposit: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Category</label>
                  <select
                    value={editingProduct.category || 'viral-kurtis'}
                    onChange={(e) => setEditingProduct({
                      ...editingProduct,
                      category: e.target.value,
                      categoryName: e.target.value === 'wedding' ? 'Wedding & Festive Collection' : 'Viral & Trendy Kurtis'
                    })}
                    className="w-full px-3 py-1.5 border rounded-lg"
                  >
                    <option value="viral-kurtis">Viral &amp; Trendy Kurtis</option>
                    <option value="wedding">Wedding Collection</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">Kurta Fabric</label>
                  <input
                    type="text"
                    value={editingProduct.specs?.kurtaFabric || ''}
                    onChange={(e) => setEditingProduct({
                      ...editingProduct,
                      specs: { ...editingProduct.specs, kurtaFabric: e.target.value }
                    })}
                    className="w-full px-3 py-1.5 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Bottom Type</label>
                  <input
                    type="text"
                    value={editingProduct.specs?.bottomType || ''}
                    onChange={(e) => setEditingProduct({
                      ...editingProduct,
                      specs: { ...editingProduct.specs, bottomType: e.target.value }
                    })}
                    className="w-full px-3 py-1.5 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              {/* STOCK STATUS TOGGLE IN EDIT MODAL */}
              <div className="p-3 bg-cream/40 rounded-xl border flex items-center justify-between">
                <div>
                  <span className="font-bold text-charcoal block">Stock Availability</span>
                  <span className="text-[11px] text-charcoal/60">
                    {editingProduct.inStock !== false ? 'Currently IN STOCK and available for purchase & rent' : 'Currently OUT OF STOCK'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setEditingProduct({
                    ...editingProduct,
                    inStock: editingProduct.inStock === false ? true : false
                  })}
                  className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition ${
                    editingProduct.inStock !== false
                      ? 'bg-emerald-600 text-white'
                      : 'bg-rose-600 text-white'
                  }`}
                >
                  {editingProduct.inStock !== false ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                  <span>{editingProduct.inStock !== false ? 'In Stock' : 'Out of Stock'}</span>
                </button>
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer font-bold">
                  <input
                    type="checkbox"
                    checked={editingProduct.inWeddingSection || false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, inWeddingSection: e.target.checked })}
                  />
                  <span>Feature in Wedding Section</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold">
                  <input
                    type="checkbox"
                    checked={editingProduct.isViral || false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isViral: e.target.checked })}
                  />
                  <span>Mark as Viral Hit</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 bg-cream hover:bg-gold-100 rounded-xl font-bold text-charcoal"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold"
              >
                Save All Changes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
