// src/components/WishlistDrawer.jsx
import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';

export default function WishlistDrawer() {
  const {
    isWishlistOpen,
    setIsWishlistOpen,
    wishlist,
    products,
    toggleWishlist,
    addToCart,
    formatPrice
  } = useStore();

  if (!isWishlistOpen) return null;

  const savedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-charcoal/60 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div
        className="relative w-full sm:max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-gold-400/40 text-charcoal pb-8 sm:pb-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gold-500/20 flex items-center justify-between bg-cream/30">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-brand-600 fill-current" />
            <h3 className="font-serif text-lg font-bold text-charcoal">
              Your Wishlist ({savedProducts.length})
            </h3>
          </div>
          <button
            onClick={() => setIsWishlistOpen(false)}
            className="p-1.5 rounded-full hover:bg-gold-100 transition text-charcoal/70 hover:text-charcoal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {savedProducts.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mx-auto text-charcoal/40">
                <Heart className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-xl font-bold text-charcoal">Your Wishlist is Empty</h4>
              <p className="text-xs text-charcoal/60 max-w-xs mx-auto">
                Tap the heart icon on any kurti or wedding ensemble you love to save it here for later.
              </p>
            </div>
          ) : (
            savedProducts.map((prod) => (
              <div key={prod.id} className="flex gap-3 pb-4 border-b border-gold-400/20">
                <img
                  src={prod.images?.[0] || '/uploads/product-1-main.jpg'}
                  alt={prod.title}
                  className="w-20 h-24 object-cover object-top rounded-xl border border-gold-400/30 flex-shrink-0"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h5 className="font-serif text-xs font-bold text-charcoal line-clamp-1">
                      {prod.title}
                    </h5>
                    <p className="text-[11px] text-charcoal/60 mt-0.5">
                      {prod.specs?.kurtaFabric || prod.categoryName}
                    </p>
                    <p className="text-xs font-extrabold text-charcoal mt-1">
                      {formatPrice(prod.price)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => {
                        addToCart(prod, prod.sizes?.[0] || 'M', 1);
                        toggleWishlist(prod.id);
                      }}
                      className="px-3 py-1 rounded-full text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white transition flex items-center gap-1 shadow-sm"
                    >
                      <ShoppingBag className="w-3 h-3" /> Move to Bag
                    </button>

                    <button
                      onClick={() => toggleWishlist(prod.id)}
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

        {/* Footer */}
        <div className="p-4 border-t border-gold-500/20 bg-cream/20 text-center">
          <button
            onClick={() => setIsWishlistOpen(false)}
            className="text-xs font-bold text-brand-600 hover:text-brand-700 underline"
          >
            Continue Shopping
          </button>
        </div>

      </div>
    </div>
  );
}

