// src/components/Footer.jsx
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, Shield, Heart, ArrowRight, Instagram, Facebook, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  const { setIsAdminOpen, setActiveCategory, showToast, instagramHandle } = useStore();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      showToast('Welcome to the Label & Loom Atelier VIP Circle! 💌 Check your inbox for 15% OFF.');
      setEmail('');
    }
  };

  return (
    <footer className="bg-charcoal text-white pt-10 sm:pt-14 pb-24 sm:pb-8 border-t border-gold-500/20">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 space-y-8">
        
        {/* Top Newsletter & Brand Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10 items-center">
          
          <div className="lg:col-span-6 space-y-3">
            <span className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight uppercase flex items-center gap-2">
              <span>label</span>
              <span className="text-gold-400 font-serif italic text-2xl">&amp;</span>
              <span>loom</span>
            </span>
            <p className="text-xs sm:text-sm text-white/70 max-w-md font-light leading-relaxed">
              Viral Indian ethnic &amp; festive couture. Handcrafted real mirror work, pure flowy georgettes, and breezy organic khadi ensembles for the modern muse.
            </p>
          </div>

          <div className="lg:col-span-6 space-y-3">
            <h4 className="font-serif text-base font-bold text-gold-300">
              Join the VIP Atelier Circle
            </h4>
            <p className="text-xs text-white/60">
              Receive exclusive early access to festive drop releases, bridal edits, and 15% off your first order.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
              <input
                type="email"
                required
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-2.5 text-xs bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-gold-400"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow transition whitespace-nowrap flex items-center gap-1.5"
              >
                <span>Subscribe</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-xs text-white/70">
          
          <div className="space-y-3">
            <h5 className="font-bold text-sm text-white uppercase tracking-wider">Collections</h5>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setActiveCategory('viral-kurtis')} className="hover:text-gold-400 transition">
                  Viral &amp; Trendy Kurtis 🔥
                </button>
              </li>
              <li>
                <button onClick={() => setActiveCategory('wedding')} className="hover:text-gold-400 transition">
                  Wedding &amp; Festive Suite 💍
                </button>
              </li>
              <li>
                <button onClick={() => setActiveCategory('mirror')} className="hover:text-gold-400 transition">
                  Real Mirror Work Sets ✨
                </button>
              </li>
              <li>
                <button onClick={() => setActiveCategory('khadi')} className="hover:text-gold-400 transition">
                  Handloom Khadi &amp; Cotton 🌸
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="font-bold text-sm text-white uppercase tracking-wider">Customer Care</h5>
            <ul className="space-y-2">
              <li><a href="#story-section" className="hover:text-gold-400 transition">Size Guide Chart</a></li>
              <li><a href="#story-section" className="hover:text-gold-400 transition">Express Delivery &amp; Tracking</a></li>
              <li><a href="#story-section" className="hover:text-gold-400 transition">7-Day Size Exchange</a></li>
              <li><a href="#story-section" className="hover:text-gold-400 transition">Wash &amp; Fabric Care</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="font-bold text-sm text-white uppercase tracking-wider">Direct Concierge</h5>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Instagram className="w-3.5 h-3.5 text-gold-400" />
                <a
                  href={`https://www.instagram.com/${(instagramHandle || 'labelandloom.in').replace(/^@/, '')}/`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-gold-400 transition"
                >
                  @{instagramHandle || 'labelandloom.in'}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-gold-400" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-gold-400" />
                <span>concierge@labelandloom.com</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-gold-400" />
                <span>Atelier Studio, New Delhi &amp; Jaipur</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="font-bold text-sm text-white uppercase tracking-wider">Atelier Portal</h5>
            <p className="text-[11px] text-white/50 leading-relaxed">
              Store administrators can manage stock, upload dresses, and run the Smart Screenshot Vision system.
            </p>
            <button
              onClick={() => setIsAdminOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-gold-500 hover:text-charcoal text-white font-bold text-xs transition border border-white/20 shadow-xs"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Login (admin / admin123)</span>
            </button>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-white/50 gap-4">
          <p>© 2026 Label &amp; Loom Atelier. All Rights Reserved. Indian Ethnic Couture.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Crafted with <Heart className="w-3 h-3 text-rose-500 fill-current" /> for Indian Handlooms
            </span>
            <span>•</span>
            <button onClick={() => setIsAdminOpen(true)} className="hover:text-gold-400 underline">
              Admin Access
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}

