// src/components/ProductModal.jsx - Product Details with Renting & Instagram DM Order
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, Heart, ShoppingBag, ShieldCheck, Truck, RefreshCw, 
  Sparkles, Check, Ruler, Instagram, Clock, Calendar, AlertTriangle
} from 'lucide-react';

export default function ProductModal() {
  const { 
    selectedProduct, 
    setSelectedProduct, 
    addToCart, 
    wishlist, 
    toggleWishlist, 
    formatPrice,
    triggerInstagramDMOrder 
  } = useStore();

  if (!selectedProduct) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(selectedProduct.sizes?.[0] || 'M');
  const [purchaseMode, setPurchaseMode] = useState('buy'); // 'buy' or 'rent'
  const [rentalDuration, setRentalDuration] = useState(3); // 3 or 7 days
  const [rentalDate, setRentalDate] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState(null);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [activeTab, setActiveTab] = useState('specs');

  const isSaved = wishlist.includes(selectedProduct.id);
  const isOutOfStock = selectedProduct.inStock === false;
  const images = (selectedProduct.images && selectedProduct.images.length > 0) 
    ? selectedProduct.images 
    : ['/uploads/product-1-main.jpg'];

  const rentRate3Day = selectedProduct.rentPrice || Math.round(selectedProduct.price * 0.28);
  const rentRate7Day = Math.round(rentRate3Day * 1.4);
  const currentRentRate = rentalDuration === 7 ? rentRate7Day : rentRate3Day;
  const securityDeposit = selectedProduct.rentSecurityDeposit || 999;

  const handlePincodeCheck = (e) => {
    e.preventDefault();
    if (pincode.length === 6 && /^\d+$/.test(pincode)) {
      setPincodeStatus({
        valid: true,
        message: 'Delivery available to ' + pincode + '! Express dispatch within 24 hours.'
      });
    } else {
      setPincodeStatus({
        valid: false,
        message: 'Please enter a valid 6-digit Indian pincode.'
      });
    }
  };

  const handleInstagramAction = () => {
    triggerInstagramDMOrder(selectedProduct, selectedSize, purchaseMode, rentalDuration, pincode);
  };

  const handleAddBag = () => {
    addToCart(selectedProduct, selectedSize, quantity, purchaseMode, rentalDuration);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6 animate-fadeIn">
      <div 
        className="relative bg-white rounded-t-3xl sm:rounded-3xl max-w-4xl w-full max-h-[94vh] sm:max-h-[92vh] overflow-y-auto shadow-2xl border-t sm:border border-gold-400/40 p-4 sm:p-8 text-charcoal pb-12 sm:pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Swipe Handle Indicator */}
        <div className="w-12 h-1 bg-charcoal/20 rounded-full mx-auto mb-3 sm:hidden" />

        {/* Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 sm:p-2.5 rounded-full bg-cream hover:bg-gold-200 text-charcoal transition z-20 shadow-sm"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-8">
          
          {/* Left Column: Image Gallery */}
          <div className="md:col-span-6 space-y-4">
            
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-cream/30 border border-gold-400/20 shadow-md">
              <img
                src={images[activeImageIndex] || images[0]}
                alt={selectedProduct.title}
                className={`w-full h-full object-cover object-top ${isOutOfStock ? 'grayscale-[20%]' : ''}`}
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80";
                }}
              />

              <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                {isOutOfStock ? (
                  <span className="bg-charcoal text-white text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow">
                    Out of Stock
                  </span>
                ) : (
                  <>
                    {selectedProduct.inWeddingSection && (
                      <span className="bg-brand-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                        💍 Wedding Suite
                      </span>
                    )}
                    {selectedProduct.discount > 0 && (
                      <span className="bg-gold-500 text-charcoal text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow">
                        {selectedProduct.discount}% OFF
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                      activeImageIndex === idx
                        ? 'border-brand-600 scale-105 shadow-md'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover object-top" />
                  </button>
                ))}
              </div>
            )}

            {/* Trust Points */}
            <div className="p-4 bg-brand-50/50 rounded-xl border border-gold-400/20 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-charcoal/80">
                <Truck className="w-4 h-4 text-brand-600" />
                <span>Free Express Shipping across India above ₹1,999</span>
              </div>
              <div className="flex items-center gap-2 text-charcoal/80">
                <RefreshCw className="w-4 h-4 text-gold-600" />
                <span>7-Day Exchange &amp; Dry-Cleaned Rental Sanitization</span>
              </div>
              <div className="flex items-center gap-2 text-charcoal/80">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Authentic Handcrafted Ethnic Wear</span>
              </div>
            </div>
          </div>

          {/* Right Column: Buy vs Rent, Options & Instagram DM */}
          <div className="md:col-span-6 space-y-5">
            
            <div className="flex items-center gap-1.5 text-xs text-charcoal/60 uppercase tracking-widest font-semibold">
              <span>{selectedProduct.categoryName}</span>
              <span>/</span>
              <span className="text-brand-600">{selectedProduct.specs?.color || 'Ethnic'}</span>
            </div>

            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-charcoal leading-tight">
                {selectedProduct.title}
              </h2>
              {selectedProduct.subtitle && (
                <p className="text-xs sm:text-sm text-charcoal/70 mt-1 font-light italic">
                  {selectedProduct.subtitle}
                </p>
              )}
            </div>

            {/* Out of Stock Warning */}
            {isOutOfStock && (
              <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl flex items-center gap-2 text-xs text-rose-800 font-bold">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Currently marked OUT OF STOCK. Send an Instagram DM to request restock!</span>
              </div>
            )}

            {/* BUY VS RENT SELECTOR TABS */}
            <div className="p-1 bg-cream/70 rounded-2xl flex border border-gold-400/30">
              <button
                type="button"
                onClick={() => setPurchaseMode('buy')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
                  purchaseMode === 'buy'
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-charcoal/70 hover:text-charcoal'
                }`}
              >
                <span>🛍️ Buy Outfit</span>
                <span className="text-[11px] opacity-90">({formatPrice(selectedProduct.price)})</span>
              </button>

              <button
                type="button"
                onClick={() => setPurchaseMode('rent')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
                  purchaseMode === 'rent'
                    ? 'bg-gradient-to-r from-amber-600 to-rose-600 text-white shadow-md'
                    : 'text-charcoal/70 hover:text-charcoal'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>✨ Rent Outfit</span>
                <span className="text-[11px] opacity-90">(from {formatPrice(rentRate3Day)})</span>
              </button>
            </div>

            {/* Pricing Section depending on mode */}
            {purchaseMode === 'buy' ? (
              <div className="p-3 bg-cream/40 rounded-xl border border-gold-400/20 flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-serif font-extrabold text-charcoal">
                  {formatPrice(selectedProduct.price)}
                </span>
                {selectedProduct.originalPrice && (
                  <span className="text-sm text-charcoal/50 line-through">
                    {formatPrice(selectedProduct.originalPrice)}
                  </span>
                )}
                {selectedProduct.discount > 0 && (
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded">
                    Save {selectedProduct.discount}%
                  </span>
                )}
                <span className="text-[11px] text-charcoal/60 ml-auto">Inclusive of all taxes</span>
              </div>
            ) : (
              /* RENTAL DURATION & RATES */
              <div className="p-4 bg-amber-50/70 border border-amber-300 rounded-2xl space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-charcoal uppercase tracking-wider text-[11px]">
                    Select Rental Duration:
                  </span>
                  <span className="text-[11px] text-brand-700 font-bold">
                    Dry-cleaned &amp; pristine sanitized
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRentalDuration(3)}
                    className={`p-2.5 rounded-xl border text-center transition ${
                      rentalDuration === 3
                        ? 'border-brand-600 bg-white shadow-sm ring-2 ring-brand-500/20'
                        : 'border-amber-200 bg-white/60 hover:bg-white'
                    }`}
                  >
                    <span className="font-bold text-sm block text-charcoal">3 Days Rental</span>
                    <span className="font-serif font-extrabold text-brand-700 text-base">{formatPrice(rentRate3Day)}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRentalDuration(7)}
                    className={`p-2.5 rounded-xl border text-center transition ${
                      rentalDuration === 7
                        ? 'border-brand-600 bg-white shadow-sm ring-2 ring-brand-500/20'
                        : 'border-amber-200 bg-white/60 hover:bg-white'
                    }`}
                  >
                    <span className="font-bold text-sm block text-charcoal">7 Days Rental</span>
                    <span className="font-serif font-extrabold text-brand-700 text-base">{formatPrice(rentRate7Day)}</span>
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-charcoal/70 pt-1 border-t border-amber-200/60">
                  <span>Refundable Security Deposit:</span>
                  <span className="font-bold text-charcoal">{formatPrice(securityDeposit)} (returned on pickup)</span>
                </div>
              </div>
            )}

            {/* Size Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-charcoal">
                  Select Size: <span className="text-brand-600 font-extrabold">{selectedSize}</span>
                </span>
                <button
                  onClick={() => setShowSizeGuide(!showSizeGuide)}
                  className="text-xs text-brand-600 hover:text-brand-700 font-semibold flex items-center gap-1 underline"
                >
                  <Ruler className="w-3.5 h-3.5" /> Size Guide
                </button>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {(selectedProduct.sizes || ['S', 'M', 'L', 'XL', 'XXL']).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`min-w-11 h-10 px-3.5 rounded-xl text-xs font-extrabold transition-all border ${
                      selectedSize === sz
                        ? 'bg-brand-600 text-white border-brand-600 shadow-md scale-105'
                        : 'bg-white text-charcoal hover:bg-gold-50 border-gold-400/40'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>

              {showSizeGuide && (
                <div className="p-3 bg-cream/70 rounded-xl border border-gold-400/30 text-xs space-y-1.5 animate-fadeIn">
                  <p className="font-bold text-charcoal flex items-center justify-between">
                    <span>Indian Ethnic Size Chart (in inches)</span>
                    <button onClick={() => setShowSizeGuide(false)} className="text-charcoal/50 hover:text-charcoal">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </p>
                  <table className="w-full text-left text-[11px]">
                    <thead>
                      <tr className="border-b border-gold-400/30 font-semibold">
                        <th className="py-1">Size</th><th>Bust</th><th>Waist</th><th>Hip</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gold-400/20">
                      <tr><td className="py-1 font-bold">S</td><td>36"</td><td>32"</td><td>38"</td></tr>
                      <tr><td className="py-1 font-bold">M</td><td>38"</td><td>34"</td><td>40"</td></tr>
                      <tr><td className="py-1 font-bold">L</td><td>40"</td><td>36"</td><td>42"</td></tr>
                      <tr><td className="py-1 font-bold">XL</td><td>42"</td><td>38"</td><td>44"</td></tr>
                      <tr><td className="py-1 font-bold">XXL</td><td>44"</td><td>40"</td><td>46"</td></tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* ACTION BUTTONS: INSTAGRAM DM (FOOLPROOF ORDER) + ADD TO BAG */}
            <div className="space-y-2.5 pt-2">
              
              {/* PRIMARY INSTAGRAM DM ORDER BUTTON */}
              <button
                type="button"
                onClick={handleInstagramAction}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-purple-600 via-rose-600 to-amber-600 hover:opacity-95 text-white font-bold text-sm rounded-xl shadow-lg transition flex items-center justify-center gap-2"
              >
                <Instagram className="w-4 h-4" />
                <span>
                  {isOutOfStock
                    ? 'Inquire on Instagram DM'
                    : purchaseMode === 'rent'
                      ? `Rent via Instagram DM • ${formatPrice(currentRentRate)}`
                      : `Order via Instagram DM • ${formatPrice(selectedProduct.price)}`}
                </span>
              </button>

              {/* Secondary Add to Bag Button */}
              {!isOutOfStock && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-gold-400/40 rounded-xl overflow-hidden bg-white">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-charcoal hover:bg-cream transition font-bold"
                    >
                      -
                    </button>
                    <span className="px-3 py-2 text-xs font-bold text-charcoal">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 text-charcoal hover:bg-cream transition font-bold"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAddBag}
                    className="flex-1 py-2.5 px-4 bg-brand-50 hover:bg-brand-600 text-brand-700 hover:text-white font-bold text-xs rounded-xl border border-brand-200 transition flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Shopping Bag</span>
                  </button>

                  <button
                    onClick={() => toggleWishlist(selectedProduct.id)}
                    className={`p-2.5 rounded-xl border transition-all ${
                      isSaved
                        ? 'bg-brand-50 border-brand-500 text-brand-600'
                        : 'bg-white border-gold-400/40 text-charcoal hover:text-brand-600'
                    }`}
                    title="Wishlist"
                  >
                    <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                  </button>
                </div>
              )}
            </div>

            {/* Pincode Delivery Estimate */}
            <div className="pt-2">
              <form onSubmit={handlePincodeCheck} className="flex items-center gap-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter Pincode for Delivery"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-cream/40 border border-gold-400/40 rounded-lg focus:outline-none focus:border-brand-500"
                />
                <button
                  type="submit"
                  className="px-3.5 py-1.5 text-xs font-bold bg-charcoal text-white rounded-lg hover:bg-brand-700 transition"
                >
                  Check
                </button>
              </form>
              {pincodeStatus && (
                <p className={`text-xs mt-1.5 ${pincodeStatus.valid ? 'text-emerald-700 font-medium' : 'text-rose-600'}`}>
                  {pincodeStatus.message}
                </p>
              )}
            </div>

            {/* Specifications Tab */}
            <div className="pt-3 border-t border-gold-500/20">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                {selectedProduct.specs?.kurtaFabric && (
                  <div>
                    <span className="text-charcoal/50 text-[10px] block uppercase font-bold">Kurta Fabric</span>
                    <span className="font-semibold text-charcoal">{selectedProduct.specs.kurtaFabric}</span>
                  </div>
                )}
                {selectedProduct.specs?.bottomFabric && (
                  <div>
                    <span className="text-charcoal/50 text-[10px] block uppercase font-bold">Bottom Fabric</span>
                    <span className="font-semibold text-charcoal">{selectedProduct.specs.bottomFabric}</span>
                  </div>
                )}
                {selectedProduct.specs?.neck && (
                  <div>
                    <span className="text-charcoal/50 text-[10px] block uppercase font-bold">Neckline</span>
                    <span className="font-semibold text-charcoal">{selectedProduct.specs.neck}</span>
                  </div>
                )}
                {selectedProduct.specs?.sleeve && (
                  <div>
                    <span className="text-charcoal/50 text-[10px] block uppercase font-bold">Sleeve</span>
                    <span className="font-semibold text-charcoal">{selectedProduct.specs.sleeve}</span>
                  </div>
                )}
                {selectedProduct.specs?.ornamentation && (
                  <div>
                    <span className="text-charcoal/50 text-[10px] block uppercase font-bold">Ornamentation</span>
                    <span className="font-semibold text-charcoal">{selectedProduct.specs.ornamentation}</span>
                  </div>
                )}
                {selectedProduct.specs?.washCare && (
                  <div className="col-span-2">
                    <span className="text-charcoal/50 text-[10px] block uppercase font-bold">Wash Care</span>
                    <span className="font-semibold text-brand-700">{selectedProduct.specs.washCare}</span>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
