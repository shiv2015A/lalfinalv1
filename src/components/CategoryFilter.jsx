// src/components/CategoryFilter.jsx - Meesho/Flipkart Style Circular Category Strip & Filter Bar
import React from 'react';
import { useStore } from '../context/StoreContext';
import { SlidersHorizontal, Sparkles, Flame, Crown, Gem, Flower2 } from 'lucide-react';

export default function CategoryFilter({ sortBy, setSortBy }) {
  const { activeCategory, setActiveCategory, products } = useStore();

  const categories = [
    {
      id: 'all',
      name: 'All Kurtis',
      image: '/uploads/product-1-main.jpg',
      icon: Sparkles,
      count: products.length
    },
    {
      id: 'viral-kurtis',
      name: 'Viral Trends',
      image: '/uploads/product-2-main.jpg',
      icon: Flame,
      count: products.filter(p => p.isViral || p.category === 'viral-kurtis').length
    },
    {
      id: 'wedding',
      name: 'Wedding Suite',
      image: '/uploads/product-1-closeup.jpg',
      icon: Crown,
      count: products.filter(p => p.inWeddingSection || p.category === 'wedding').length
    },
    {
      id: 'mirror',
      name: 'Mirror Work',
      image: '/uploads/product-1-side.jpg',
      icon: Gem,
      count: products.filter(p => p.tags?.includes('mirror work') || p.specs?.ornamentation?.toLowerCase().includes('mirror')).length
    },
    {
      id: 'khadi',
      name: 'Pure Khadi',
      image: '/uploads/product-3-main.jpg',
      icon: Flower2,
      count: products.filter(p => p.tags?.includes('khadi') || p.specs?.kurtaFabric?.toLowerCase().includes('khadi')).length
    },
  ];

  return (
    <div className="space-y-3 pt-1">
      {/* 1. Meesho / Flipkart Circular Category Navigation Strip */}
      <div className="flex items-center justify-between sm:justify-start gap-3 sm:gap-6 overflow-x-auto py-2 px-1 scrollbar-none">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="flex flex-col items-center flex-shrink-0 group cursor-pointer active:scale-95 transition"
            >
              {/* Circular Avatar */}
              <div className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden p-0.5 transition-all ${
                isActive
                  ? 'ring-2.5 ring-brand-600 shadow-md scale-105'
                  : 'ring-1 ring-gray-200 group-hover:ring-brand-400'
              }`}>
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    e.target.src = '/uploads/product-1-main.jpg';
                  }}
                />
                {isActive && (
                  <div className="absolute inset-0 bg-brand-900/15 rounded-full" />
                )}
              </div>

              {/* Category Label */}
              <span className={`text-[11px] sm:text-xs font-semibold mt-1.5 text-center leading-tight whitespace-nowrap ${
                isActive ? 'text-brand-700 font-bold' : 'text-gray-700 group-hover:text-brand-600'
              }`}>
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. Meesho / Flipkart Sticky Sort & Product Count Bar */}
      <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 flex items-center justify-between shadow-2xs">
        <span className="text-xs font-medium text-gray-600">
          Showing <strong className="text-gray-900 font-bold">{products.length}</strong> Outfits
        </span>

        <div className="flex items-center gap-1.5 text-xs">
          <SlidersHorizontal className="w-3.5 h-3.5 text-gray-500" />
          <span className="text-gray-500 hidden sm:inline">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent border-0 text-xs font-bold text-gray-800 focus:outline-none cursor-pointer pr-1"
          >
            <option value="featured">Featured &amp; Trending</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="discount">Biggest Discount</option>
          </select>
        </div>
      </div>
    </div>
  );
}
