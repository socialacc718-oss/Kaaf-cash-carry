import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Phone, 
  MapPin, 
  Gift, 
  AlertCircle
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { BRANCH_CONTACTS } from '../data/products';
import { formatPKR, getWhatsAppUrl } from '../utils/helpers';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  initialOrderId?: string;
}

const STATUS_STEPS: { status: OrderStatus; label: string; desc: string }[] = [
  { status: 'Pending', label: 'Order Placed', desc: 'Received in store system' },
  { status: 'Confirmed', label: 'Store Confirmed', desc: 'Verified by branch manager' },
  { status: 'Packing', label: 'Packing Items', desc: 'Packed from shelves' },
  { status: 'Out for Delivery', label: 'Out for Delivery', desc: 'Rider is on the way' },
  { status: 'Delivered', label: 'Delivered', desc: 'Completed successfully' }
];

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  orders,
  initialOrderId = ''
}) => {
  if (!isOpen) return null;

  const [searchTerm, setSearchTerm] = useState(initialOrderId);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(() => {
    if (initialOrderId) {
      return orders.find(o => o.orderNumber === initialOrderId || o.id === initialOrderId) || (orders[0] || null);
    }
    return orders[0] || null;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    const term = searchTerm.trim().toLowerCase();
    const found = orders.find(o => 
      o.orderNumber.toLowerCase().includes(term) ||
      o.customerPhone.includes(term) ||
      o.id.toLowerCase().includes(term)
    );

    if (found) {
      setSelectedOrder(found);
    } else {
      setSelectedOrder(null);
    }
  };

  const getStepIndex = (status: OrderStatus): number => {
    switch (status) {
      case 'Pending': return 0;
      case 'Confirmed': return 1;
      case 'Packing': return 2;
      case 'Out for Delivery': return 3;
      case 'Delivered': return 4;
      case 'Cancelled': return -1;
      default: return 0;
    }
  };

  const currentStep = selectedOrder ? getStepIndex(selectedOrder.status) : 0;
  const branchInfo = selectedOrder ? BRANCH_CONTACTS[selectedOrder.branch] || BRANCH_CONTACTS['Jinnah Garden'] : BRANCH_CONTACTS['Jinnah Garden'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">Live Order Tracking</h3>
              <p className="text-xs text-slate-300">Enter your Order ID or active WhatsApp mobile number</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter Order # (e.g. KF-8921) or Phone (0333...)"
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs sm:text-sm shadow-xs transition"
            >
              Track Order
            </button>
          </form>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {!selectedOrder ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-slate-800 text-base">No Order Found</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Please verify your Order Number or Phone entered during checkout.
              </p>
            </div>
          ) : (
            <>
              {/* Order Meta Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">Order ID:</span>
                    <span className="font-black text-slate-900 text-base">#{selectedOrder.orderNumber}</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                      {selectedOrder.branch}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Placed on: {selectedOrder.date} • {selectedOrder.customerName}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-500">Net Payable:</div>
                  <div className="text-lg font-black text-emerald-800">
                    {formatPKR(selectedOrder.grandTotal)}
                  </div>
                </div>
              </div>

              {/* Status Timeline Progress */}
              <div>
                <h5 className="font-bold text-xs text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-700" />
                  <span>Real-time Fulfillment Timeline</span>
                </h5>

                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute top-5 left-5 right-5 h-1 bg-slate-200 -z-0 hidden sm:block">
                    <div
                      className="h-full bg-emerald-600 transition-all duration-500"
                      style={{ width: `${(Math.max(0, currentStep) / (STATUS_STEPS.length - 1)) * 100}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
                    {STATUS_STEPS.map((step, idx) => {
                      const isCompleted = idx <= currentStep;
                      const isCurrent = idx === currentStep;

                      return (
                        <div key={step.status} className="flex sm:flex-col items-center gap-3 sm:gap-2 text-left sm:text-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow transition-all ${
                              isCurrent
                                ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 animate-pulse'
                                : isCompleted
                                  ? 'bg-emerald-800 text-white'
                                  : 'bg-white border-2 border-slate-200 text-slate-400'
                            }`}
                          >
                            {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                          </div>
                          <div>
                            <div className={`font-bold text-xs ${isCurrent ? 'text-emerald-800' : 'text-slate-800'}`}>
                              {step.label}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {step.desc}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Qurandazi Tickets in this Order */}
              {selectedOrder.qurandaziTickets && selectedOrder.qurandaziTickets.length > 0 && (
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-300 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Gift className="w-5 h-5 text-amber-600" />
                    <span className="font-extrabold text-sm text-amber-950">
                      Promotional Lucky Draw Tickets in this Order
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedOrder.qurandaziTickets.map((t, idx) => (
                      <span key={idx} className="bg-white border border-amber-400 px-3 py-1 rounded-xl text-xs font-black text-slate-900 shadow-2xs">
                        🎟️ {t}
                      </span>
                    ))}
                  </div>
                  <p className="text-[11px] text-amber-900 mt-2">
                    Eligible for the 2026 Motorcycle, 4K Smart TV & Baking Oven live computerized draw.
                  </p>
                </div>
              )}

              {/* Items Summary */}
              <div className="border border-slate-200 rounded-2xl p-4">
                <h6 className="font-bold text-xs text-slate-700 mb-2">
                  Order Items ({selectedOrder.items.length} items)
                </h6>
                <div className="divide-y divide-slate-100 max-h-40 overflow-y-auto text-xs">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="py-2 flex justify-between items-center">
                      <div>
                        <span className="font-semibold text-slate-900">{item.product.name}</span>
                        <span className="text-[10px] text-slate-400 block">{item.product.brand} • {item.product.unit} × {item.quantity}</span>
                      </div>
                      <span className="font-bold text-slate-800">
                        {formatPKR(item.product.discountedPrice * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct WhatsApp Store Contact */}
              <div className="bg-emerald-50 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 border border-emerald-200">
                <div>
                  <div className="font-bold text-xs text-emerald-950">
                    Need delivery status assistance or rider coordination?
                  </div>
                  <div className="text-[11px] text-emerald-700">
                    {branchInfo.name}: <strong>{branchInfo.phone}</strong>
                  </div>
                </div>
                <a
                  href={`https://wa.me/${branchInfo.whatsappNumber}?text=${encodeURIComponent(
                    `Hello KAAF Cash & Carry! I would like an update on my Order #${selectedOrder.orderNumber}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition shrink-0"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Contact Branch Manager</span>
                </a>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
