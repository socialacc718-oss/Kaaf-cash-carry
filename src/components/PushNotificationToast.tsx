import React from 'react';
import { Sparkles, X, ChevronRight, Zap } from 'lucide-react';
import { FlashSaleNotification } from '../types';

interface PushNotificationToastProps {
  notification: FlashSaleNotification | null;
  onClose: () => void;
  onExplore: () => void;
}

export const PushNotificationToast: React.FC<PushNotificationToastProps> = ({
  notification,
  onClose,
  onExplore
}) => {
  if (!notification || !notification.active) return null;

  return (
    <div className="fixed bottom-3 right-3 left-3 sm:left-auto sm:right-4 sm:bottom-4 z-40 sm:max-w-sm bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-3.5 sm:p-4 shadow-2xl border border-amber-400/50">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-xs">
          <Zap className="w-5 h-5 fill-slate-950 text-slate-950" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
              {notification.discountBadge}
            </span>
            <span className="text-[10px] text-slate-400">{notification.timeAgo}</span>
          </div>

          <h5 className="font-extrabold text-xs text-white leading-tight">
            {notification.title}
          </h5>
          <p className="text-[11px] text-slate-300 mt-1 leading-snug">
            {notification.message}
          </p>

          <div className="mt-2.5 flex items-center gap-2">
            <button
              onClick={() => {
                onExplore();
                onClose();
              }}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-xs transition"
            >
              <span>View Deal</span>
              <ChevronRight className="w-3 h-3" />
            </button>
            <button
              onClick={onClose}
              className="text-[11px] text-slate-400 hover:text-white px-2 py-1"
            >
              Dismiss
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
