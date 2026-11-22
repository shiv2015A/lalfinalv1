// src/components/InstagramOrderModal.jsx - Foolproof Instagram Order Booking Modal
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Instagram, Check, Copy, ExternalLink, X, Send } from 'lucide-react';

export default function InstagramOrderModal() {
  const { instagramVoucherModal, setInstagramVoucherModal, instagramHandle, copyTextToClipboard, showToast } = useStore();
  const [copied, setCopied] = useState(true);

  if (!instagramVoucherModal) return null;

  const { refId, voucherText, instagramUrl } = instagramVoucherModal;
  const cleanHandle = (instagramHandle || 'labelandloom.in').replace(/^@/, '').trim();
  const targetUrl = instagramUrl || `https://www.instagram.com/${cleanHandle}/`;

  const handleCopy = async () => {
    await copyTextToClipboard(voucherText);
    setCopied(true);
    showToast('Order details copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenInstagram = () => {
    // Open Instagram profile directly
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-60 overflow-y-auto bg-charcoal/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div 
        className="relative bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-2xl border-t sm:border border-gold-400/50 text-charcoal space-y-4 sm:space-y-5 animate-scaleUp pb-10 sm:pb-7"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Swipe Handle */}
        <div className="w-12 h-1 bg-charcoal/20 rounded-full mx-auto mb-2 sm:hidden" />

        {/* Close Button */}
        <button
          onClick={() => setInstagramVoucherModal(null)}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full bg-cream hover:bg-gold-200 text-charcoal transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1.5 pt-1">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center mx-auto shadow-md">
            <Instagram className="w-7 h-7" />
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal">
            Instagram Order Booking
          </h3>
          <p className="text-xs text-charcoal/60">
            Official Handle: <span className="font-bold text-brand-600">@{cleanHandle}</span>
          </p>
        </div>

        {/* Copied Success Banner */}
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center gap-2.5 text-xs text-emerald-900 font-semibold">
          <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 text-[10px]">
            ✓
          </div>
          <span>Order details copied to clipboard! Just paste into Instagram DM.</span>
        </div>

        {/* Formatted Message Preview Box */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-charcoal/70">
            <span>Order Template (Ref #{refId})</span>
            <button
              onClick={handleCopy}
              className="text-brand-600 hover:text-brand-700 flex items-center gap-1 font-semibold normal-case text-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Again'}</span>
            </button>
          </div>
          <div className="p-3.5 bg-cream/50 rounded-xl border border-gold-400/30 text-xs font-mono whitespace-pre-wrap text-charcoal/90 leading-relaxed max-h-40 overflow-y-auto select-all">
            {voucherText}
          </div>
        </div>

        {/* 3 Simple Steps */}
        <div className="grid grid-cols-3 gap-2 text-center text-[10px] text-charcoal/70 pt-1">
          <div className="p-2 rounded-lg bg-cream/30 border border-gold-400/20">
            <span className="font-bold text-emerald-700 block">✓ Step 1</span>
            <span>Voucher Copied</span>
          </div>
          <div className="p-2 rounded-lg bg-cream/30 border border-gold-400/20">
            <span className="font-bold text-brand-700 block">Step 2</span>
            <span>Open Profile</span>
          </div>
          <div className="p-2 rounded-lg bg-cream/30 border border-gold-400/20">
            <span className="font-bold text-brand-700 block">Step 3</span>
            <span>Tap "Message" &amp; Paste</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <button
            onClick={handleOpenInstagram}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-purple-600 via-rose-600 to-amber-600 hover:opacity-95 text-white font-bold text-sm rounded-xl shadow-lg transition flex items-center justify-center gap-2"
          >
            <Instagram className="w-4 h-4" />
            <span>Open @{cleanHandle} on Instagram</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </button>

          <button
            onClick={handleCopy}
            className="w-full py-2.5 px-4 bg-cream hover:bg-gold-100 text-charcoal font-semibold text-xs rounded-xl border border-gold-400/30 transition flex items-center justify-center gap-1.5"
          >
            <Copy className="w-3.5 h-3.5 text-brand-600" />
            <span>{copied ? '✓ Order Text in Clipboard' : 'Copy Order Text to Clipboard'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}

