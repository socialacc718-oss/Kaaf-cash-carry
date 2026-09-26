export type Branch = 'Jinnah Garden' | 'River Garden';

export interface Product {
  id: string;
  name: string;
  nameUrdu: string;
  brand: string;
  category: string;
  originalPrice: number;
  discountedPrice: number;
  unit: string;
  image: string;
  inStock: boolean;
  stockCount: number;
  isPamphletDeal: boolean;
  featured?: boolean;
  popularity: number; // 1-100 score based on purchases & views
  createdAt: number;  // timestamp for newest arrivals sorting
  description?: string;
  barcode?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Packing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

export type PaymentMethod = 'Cash on Delivery (COD)' | 'JazzCash' | 'EasyPaisa' | 'Bank Transfer' | 'Card on Delivery';

export type LoyaltyTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';

export interface LoyaltyTierInfo {
  tier: LoyaltyTier;
  minPoints: number;
  multiplier: number;
  color: string;
  badgeBg: string;
  benefits: string[];
}

export interface LoyaltyAccount {
  points: number;
  lifetimePoints: number;
  tier: LoyaltyTier;
  redeemedSavings: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  branch: Branch;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  totalSavings: number;
  pointsRedeemed?: number;
  loyaltyDiscount?: number;
  grandTotal: number;
  qurandaziTickets: string[];
  status: OrderStatus;
  notes?: string;
  createdAt: number;
}

export interface QurandaziPrize {
  id: string;
  title: string;
  titleUrdu: string;
  rank: number;
  badge: string;
  image: string;
  specs: string;
}

export interface FlashSaleNotification {
  id: string;
  title: string;
  titleUrdu?: string;
  message: string;
  discountBadge: string;
  timeAgo: string;
  active: boolean;
}

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'popularity' | 'newest' | 'discount';

export interface FilterState {
  searchQuery: string;
  selectedCategory: string;
  selectedBrands: string[];
  minPrice: number;
  maxPrice: number;
  onlyPamphlet: boolean;
  onlyInStock: boolean;
  sortBy: SortOption;
}
