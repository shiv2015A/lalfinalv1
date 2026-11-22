// src/components/CartDrawer.jsx
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck, Sparkles, Check, Phone, Instagram } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CartDrawer() {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQty,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartSavings,
    cartTotal,
    freeShippingThreshold,
    freeShippingLeft,
    shippingFee,
    promoCode,
    appliedDiscount,
    applyPromoCode,
    formatPrice,
    instagramHandle,
    setInstagramVoucherModal,
    copyTextToClipboard,
    showToast
  } = useStore();

  const [inputCode, setInputCode] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyCode = (e) => {
    e.preventDefault();
    applyPromoCode(inputCode);
  };

  const handleCheckout = () => {
    // Launch celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    setOrderPlaced(true);
    setTimeout(() => {
      clearCart();
      setOrderPlaced(false);
      setIsCartOpen(false);
    }, 4500);
  };

  const cartSummaryWhatsApp = encodeURIComponent(
    `Hello Label & Loom! ✨ I want to checkout my order:\n\n` +
    cart.map(item => `• ${item.product.title} (Size: ${item.size}) x ${item.quantity} = ${formatPrice(item.product.price * item.quantity)}`).join('\n') +
    `\n\n💰 Subtotal: ${formatPrice(cartSubtotal)}` +
    (appliedDiscount > 0 ? `\n🏷️ Discount (${appliedDiscount}%): -${formatPrice(cartSubtotal * appliedDiscount / 100)}` : '') +
    `\n🚚 Shipping: ${shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}` +
    `\n👑 Total Payable: ${formatPrice(cartTotal)}\n\nPlease provide payment link & shipping details!`
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-charcoal/60 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div 
        className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-gold-400/40 text-charcoal animate-slideLeft"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gold-500/20 flex items-center justify-between bg-cream/30">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-brand-600" />
            <h3 className="font-serif text-lg font-bold text-charcoal">
              Shopping Bag ({cart.reduce((s, i) => s + i.quantity, 0)})
            </h3>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-full hover:bg-gold-100 transition text-charcoal/70 hover:text-charcoal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Meter */}
        <div className="px-5 py-3 bg-brand-50/70 border-b border-gold-400/20 text-xs">
          {freeShippingLeft > 0 ? (
            <div className="space-y-1.5">
              <p className="text-charcoal/80 flex items-center justify-between font-medium">
                <span>Add <strong className="text-brand-600">{formatPrice(freeShippingLeft)}</strong> more for <strong>FREE Express Shipping</strong>!</span>
                <Truck className="w-4 h-4 text-brand-600" />
              </p>
              <div className="w-full h-1.5 bg-brand-200/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-brand-600 transition-all duration-500 rounded-full"
                  style={{ width: `${Math.min(100, ((freeShippingThreshold - freeShippingLeft) / freeShippingThreshold) * 100)}%` }}
                />
              </div>
            </div>
          ) : (
            <p className="text-emerald-700 font-bold flex items-center gap-1.5">
              <Check className="w-4 h-4" /> You've unlocked FREE Express Shipping across India! ✨
            </p>
          )}
        </div>

        {/* Cart Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {orderPlaced ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                ✓
              </div>
              <h4 className="font-serif text-2xl font-bold text-charcoal">Thank You! Order Placed 🎉</h4>
              <p className="text-xs text-charcoal/70 max-w-xs mx-auto">
                Your luxury Label &amp; Loom order has been confirmed. Our bespoke atelier is preparing your pieces with care!
              </p>
            </div>
          ) : cart.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mx-auto text-charcoal/40">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-xl font-bold text-charcoal">Your Shopping Bag is Empty</h4>
              <p className="text-xs text-charcoal/60 max-w-xs mx-auto">
                Explore our viral mirror-work chinons, wine georgette kurtis, and wedding ensembles to start filling your bag.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="px-6 py-2.5 rounded-full bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow transition"
              >
                Start Exploring
              </button>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={`${item.product.id}-${item.size}-${idx}`} className="flex gap-3 pb-4 border-b border-gold-400/20">
                <img
                  src={item.product.images?.[0] || '/uploads/product-1-main.jpg'}
                  alt={item.product.title}
                  className="w-20 h-24 object-cover object-top rounded-xl border border-gold-400/30 flex-shrink-0"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h5 className="font-serif text-xs font-bold text-charcoal line-clamp-1">
                      {item.product.title}
                    </h5>
                    <p className="text-[11px] text-charcoal/60 mt-0.5">
                      <span className="font-bold text-brand-700 bg-brand-50 px-1.5 py-0.2 rounded border border-brand-200 text-[10px] mr-1.5">
                        {item.mode === 'rent' ? `Rent (${item.rentalDays || 3}d)` : 'Buy'}
                      </span>
                      Size: <span className="font-bold text-charcoal">{item.size}</span>
                      {item.product.specs?.color ? ` • ${item.product.specs.color}` : ''}
                    </p>
                    <p className="text-xs font-extrabold text-charcoal mt-1">
                      {formatPrice(item.price)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center border border-gold-400/40 rounded-lg overflow-hidden bg-white text-xs">
                      <button
                        onClick={() => updateCartQty(item.product.id, item.size, item.mode || 'buy', item.quantity - 1)}
                        className="px-2 py-0.5 hover:bg-cream text-charcoal font-bold"
                      >
                        -
                      </button>
                      <span className="px-2 py-0.5 font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQty(item.product.id, item.size, item.mode || 'buy', item.quantity + 1)}
                        className="px-2 py-0.5 hover:bg-cream text-charcoal font-bold"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id, item.size, item.mode || 'buy')}
                      className="text-charcoal/40 hover:text-rose-600 transition"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Summary */}
        {cart.length > 0 && !orderPlaced && (
          <div className="p-4 sm:p-5 border-t border-gold-500/20 bg-cream/20 space-y-3">
            
            {/* Promo Code Input */}
            <form onSubmit={handleApplyCode} className="flex gap-2">
              <input
                type="text"
                placeholder="Promo Code (Try LOOM10)"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs bg-white border border-gold-400/40 rounded-lg focus:outline-none uppercase font-semibold"
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 text-xs font-bold bg-charcoal text-white rounded-lg hover:bg-brand-600 transition"
              >
                Apply
              </button>
            </form>

            {appliedDiscount > 0 && (
              <p className="text-[11px] text-emerald-700 font-bold flex items-center justify-between">
                <span>Code {promoCode} ({appliedDiscount}% OFF applied!)</span>
                <span>-{formatPrice(cartSubtotal * appliedDiscount / 100)}</span>
              </p>
            )}

            {/* Price Line Breakdown */}
            <div className="space-y-1 text-xs text-charcoal/70">
              <div className="flex justify-between">
                <span>Bag Subtotal</span>
                <span className="font-medium text-charcoal">{formatPrice(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="font-medium text-charcoal">
                  {shippingFee === 0 ? <strong className="text-emerald-700">FREE</strong> : formatPrice(shippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-serif font-extrabold text-charcoal pt-1.5 border-t border-gold-400/20">
                <span>Total Amount</span>
                <span className="text-brand-700">{formatPrice(cartTotal)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  const refId = `LL-${Date.now().toString().slice(-5)}`;
                  const cleanHandle = (instagramHandle || 'labelandloom.in').replace(/^@/, '').trim();
                  const instagramProfileUrl = `https://www.instagram.com/${cleanHandle}/`;
                  const itemsSummary = cart.map(item => 
                    `• ${item.product.title}\n  - Mode: ${item.mode === 'rent' ? `RENT (${item.rentalDays || 3} Days)` : 'BUY'}\n  - Size: ${item.size} | Qty: ${item.quantity} | Total: ${formatPrice(item.price * item.quantity)}`
                  ).join('\n\n');

                  const voucherText = 
`✨ LABEL & LOOM ATELIER ORDER BOOKING ✨
Ref ID: #${refId}

🛍️ ITEMS IN BAG:
${itemsSummary}

💰 Subtotal: ${formatPrice(cartSubtotal)}
${appliedDiscount > 0 ? `🏷️ Discount (${appliedDiscount}%): -${formatPrice(cartSubtotal * appliedDiscount / 100)}\n` : ''}🚚 Shipping: ${shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}
👑 Total Amount: ${formatPrice(cartTotal)}
----------------------------------------
Hello @${cleanHandle}! I would like to place an order for the items above. Please share payment and shipping confirmation!`;

                  copyTextToClipboard(voucherText);
                  try {
                    window.open(instagramProfileUrl, '_blank', 'noopener,noreferrer');
                  } catch (_) {}

                  setInstagramVoucherModal({
                    refId,
                    product: cart[0]?.product,
                    voucherText,
                    instagramUrl: instagramProfileUrl
                  });

                  if (showToast) showToast(`Order copied! Opening @${cleanHandle} on Instagram ✨`);
                }}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-purple-600 via-rose-600 to-amber-600 hover:opacity-95 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg transition flex items-center justify-center gap-2"
              >
                <Instagram className="w-4 h-4" />
                <span>Checkout via Instagram (@{instagramHandle})</span>
              </button>

              <button
                onClick={handleCheckout}
                className="w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-1.5"
              >
                <span>Direct Web Checkout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <a
                href={`https://wa.me/919876543210?text=${cartSummaryWhatsApp}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow transition flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>Instant Checkout via WhatsApp</span>
              </a>
            </div>

            <div className="flex items-center justify-center gap-2 text-[10px] text-charcoal/50 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Encrypted &amp; Verified Payment Gateway</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

