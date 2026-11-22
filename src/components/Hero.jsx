// src/components/Hero.jsx - Meesho/Flipkart Style Sleek Promotional Banner
import React from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, ArrowRight, Instagram, Clock, ShieldCheck, Tag } from 'lucide-react';

export default function Hero() {
  const { setActiveCategory, instagramHandle } = useStore();
  const cleanHandle = (instagramHandle || 'labelandloom.in').replace(/^@/, '').trim();

  const handleScrollToShop = (category = 'all') => {
    setActiveCategory(category);
    const el = document.getElementById('catalog-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full pt-2 pb-1">
      {/* Sleek Flipkart/Meesho Promotional App Banner */}
      <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-brand-800 via-rose-800 to-amber-700 text-white shadow-sm border border-gold-400/30">
        <div className="grid grid-cols-12 items-center p-3 sm:p-5 min-h-[135px] sm:min-h-[160px]">
          
          {/* Left Text & Offers */}
          <div className="col-span-8 sm:col-span-8 space-y-1 sm:space-y-1.5 z-10 pr-2">
            <div className="inline-flex items-center gap-1 bg-gold-400 text-charcoal font-black text-[9px] sm:text-[10px] px-2 py-0.5 rounded uppercase tracking-wider shadow-xs">
              <Sparkles className="w-3 h-3" />
              Festive Wedding Season Sale
            </div>

            <h2 className="font-serif text-base sm:text-2xl font-black text-white leading-tight">
              Viral Kurtis &amp; Wedding Sets
            </h2>

            <p className="text-[11px] sm:text-xs text-brand-100 font-medium line-clamp-1">
              Pure Georgettes, Real Mirror &amp; Khadi • <strong>Buy or Rent from ₹399</strong>
            </p>

            <div className="pt-1 flex items-center gap-2 flex-wrap">
              <button
                onClick={() => handleScrollToShop('wedding')}
                className="px-3 py-1 sm:px-4 sm:py-1.5 bg-white text-brand-800 font-extrabold text-[10px] sm:text-xs rounded-full shadow hover:bg-gold-50 transition active:scale-95 flex items-center gap-1"
              >
                <span>Shop Collection</span>
                <ArrowRight className="w-3 h-3" />
              </button>

              <a
                href={`https://www.instagram.com/${cleanHandle}/`}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-white/20 hover:bg-white/30 text-white font-bold text-[10px] sm:text-xs rounded-full transition flex items-center gap-1 backdrop-blur-xs"
              >
                <Instagram className="w-3 h-3" />
                <span>@{cleanHandle}</span>
              </a>
            </div>
          </div>

          {/* Right Featured Model Photo - Clean & Contained */}
          <div className="col-span-4 sm:col-span-4 flex justify-end">
            <div className="relative w-24 h-28 sm:w-32 sm:h-36 rounded-lg overflow-hidden shadow-md border-2 border-white/30 rotate-1 group-hover:rotate-0 transition">
              <img
                src="/uploads/product-1-main.jpg"
                alt="Festive Kurti Set"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute bottom-0 inset-x-0 bg-brand-900/80 text-white text-[8px] sm:text-[9px] font-bold text-center py-0.5">
                50% OFF
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Trust Ticker - 100% Responsive & Fits Screen */}
        <div className="bg-black/25 px-2 sm:px-3 py-1 flex items-center justify-between sm:justify-around text-[9px] sm:text-[10px] text-brand-100 border-t border-white/10 w-full overflow-hidden">
          <span className="flex items-center gap-1 truncate">
            <ShieldCheck className="w-3 h-3 text-gold-300 flex-shrink-0" /> Pure Fabrics
          </span>
          <span className="text-white/30">•</span>
          <span className="flex items-center gap-1 truncate">
            <Clock className="w-3 h-3 text-gold-300 flex-shrink-0" /> Rent from ₹399
          </span>
          <span className="text-white/30">•</span>
          <span className="flex items-center gap-1 truncate">
            <Tag className="w-3 h-3 text-gold-300 flex-shrink-0" /> Code: <strong>LOOM10</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
