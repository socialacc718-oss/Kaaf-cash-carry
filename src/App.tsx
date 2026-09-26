import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { QurandaziBanner } from './components/QurandaziBanner';
import { PamphletDealsSection } from './components/PamphletDealsSection';
import { ProductCatalog } from './components/ProductCatalog';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { WhatsAppSlipModal } from './components/WhatsAppSlipModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { LoyaltyRewardsModal } from './components/LoyaltyRewardsModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLoginModal } from './components/AdminLoginModal';
import { PushNotificationToast } from './components/PushNotificationToast';
import { Footer } from './components/Footer';

import { Product, CartItem, Order, Branch, OrderStatus, FlashSaleNotification, LoyaltyAccount } from './types';
import { INITIAL_PRODUCTS } from './data/products';
import { getTierFromPoints } from './utils/helpers';

export default function App() {
  // Products state (persisted or defaults)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('kaaf_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed
            .filter((p: any) => p && typeof p === 'object' && p.id)
            .map((p: any) => ({
              ...p,
              id: String(p.id),
              name: String(p.name || 'Grocery Item'),
              nameUrdu: String(p.nameUrdu || p.name || ''),
              brand: String(p.brand || 'KAAF Fresh'),
              category: String(p.category || 'General Grocery'),
              description: String(p.description || ''),
              unit: String(p.unit || '1 Pack'),
              originalPrice: typeof p.originalPrice === 'number' ? p.originalPrice : (typeof p.discountedPrice === 'number' ? p.discountedPrice : 100),
              discountedPrice: typeof p.discountedPrice === 'number' ? p.discountedPrice : 100,
              stockCount: typeof p.stockCount === 'number' ? p.stockCount : 50,
              inStock: p.inStock !== false,
              image: p.image || INITIAL_PRODUCTS[0]?.image || ''
            }));
        }
      }
    } catch (e) {
      console.warn('Error reading products from storage:', e);
    }
    return INITIAL_PRODUCTS;
  });

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('kaaf_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed
            .filter(item => item && item.product && typeof item.product === 'object' && item.product.id)
            .map(item => ({
              ...item,
              quantity: typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 1,
              product: {
                ...item.product,
                name: String(item.product.name || 'Grocery Item'),
                brand: String(item.product.brand || 'KAAF Fresh'),
                category: String(item.product.category || 'General Grocery'),
                discountedPrice: typeof item.product.discountedPrice === 'number' ? item.product.discountedPrice : (item.product.originalPrice || 0),
                originalPrice: typeof item.product.originalPrice === 'number' ? item.product.originalPrice : (item.product.discountedPrice || 0),
                unit: String(item.product.unit || '1 Pack')
              }
            }));
        }
      }
    } catch (e) {}
    return [];
  });

  // Loyalty Account state (with points balance & tier)
  const [loyaltyAccount, setLoyaltyAccount] = useState<LoyaltyAccount>(() => {
    try {
      const saved = localStorage.getItem('kaaf_loyalty');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            points: typeof parsed.points === 'number' ? parsed.points : 250,
            lifetimePoints: typeof parsed.lifetimePoints === 'number' ? parsed.lifetimePoints : 450,
            tier: parsed.tier && ['Bronze', 'Silver', 'Gold', 'Platinum'].includes(parsed.tier) ? parsed.tier : 'Silver',
            redeemedSavings: typeof parsed.redeemedSavings === 'number' ? parsed.redeemedSavings : 150
          };
        }
      }
    } catch (e) {}
    return {
      points: 250,
      lifetimePoints: 450,
      tier: 'Silver',
      redeemedSavings: 150
    };
  });

  // Orders state
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('kaaf_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.filter(o => o && typeof o === 'object' && (o.id || o.orderNumber));
        }
      }
    } catch (e) {}
    return [
      {
        id: 'KF-8921',
        orderNumber: 'KF-8921',
        date: '26 Sep 2026, 11:30 AM',
        customerName: 'Haji Muhammad Irfan',
        customerPhone: '03335123456',
        customerAddress: 'House 112, Street 8, Sector B, Jinnah Garden, Islamabad',
        branch: 'Jinnah Garden',
        paymentMethod: 'Cash on Delivery (COD)',
        items: [
          { product: INITIAL_PRODUCTS[0], quantity: 1 }, // Dalda 5kg (2970)
          { product: INITIAL_PRODUCTS[2], quantity: 1 }  // Olpers Milk (3900)
        ],
        subtotal: 6870,
        deliveryFee: 0,
        totalSavings: 500,
        pointsRedeemed: 100,
        loyaltyDiscount: 100,
        grandTotal: 6770,
        qurandaziTickets: ['KAAF-QDZ-M78921'],
        status: 'Out for Delivery',
        notes: 'Please call before arrival',
        createdAt: Date.now() - 3600000
      }
    ];
  });

  // Branch preference
  const [currentBranch, setCurrentBranch] = useState<Branch>(() => {
    const saved = localStorage.getItem('kaaf_branch') as Branch;
    return saved === 'River Garden' ? 'River Garden' : 'Jinnah Garden';
  });

  // Search & Catalog Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Products');

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeSlipOrder, setActiveSlipOrder] = useState<Order | null>(null);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [trackingInitialId, setTrackingInitialId] = useState('');
  const [isLoyaltyOpen, setIsLoyaltyOpen] = useState(false);

  // Admin security lock states
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Flash Sale push notification banner
  const [flashNotification, setFlashNotification] = useState<FlashSaleNotification | null>({
    id: 'flash-1',
    title: '⚡ Exclusive Deal: Dalda Cooking Oil 5KG at just Rs. 2,970!',
    message: 'Regular market price Rs. 3,170. Order now with FREE Home Delivery across Islamabad!',
    discountBadge: 'HOT DEAL',
    timeAgo: 'Live Now',
    active: true
  });

  // Save changes to localStorage safely
  useEffect(() => {
    try {
      localStorage.setItem('kaaf_products', JSON.stringify(products));
    } catch (e) {}
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('kaaf_cart', JSON.stringify(cartItems));
    } catch (e) {}
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem('kaaf_loyalty', JSON.stringify(loyaltyAccount));
    } catch (e) {}
  }, [loyaltyAccount]);

  useEffect(() => {
    try {
      localStorage.setItem('kaaf_orders', JSON.stringify(orders));
    } catch (e) {}
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('kaaf_branch', currentBranch);
    } catch (e) {}
  }, [currentBranch]);

  // Cart Handlers
  const handleAddToCart = (product: Product) => {
    if (!product || !product.id) return;
    setCartItems(prev => {
      const existing = prev.find(item => item?.product?.id === product.id);
      if (existing) {
        return prev.map(item =>
          item?.product?.id === product.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Checkout & Order Placement
  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (newOrder: Order, pointsRedeemed: number, pointsEarned: number) => {
    // 1. Add order to state
    setOrders(prev => [newOrder, ...prev]);

    // 2. Reduce inventory counts
    setProducts(prev =>
      prev.map(prod => {
        const orderItem = newOrder.items.find(i => i.product.id === prod.id);
        if (orderItem) {
          const newCount = Math.max(0, prod.stockCount - orderItem.quantity);
          return {
            ...prod,
            stockCount: newCount,
            inStock: newCount > 0
          };
        }
        return prod;
      })
    );

    // 3. Update Loyalty Account
    setLoyaltyAccount(prev => {
      const updatedBalance = Math.max(0, prev.points - pointsRedeemed + pointsEarned);
      const updatedLifetime = prev.lifetimePoints + pointsEarned;
      const updatedTier = getTierFromPoints(updatedBalance);
      return {
        points: updatedBalance,
        lifetimePoints: updatedLifetime,
        tier: updatedTier,
        redeemedSavings: prev.redeemedSavings + pointsRedeemed
      };
    });

    // 4. Clear shopping basket
    setCartItems([]);

    // 5. Close checkout modal and show thermal WhatsApp slip
    setIsCheckoutOpen(false);
    setActiveSlipOrder(newOrder);
  };

  // Order Tracking Launch
  const handleOpenTracking = (orderId?: string) => {
    setTrackingInitialId(orderId || '');
    if (activeSlipOrder) {
      setActiveSlipOrder(null);
    }
    setIsTrackingOpen(true);
  };

  // Admin access with password protection
  const handleRequestAdminAccess = () => {
    if (isAdminUnlocked) {
      setIsAdminOpen(true);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminUnlocked(true);
    setIsAdminLoginOpen(false);
    setIsAdminOpen(true);
  };

  // Admin Dashboard actions
  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status } : o))
    );
  };

  const handleUpdateProductStock = (productId: string, newStock: number, inStock: boolean) => {
    setProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, stockCount: newStock, inStock } : p))
    );
  };

  const handleUpdateProductPrice = (productId: string, originalPrice: number, discountedPrice: number) => {
    setProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, originalPrice, discountedPrice } : p))
    );
  };

  const handleAddNewProduct = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
  };

  const handleTriggerFlashSale = (notif: FlashSaleNotification) => {
    setFlashNotification(notif);
  };

  // Smooth scroll navigations
  const scrollToPamphlet = () => {
    const el = document.getElementById('pamphlet-deals');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToQurandazi = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cartSubtotal = cartItems.reduce(
    (acc, item) => acc + ((item?.product?.discountedPrice || 0) * (item?.quantity || 1)),
    0
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-950 w-full max-w-full overflow-x-hidden">
      
      {/* 1. Header with branding, branch selector, search, loyalty tier badge, and cart preview */}
      <Header
        currentBranch={currentBranch}
        onSelectBranch={(b) => setCurrentBranch(b)}
        cartItems={cartItems}
        loyaltyAccount={loyaltyAccount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTracking={() => handleOpenTracking()}
        onOpenLoyalty={() => setIsLoyaltyOpen(true)}
        onOpenAdmin={handleRequestAdminAccess}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNavigateToQurandazi={scrollToQurandazi}
        onNavigateToPamphlet={scrollToPamphlet}
      />

      <main className="flex-1">
        
        {/* 2. Grand Qurandazi Lucky Draw Hero Showcase */}
        <QurandaziBanner
          cartSubtotal={cartSubtotal}
          userTier={loyaltyAccount.tier}
          onExploreDeals={scrollToPamphlet}
          onOpenCart={() => setIsCartOpen(true)}
        />

        {/* 3. Pamphlet Exclusive Deals */}
        <PamphletDealsSection
          products={products}
          cartItems={cartItems}
          onAddToCart={handleAddToCart}
          onUpdateQuantity={handleUpdateQuantity}
        />

        {/* 4. Complete Supermarket Catalog with Advanced Search, Brand Filtering, Price Range & Sorting */}
        <ProductCatalog
          products={products}
          cartItems={cartItems}
          onAddToCart={handleAddToCart}
          onUpdateQuantity={handleUpdateQuantity}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

      </main>

      {/* 5. Footer with comprehensive branch contacts, timings, and delivery guidelines */}
      <Footer
        onSelectBranch={setCurrentBranch}
        onNavigateToPamphlet={scrollToPamphlet}
        onNavigateToQurandazi={scrollToQurandazi}
      />

      {/* 6. Shopping Cart Centered Full-Screen Modal (Spacious & balanced layout) */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        loyaltyAccount={loyaltyAccount}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* 7. Checkout Modal with Points Redemption & Automated Jinnah Garden Branch WhatsApp Flow */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        loyaltyAccount={loyaltyAccount}
        defaultBranch={currentBranch}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* 8. POS Thermal Receipt Invoice Slip Modal */}
      <WhatsAppSlipModal
        order={activeSlipOrder}
        isOpen={!!activeSlipOrder}
        onClose={() => setActiveSlipOrder(null)}
        onOpenTracking={(ordNum) => handleOpenTracking(ordNum)}
      />

      {/* 9. Live Order Fulfillment Tracker Modal */}
      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        orders={orders}
        initialOrderId={trackingInitialId}
      />

      {/* 10. Loyalty Rewards & Membership Tier Management Modal */}
      <LoyaltyRewardsModal
        isOpen={isLoyaltyOpen}
        onClose={() => setIsLoyaltyOpen(false)}
        loyaltyAccount={loyaltyAccount}
        orders={orders}
      />

      {/* 11. Admin Password Security Authentication Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={handleAdminLoginSuccess}
      />

      {/* 12. Store Admin Management Dashboard (Protected) */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        orders={orders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onUpdateProductStock={handleUpdateProductStock}
        onUpdateProductPrice={handleUpdateProductPrice}
        onAddNewProduct={handleAddNewProduct}
        onTriggerFlashSale={handleTriggerFlashSale}
      />

      {/* 13. Push Notification Alert Toast */}
      <PushNotificationToast
        notification={flashNotification}
        onClose={() => setFlashNotification(null)}
        onExplore={scrollToPamphlet}
      />

    </div>
  );
}
