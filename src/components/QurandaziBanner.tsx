import React, { useState, useEffect } from 'react';
import { 
  Gift, 
  Sparkles, 
  Trophy, 
  Tv, 
  Bike, 
  Flame, 
  Clock, 
  Truck, 
  PartyPopper, 
  ChevronRight,
  ShieldCheck,
  Star
} from 'lucide-react';
import { QURANDAZI_PRIZES } from '../data/products';
import { formatPKR } from '../utils/helpers';
import { LoyaltyTier } from '../types';

interface QurandaziBannerProps {
  cartSubtotal: number;
  userTier: LoyaltyTier;
  onExploreDeals: () => void;
  onOpenCart: () => void;
}

export const QurandaziBanner: React.FC<QurandaziBannerProps> = ({
  cartSubtotal,
  userTier,
  onExploreDeals,
  onOpenCart
}) => {
  // Countdown to grand draw
  const [timeLeft, setTimeLeft] = useState({
    days: 14,
    hours: 8,
    minutes: 42,
    seconds: 19
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const progress = Math.min(100, (cartSubtotal / 5000) * 100);
  const remainingForTicket = Math.max(0, 5000 - cartSubtotal);
  const baseTickets = Math.floor(cartSubtotal / 5000);
  const tierMultiplier = userTier === 'Platinum' ? 3 : userTier === 'Gold' ? 2 : 1;
  const earnedTickets = baseTickets * tierMultiplier;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-teal-900 to-slate-900 text-white py-12 sm:py-16 px-4">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Top Badges & Tagline */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 via-amber-400/30 to-amber-500/20 border border-amber-400/50 px-4 py-1.5 rounded-full text-amber-300 font-bold text-xs sm:text-sm tracking-wide shadow-inner mb-3">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
            <span>KAAF CASH & CARRY MEGA GRAND LUCKY DRAW 2026</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-2 leading-tight">
            Shop For <span className="text-amber-400">Rs. 5,000</span> & Enter
          </h2>
          <h3 className="text-2xl sm:text-4xl font-extrabold text-emerald-300 mb-3">
            The Grand Prize Qurandazi!
          </h3>

          <p className="max-w-2xl mx-auto text-slate-300 text-xs sm:text-base leading-relaxed">
            Every Rs. 5,000 purchase unlocks a computerized lucky draw token on your WhatsApp invoice slip.
            <span className="block text-amber-300 font-bold mt-1">
              "Everything at Wholesale Rates!" — Countless Prizes + FREE Home Delivery!
            </span>
          </p>
        </div>

        {/* Live Draw Countdown & User Cart Qualification Tracker */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 my-8 items-center">
          
          {/* Countdown Clock */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center">
            <div className="text-xs uppercase tracking-widest text-emerald-400 font-bold mb-2 flex items-center justify-center gap-1.5">
              <Clock className="w-4 h-4" /> Live Lucky Draw Countdown
            </div>
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-black/40 rounded-xl py-2 px-1 border border-white/10">
                <span className="text-xl sm:text-2xl font-black text-amber-400">{timeLeft.days}</span>
                <span className="block text-[10px] text-slate-400 uppercase">Days</span>
              </div>
              <div className="bg-black/40 rounded-xl py-2 px-1 border border-white/10">
                <span className="text-xl sm:text-2xl font-black text-white">{timeLeft.hours}</span>
                <span className="block text-[10px] text-slate-400 uppercase">Hours</span>
              </div>
              <div className="bg-black/40 rounded-xl py-2 px-1 border border-white/10">
                <span className="text-xl sm:text-2xl font-black text-white">{timeLeft.minutes}</span>
                <span className="block text-[10px] text-slate-400 uppercase">Mins</span>
              </div>
              <div className="bg-black/40 rounded-xl py-2 px-1 border border-white/10">
                <span className="text-xl sm:text-2xl font-black text-emerald-400">{timeLeft.seconds}</span>
                <span className="block text-[10px] text-slate-400 uppercase">Secs</span>
              </div>
            </div>
          </div>

          {/* User's Cart Qualification Progress Bar */}
          <div className="lg:col-span-2 bg-gradient-to-r from-emerald-900/60 to-teal-900/60 backdrop-blur-md border border-emerald-500/30 rounded-2xl p-5 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <span className="font-bold text-sm text-white">Your Lucky Draw Eligibility</span>
                {userTier !== 'Bronze' && (
                  <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-full font-bold">
                    {userTier} Perk: {tierMultiplier}x Tickets
                  </span>
                )}
              </div>
              <div className="text-xs">
                {earnedTickets > 0 ? (
                  <span className="bg-amber-400 text-slate-950 font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
                    <PartyPopper className="w-3.5 h-3.5" /> {earnedTickets} Token(s) Qualified!
                  </span>
                ) : (
                  <span className="text-amber-200">
                    Add <strong className="text-white font-bold">{formatPKR(remainingForTicket)}</strong> more to qualify
                  </span>
                )}
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-black/40 rounded-full h-3.5 p-0.5 border border-white/10 overflow-hidden mb-2">
              <div 
                className="bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-300 h-full rounded-full transition-all duration-700 ease-out shadow-xs"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Cart Subtotal: <strong>{formatPKR(cartSubtotal)}</strong></span>
              <span>Target: <strong>Rs. 5,000 = 1 Lucky Draw Ticket</strong></span>
            </div>

            {earnedTickets > 0 && (
              <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-xs text-amber-300">
                <span>🎉 Congratulations! Your order includes computerized lucky draw entries!</span>
                <button
                  onClick={onOpenCart}
                  className="underline font-bold text-white hover:text-amber-400 flex items-center gap-1"
                >
                  View Basket <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Grand Prizes Showcase (Exact items from pamphlet) */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <Trophy className="w-6 h-6 text-amber-400" />
                <span>Grand Lucky Draw Prizes</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Official prizes as featured on the KAAF Cash & Carry front flyer
              </p>
            </div>
            <button
              onClick={onExploreDeals}
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 px-4 py-2 rounded-xl transition shadow"
            >
              <span>Explore Deals & Shop Now</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Top 3 Podium Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            
            {/* 1st Prize: Motorcycle */}
            <div className="relative group bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-amber-400/80 rounded-3xl p-5 shadow-2xl hover:border-amber-400 transition-all duration-300 transform hover:-translate-y-1">
              <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-slate-950" /> 1st Grand Prize
              </div>
              <div className="h-48 sm:h-52 w-full rounded-2xl overflow-hidden mb-4 bg-slate-950/60 relative">
                <img
                  src={QURANDAZI_PRIZES[0].image}
                  alt="Honda 70 Motorcycle"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 bg-amber-500 text-slate-950 font-black text-xs px-2.5 py-1 rounded-lg">
                  BRAND NEW 2026
                </div>
              </div>
              <div className="mb-2">
                <span className="text-xl sm:text-2xl font-black text-amber-400 block">Honda CD70 Motorcycle</span>
                <span className="text-xs text-slate-400 block">موٹر سائیکل (ہونڈا 70 سی سی)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Brand new 2026 model, 70cc 4-stroke highly fuel-efficient engine with complete documentation.
              </p>
            </div>

            {/* 2nd Prize: 4K LED TV */}
            <div className="relative group bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-emerald-400/80 rounded-3xl p-5 shadow-2xl hover:border-emerald-400 transition-all duration-300 transform hover:-translate-y-1">
              <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1">
                <Tv className="w-3.5 h-3.5" /> 2nd Grand Prize
              </div>
              <div className="h-48 sm:h-52 w-full rounded-2xl overflow-hidden mb-4 bg-slate-950/60 relative">
                <img
                  src={QURANDAZI_PRIZES[1].image}
                  alt="4K Smart LED TV"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 bg-emerald-500 text-slate-950 font-black text-xs px-2.5 py-1 rounded-lg">
                  4K ULTRA HD
                </div>
              </div>
              <div className="mb-2">
                <span className="text-xl sm:text-2xl font-black text-emerald-300 block">50" 4K Smart LED TV</span>
                <span className="text-xs text-slate-400 block">4K الٹرا ایچ ڈی اسمارٹ ایل ای ڈی</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                50-inch bezel-less display, Android TV with YouTube, Netflix, Wi-Fi, and Google Voice Remote.
              </p>
            </div>

            {/* 3rd Prize: Baking Oven */}
            <div className="relative group bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-amber-300/60 rounded-3xl p-5 shadow-2xl hover:border-amber-300 transition-all duration-300 transform hover:-translate-y-1">
              <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-amber-400 to-amber-200 text-slate-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" /> 3rd Grand Prize
              </div>
              <div className="h-48 sm:h-52 w-full rounded-2xl overflow-hidden mb-4 bg-slate-950/60 relative">
                <img
                  src={QURANDAZI_PRIZES[2].image}
                  alt="Baking Oven"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 bg-amber-400 text-slate-950 font-black text-xs px-2.5 py-1 rounded-lg">
                  DELUXE OVEN
                </div>
              </div>
              <div className="mb-2">
                <span className="text-xl sm:text-2xl font-black text-amber-300 block">Electric Baking & Grill Oven</span>
                <span className="text-xs text-slate-400 block">الیکٹرک بیکنگ اوون</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                45 Litre heavy duty rotisserie convection oven for roasting, grilling, toasting, and baking.
              </p>
            </div>

          </div>

          {/* Consolation Prizes Strip */}
          <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-4 sm:p-6">
            <h5 className="text-sm font-bold text-amber-400 mb-3 flex items-center gap-2">
              <Gift className="w-4 h-4" />
              <span>Consolation Prizes & Special Gift Hampers</span>
            </h5>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {QURANDAZI_PRIZES.slice(3).map((prize) => (
                <div key={prize.id} className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-center hover:bg-white/10 transition">
                  <div className="h-20 w-full rounded-lg overflow-hidden mb-2 bg-black/40">
                    <img src={prize.image} alt={prize.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-xs font-bold text-white truncate">{prize.title}</div>
                  <div className="text-[10px] text-slate-400 truncate font-serif">{prize.titleUrdu}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Flyer Free Delivery Notice */}
          <div className="mt-6 bg-gradient-to-r from-emerald-800/80 via-teal-800/80 to-emerald-900/80 border border-emerald-500/40 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shrink-0 shadow">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h6 className="font-black text-sm sm:text-base text-white">
                  FREE HOME DELIVERY SERVICE AVAILABLE!
                </h6>
                <p className="text-xs text-emerald-100">
                  Shop from comfort of your home. Your order slip automatically forwards to Jinnah Garden WhatsApp <strong className="text-amber-300">0333-8951378</strong>.
                </p>
              </div>
            </div>
            <button
              onClick={onExploreDeals}
              className="bg-white text-emerald-900 hover:bg-amber-300 hover:text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl transition shadow whitespace-nowrap"
            >
              Start Shopping Now
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
