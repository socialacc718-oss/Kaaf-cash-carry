import React from 'react';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Truck, 
  Gift, 
  ShieldCheck, 
  Send, 
  Store
} from 'lucide-react';
import { BRANCH_CONTACTS } from '../data/products';

interface FooterProps {
  onSelectBranch: (branch: any) => void;
  onNavigateToPamphlet: () => void;
  onNavigateToQurandazi: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectBranch,
  onNavigateToPamphlet,
  onNavigateToQurandazi
}) => {
  return (
    <footer className="bg-slate-900 text-white pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          
          {/* Col 1: Brand & Tagline */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center font-black text-white shadow-lg">
                <span className="text-xl font-serif">کاف</span>
              </div>
              <div>
                <h4 className="text-xl font-black tracking-tight text-white">
                  KAAF <span className="text-emerald-400">CASH & CARRY</span>
                </h4>
                <p className="text-xs text-emerald-300 font-medium">Everything at Wholesale Rates!</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Islamabad's premium supermarket for fresh groceries, imported staples, beverages, baby care, and household essentials. FREE Home Delivery & automated WhatsApp POS order slips.
            </p>

            <div className="flex items-center gap-2 text-xs text-amber-400 font-bold bg-white/5 p-2.5 rounded-xl border border-white/10">
              <Gift className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Shop for Rs. 5,000 & Win a Motorcycle or 4K TV!</span>
            </div>
          </div>

          {/* Col 2: Jinnah Garden Branch */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <Store className="w-4 h-4" />
              <span>Jinnah Garden Branch (Main Branch)</span>
            </div>
            
            <div className="bg-white/5 rounded-2xl p-3.5 border border-white/10 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>WhatsApp Orders: <strong className="text-white">0333-8951378</strong></span>
              </div>
              <div className="flex items-start gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Main Commercial Avenue, Near Gate 1, Jinnah Garden, Islamabad</span>
              </div>
              <a
                href="https://wa.me/923338951378"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition block text-center"
              >
                <Send className="w-3.5 h-3.5 inline" />
                <span>Message 0333-8951378 on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Col 3: River Garden Branch */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <Store className="w-4 h-4" />
              <span>River Garden Branch</span>
            </div>

            <div className="bg-white/5 rounded-2xl p-3.5 border border-white/10 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>WhatsApp Orders: <strong className="text-white">0333-8951377</strong></span>
              </div>
              <div className="flex items-start gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Main Boulevard, River Garden Housing Scheme, Islamabad</span>
              </div>
              <a
                href="https://wa.me/923338951377"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition block text-center"
              >
                <Send className="w-3.5 h-3.5 inline" />
                <span>Message 0333-8951377 on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Col 4: Store Hours & Delivery Highlights */}
          <div className="space-y-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <Clock className="w-4 h-4" />
              <span>Operating Hours & Delivery</span>
            </div>

            <div className="space-y-2 text-slate-300">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span>Monday - Sunday (7 Days Open):</span>
                <span className="font-bold text-white">9:00 AM - 11:30 PM</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span>Delivery ETA:</span>
                <span className="font-bold text-amber-400">Fast 45-60 Mins</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span>Home Delivery Fee:</span>
                <span className="font-bold text-emerald-400">FREE HOME DELIVERY</span>
              </div>
            </div>

            <div className="pt-2 text-slate-400 leading-relaxed text-[11px]">
              Payment Options: Cash on Delivery (COD), JazzCash, EasyPaisa, or Direct Bank Transfer.
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} KAAF Cash & Carry. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Jinnah Garden Branch: 0333-8951378</span>
            <span>•</span>
            <span>River Garden Branch: 0333-8951377</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
