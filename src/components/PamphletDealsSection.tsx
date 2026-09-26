import React from 'react';
import { 
  Sparkles, 
  ShoppingBag, 
  Plus, 
  Minus, 
  Tag, 
  TrendingDown,
  Layers,
  Check
} from 'lucide-react';
import { Product, CartItem } from '../types';
import { formatPKR } from '../utils/helpers';

interface PamphletDealsSectionProps {
  products: Product[];
  cartItems: CartItem[];
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

export const PamphletDealsSection: React.FC<PamphletDealsSectionProps> = ({
  products,
  cartItems,
  onAddToCart,
  onUpdateQuantity
}) => {
  const pamphletProducts = products.filter(p => p.isPamphletDeal);

  const getItemQuantity = (productId: string): number => {
    const item = cartItems.find(i => i.product.id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <section id="pamphlet-deals" className="py-12 px-4 max-w-7xl mx-auto">
      
      {/* Section Header Banner */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-400 text-slate-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider mb-2 shadow">
              <Sparkles className="w-3.5 h-3.5" /> Official Pamphlet Discounts
            </div>
            <h3 className="text-2xl sm:text-4xl font-black tracking-tight">
              All Grocery Items Available at Wholesale Discount Rates!
            </h3>
            <p className="text-red-100 text-xs sm:text-sm mt-1 max-w-2xl">
              All 30 promotional items from the official KAAF Cash & Carry flyer with original struck-through prices and genuine savings. Instant WhatsApp slip generated on checkout!
            </p>
          </div>

          <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center shrink-0">
            <span className="text-xs uppercase text-amber-300 font-bold block">Promotional Deals</span>
            <span className="text-3xl font-black text-white">{pamphletProducts.length} Items</span>
            <span className="text-[11px] text-red-200 block">Lowest Rates Guaranteed</span>
          </div>
        </div>
      </div>

      {/* Grid of Pamphlet Products */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {pamphletProducts.map((product) => {
          const quantity = getItemQuantity(product.id);
          const savings = product.originalPrice - product.discountedPrice;
          const discountPercent = Math.round((savings / product.originalPrice) * 100);

          return (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group hover:border-emerald-600/40"
            >
              {/* Image & Discount Badges */}
              <div className="relative h-44 sm:h-52 bg-slate-100 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />

                {/* Savings Pill */}
                <div className="absolute top-2.5 left-2.5 bg-red-600 text-white font-black text-[11px] px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1">
                  <TrendingDown className="w-3 h-3" />
                  <span>Save Rs. {savings}</span>
                </div>

                {/* Discount Percentage Pill */}
                <div className="absolute top-2.5 right-2.5 bg-amber-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full shadow">
                  {discountPercent}% OFF
                </div>

                {/* Brand & Unit Tag */}
                <div className="absolute bottom-2 left-2.5 flex items-center gap-1">
                  <span className="bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    {product.brand}
                  </span>
                  <span className="bg-emerald-900/80 backdrop-blur-xs text-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded">
                    {product.unit}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  {/* Category */}
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    {product.category}
                  </span>

                  {/* Name */}
                  <h4 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug line-clamp-1 group-hover:text-emerald-700 transition">
                    {product.name}
                  </h4>
                  <div className="text-[11px] text-slate-500 line-clamp-1 mb-2">
                    {product.nameUrdu}
                  </div>

                  {/* Pricing info */}
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-lg sm:text-xl font-black text-slate-900">
                      {formatPKR(product.discountedPrice)}
                    </span>
                    <span className="text-xs text-slate-400 line-through">
                      Rs. {product.originalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Add to Cart Stepper */}
                <div className="pt-2 border-t border-slate-100">
                  {quantity === 0 ? (
                    <button
                      onClick={() => onAddToCart(product)}
                      disabled={!product.inStock}
                      className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition duration-200 ${
                        product.inStock
                          ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-md shadow-emerald-700/20 active:scale-95'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
                    </button>
                  ) : (
                    <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl p-1">
                      <button
                        onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                        className="w-8 h-8 rounded-lg bg-white text-emerald-800 shadow-xs flex items-center justify-center hover:bg-emerald-100 font-bold active:scale-90 transition"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-black text-emerald-900 text-sm px-2">
                        {quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                        className="w-8 h-8 rounded-lg bg-emerald-700 text-white shadow-xs flex items-center justify-center hover:bg-emerald-800 font-bold active:scale-90 transition"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Stock count */}
                  <div className="mt-2 text-center">
                    <span className="text-[10px] text-slate-400">
                      {product.stockCount > 0 ? `In Stock: ${product.stockCount} units` : 'Sold Out'}
                    </span>
                  </div>
                </div>

              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
};
