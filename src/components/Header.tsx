import React from 'react';
import { 
  ShoppingCart, 
  Search, 
  MapPin, 
  Phone, 
  Gift, 
  Clock, 
  Truck, 
  Award, 
  LayoutDashboard, 
  User, 
  Sparkles,
  Percent,
  Star,
  ShieldCheck
} from 'lucide-react';
import { Branch, CartItem, LoyaltyAccount } from '../types';
import { BRANCH_CONTACTS, LOYALTY_TIERS } from '../data/products';
import { formatPKR } from '../utils/helpers';

interface HeaderProps {
  currentBranch: Branch;
  onSelectBranch: (branch: Branch) => void;
  cartItems: CartItem[];
  loyaltyAccount: LoyaltyAccount;
  onOpenCart: () => void;
  onOpenTracking: () => void;
  onOpenLoyalty: () => void;
  onOpenAdmin: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onNavigateToQurandazi: () => void;
  onNavigateToPamphlet: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentBranch,
  onSelectBranch,
  cartItems,
  loyaltyAccount,
  onOpenCart,
  onOpenTracking,
  onOpenLoyalty,
  onOpenAdmin,
  searchQuery,
  onSearchChange,
  onNavigateToQurandazi,
  onNavigateToPamphlet
}) => {
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, item) => acc + (item.product.discountedPrice * item.quantity), 0);
  const tierInfo = LOYALTY_TIERS[loyaltyAccount.tier] || LOYALTY_TIERS['Bronze'];

  return (
    <header className="sticky top-0 z-40 bg-white shadow-xs border-b border-slate-200">
      
      {/* Top Banner Ticker */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-800 to-emerald-900 text-white text-xs py-2 px-4 font-medium">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          
          <div className="flex items-center gap-2 overflow-hidden text-center sm:text-left">
            <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shrink-0 animate-pulse">
              <Gift className="w-3 h-3" /> GRAND LUCKY DRAW
            </span>
            <span className="truncate">
              Shop for <strong>Rs. 5,000 & Win</strong> a 2026 Motorcycle, 4K Smart LED TV & Baking Oven!
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs shrink-0">
            <div className="flex items-center gap-1.5 text-emerald-200 font-semibold">
              <Truck className="w-3.5 h-3.5 text-amber-300" />
              <span>FREE Home Delivery in Islamabad</span>
            </div>
            <div className="hidden lg:flex items-center gap-3 border-l border-emerald-700 pl-3 text-slate-300">
              <span>Jinnah Garden: <strong className="text-white">0333-8951378</strong></span>
              <span>River Garden: <strong className="text-white">0333-8951377</strong></span>
            </div>
          </div>

        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo & Tagline */}
          <div 
            className="flex items-center gap-3 shrink-0 cursor-pointer select-none" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-gradient-to-br from-emerald-700 to-teal-900 flex items-center justify-center shadow-md shadow-emerald-900/20 text-white ring-2 ring-emerald-500/20">
              <div className="text-center font-black">
                <span className="text-lg sm:text-xl block leading-tight font-serif tracking-tight">کاف</span>
                <span className="text-[9px] block text-emerald-200 -mt-1 font-sans">KAAF</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  KAAF <span className="text-emerald-700">CASH & CARRY</span>
                </h1>
              </div>
              <p className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <span>Wholesale Grocery Superstore</span>
                <span className="text-slate-300">•</span>
                <span className="text-emerald-700 font-medium">Islamabad</span>
              </p>
            </div>
          </div>

          {/* Quick Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md relative mx-2">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search Dalda, Olpers, Tapal, Diapers, Rice..."
                className="w-full pl-10 pr-10 py-2.5 bg-slate-100/90 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              {searchQuery && (
                <button 
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-3 text-xs bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-full w-5 h-5 flex items-center justify-center"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Right Action Icons & Loyalty Tier Badge */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Branch Switcher */}
            <div className="hidden xl:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <button
                onClick={() => onSelectBranch('Jinnah Garden')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                  currentBranch === 'Jinnah Garden'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Jinnah Garden (0333-8951378)</span>
              </button>
              <button
                onClick={() => onSelectBranch('River Garden')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                  currentBranch === 'River Garden'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>River Garden (0333-8951377)</span>
              </button>
            </div>

            {/* Loyalty Rewards Tier Pill */}
            <button
              onClick={onOpenLoyalty}
              className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition shadow-xs ${tierInfo.badgeBg}`}
              title="Click to view your KAAF Rewards Club & Points"
            >
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">{loyaltyAccount.tier} Tier:</span>
              <span className="font-black">{loyaltyAccount.points} Pts</span>
            </button>

            {/* Quick Track Order */}
            <button
              onClick={onOpenTracking}
              className="p-2 sm:px-3 sm:py-2 text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition flex items-center gap-1.5 text-xs font-bold border border-slate-200 sm:border-transparent hover:border-emerald-200"
              title="Track Your Order"
            >
              <Clock className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">Track Order</span>
            </button>

            {/* Admin Panel */}
            <button
              onClick={onOpenAdmin}
              className="p-2 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-xl transition border border-slate-200 sm:border-transparent"
              title="Store Admin Dashboard"
            >
              <LayoutDashboard className="w-4 h-4" />
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md shadow-emerald-700/20 transition active:scale-95"
            >
              <div className="relative">
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-400 text-slate-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-bounce shadow">
                    {totalItemsCount}
                  </span>
                )}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-[10px] text-emerald-200 leading-tight">Cart</div>
                <div className="text-xs font-black">{cartSubtotal > 0 ? formatPKR(cartSubtotal) : 'Rs. 0'}</div>
              </div>
            </button>

          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-2.5 md:hidden">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search products, brands, or deals..."
              className="w-full pl-9 pr-8 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            {searchQuery && (
              <button 
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-2 text-[10px] bg-slate-200 text-slate-600 rounded-full w-4 h-4 flex items-center justify-center"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Quick Navigation Filter Bar */}
        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar text-xs">
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={onNavigateToPamphlet}
              className="bg-red-50 text-red-700 hover:bg-red-100 font-bold px-3 py-1.5 rounded-lg border border-red-200 flex items-center gap-1.5 transition whitespace-nowrap"
            >
              <Percent className="w-3.5 h-3.5 text-red-600" />
              <span>Pamphlet Deals (Discounted)</span>
            </button>

            <button
              onClick={onNavigateToQurandazi}
              className="bg-amber-50 text-amber-950 hover:bg-amber-100 font-bold px-3 py-1.5 rounded-lg border border-amber-300 flex items-center gap-1.5 transition whitespace-nowrap"
            >
              <Gift className="w-3.5 h-3.5 text-amber-600" />
              <span>Lucky Draw Grand Prizes</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-slate-500 text-[11px] shrink-0">
            <span className="hidden md:inline font-medium">Active Branch:</span>
            <span className="font-bold text-emerald-900 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
              {currentBranch === 'Jinnah Garden' ? 'Jinnah Garden (0333-8951378)' : 'River Garden (0333-8951377)'}
            </span>
          </div>
        </div>

      </div>
    </header>
  );
};
