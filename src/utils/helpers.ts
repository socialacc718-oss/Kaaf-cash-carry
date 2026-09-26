import { CartItem, Order, Branch, LoyaltyTier } from '../types';
import { BRANCH_CONTACTS, LOYALTY_TIERS } from '../data/products';

export const formatPKR = (amount: number): string => {
  if (typeof amount !== 'number' || isNaN(amount)) return 'Rs. 0';
  return `Rs. ${Math.round(amount).toLocaleString('en-PK')}`;
};

export const generateOrderId = (): string => {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `KF-${Date.now().toString().slice(-4)}${randomNum}`;
};

export const generateQurandaziTicket = (orderId: string, index: number): string => {
  const randomChar = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  const randomDigits = Math.floor(10000 + Math.random() * 90000);
  return `KAAF-QDZ-${randomChar}${randomDigits}`;
};

export const calculateQurandaziTickets = (subtotal: number, tierMultiplier: number = 1): number => {
  if (!subtotal || subtotal < 5000) return 0;
  const baseTickets = Math.floor(subtotal / 5000);
  return Math.round(baseTickets * (tierMultiplier || 1));
};

export const getTierFromPoints = (points: number): LoyaltyTier => {
  const p = points || 0;
  if (p >= 1000) return 'Platinum';
  if (p >= 500) return 'Gold';
  if (p >= 200) return 'Silver';
  return 'Bronze';
};

export const calculatePointsEarned = (amount: number, tier?: LoyaltyTier): number => {
  const safeTier = tier && LOYALTY_TIERS[tier] ? tier : 'Bronze';
  const multiplier = LOYALTY_TIERS[safeTier]?.multiplier || 1.0;
  return Math.floor(((amount || 0) / 100) * multiplier);
};

export const buildWhatsAppOrderText = (order: Order): string => {
  const branchInfo = BRANCH_CONTACTS[order.branch] || BRANCH_CONTACTS['Jinnah Garden'];
  
  let text = `🛒 *KAAF CASH & CARRY - NEW ONLINE ORDER* 🛒\n`;
  text += `*Everything at Wholesale Rates!*\n`;
  text += `────────────────────\n`;
  text += `📋 *Order ID:* #${order.orderNumber}\n`;
  text += `📅 *Date & Time:* ${order.date}\n`;
  text += `🏢 *Branch:* ${order.branch} (${branchInfo.phone})\n`;
  text += `👤 *Customer Name:* ${order.customerName}\n`;
  text += `📞 *Phone/WhatsApp:* ${order.customerPhone}\n`;
  text += `📍 *Delivery Address:* ${order.customerAddress}\n`;
  text += `💳 *Payment Method:* ${order.paymentMethod}\n`;
  if (order.transactionId) {
    text += `🔢 *Transaction ID:* ${order.transactionId}\n`;
  }
  text += `────────────────────\n`;
  text += `🛍️ *Order Items List:*\n`;

  (order.items || []).forEach((item, idx) => {
    const price = item?.product?.discountedPrice || 0;
    const qty = item?.quantity || 1;
    const itemTotal = price * qty;
    const name = item?.product?.name || 'Grocery Item';
    const brand = item?.product?.brand || 'KAAF';
    const unit = item?.product?.unit || '1 Pack';
    text += `${idx + 1}. *${name}* [${brand}]\n`;
    text += `   ${qty} x Rs. ${price.toLocaleString()} = *Rs. ${itemTotal.toLocaleString()}* (${unit})\n`;
  });

  text += `────────────────────\n`;
  text += `💰 *Subtotal:* Rs. ${(order.subtotal || 0).toLocaleString()}\n`;
  text += `🚚 *Delivery Fee:* ${order.deliveryFee === 0 ? 'FREE HOME DELIVERY' : `Rs. ${order.deliveryFee}`}\n`;
  
  if (order.loyaltyDiscount && order.loyaltyDiscount > 0) {
    text += `⭐ *Loyalty Points Redeemed:* -Rs. ${order.loyaltyDiscount.toLocaleString()} (${order.pointsRedeemed || 0} pts)\n`;
  }

  text += `🎉 *Total Pamphlet Savings:* Rs. ${(order.totalSavings || 0).toLocaleString()}\n`;
  text += `💵 *NET PAYABLE (Grand Total):* *Rs. ${(order.grandTotal || 0).toLocaleString()}*\n`;
  text += `────────────────────\n`;

  if (order.qurandaziTickets && order.qurandaziTickets.length > 0) {
    text += `🛵📺 *LUCKY DRAW TOKENS (Rs. 5,000+ Promo):* 🎁\n`;
    text += `Congratulations! Qualified Lucky Draw Tickets:\n`;
    order.qurandaziTickets.forEach((t) => {
      text += `🎟️ *${t}*\n`;
    });
    text += `(Eligible to win 2026 Motorcycle, 4K Smart LED TV & Baking Oven!)\n`;
    text += `────────────────────\n`;
  }

  if (order.notes) {
    text += `📝 *Delivery Notes:* ${order.notes}\n`;
    text += `────────────────────\n`;
  }

  text += `_Please confirm this order and dispatch items. Thank you!_\n`;
  text += `*KAAF Cash & Carry Jinnah Garden Branch: 0333-8951378*`;

  return text;
};

export const getWhatsAppUrl = (order: Order, targetBranchPhone?: string): string => {
  // Default to pamphlet Jinnah Garden branch number: 0333-8951378
  const phone = targetBranchPhone || '923338951378';
  const text = buildWhatsAppOrderText(order);
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
};
