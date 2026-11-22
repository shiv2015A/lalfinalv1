// src/components/Navbar.jsx - Meesho / Flipkart / Amazon Style App Header
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, ShoppingBag, Heart, User, Sparkles, X, Menu, Phone, Instagram } from 'lucide-react';

export default function Navbar() {
  const {
    cart,
    wishlist,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsAdminOpen,
    adminToken,
    searchQuery,
    setSearchQuery,
    currency,
    setCurrency,
    setActiveCategory,
    instagramHandle
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cleanHandle = (instagramHandle || 'labelandloom.in').replace(/^@/, '').trim();

  const navLinks = [
    { name: 'All Kurtis', id: 'all' },
    { name: '🔥 Viral Trends', id: 'viral-kurtis' },
    { name: '💍 Wedding Suite', id: 'wedding' },
    { name: '✨ Mirror Work', id: 'mirror' },
    { name: '🌸 Pure Khadi', id: 'khadi' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200 shadow-2xs">
      
      {/* 1. Top Offer Strip (Meesho / Flipkart Style) */}
      <div className="bg-brand-900 text-white text-[10px] sm:text-xs py-1 px-3 text-center flex items-center justify-between">
        <span className="hidden sm:inline text-brand-200">✨ Authentic Indian Ethnic &amp; Wedding Couture</span>
        <div className="mx-auto flex items-center gap-1.5 font-medium">
          <span className="bg-gold-500 text-charcoal px-1.5 py-0.2 rounded font-extrabold text-[9px] uppercase">Festive Offer</span>
          <span>10% OFF with code <strong className="text-gold-300 font-bold">LOOM10</strong> • Free Delivery</span>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-[11px] text-brand-200">
          <button
            onClick={() => setCurrency(currency === 'INR' ? 'USD' : 'INR')}
            className="hover:text-white transition"
          >
            {currency === 'INR' ? '₹ INR' : '$ USD'}
          </button>
        </div>
      </div>

      {/* 2. Main E-Commerce Header Row */}
      <div className="max-w-5xl mx-auto px-2 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-2">
        
        {/* Left: Mobile Menu & Logo */}
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1 text-gray-700 hover:text-brand-700 transition lg:hidden"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo (Meesho / Flipkart clean style) */}
          <div
            onClick={() => {
              setActiveCategory('all');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="cursor-pointer flex flex-col items-start leading-none min-w-0"
          >
            <div className="flex items-center gap-0.5 sm:gap-1">
              <span className="font-serif text-base sm:text-2xl font-black text-brand-800 tracking-tight uppercase">
                label
              </span>
              <span className="text-gold-600 font-serif italic text-sm sm:text-xl">&amp;</span>
              <span className="font-serif text-base sm:text-2xl font-black text-brand-800 tracking-tight uppercase">
                loom
              </span>
            </div>
            <span className="text-[7px] sm:text-[9px] uppercase tracking-widest text-gray-500 font-bold">
              Ethnic Couture
            </span>
          </div>
        </div>

        {/* Center: Desktop-Only Search Bar */}
        <div className="hidden sm:block flex-1 max-w-md mx-3 relative">
          <input
            type="text"
            placeholder="Search kurtis, mirror work, wedding sets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-7 py-2 text-xs bg-gray-100 hover:bg-gray-50 focus:bg-white border border-gray-300 focus:border-brand-600 rounded-lg focus:outline-none transition shadow-2xs"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right: Actions (Wishlist, Cart, Admin) */}
        <div className="flex items-center space-x-1 sm:space-x-3 flex-shrink-0">
          
          {/* Wishlist */}
          <button
            onClick={() => setIsWishlistOpen(true)}
            className="relative p-1.5 sm:p-2 text-gray-700 hover:text-brand-600 transition rounded-full hover:bg-gray-100"
            title="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-brand-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Shopping Bag / Cart */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-1.5 sm:p-2 text-gray-700 hover:text-brand-600 transition rounded-full hover:bg-gray-100"
            title="Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-gold-500 text-charcoal text-[9px] font-extrabold rounded-full flex items-center justify-center px-1 shadow-xs">
                {cartCount}
              </span>
            )}
          </button>

          {/* Account Button */}
          <button
            onClick={() => setIsAdminOpen(true)}
            className="p-1 sm:px-2.5 sm:py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition text-gray-700 hover:text-brand-700 hover:bg-gray-100"
            title={adminToken ? "Studio" : "Sign In"}
            aria-label="Account"
          >
            <User className="w-4 h-4" />
            <span className="hidden md:inline">{adminToken ? 'Studio' : 'Sign In'}</span>
          </button>
        </div>

      </div>

      {/* 3. Mobile-Only Full-Width Search Bar (Meesho / Flipkart Standard) */}
      <div className="sm:hidden px-2 pb-2">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search kurtis, mirror work, wedding sets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-7 py-1.5 text-xs bg-gray-100 focus:bg-white border border-gray-300 focus:border-brand-600 rounded-lg focus:outline-none transition shadow-2xs"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2 text-gray-400 hover:text-gray-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Slide-down Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white px-3 py-3 space-y-2 animate-fadeIn shadow-lg">
          <div className="grid grid-cols-2 gap-1.5">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setActiveCategory(link.id);
                  setMobileMenuOpen(false);
                  const el = document.getElementById('catalog-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-left py-2 px-2.5 text-xs font-semibold text-gray-800 bg-gray-50 hover:bg-brand-50 hover:text-brand-700 rounded-lg border border-gray-200"
              >
                {link.name}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
            <a
              href={`https://www.instagram.com/${cleanHandle}/`}
              target="_blank"
              rel="noreferrer"
              className="text-brand-600 font-bold flex items-center gap-1"
            >
              <Instagram className="w-3.5 h-3.5" /> @{cleanHandle}
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsAdminOpen(true);
              }}
              className="text-gray-500 hover:text-gray-800 font-semibold"
            >
              {adminToken ? 'Studio' : 'Sign In'}
            </button>
          </div>
        </div>
      )}

    </header>
  );
}
