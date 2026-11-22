// src/context/StoreContext.jsx - Global Store with Rental, Out-of-Stock, and Instagram DM Engine
import React, { createContext, useContext, useState, useEffect } from 'react';

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // UI states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  
  // Instagram DM Order Voucher Modal
  const [instagramVoucherModal, setInstagramVoucherModal] = useState(null);
  const [instagramHandle, setInstagramHandle] = useState(() => localStorage.getItem('loom_ig_handle') || 'labelandloom.in');

  // Admin auth (empty credentials by default)
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('loom_admin_token') || null);
  const [adminUser, setAdminUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('loom_admin_user')) || null;
    } catch {
      return null;
    }
  });

  // Firestore status
  const [firestoreStatus, setFirestoreStatus] = useState({
    connected: false,
    usingFallback: true,
    projectId: 'labelandloom-store'
  });

  // Cart & Wishlist persistence
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('loom_cart')) || [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('loom_wishlist')) || [];
    } catch {
      return [];
    }
  });

  // Promo code & currency
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [currency, setCurrency] = useState('INR');

  // Notification toast
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 3800);
  };

  useEffect(() => {
    localStorage.setItem('loom_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('loom_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('loom_ig_handle', instagramHandle);
  }, [instagramHandle]);

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Failed to load products');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.warn('Backend API error:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkFirestore = async () => {
    try {
      const res = await fetch('/api/firestore/status');
      if (res.ok) {
        const data = await res.json();
        setFirestoreStatus(data);
      }
    } catch (_) {}
  };

  useEffect(() => {
    fetchProducts();
    checkFirestore();
  }, []);

  const formatPrice = (amount) => {
    if (amount === undefined || amount === null) return '₹0';
    if (currency === 'USD') {
      const usd = Math.round(amount / 83);
      return `$${usd}`;
    }
    return `₹${Number(amount).toLocaleString('en-IN')}`;
  };

  // Cart operations (with Buy vs Rent mode)
  const addToCart = (product, size = 'M', quantity = 1, mode = 'buy', rentalDays = 3) => {
    if (product.inStock === false) {
      showToast('This piece is currently out of stock. You can inquire on Instagram!', 'error');
      return;
    }

    const price = mode === 'rent' ? (product.rentPrice || Math.round(product.price * 0.3)) : product.price;

    setCart(prev => {
      const existingIdx = prev.findIndex(item => 
        item.product.id === product.id && item.size === size && item.mode === mode
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      } else {
        return [...prev, { product, size, quantity, mode, rentalDays, price }];
      }
    });

    showToast(`Added ${product.title} (${mode === 'rent' ? `Rental ${rentalDays}d` : 'Buy'} • ${size}) to bag! ✨`);
    setIsCartOpen(true);
  };

  const updateCartQty = (productId, size, modeOrQty, maybeQty) => {
    let mode = 'buy';
    let quantity = 1;
    if (typeof modeOrQty === 'number') {
      quantity = modeOrQty;
    } else {
      mode = modeOrQty;
      quantity = maybeQty;
    }

    if (quantity <= 0) {
      removeFromCart(productId, size, mode);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId && item.size === size && (item.mode || 'buy') === mode
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeFromCart = (productId, size, mode) => {
    setCart(prev => prev.filter(item => {
      const matchProduct = item.product.id === productId && item.size === size;
      if (mode) {
        return !(matchProduct && (item.mode || 'buy') === mode);
      }
      return !matchProduct;
    }));
    showToast('Item removed from shopping bag');
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = Math.round(cartSubtotal * (appliedDiscount / 100));
  const freeShippingThreshold = 1999;
  const freeShippingLeft = Math.max(0, freeShippingThreshold - cartSubtotal);
  const shippingFee = (cartSubtotal >= freeShippingThreshold || cartSubtotal === 0) ? 0 : 99;
  const cartTotal = cartSubtotal - discountAmount + shippingFee;

  const applyPromoCode = (code) => {
    const cleaned = (code || '').trim().toUpperCase();
    if (cleaned === 'LOOM10') {
      setAppliedDiscount(10);
      setPromoCode('LOOM10');
      showToast('10% VIP Discount Code Applied! 🎉');
      return true;
    } else {
      showToast('Invalid promo code. Try LOOM10', 'error');
      return false;
    }
  };

  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from wishlist');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Saved to your wishlist! 💖');
        return [...prev, productId];
      }
    });
  };

  // ----------------------------------------------------
  // FOOLPROOF INSTAGRAM ORDER VOUCHER SYSTEM
  // ----------------------------------------------------
  const copyTextToClipboard = async (text) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (_) {}

    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      textArea.remove();
      return successful;
    } catch (_) {
      return false;
    }
  };

  const triggerInstagramDMOrder = (product, size = 'M', mode = 'buy', rentalDays = 3, pincode = '') => {
    const refId = `LL-${Date.now().toString().slice(-5)}`;
    const effectivePrice = mode === 'rent' ? (product.rentPrice || Math.round(product.price * 0.3)) : product.price;
    const cleanHandle = (instagramHandle || 'labelandloom.in').replace(/^@/, '').trim();
    const instagramProfileUrl = `https://www.instagram.com/${cleanHandle}/`;

    const voucherText = 
`✨ LABEL & LOOM ATELIER ORDER BOOKING ✨
Reference ID: #${refId}

👗 Outfit: ${product.title}
🏷️ Booking Type: ${mode === 'rent' ? `RENTAL (${rentalDays} Days Duration)` : 'BUY (Brand New Ready-To-Wear)'}
💰 Price: ${formatPrice(effectivePrice)}${mode === 'rent' ? ` (+ ₹${product.rentSecurityDeposit || 999} Refundable Deposit)` : ''}
📏 Size: ${size}
🎨 Color: ${product.specs?.color || 'As Shown'}
📦 Fabric: ${product.specs?.kurtaFabric || 'Silk Blend'}
${pincode ? `📍 Delivery Pincode: ${pincode}\n` : ''}
----------------------------------------
Hello @${cleanHandle}! I would like to confirm my ${mode === 'rent' ? 'rental booking' : 'purchase'} for this outfit. Please let me know availability and payment details!`;

    // 1. Copy to clipboard immediately with fallback
    copyTextToClipboard(voucherText);

    // 2. Open Instagram profile immediately in new tab
    try {
      window.open(instagramProfileUrl, '_blank', 'noopener,noreferrer');
    } catch (_) {}

    // 3. Show clear confirmation modal with voucher preview and copy button
    setInstagramVoucherModal({
      refId,
      product,
      size,
      mode,
      rentalDays,
      effectivePrice,
      voucherText,
      instagramUrl: instagramProfileUrl,
      handle: cleanHandle
    });

    showToast(`Order copied! Opening @${cleanHandle} on Instagram ✨`);
  };

  // Admin Auth
  const loginAdmin = async (user, pass) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, password: pass })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Invalid credentials');
      }

      setAdminToken(data.token);
      setAdminUser(data.user);
      localStorage.setItem('loom_admin_token', data.token);
      localStorage.setItem('loom_admin_user', JSON.stringify(data.user));
      showToast('Welcome back, Admin! 👑');
      return { success: true };
    } catch (err) {
      showToast(err.message, 'error');
      return { success: false, error: err.message };
    }
  };

  const logoutAdmin = () => {
    setAdminToken(null);
    setAdminUser(null);
    localStorage.removeItem('loom_admin_token');
    localStorage.removeItem('loom_admin_user');
    showToast('Admin logged out');
  };

  // Admin Product Actions
  const createProduct = async (productData) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(productData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create product');

      setProducts(prev => [data, ...prev]);
      showToast(`Product "${data.title}" added to store! 👗`);
      return data;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const editProduct = async (id, updates) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update product');

      setProducts(prev => prev.map(p => p.id === id ? data : p));
      showToast('Product updated successfully!');
      return data;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const toggleStockStatus = async (id) => {
    const prod = products.find(p => p.id === id);
    if (!prod) return;
    const newStatus = prod.inStock === false ? true : false;
    await editProduct(id, { inStock: newStatus });
    showToast(`Marked "${prod.title}" as ${newStatus ? 'IN STOCK' : 'OUT OF STOCK'}`);
  };

  const removeProduct = async (id) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      if (!res.ok) throw new Error('Failed to delete product');

      setProducts(prev => prev.filter(p => p.id !== id));
      showToast('Product deleted from store');
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const processScreenshots = async (fileList) => {
    const formData = new FormData();
    for (let i = 0; i < fileList.length; i++) {
      formData.append('screenshots', fileList[i]);
    }

    const res = await fetch('/api/extract/screenshot', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`
      },
      body: formData
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to process screenshot');
    }
    return data.data;
  };

  const extractFromLink = async (url) => {
    const res = await fetch('/api/extract/link', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ url })
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to extract link details');
    }
    return data.data;
  };

  const uploadFiles = async (fileList) => {
    const formData = new FormData();
    for (let i = 0; i < fileList.length; i++) {
      formData.append('files', fileList[i]);
    }

    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`
      },
      body: formData
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'File upload failed');
    return data.files;
  };

  const saveFirestoreConfig = async (config) => {
    const res = await fetch('/api/firestore/config', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify(config)
    });
    const data = await res.json();
    if (data.status) {
      setFirestoreStatus(data.status);
    }
    return data;
  };

  const resetToSeedCatalog = async () => {
    const res = await fetch('/api/seed', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    const data = await res.json();
    if (data.products) {
      setProducts(data.products);
      showToast(`Catalog reset strictly to the 3 uploaded outfits!`);
    }
  };

  return (
    <StoreContext.Provider value={{
      products,
      loading,
      error,
      activeCategory,
      setActiveCategory,
      searchQuery,
      setSearchQuery,
      selectedProduct,
      setSelectedProduct,
      isCartOpen,
      setIsCartOpen,
      isWishlistOpen,
      setIsWishlistOpen,
      isAdminOpen,
      setIsAdminOpen,
      adminToken,
      adminUser,
      firestoreStatus,
      instagramHandle,
      setInstagramHandle,
      instagramVoucherModal,
      setInstagramVoucherModal,
      triggerInstagramDMOrder,
      copyTextToClipboard,
      cart,
      wishlist,
      cartSubtotal,
      cartTotal,
      freeShippingThreshold,
      freeShippingLeft,
      shippingFee,
      appliedDiscount,
      promoCode,
      currency,
      setCurrency,
      formatPrice,
      addToCart,
      updateCartQty,
      removeFromCart,
      clearCart,
      applyPromoCode,
      toggleWishlist,
      loginAdmin,
      logoutAdmin,
      createProduct,
      editProduct,
      toggleStockStatus,
      removeProduct,
      processScreenshots,
      extractFromLink,
      uploadFiles,
      saveFirestoreConfig,
      resetToSeedCatalog,
      toast,
      showToast
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);
