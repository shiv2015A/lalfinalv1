// src/components/ProductCard.jsx - Authentic Meesho / Flipkart / Amazon E-Commerce Card
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Heart, Instagram, ShoppingBag, Clock } from 'lucide-react';

export default function ProductCard({ product }) {
  const { 
    wishlist, 
    toggleWishlist, 
    addToCart, 
    setSelectedProduct, 
    formatPrice,
    triggerInstagramDMOrder 
  } = useStore();

  const [selectedSize] = useState(product.sizes?.[0] || 'M');

  const isSaved = wishlist.includes(product.id);
  const primaryImg = product.images?.[0] || '/uploads/product-1-main.jpg';
  const isOutOfStock = product.inStock === false;

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    if (isOutOfStock) {
      triggerInstagramDMOrder(product, selectedSize, 'buy', 3);
      return;
    }
    addToCart(product, selectedSize, 1, 'buy');
  };

  const handleInstagramDM = (e) => {
    e.stopPropagation();
    triggerInstagramDMOrder(product, selectedSize, 'buy', 3);
  };

  return (
    <div
      className={`group relative bg-white rounded-lg border overflow-hidden flex flex-col justify-between transition-all duration-200 cursor-pointer min-w-0 w-full max-w-full ${
        isOutOfStock 
          ? 'border-gray-200 opacity-90' 
          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
      }`}
      onClick={() => setSelectedProduct(product)}
    >
      {/* 1. Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-50">
        <img
          src={primaryImg}
          alt={product.title}
          className={`w-full h-full object-cover object-top transition-transform duration-500 ${
            isOutOfStock ? 'grayscale-[25%]' : 'group-hover:scale-103'
          }`}
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=80";
          }}
        />

        {/* Top Badges (Meesho/Flipkart style) */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start z-10">
          {isOutOfStock ? (
            <span className="bg-gray-900 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-xs uppercase">
              Out of Stock
            </span>
          ) : (
            <>
              {product.inWeddingSection && (
                <span className="bg-brand-700 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                  Wedding
                </span>
              )}
              {product.isViral && (
                <span className="bg-amber-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                  🔥 Viral
                </span>
              )}
            </>
          )}
        </div>

        {/* Wishlist Heart Icon (Top Right) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2 right-2 w-7 h-7 rounded-full backdrop-blur-xs flex items-center justify-center transition shadow-xs z-10 ${
            isSaved
              ? 'bg-brand-600 text-white'
              : 'bg-white/90 text-gray-600 hover:text-brand-600'
          }`}
          title={isSaved ? "Remove from wishlist" : "Save to wishlist"}
          aria-label="Wishlist"
        >
          <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        {/* Rental Tag on Image */}
        {product.rentPrice && !isOutOfStock && (
          <div className="absolute bottom-2 left-2 bg-black/75 backdrop-blur-xs text-gold-300 font-extrabold text-[9px] px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" />
            <span>Rent {formatPrice(product.rentPrice)}/3d</span>
          </div>
        )}
      </div>

      {/* 2. Product Details (Meesho / Flipkart / Amazon Layout) */}
      <div className="p-2 sm:p-2.5 space-y-1.5 flex-1 flex flex-col justify-between min-w-0 overflow-hidden">
        <div>
          {/* Brand & Category */}
          <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider truncate">
            {product.specs?.kurtaFabric || 'Ethnic Wear'}
          </p>

          {/* Title */}
          <h3 className="text-xs sm:text-sm font-normal text-gray-800 line-clamp-1 leading-snug group-hover:text-brand-700 transition-colors">
            {product.title}
          </h3>

          {/* Color & Work Spec */}
          <p className="text-[11px] text-gray-500 truncate pt-0.5">
            {product.specs?.color || ''}{product.specs?.ornamentation ? ` • ${product.specs.ornamentation}` : ''}
          </p>

          {/* Price Line (Bold price, strikethrough MRP, % OFF) */}
          <div className="flex items-baseline gap-1.5 pt-1 flex-wrap">
            <span className="text-sm sm:text-base font-extrabold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-[11px] text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            {product.discount > 0 && (
              <span className="text-[10px] sm:text-[11px] font-bold text-emerald-600">
                {product.discount}% off
              </span>
            )}
          </div>

          {/* Free Delivery Tag */}
          <div className="flex items-center justify-between text-[10px] text-gray-500 pt-0.5">
            <span className="bg-gray-100 text-gray-600 px-1 rounded font-medium">Free Delivery</span>
            <span className="text-emerald-700 font-semibold">Ready to Ship</span>
          </div>
        </div>

        {/* 3. Action Buttons (Meesho/Flipkart Style) */}
        <div className="pt-2 border-t border-gray-100 flex items-center gap-1.5">
          <button
            onClick={handleInstagramDM}
            className="flex-1 py-1.5 px-2 bg-gradient-to-r from-purple-600 via-rose-600 to-amber-600 hover:opacity-95 text-white font-bold text-[11px] sm:text-xs rounded shadow-xs transition flex items-center justify-center gap-1 active:scale-98"
            title="Order on Instagram"
          >
            <Instagram className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{isOutOfStock ? 'Inquire IG' : 'Order on IG'}</span>
          </button>

          {!isOutOfStock && (
            <button
              onClick={handleQuickAdd}
              className="p-1.5 sm:px-2.5 py-1.5 bg-gray-100 hover:bg-brand-50 text-gray-700 hover:text-brand-700 font-bold text-xs rounded border border-gray-200 transition flex items-center justify-center"
              title="Add to Shopping Bag"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
