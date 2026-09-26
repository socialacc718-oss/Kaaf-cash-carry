import React, { useRef } from 'react';
import { 
  X, 
  Printer, 
  Send, 
  CheckCircle, 
  Gift, 
  Clock, 
  ExternalLink,
  MapPin
} from 'lucide-react';
import { Order } from '../types';
import { BRANCH_CONTACTS } from '../data/products';
import { formatPKR, getWhatsAppUrl } from '../utils/helpers';

interface WhatsAppSlipModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenTracking: (orderId: string) => void;
}

export const WhatsAppSlipModal: React.FC<WhatsAppSlipModalProps> = ({
  order,
  isOpen,
  onClose,
  onOpenTracking
}) => {
  if (!isOpen || !order) return null;

  const slipRef = useRef<HTMLDivElement>(null);
  const branchInfo = BRANCH_CONTACTS[order.branch] || BRANCH_CONTACTS['Jinnah Garden'];
  const targetPhone = order.branch === 'Jinnah Garden' ? '923338951378' : '923338951377';
  const whatsappUrl = getWhatsAppUrl(order, targetPhone);

  const handlePrint = () => {
    window.print();
  };

  const handleSendWhatsApp = () => {
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[95vh]">
        
        {/* Top Action Bar */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
              ✓
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base">Order Slip Generated Successfully</h3>
              <p className="text-[11px] text-emerald-300">
                Jinnah Garden Branch WhatsApp: <strong>0333-8951378</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Button Bar */}
        <div className="bg-emerald-50 border-b border-emerald-100 p-3.5 flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={handleSendWhatsApp}
            className="flex-1 min-w-[200px] py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-700/25 transition active:scale-95"
          >
            <Send className="w-4 h-4" />
            <span>Forward to 0333-8951378 (WhatsApp)</span>
          </button>

          <button
            onClick={handlePrint}
            className="py-2.5 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Print Slip</span>
          </button>

          <button
            onClick={() => onOpenTracking(order.orderNumber)}
            className="py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
          >
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Track Status</span>
          </button>
        </div>

        {/* Thermal Receipt Preview Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100/70">
          <div
            ref={slipRef}
            className="bg-white p-5 sm:p-7 rounded-2xl shadow-xs border border-slate-200 text-slate-800 font-mono text-xs leading-relaxed max-w-md mx-auto"
          >
            {/* Slip Header */}
            <div className="text-center pb-4 border-b-2 border-dashed border-slate-300">
              <div className="font-sans font-black text-2xl text-emerald-800 tracking-tight">
                KAAF CASH & CARRY
              </div>
              <div className="text-xs text-slate-600 font-sans font-bold">
                Wholesale Supermarket • Islamabad
              </div>
              <div className="text-[11px] text-slate-500 font-sans mt-0.5">
                "Everything at Wholesale Rates!"
              </div>
              <div className="text-[11px] font-sans font-bold text-emerald-800 mt-1">
                {branchInfo.name}
              </div>
              <div className="text-[11px] text-slate-600 font-sans">
                WhatsApp Orders: <strong className="text-slate-900">{branchInfo.phone}</strong>
              </div>
              <div className="text-[10px] text-slate-400 font-sans">
                {branchInfo.address}
              </div>
            </div>

            {/* Order & Customer Metadata */}
            <div className="py-3 border-b-2 border-dashed border-slate-300 space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span>ORDER ID:</span>
                <span className="font-bold text-slate-900">#{order.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>DATE / TIME:</span>
                <span>{order.date}</span>
              </div>
              <div className="flex justify-between">
                <span>CUSTOMER:</span>
                <span className="font-bold text-slate-900">{order.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span>PHONE:</span>
                <span>{order.customerPhone}</span>
              </div>
              <div className="flex justify-between">
                <span>ADDRESS:</span>
                <span className="text-right max-w-[210px] font-sans">{order.customerAddress}</span>
              </div>
              <div className="flex justify-between">
                <span>PAYMENT:</span>
                <span className="font-bold text-slate-900">{order.paymentMethod}</span>
              </div>
              {order.transactionId && (
                <div className="flex justify-between text-emerald-700">
                  <span>TRX ID:</span>
                  <span>{order.transactionId}</span>
                </div>
              )}
            </div>

            {/* Items Table */}
            <div className="py-3 border-b-2 border-dashed border-slate-300">
              <div className="grid grid-cols-12 font-bold text-slate-900 pb-1.5 border-b border-slate-200">
                <span className="col-span-6">ITEM DESCRIPTION</span>
                <span className="col-span-2 text-center">QTY</span>
                <span className="col-span-4 text-right">TOTAL</span>
              </div>

              <div className="divide-y divide-slate-100 py-1">
                {(order.items || []).map((item, idx) => {
                  const price = item?.product?.discountedPrice || 0;
                  const qty = item?.quantity || 1;
                  const name = item?.product?.name || 'Item';
                  const brand = item?.product?.brand || 'KAAF';
                  const unit = item?.product?.unit || '1 Pack';
                  return (
                    <div key={idx} className="grid grid-cols-12 py-1.5 items-start">
                      <div className="col-span-6">
                        <div className="font-bold text-slate-800 line-clamp-1">{name}</div>
                        <div className="text-[10px] text-slate-400 font-sans">
                          {brand} • {unit}
                        </div>
                      </div>
                      <div className="col-span-2 text-center font-bold">
                        {qty}
                      </div>
                      <div className="col-span-4 text-right font-bold">
                        Rs. {(price * qty).toLocaleString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Totals & Savings */}
            <div className="py-3 border-b-2 border-dashed border-slate-300 space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span>SUBTOTAL:</span>
                <span>Rs. {order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>DELIVERY CHARGES:</span>
                <span className="font-bold">FREE (0 PKR)</span>
              </div>
              {order.loyaltyDiscount && order.loyaltyDiscount > 0 && (
                <div className="flex justify-between text-amber-700 font-bold">
                  <span>POINTS REDEEMED:</span>
                  <span>- Rs. {order.loyaltyDiscount.toLocaleString()} ({order.pointsRedeemed} pts)</span>
                </div>
              )}
              {order.totalSavings > 0 && (
                <div className="flex justify-between text-red-600 font-bold">
                  <span>PAMPHLET SAVINGS:</span>
                  <span>- Rs. {order.totalSavings.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black text-slate-900 pt-1 border-t border-slate-300">
                <span>NET PAYABLE:</span>
                <span className="text-emerald-800">Rs. {order.grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Qurandazi Lucky Draw Section on Receipt */}
            {order.qurandaziTickets && order.qurandaziTickets.length > 0 && (
              <div className="py-3 border-b-2 border-dashed border-slate-300 bg-amber-50/70 -mx-2 px-3 rounded-lg my-2">
                <div className="text-center font-bold text-amber-950 flex items-center justify-center gap-1 mb-1 font-sans text-xs">
                  <Gift className="w-3.5 h-3.5 text-amber-600" />
                  <span>Rs. 5,000 Promotional Lucky Draw Tokens</span>
                </div>
                <div className="space-y-1">
                  {order.qurandaziTickets.map((t, idx) => (
                    <div key={idx} className="bg-white border border-amber-300 rounded p-1.5 text-center font-black text-xs text-slate-900 shadow-2xs">
                      🎟️ {t}
                    </div>
                  ))}
                </div>
                <div className="text-[10px] text-center text-amber-800 font-sans mt-1">
                  Eligible for Motorcycle, 4K Smart TV & Baking Oven Draw!
                </div>
              </div>
            )}

            {/* Slip Footer Message */}
            <div className="pt-3 text-center text-[10px] text-slate-500 font-sans space-y-1">
              <p className="font-bold text-slate-700 text-xs">
                Thank you for shopping with KAAF Cash & Carry!
              </p>
              <p>Customer Support Helpline: <strong>{branchInfo.phone}</strong></p>
              <p>KAAF POS Smart Receipt System</p>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-slate-600">
            Order slip automatically generated for store manager confirmation.
          </span>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-700 font-bold hover:underline flex items-center gap-1 shrink-0"
          >
            <span>Open WhatsApp Directly</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </div>
  );
};
