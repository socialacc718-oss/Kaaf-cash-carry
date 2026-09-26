import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Phone, 
  User, 
  CreditCard, 
  Truck, 
  Gift, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  AlertCircle,
  Building2,
  Star,
  Check
} from 'lucide-react';
import { CartItem, Order, Branch, PaymentMethod, LoyaltyAccount } from '../types';
import { BRANCH_CONTACTS } from '../data/products';
import { 
  formatPKR, 
  generateOrderId, 
  calculateQurandaziTickets, 
  generateQurandaziTicket, 
  getWhatsAppUrl,
  calculatePointsEarned
} from '../utils/helpers';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  loyaltyAccount: LoyaltyAccount;
  defaultBranch: Branch;
  onOrderSuccess: (order: Order, pointsRedeemed: number, pointsEarned: number) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  loyaltyAccount,
  defaultBranch,
  onOrderSuccess
}) => {
  if (!isOpen) return null;

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<Branch>(defaultBranch || 'Jinnah Garden');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash on Delivery (COD)');
  const [transactionId, setTransactionId] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Loyalty Points Redemption
  const [redeemPointsToggle, setRedeemPointsToggle] = useState(false);
  const maxRedeemable = Math.min(loyaltyAccount?.points || 0, 500); // Up to 500 points per order
  const [pointsToRedeem, setPointsToRedeem] = useState(maxRedeemable > 0 ? maxRedeemable : 0);

  const subtotal = (cartItems || []).reduce((acc, item) => acc + ((item?.product?.discountedPrice || 0) * (item?.quantity || 1)), 0);
  const originalSubtotal = (cartItems || []).reduce((acc, item) => acc + ((item?.product?.originalPrice || item?.product?.discountedPrice || 0) * (item?.quantity || 1)), 0);
  const totalSavings = originalSubtotal - subtotal;
  const deliveryFee = 0; // Free Home Delivery

  const loyaltyDiscount = redeemPointsToggle ? pointsToRedeem : 0;
  const grandTotal = Math.max(0, subtotal - loyaltyDiscount + deliveryFee);

  // Qurandazi tickets based on tier
  const safeTier = loyaltyAccount?.tier || 'Silver';
  const tierMultiplier = safeTier === 'Platinum' ? 3 : safeTier === 'Gold' ? 2 : 1;
  const ticketCount = calculateQurandaziTickets(subtotal, tierMultiplier);

  // Points earned on this transaction
  const pointsEarned = calculatePointsEarned(grandTotal, safeTier);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    if (!customerPhone.trim() || customerPhone.length < 10) {
      setErrorMsg('Please enter a valid active WhatsApp mobile number (e.g. 0333 1234567).');
      return;
    }

    if (!customerAddress.trim()) {
      setErrorMsg('Please enter your complete delivery address in Islamabad.');
      return;
    }

    setIsSubmitting(true);

    const orderId = generateOrderId();
    const orderDate = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Generate Lucky Draw tickets if qualified
    const tickets: string[] = [];
    for (let i = 0; i < ticketCount; i++) {
      tickets.push(generateQurandaziTicket(orderId, i));
    }

    const newOrder: Order = {
      id: orderId,
      orderNumber: orderId,
      date: orderDate,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerAddress: customerAddress.trim(),
      branch: selectedBranch,
      paymentMethod,
      transactionId: transactionId.trim() || undefined,
      items: [...cartItems],
      subtotal,
      deliveryFee,
      totalSavings,
      pointsRedeemed: redeemPointsToggle ? pointsToRedeem : 0,
      loyaltyDiscount: loyaltyDiscount > 0 ? loyaltyDiscount : undefined,
      grandTotal,
      qurandaziTickets: tickets,
      status: 'Pending',
      notes: notes.trim() || undefined,
      createdAt: Date.now()
    };

    // Auto send to Jinnah Garden branch WhatsApp number 0333-8951378 or River Garden 0333-8951377
    const targetPhone = selectedBranch === 'Jinnah Garden' ? '923338951378' : '923338951377';
    const whatsappUrl = getWhatsAppUrl(newOrder, targetPhone);

    // Save order in state/localStorage via parent callback
    onOrderSuccess(newOrder, redeemPointsToggle ? pointsToRedeem : 0, pointsEarned);

    // Automatically trigger WhatsApp opening for user to submit slip
    try {
      window.open(whatsappUrl, '_blank');
    } catch (e) {
      console.log('Popup blocked, WhatsApp button available on slip modal');
    }

    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-800 to-emerald-950 text-white p-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                Free Delivery
              </span>
              <h3 className="text-lg sm:text-xl font-black">Checkout & Order Placement</h3>
            </div>
            <p className="text-xs text-emerald-200 mt-0.5">
              Official WhatsApp slip will be generated for Jinnah Garden: <strong className="text-white">0333-8951378</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmitOrder} className="p-5 sm:p-6 overflow-y-auto space-y-5">
          
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm p-3 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Qurandazi Deal Qualification Callout */}
          {ticketCount > 0 ? (
            <div className="bg-gradient-to-r from-amber-500/15 via-yellow-500/20 to-amber-500/15 border border-amber-400/60 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-xs">
                <Gift className="w-6 h-6" />
              </div>
              <div className="text-xs">
                <h5 className="font-extrabold text-amber-950 text-sm flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Congratulations! You qualify for {ticketCount} Lucky Draw Token(s)!</span>
                </h5>
                <p className="text-amber-900 mt-0.5">
                  Your computerized token code(s) will be printed on your official thermal invoice. Eligible to win a brand new 2026 Motorcycle, 4K Smart TV & Baking Oven!
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-amber-500" />
                <span>
                  Add <strong>{formatPKR(5000 - subtotal)}</strong> more to unlock Grand Lucky Draw Entry
                </span>
              </div>
              <span className="text-[10px] text-slate-400">(Spend Rs. 5,000+)</span>
            </div>
          )}

          {/* Loyalty Points Redemption Box */}
          {loyaltyAccount.points > 0 && (
            <div className="bg-amber-50/70 border border-amber-300 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black">
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                      KAAF Rewards Points: {loyaltyAccount.points} Available
                    </h5>
                    <p className="text-[11px] text-slate-600">
                      Redeem your points for an instant Rs. discount (1 pt = Rs. 1)
                    </p>
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={redeemPointsToggle}
                    onChange={(e) => setRedeemPointsToggle(e.target.checked)}
                    className="w-4 h-4 text-emerald-700 rounded focus:ring-emerald-600"
                  />
                  <span className="text-xs font-bold text-slate-800">Redeem Points</span>
                </label>
              </div>

              {redeemPointsToggle && (
                <div className="pt-2 border-t border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex-1">
                    <div className="flex justify-between font-bold text-slate-700 mb-1">
                      <span>Points to Redeem:</span>
                      <span className="text-emerald-800">{pointsToRedeem} Points (-Rs. {pointsToRedeem})</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={maxRedeemable}
                      step={10}
                      value={pointsToRedeem}
                      onChange={(e) => setPointsToRedeem(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>
                  <div className="bg-white px-3 py-1.5 rounded-xl border border-amber-300 font-black text-emerald-800 shrink-0 text-center">
                    Instant -Rs. {pointsToRedeem} OFF
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Branch Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>Select Servicing Branch:</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label 
                className={`flex items-start gap-3 p-3 rounded-2xl border-2 cursor-pointer transition ${
                  selectedBranch === 'Jinnah Garden'
                    ? 'border-emerald-700 bg-emerald-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="branch"
                  value="Jinnah Garden"
                  checked={selectedBranch === 'Jinnah Garden'}
                  onChange={() => setSelectedBranch('Jinnah Garden')}
                  className="mt-1 text-emerald-700 focus:ring-emerald-600"
                />
                <div>
                  <div className="font-extrabold text-sm text-slate-900 flex items-center gap-1">
                    <span>Jinnah Garden Branch</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.2 rounded font-black">Main</span>
                  </div>
                  <div className="text-xs font-bold text-emerald-700 mt-0.5">WhatsApp: 0333-8951378</div>
                  <div className="text-[11px] text-slate-500">Main Commercial Avenue, Near Gate 1</div>
                </div>
              </label>

              <label 
                className={`flex items-start gap-3 p-3 rounded-2xl border-2 cursor-pointer transition ${
                  selectedBranch === 'River Garden'
                    ? 'border-emerald-700 bg-emerald-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="branch"
                  value="River Garden"
                  checked={selectedBranch === 'River Garden'}
                  onChange={() => setSelectedBranch('River Garden')}
                  className="mt-1 text-emerald-700 focus:ring-emerald-600"
                />
                <div>
                  <div className="font-extrabold text-sm text-slate-900">River Garden Branch</div>
                  <div className="text-xs font-bold text-emerald-700 mt-0.5">WhatsApp: 0333-8951377</div>
                  <div className="text-[11px] text-slate-500">Main Boulevard, River Garden Scheme</div>
                </div>
              </label>
            </div>
          </div>

          {/* Customer Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Customer Full Name *</span>
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Muhammad Usman"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>WhatsApp Phone Number *</span>
              </label>
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="0333 1234567"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white"
              />
            </div>
          </div>

          {/* Delivery Address */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>Complete Delivery Address (Islamabad) *</span>
            </label>
            <textarea
              required
              rows={2}
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              placeholder="House #, Street #, Sector / Phase (e.g. House 45, Street 12, Sector A, Jinnah Garden, Islamabad)"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white"
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5 text-slate-400" />
              <span>Payment Method *</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {[
                { id: 'Cash on Delivery (COD)', label: 'Cash on Delivery (COD)' },
                { id: 'JazzCash', label: 'JazzCash' },
                { id: 'EasyPaisa', label: 'EasyPaisa' },
                { id: 'Bank Transfer', label: 'Bank Transfer' }
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id as PaymentMethod)}
                  className={`p-2.5 rounded-xl border text-center font-bold transition flex flex-col items-center justify-center min-h-[50px] ${
                    paymentMethod === m.id
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="leading-tight">{m.label}</span>
                </button>
              ))}
            </div>

            {/* Account Details if Online Payment selected */}
            {(paymentMethod === 'JazzCash' || paymentMethod === 'EasyPaisa' || paymentMethod === 'Bank Transfer') && (
              <div className="mt-3 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-2">
                <div className="font-bold text-slate-800">
                  {paymentMethod} Official Account Details:
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200 font-mono text-xs text-slate-700 space-y-1">
                  <div><strong>Account Title:</strong> KAAF CASH & CARRY</div>
                  <div><strong>Account / Mobile:</strong> {selectedBranch === 'Jinnah Garden' ? '0333-8951378' : '0333-8951377'}</div>
                  <div className="text-[11px] text-emerald-700 font-sans">
                    After transfer, please enter your Transaction ID (TID) below.
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="Enter Transaction ID (TID / Trx ID) *"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                />
              </div>
            )}
          </div>

          {/* Delivery Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Special Delivery Instructions (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Near main commercial mosque, call before arrival"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          {/* Price Summary Breakdown */}
          <div className="bg-slate-100/90 rounded-2xl p-4 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Total Items:</span>
              <span className="font-bold text-slate-900">{cartItems.length}</span>
            </div>
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
            {loyaltyDiscount > 0 && (
              <div className="flex justify-between text-amber-700 font-bold">
                <span>Loyalty Points Redeemed ({pointsToRedeem} pts):</span>
                <span>- {formatPKR(loyaltyDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between text-emerald-700 font-bold">
              <span>Home Delivery Fee:</span>
              <span>FREE (0 PKR)</span>
            </div>
            <div className="flex justify-between text-sm sm:text-base font-black text-slate-900 pt-2 border-t border-slate-300">
              <span>Net Payable (Grand Total):</span>
              <span className="text-emerald-800">{formatPKR(grandTotal)}</span>
            </div>
            <div className="text-[11px] text-amber-800 pt-1 flex items-center justify-between font-semibold">
              <span>⭐ Points you will earn on this order:</span>
              <span>+{pointsEarned} Points ({loyaltyAccount.tier} Tier)</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 hover:from-emerald-800 hover:to-teal-900 text-white rounded-2xl font-black text-sm sm:text-base shadow-xl shadow-emerald-700/30 flex items-center justify-center gap-2 transition active:scale-95"
          >
            <span>Confirm Order & Send Slip to Jinnah Garden WhatsApp</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <p className="text-center text-[11px] text-slate-500">
            Clicking will automatically format your POS invoice slip and route to WhatsApp <strong>0333-8951378</strong>.
          </p>

        </form>

      </div>
    </div>
  );
};
