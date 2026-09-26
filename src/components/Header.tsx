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
  const totalItemsCount = (cartItems || []).reduce((acc, item) => acc + (item?.quantity || 0), 0);
  const cartSubtotal = (cartItems || []).reduce((acc, item) => acc + ((item?.product?.discountedPrice || 0) * (item?.quantity || 1)), 0);
  const tierInfo = LOYALTY_TIERS[loyaltyAccount?.tier || 'Bronze'] || LOYALTY_TIERS['Bronze'];

  return (
    <header className="sticky top-0 z-40 bg-white shadow-xs border-b border-slate-200 w-full max-w-full overflow-hidden">
      
      {/* Top Banner Ticker */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-800 to-emerald-900 text-white text-[10px] sm:text-xs py-1.5 sm:py-2 px-2.5 sm:px-4 font-medium w-full max-w-full overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-1.5 sm:gap-2">
          
          <div className="flex items-center gap-1.5 sm:gap-2 truncate min-w-0">
            <span className="bg-amber-400 text-slate-950 text-[8px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shrink-0 animate-pulse">
              <Gift className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> LUCKY DRAW
            </span>
            <span className="truncate text-[10px] sm:text-xs">
              Shop for <strong>Rs. 5,000 & Win</strong> 2026 Bike & 4K LED TV!
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-xs shrink-0">
            <div className="flex items-center gap-1.5 text-emerald-200 font-semibold">
              <Truck className="w-3.5 h-3.5 text-amber-300" />
              <span>FREE Home Delivery in Islamabad</span>
            </div>
            <div className="hidden lg:flex items-center gap-3 border-l border-emerald-700 pl-3 text-slate-300">
              <span>Jinnah: <strong className="text-white">0333-8951378</strong></span>
              <span>River: <strong className="text-white">0333-8951377</strong></span>
            </div>
          </div>

        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-3 w-full max-w-full">
        <div className="flex items-center justify-between gap-1.5 sm:gap-4 w-full">
          
          {/* Logo & Tagline */}
          <div 
            className="flex items-center gap-1.5 sm:gap-2.5 shrink min-w-0 cursor-pointer select-none" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-2xl bg-gradient-to-br from-emerald-700 to-teal-900 flex items-center justify-center shadow-md text-white ring-2 ring-emerald-500/20 shrink-0">
              <div className="text-center font-black">
                <span className="text-sm sm:text-xl block leading-tight font-serif tracking-tight">کاف</span>
                <span className="text-[6px] sm:text-[8px] block text-emerald-200 -mt-0.5 font-sans">KAAF</span>
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <h1 className="text-xs sm:text-lg md:text-xl font-black text-slate-900 tracking-tight leading-tight truncate">
                  KAAF <span className="text-emerald-700">CASH & CARRY</span>
                </h1>
              </div>
              <p className="hidden xs:flex sm:flex text-[8px] sm:text-xs font-semibold text-slate-500 items-center gap-1 leading-none mt-0.5 whitespace-nowrap">
                <span>Wholesale Superstore</span>
                <span className="text-slate-300">•</span>
                <span className="text-emerald-700 font-medium">Islamabad</span>
              </p>
            </div>
          </div>

          {/* Quick Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md relative mx-2 min-w-0">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search Dalda, Olpers, Tapal, Diapers, Rice..."
                className="w-full pl-10 pr-10 py-2 bg-slate-100/90 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              {searchQuery && (
                <button 
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-2.5 text-xs bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-full w-5 h-5 flex items-center justify-center"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Right Action Icons & Loyalty Tier Badge */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            
            {/* Desktop Branch Switcher */}
            <div className="hidden xl:flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs">
              <button
                onClick={() => onSelectBranch('Jinnah Garden')}
                className={`px-2.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 ${
                  currentBranch === 'Jinnah Garden'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Jinnah Garden</span>
              </button>
              <button
                onClick={() => onSelectBranch('River Garden')}
                className={`px-2.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 ${
                  currentBranch === 'River Garden'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>River Garden</span>
              </button>
            </div>

            {/* Loyalty Rewards Tier Pill */}
            <button
              onClick={onOpenLoyalty}
              className={`px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border flex items-center gap-1 text-[10px] sm:text-xs font-bold transition shadow-2xs shrink-0 ${tierInfo.badgeBg}`}
              title="Click to view your KAAF Rewards Club & Points"
            >
              <Star className="w-3 h-3 fill-current text-amber-500 shrink-0" />
              <span className="hidden sm:inline">{loyaltyAccount?.tier || 'Silver'}:</span>
              <span className="font-black">{loyaltyAccount?.points || 0} <span className="text-[9px] sm:text-[10px]">Pts</span></span>
            </button>

            {/* Quick Track Order (hidden on small mobile, available in sub-bar) */}
            <button
              onClick={onOpenTracking}
              className="hidden sm:flex p-1.5 sm:px-2.5 sm:py-1.5 text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition items-center gap-1 text-xs font-bold border border-slate-200 hover:border-emerald-200 shrink-0"
              title="Track Your Order"
            >
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Track</span>
            </button>

            {/* Admin Panel (hidden on small mobile, available in sub-bar) */}
            <button
              onClick={onOpenAdmin}
              className="hidden sm:flex p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-xl transition border border-slate-200 shrink-0"
              title="Store Admin Dashboard"
            >
              <LayoutDashboard className="w-4 h-4" />
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-1 bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 text-white px-2 sm:px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-bold text-xs shadow-md shadow-emerald-700/20 transition active:scale-95 shrink-0"
            >
              <div className="relative">
                <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-400 text-slate-950 text-[8px] sm:text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-bounce shadow">
                    {totalItemsCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-black text-xs">
                {cartSubtotal > 0 ? formatPKR(cartSubtotal) : 'Cart'}
              </span>
            </button>

          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-2 md:hidden w-full">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search products, brands, deals..."
              className="w-full pl-8 pr-7 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700 text-slate-800"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            {searchQuery && (
              <button 
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-1.5 text-[10px] bg-slate-200 text-slate-600 rounded-full w-4 h-4 flex items-center justify-center"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Quick Navigation Filter Bar (Clean Horizontal Scroll) */}
        <div className="mt-1.5 pt-1.5 border-t border-slate-100 w-full max-w-full overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 pb-0.5 w-max">
            <button
              onClick={onNavigateToPamphlet}
              className="bg-red-50 text-red-700 hover:bg-red-100 font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg border border-red-200 flex items-center gap-1 text-[10px] sm:text-[11px] transition shrink-0"
            >
              <Percent className="w-3 h-3 text-red-600" />
              <span>Pamphlet Deals</span>
            </button>

            <button
              onClick={onNavigateToQurandazi}
              className="bg-amber-50 text-amber-950 hover:bg-amber-100 font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg border border-amber-300 flex items-center gap-1 text-[10px] sm:text-[11px] transition shrink-0"
            >
              <Gift className="w-3 h-3 text-amber-600" />
              <span>Lucky Draw</span>
            </button>

            {/* Mobile Track Button */}
            <button
              onClick={onOpenTracking}
              className="sm:hidden bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold px-2 py-0.5 rounded-lg border border-slate-200 flex items-center gap-1 text-[10px] transition shrink-0"
            >
              <Clock className="w-3 h-3 text-emerald-600" />
              <span>Track Order</span>
            </button>

            {/* Mobile Admin Button */}
            <button
              onClick={onOpenAdmin}
              className="sm:hidden bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold px-2 py-0.5 rounded-lg border border-slate-200 flex items-center gap-1 text-[10px] transition shrink-0"
            >
              <LayoutDashboard className="w-3 h-3 text-slate-600" />
              <span>Admin</span>
            </button>

            {/* Branch Selector Pill */}
            <div className="flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200 text-[10px] sm:text-[11px] font-bold text-emerald-950 shrink-0">
              <MapPin className="w-3 h-3 text-emerald-700" />
              <span>{currentBranch === 'Jinnah Garden' ? 'Jinnah Garden' : 'River Garden'}</span>
              <button
                onClick={() => onSelectBranch(currentBranch === 'Jinnah Garden' ? 'River Garden' : 'Jinnah Garden')}
                className="text-[10px] text-emerald-700 underline font-semibold ml-0.5"
              >
                Change
              </button>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};
