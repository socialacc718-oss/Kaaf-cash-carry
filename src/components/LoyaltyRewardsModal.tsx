import React, { useState } from 'react';
import { 
  X, 
  Award, 
  Gift, 
  Tag, 
  Check, 
  Sparkles, 
  Star, 
  Copy,
  Clock, 
  ShieldCheck, 
  ChevronRight,
  Zap,
  TrendingUp
} from 'lucide-react';
import { Order, LoyaltyAccount, LoyaltyTier } from '../types';
import { LOYALTY_TIERS } from '../data/products';
import { formatPKR } from '../utils/helpers';

interface LoyaltyRewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  loyaltyAccount: LoyaltyAccount;
  orders: Order[];
}

export const LoyaltyRewardsModal: React.FC<LoyaltyRewardsModalProps> = ({
  isOpen,
  onClose,
  loyaltyAccount,
  orders
}) => {
  if (!isOpen) return null;

  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedTierTab, setSelectedTierTab] = useState<LoyaltyTier>(loyaltyAccount.tier);

  const currentTierInfo = LOYALTY_TIERS[loyaltyAccount.tier];

  // Calculate next tier target
  let nextTier: LoyaltyTier | null = null;
  let pointsToNext = 0;
  let progressToNext = 100;

  if (loyaltyAccount.tier === 'Bronze') {
    nextTier = 'Silver';
    pointsToNext = Math.max(0, 200 - loyaltyAccount.points);
    progressToNext = Math.min(100, (loyaltyAccount.points / 200) * 100);
  } else if (loyaltyAccount.tier === 'Silver') {
    nextTier = 'Gold';
    pointsToNext = Math.max(0, 500 - loyaltyAccount.points);
    progressToNext = Math.min(100, ((loyaltyAccount.points - 200) / 300) * 100);
  } else if (loyaltyAccount.tier === 'Gold') {
    nextTier = 'Platinum';
    pointsToNext = Math.max(0, 1000 - loyaltyAccount.points);
    progressToNext = Math.min(100, ((loyaltyAccount.points - 500) / 500) * 100);
  }

  // Collect all Qurandazi tickets earned across orders
  const allTickets = orders.flatMap(o => o.qurandaziTickets || []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[94vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
              <Award className="w-6 h-6 text-amber-200" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg">KAAF Club Loyalty Program</h3>
              <p className="text-xs text-amber-100">Earn points on every order & unlock tiered VIP benefits</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          
          {/* Main Points & Tier Hero Card */}
          <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-5 sm:p-6 relative overflow-hidden shadow-xl border border-white/10">
            <div className="absolute top-0 right-0 w-44 h-44 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase font-extrabold tracking-wider text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> OFFICIAL MEMBERSHIP CARD
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${currentTierInfo.badgeBg}`}>
                {loyaltyAccount.tier} Member
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 my-2">
              <div>
                <span className="text-xs text-slate-400 block">Available Points</span>
                <span className="text-3xl sm:text-4xl font-black text-amber-400">{loyaltyAccount.points}</span>
                <span className="text-[11px] text-slate-300 block font-semibold">= {formatPKR(loyaltyAccount.points)} Checkout Value</span>
              </div>

              <div>
                <span className="text-xs text-slate-400 block">Earning Multiplier</span>
                <span className="text-2xl sm:text-3xl font-black text-emerald-400">
                  {currentTierInfo.multiplier}x
                </span>
                <span className="text-[11px] text-slate-300 block">Pts per Rs. 100 spend</span>
              </div>

              <div className="col-span-2 sm:col-span-1 border-t sm:border-t-0 sm:border-l border-white/10 pt-2 sm:pt-0 sm:pl-4">
                <span className="text-xs text-slate-400 block">Total Lifetime Points</span>
                <span className="text-2xl sm:text-3xl font-black text-white">{loyaltyAccount.lifetimePoints}</span>
                <span className="text-[11px] text-slate-300 block">{orders.length} Completed Orders</span>
              </div>
            </div>

            {/* Tier Progress Bar */}
            {nextTier ? (
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between text-xs mb-1.5 font-semibold">
                  <span className="text-slate-300">
                    Tier Progress: <strong className="text-white">{pointsToNext} points needed</strong> to reach {nextTier}
                  </span>
                  <span className="text-amber-400 font-bold">{Math.round(progressToNext)}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full transition-all duration-700"
                    style={{ width: `${progressToNext}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="mt-4 pt-3 border-t border-white/10 text-xs text-amber-300 font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>You have achieved the highest VIP Platinum tier status!</span>
              </div>
            )}
          </div>

          {/* How Points & Redemption Work */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4">
            <h4 className="font-black text-xs sm:text-sm text-emerald-950 flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-emerald-700" />
              <span>How Points & Redemptions Work</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700">
              <div className="bg-white p-3 rounded-xl border border-emerald-100 shadow-2xs">
                <div className="font-extrabold text-emerald-900 mb-1">1. Shop & Earn</div>
                <p className="text-[11px] text-slate-600">
                  Every order earns points automatically based on your tier multiplier (up to 2x points).
                </p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-emerald-100 shadow-2xs">
                <div className="font-extrabold text-emerald-900 mb-1">2. Redeem at Checkout</div>
                <p className="text-[11px] text-slate-600">
                  Simply check "Redeem Points" during checkout to convert points into instant PKR cash discounts.
                </p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-emerald-100 shadow-2xs">
                <div className="font-extrabold text-emerald-900 mb-1">3. Level Up Tiers</div>
                <p className="text-[11px] text-slate-600">
                  Climb from Bronze to Silver, Gold, and Platinum to multiply points and double your Lucky Draw tokens!
                </p>
              </div>
            </div>
          </div>

          {/* Tier System Benefits Comparison */}
          <div>
            <h4 className="font-extrabold text-xs uppercase text-slate-500 tracking-wider mb-3 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
              <span>Loyalty Membership Tiers & Privileges</span>
            </h4>

            {/* Tier Tabs */}
            <div className="grid grid-cols-4 gap-2 mb-3">
              {(['Bronze', 'Silver', 'Gold', 'Platinum'] as LoyaltyTier[]).map((t) => {
                const info = LOYALTY_TIERS[t];
                const isSelected = selectedTierTab === t;
                const isCurrent = loyaltyAccount.tier === t;

                return (
                  <button
                    key={t}
                    onClick={() => setSelectedTierTab(t)}
                    className={`py-2 px-2 rounded-xl text-xs font-black transition text-center border ${
                      isSelected
                        ? 'border-emerald-700 bg-emerald-700 text-white shadow-xs'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div>{t}</div>
                    <div className="text-[10px] opacity-80">{info.minPoints}+ pts</div>
                    {isCurrent && (
                      <span className="block text-[9px] text-amber-300 font-bold uppercase mt-0.5">Current</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Selected Tier Details Box */}
            {(() => {
              const info = LOYALTY_TIERS[selectedTierTab];
              return (
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${info.badgeBg}`}>
                        {info.tier} Tier
                      </span>
                      <span className="text-xs text-slate-500 font-semibold">
                        Requires {info.minPoints} points
                      </span>
                    </div>
                    <span className="font-black text-emerald-800 text-xs bg-emerald-100 px-2 py-0.5 rounded">
                      {info.multiplier}x Points Multiplier
                    </span>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-700">
                    {info.benefits.map((b, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })()}
          </div>

          {/* Lucky Draw Tokens Archive */}
          <div className="bg-amber-50/70 border border-amber-300 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-black text-xs sm:text-sm text-amber-950 flex items-center gap-1.5">
                <Gift className="w-4 h-4 text-amber-600" />
                <span>Your Qurandazi Lucky Draw Tokens Archive</span>
              </h4>
              <span className="text-xs font-bold text-amber-900 bg-amber-200 px-2 py-0.5 rounded-full">
                {allTickets.length} Active Token(s)
              </span>
            </div>

            {allTickets.length === 0 ? (
              <p className="text-xs text-amber-900/80">
                No tickets registered yet. Place an order of Rs. 5,000 or more to receive your computerized tokens for the Motorcycle, 4K Smart TV & Baking Oven draw!
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
                {allTickets.map((ticket, i) => (
                  <div key={i} className="bg-white border border-amber-300 rounded-xl p-2 text-center shadow-2xs">
                    <span className="font-black text-xs text-slate-900 block font-mono">{ticket}</span>
                    <span className="text-[9px] text-emerald-700 font-bold block uppercase">Qualified Entry</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Exclusive Redeemable Coupons */}
          <div>
            <h4 className="font-extrabold text-xs uppercase text-slate-500 tracking-wider mb-3 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-emerald-700" />
              <span>Special Discount Coupons</span>
            </h4>

            <div className="space-y-2.5">
              {[
                { code: 'KAAF-200', title: 'Rs. 200 Instant Discount', minSpend: 3000 },
                { code: 'KAAF-500', title: 'Rs. 500 Bulk Grocery Coupon', minSpend: 6000 },
                { code: 'FREEDEL-VIP', title: 'Express VIP Priority Delivery', minSpend: 1500 }
              ].map((voucher) => (
                <div
                  key={voucher.code}
                  className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-slate-900">{voucher.title}</div>
                    <div className="text-[11px] text-slate-500">
                      Min shopping: {formatPKR(voucher.minSpend)}
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopy(voucher.code)}
                    className="px-3 py-1.5 bg-white border border-slate-300 hover:border-emerald-600 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-2xs transition shrink-0"
                  >
                    {copiedCode === voucher.code ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{voucher.code}</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
