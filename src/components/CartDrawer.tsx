import React from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Gift, 
  Truck, 
  ShieldCheck, 
  PartyPopper,
  Star,
  ChevronLeft
} from 'lucide-react';
import { CartItem, LoyaltyAccount } from '../types';
import { formatPKR, calculatePointsEarned } from '../utils/helpers';
import { LOYALTY_TIERS } from '../data/products';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  loyaltyAccount: LoyaltyAccount;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  loyaltyAccount,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout
}) => {
  if (!isOpen) return null;

  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.discountedPrice * item.quantity), 0);
  const originalSubtotal = cartItems.reduce((acc, item) => acc + (item.product.originalPrice * item.quantity), 0);
  const totalSavings = originalSubtotal - subtotal;
  
  const qurandaziThreshold = 5000;
  const isQualified = subtotal >= qurandaziThreshold;
  const remainingForTicket = Math.max(0, qurandaziThreshold - subtotal);
  const baseTickets = Math.floor(subtotal / qurandaziThreshold);
  const tierMultiplier = loyaltyAccount.tier === 'Platinum' ? 3 : loyaltyAccount.tier === 'Gold' ? 2 : 1;
  const earnedTickets = baseTickets * tierMultiplier;
  const progressPercent = Math.min(100, (subtotal / qurandaziThreshold) * 100);

  // Points customer will earn from this purchase
  const pointsToEarn = calculatePointsEarned(subtotal, loyaltyAccount.tier);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      
      {/* Full Screen Centered Container (eliminating right-side cramming) */}
      <div className="bg-white rounded-3xl max-w-5xl w-full shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold shadow-xs">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-lg sm:text-xl">Your Shopping Cart & Order Summary</h3>
              <p className="text-xs text-slate-500 font-medium">
                {totalItemsCount} item(s) selected • Free Home Delivery Included
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {cartItems.length > 0 && (
              <button
                onClick={onClearCart}
                className="hidden sm:inline text-xs text-slate-400 hover:text-red-500 font-semibold"
              >
                Clear Cart
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200 transition"
              title="Close Cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body: Centered 2-Column Responsive Layout */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-slate-800">Your Shopping Basket is Empty</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Explore our pamphlet promotional deals or search our full supermarket catalog to add products.
              </p>
              <button
                onClick={onClose}
                className="mt-6 px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-md transition"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Full-Width Cart Items List (7 cols on desktop) */}
              <div className="lg:col-span-7 divide-y divide-slate-100 border border-slate-200 rounded-2xl p-4 bg-slate-50/50">
                <div className="pb-2 flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <span>Selected Products ({cartItems.length})</span>
                  <span>Quantity & Price</span>
                </div>

                <div className="divide-y divide-slate-100 max-h-[50vh] overflow-y-auto pr-1">
                  {cartItems.map((item) => {
                    const itemTotal = item.product.discountedPrice * item.quantity;
                    const itemSavings = (item.product.originalPrice - item.product.discountedPrice) * item.quantity;

                    return (
                      <div key={item.product.id} className="py-3.5 flex gap-3.5 items-center">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                        />

                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">{item.product.brand}</span>
                          <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm truncate">
                            {item.product.name}
                          </h4>
                          <p className="text-[11px] text-slate-500 truncate">
                            {item.product.unit} • Rs. {item.product.discountedPrice.toLocaleString()} each
                          </p>

                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-black text-slate-900 text-xs sm:text-sm">
                              {formatPKR(itemTotal)}
                            </span>
                            {itemSavings > 0 && (
                              <span className="text-[10px] text-red-600 font-bold bg-red-50 px-1.5 py-0.5 rounded">
                                Saved Rs. {itemSavings}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Quantity Controls & Remove */}
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <div className="flex items-center bg-white rounded-xl p-0.5 border border-slate-200 shadow-2xs">
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                              className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-slate-200 font-bold"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-7 text-center text-xs font-black text-slate-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                              className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center hover:bg-emerald-800 font-bold"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <button
                            onClick={() => onRemoveItem(item.product.id)}
                            className="text-slate-400 hover:text-red-600 p-1 transition"
                            title="Remove Item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Order Summary & Qurandazi Tracker (5 cols on desktop) */}
              <div className="lg:col-span-5 space-y-4">
                
                {/* Lucky Draw Promo Tracker */}
                <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white rounded-2xl p-4 shadow-md">
                  <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
                    <span className="flex items-center gap-1.5 text-amber-300">
                      <Gift className="w-4 h-4 text-amber-400" />
                      <span>Rs. 5,000 Grand Lucky Draw</span>
                    </span>
                    {isQualified ? (
                      <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full text-[10px] font-black flex items-center gap-1 shadow-xs">
                        <PartyPopper className="w-3 h-3" /> {earnedTickets} Token(s) Won!
                      </span>
                    ) : (
                      <span className="text-[11px] text-amber-200">
                        Add {formatPKR(remainingForTicket)} more
                      </span>
                    )}
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-black/40 h-2.5 rounded-full overflow-hidden mb-2">
                    <div 
                      className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full transition-all duration-500 rounded-full"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-slate-300 leading-snug">
                    {isQualified
                      ? '🎉 Qualified! You will receive official tokens for the Motorcycle, 4K Smart TV & Baking Oven draw!'
                      : 'Shop for Rs. 5,000+ to automatically enter the Grand Lucky Draw!'}
                  </p>
                </div>

                {/* Delivery & Points Notice */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between bg-emerald-100/70 text-emerald-950 px-3.5 py-2.5 rounded-xl font-bold border border-emerald-200">
                    <span className="flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-emerald-700" />
                      <span>Home Delivery:</span>
                    </span>
                    <span className="text-emerald-800">FREE HOME DELIVERY</span>
                  </div>

                  <div className="flex items-center justify-between bg-amber-50 text-amber-900 px-3.5 py-2 rounded-xl border border-amber-200 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                      <span>Points to Earn:</span>
                    </span>
                    <span className="font-black text-amber-800">+{pointsToEarn} Points ({loyaltyAccount.tier})</span>
                  </div>
                </div>

                {/* Price Breakdown Card */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span className="font-bold text-slate-900">{formatPKR(subtotal)}</span>
                  </div>
                  {totalSavings > 0 && (
                    <div className="flex justify-between text-red-600 font-bold">
                      <span>Pamphlet Deals Savings:</span>
                      <span>- {formatPKR(totalSavings)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Delivery Charges:</span>
                    <span>FREE (0 PKR)</span>
                  </div>
                  <div className="flex justify-between text-base font-black text-slate-950 pt-2 border-t border-slate-200">
                    <span>Payable Total:</span>
                    <span className="text-emerald-800">{formatPKR(subtotal)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-1">
                  <button
                    onClick={onProceedToCheckout}
                    className="w-full py-4 px-4 bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 hover:from-emerald-800 hover:to-teal-900 text-white rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/25 transition active:scale-95"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  <button
                    onClick={onClose}
                    className="w-full py-2.5 text-slate-500 hover:text-slate-800 text-xs font-semibold flex items-center justify-center gap-1"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Back to Supermarket</span>
                  </button>
                </div>

              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
