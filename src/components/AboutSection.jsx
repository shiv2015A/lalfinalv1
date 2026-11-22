// src/components/AboutSection.jsx
import React from 'react';
import { Sparkles, Heart, Feather, Compass } from 'lucide-react';

export default function AboutSection() {
  return (
    <section id="story-section" className="py-6 sm:py-8 bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-2xs">
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          
          {/* Left Visual Composition */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="rounded-2xl overflow-hidden shadow-md aspect-[3/4] border border-gold-400/30">
              <img
                src="/uploads/product-1-closeup.jpg"
                alt="Artisanal Handcrafted Mirror Work"
                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80";
                }}
              />
            </div>
            <div className="rounded-2xl overflow-hidden shadow-md aspect-[3/4] border border-gold-400/30 mt-6">
              <img
                src="/uploads/product-3-side.jpg"
                alt="Pure Handloom Khadi Weave"
                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80";
                }}
              />
            </div>
          </div>

          {/* Right Editorial Story */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
              <Feather className="w-3.5 h-3.5" />
              The Label &amp; Loom Philosophy
            </div>

            <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-charcoal leading-tight">
              Where Centuries of Indian Handloom Heritage Meet <span className="italic font-serif text-brand-600">Viral Modern Cuts</span>
            </h2>

            <p className="text-xs sm:text-base text-charcoal/80 font-light leading-relaxed">
              Founded on the belief that ethnic wear should be vibrant, breathtakingly aesthetic, and effortless to wear, <strong>Label &amp; Loom</strong> reimagines traditional Indian attire. Every kurti and wedding ensemble is an ode to timeless craft — from authentic Rajasthani real-mirror embroidery and Lucknowi lace trims to handspun organic Khadi.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-white rounded-xl border border-gold-400/20 shadow-xs space-y-1">
                <span className="font-serif font-bold text-sm text-brand-700 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-gold-500" /> Viral Aesthetic Edits
                </span>
                <p className="text-xs text-charcoal/70">
                  Cut and tailored to flatter modern silhouettes, creating viral lookbook moments for Instagram and festive celebrations.
                </p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-gold-400/20 shadow-xs space-y-1">
                <span className="font-serif font-bold text-sm text-brand-700 flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-rose-500" /> Ethical Weaving Artisans
                </span>
                <p className="text-xs text-charcoal/70">
                  Supporting indigenous master weavers and craft clusters across India with sustainable fair wages and pure fabrics.
                </p>
              </div>
            </div>

            <div className="pt-2 text-xs text-charcoal/60 italic border-l-2 border-brand-500 pl-3">
              "We don't just weave fabric; we weave memories for weddings, celebrations, and your everyday graceful radiance."
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

