// src/App.jsx
import React, { useState, useMemo } from 'react';
import { useStore } from './context/StoreContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CategoryFilter from './components/CategoryFilter';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import AboutSection from './components/AboutSection';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import AdminPanel from './components/AdminPanel';
import InstagramOrderModal from './components/InstagramOrderModal';
import MobileBottomNav from './components/MobileBottomNav';
import Footer from './components/Footer';
import { Sparkles, X, Check, AlertCircle } from 'lucide-react';

export default function App() {
  const {
    products,
    loading,
    activeCategory,
    searchQuery,
    setSearchQuery,
    toast,
    setIsAdminOpen
  } = useStore();

  const [sortBy, setSortBy] = useState('featured');

  // Filter & Sort Products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (activeCategory === 'viral-kurtis') {
      result = result.filter(p => p.isViral || p.category === 'viral-kurtis');
    } else if (activeCategory === 'wedding') {
      result = result.filter(p => p.inWeddingSection || p.category === 'wedding' || p.tags?.includes('wedding'));
    } else if (activeCategory === 'mirror') {
      result = result.filter(p => 
        p.tags?.includes('mirror work') || 
        p.specs?.ornamentation?.toLowerCase().includes('mirror') ||
        p.title?.toLowerCase().includes('mirror')
      );
    } else if (activeCategory === 'khadi') {
      result = result.filter(p => 
        p.tags?.includes('khadi') || 
        p.specs?.kurtaFabric?.toLowerCase().includes('khadi') ||
        p.title?.toLowerCase().includes('khadi')
      );
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(p =>
        p.title?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.specs?.color?.toLowerCase().includes(q) ||
        p.specs?.kurtaFabric?.toLowerCase().includes(q) ||
        p.tags?.some(t => t.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'discount') {
      result.sort((a, b) => (b.discount || 0) - (a.discount || 0));
    }

    return result;
  }, [products, activeCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen flex flex-col w-full max-w-full overflow-x-hidden bg-ivory selection:bg-brand-600 selection:text-white">
      {/* Toast Notification Alert */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-60 animate-bounce">
          <div className={`px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold text-white border ${
            toast.type === 'error'
              ? 'bg-rose-700 border-rose-500'
              : 'bg-brand-700 border-gold-400'
          }`}>
            {toast.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <Sparkles className="w-4 h-4 text-gold-300" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Main App Layout */}
      <Navbar />

      <main className="flex-1 w-full max-w-full overflow-x-hidden pb-16 md:pb-6">
        <div className="w-full max-w-5xl mx-auto px-2 sm:px-4 space-y-3 pt-2">
          
          {/* Meesho / Flipkart Style Circular Category Icons & Sort */}
          <CategoryFilter sortBy={sortBy} setSortBy={setSortBy} />

          {/* Flipkart / Meesho Compact Promotional Banner */}
          <Hero />

          {/* Search notice if active */}
          {searchQuery && (
            <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-gray-200 text-xs">
              <span className="text-gray-700">
                Results for <strong className="text-brand-700">"{searchQuery}"</strong> ({filteredProducts.length} items found)
              </span>
              <button
                onClick={() => setSearchQuery('')}
                className="text-brand-700 font-bold hover:underline"
              >
                Clear
              </button>
            </div>
          )}

          {/* Product Grid (Meesho / Flipkart / Amazon 2-Column Standard) */}
          <section id="catalog-section" className="pt-1">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-2 sm:gap-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="aspect-[3/4] bg-gray-200 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="py-16 text-center space-y-3 bg-white rounded-xl border border-gray-200 max-w-md mx-auto">
                <Sparkles className="w-8 h-8 text-gold-500 mx-auto" />
                <h3 className="font-bold text-base text-gray-800">
                  No matching designs found
                </h3>
                <p className="text-xs text-gray-500">
                  Try adjusting your search terms or view our complete viral kurti collection.
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-1.5 rounded-full bg-brand-700 text-white font-bold text-xs"
                >
                  View All Outfits
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-2 sm:gap-3.5">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </section>

          {/* Atelier Heritage Story */}
          <AboutSection />
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile-Only App Navigation Bar */}
      <MobileBottomNav />

      {/* Modals & Slide-out Drawers */}
      <ProductModal />
      <InstagramOrderModal />
      <CartDrawer />
      <WishlistDrawer />
      <AdminPanel />
    </div>
  );
}
