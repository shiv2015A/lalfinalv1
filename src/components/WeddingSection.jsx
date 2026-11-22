// src/components/WeddingSection.jsx
import React from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, Crown, ArrowRight, Heart, ShoppingBag, Star, Phone } from 'lucide-react';
import ProductCard from './ProductCard';

export default function WeddingSection() {
  const { products, setActiveCategory } = useStore();

  const weddingProducts = products.filter(
    p => p.inWeddingSection || p.category === 'wedding' || p.tags?.includes('wedding')
  );

  return (
    <section id="wedding-section" className="py-14 bg-gradient-to-b from-brand-900 via-brand-800 to-charcoal text-white relative overflow-hidden">
      {/* Decorative Golden Paisley / Mandala Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-500/20 border border-gold-400/40 text-gold-300 text-xs font-bold tracking-widest uppercase">
            <Crown className="w-3.5 h-3.5" />
            The Royal Bridal &amp; Festive Suite
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Curated Wedding Couture <br />
            <span className="italic font-serif text-gold-400">For Bridesmaids &amp; Festive Soirees</span>
          </h2>

          <p className="text-sm sm:text-base text-brand-100/80 font-light leading-relaxed">
            Drape yourself in royal opulence. Each wedding ensemble is handcrafted with authentic real mirror work, zardozi embroidery, rich tissue silks, and fluid chinons designed to captivate the spotlight.
          </p>

          <div className="pt-2 flex items-center justify-center gap-3">
            <a
              href="https://wa.me/919876543210?text=Hello%20Label%20%26%20Loom!%20I%20am%20inquiring%20about%20your%20Wedding%20%26%20Bridesmaid%20Collection."
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow transition"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Connect with Bridal Stylist on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Wedding Collection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {weddingProducts.slice(0, 3).map((product) => (
            <div key={product.id} className="transform hover:-translate-y-1 transition-transform">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Bottom Banner with Customization Note */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-white/5 border border-gold-400/30 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="font-serif text-lg sm:text-xl font-bold text-gold-300">
              Planning a Destination Wedding or Sangeet Group Order?
            </h4>
            <p className="text-xs sm:text-sm text-brand-100/70">
              We offer bespoke size customizations, coordinated bridesmaid color palettes, and worldwide express door delivery.
            </p>
          </div>
          <button
            onClick={() => {
              setActiveCategory('wedding');
              const el = document.getElementById('catalog-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-6 py-3 rounded-full bg-gold-500 hover:bg-gold-600 text-charcoal font-bold text-xs uppercase tracking-wider transition shadow-lg flex items-center gap-2 whitespace-nowrap"
          >
            <span>View All Wedding Sets</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}

