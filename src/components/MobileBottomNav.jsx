// src/components/MobileBottomNav.jsx - App-like Thumb Navigation Bar for Mobile Devices
import React from 'react';
import { useStore } from '../context/StoreContext';
import { Home, Sparkles, Heart, ShoppingBag, Instagram, Shield } from 'lucide-react';

export default function MobileBottomNav() {
  const {
    cart,
    wishlist,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsAdminOpen,
    adminToken,
    setActiveCategory,
    instagramHandle
  } = useStore();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cleanHandle = (instagramHandle || 'labelandloom.in').replace(/^@/, '').trim();

  const handleScrollTo = (category = 'all') => {
    setActiveCategory(category);
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenInstagram = () => {
    window.open(`https://www.instagram.com/${cleanHandle}/`, '_blank', 'noopener,noreferrer');
  };

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-gold-400/30 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1.5 pb-safe transition-all duration-300"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        
        {/* 1. Home / Explore */}
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex flex-col items-center justify-center p-1.5 text-charcoal/70 hover:text-brand-600 active:scale-95 transition"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">Home</span>
        </button>

        {/* 2. Viral Kurtis / Catalog */}
        <button
          onClick={() => handleScrollTo('viral-kurtis')}
          className="flex flex-col items-center justify-center p-1.5 text-charcoal/70 hover:text-brand-600 active:scale-95 transition"
        >
          <Sparkles className="w-5 h-5 text-gold-600" />
          <span className="text-[10px] font-medium mt-0.5">Trends</span>
        </button>

        {/* 3. Wishlist */}
        <button
          onClick={() => setIsWishlistOpen(true)}
          className="relative flex flex-col items-center justify-center p-1.5 text-charcoal/70 hover:text-brand-600 active:scale-95 transition"
        >
          <Heart className="w-5 h-5" />
          {wishlist.length > 0 && (
            <span className="absolute top-0 right-1.5 min-w-[16px] h-4 bg-brand-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1">
              {wishlist.length}
            </span>
          )}
          <span className="text-[10px] font-medium mt-0.5">Saved</span>
        </button>

        {/* 4. Shopping Bag */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center justify-center p-1.5 text-charcoal/70 hover:text-brand-600 active:scale-95 transition"
        >
          <ShoppingBag className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute top-0 right-1.5 min-w-[16px] h-4 bg-gold-500 text-charcoal text-[9px] font-extrabold rounded-full flex items-center justify-center px-1 shadow-xs">
              {cartCount}
            </span>
          )}
          <span className="text-[10px] font-medium mt-0.5">Bag</span>
        </button>

        {/* 5. Instagram Direct or Admin */}
        <button
          onClick={handleOpenInstagram}
          className="flex flex-col items-center justify-center p-1.5 text-brand-600 active:scale-95 transition"
        >
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shadow-xs">
            <Instagram className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-bold mt-0.5 bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent">
            IG DM
          </span>
        </button>

      </div>
    </nav>
  );
}

