import React, { useState } from 'react';
import { 
  X, 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Gift, 
  Bell, 
  TrendingUp, 
  DollarSign, 
  Plus, 
  Edit3, 
  AlertTriangle, 
  Search, 
  Send,
  Building2,
  Sparkles,
  Trophy,
  RefreshCw,
  Star
} from 'lucide-react';
import { Product, Order, OrderStatus, Branch, FlashSaleNotification } from '../types';
import { CATEGORIES, BRANDS } from '../data/products';
import { formatPKR, getWhatsAppUrl } from '../utils/helpers';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onUpdateProductStock: (productId: string, newStock: number, inStock: boolean) => void;
  onUpdateProductPrice: (productId: string, originalPrice: number, discountedPrice: number) => void;
  onAddNewProduct: (newProduct: Product) => void;
  onTriggerFlashSale: (notification: FlashSaleNotification) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  products,
  orders,
  onUpdateOrderStatus,
  onUpdateProductStock,
  onUpdateProductPrice,
  onAddNewProduct,
  onTriggerFlashSale
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'inventory' | 'qurandazi' | 'notifications'>('overview');
  
  // Order filters
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('All');
  const [orderBranchFilter, setOrderBranchFilter] = useState<string>('All');
  const [orderSearch, setOrderSearch] = useState<string>('');

  // Inventory filters
  const [invSearch, setInvSearch] = useState<string>('');
  const [invCategory, setInvCategory] = useState<string>('All Products');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // New product form modal state
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdNameUrdu, setNewProdNameUrdu] = useState('');
  const [newProdBrand, setNewProdBrand] = useState('Dalda');
  const [newProdCategory, setNewProdCategory] = useState('Cooking Oil & Ghee');
  const [newProdOrigPrice, setNewProdOrigPrice] = useState(1000);
  const [newProdDiscPrice, setNewProdDiscPrice] = useState(900);
  const [newProdUnit, setNewProdUnit] = useState('1 KG');
  const [newProdStock, setNewProdStock] = useState(50);
  const [newProdIsPamphlet, setNewProdIsPamphlet] = useState(false);

  // Lucky Draw winner draw simulation
  const [selectedPrizeToDraw, setSelectedPrizeToDraw] = useState('Honda CD70 Motorcycle - 1st Grand Prize');
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnWinner, setDrawnWinner] = useState<{ ticket: string; customerName: string; phone: string; prize: string } | null>(null);

  // Push notification broadcaster state
  const [notifTitle, setNotifTitle] = useState('⚡ Flash Deal Alert: 10% Extra Off on All Cooking Oils!');
  const [notifMsg, setNotifMsg] = useState('Limited time wholesale flash deal. Valid for next 2 hours only. Free Home Delivery included!');
  const [notifBadge, setNotifBadge] = useState('FLASH SALE');

  // KPI Calculations
  const totalRevenue = orders.reduce((acc, o) => acc + o.grandTotal, 0);
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter(o => o.status === 'Pending').length;
  const qurandaziEligibleOrders = orders.filter(o => o.subtotal >= 5000);
  const jinnahOrdersCount = orders.filter(o => o.branch === 'Jinnah Garden').length;
  const riverOrdersCount = orders.filter(o => o.branch === 'River Garden').length;
  const lowStockProducts = products.filter(p => p.stockCount <= 10);

  // Qurandazi all tickets
  const allQurandaziEntries = orders.flatMap(o => 
    (o.qurandaziTickets || []).map(t => ({
      ticket: t,
      customerName: o.customerName,
      customerPhone: o.customerPhone,
      orderNumber: o.orderNumber,
      amount: o.grandTotal
    }))
  );

  const handleDrawWinner = () => {
    if (allQurandaziEntries.length === 0) {
      alert('No Lucky Draw tickets exist in the system yet. Once an order of Rs. 5,000+ is placed, tokens will appear here.');
      return;
    }

    setIsDrawing(true);
    setDrawnWinner(null);

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * allQurandaziEntries.length);
      const winner = allQurandaziEntries[randomIndex];
      setDrawnWinner({
        ticket: winner.ticket,
        customerName: winner.customerName,
        phone: winner.customerPhone,
        prize: selectedPrizeToDraw
      });
      setIsDrawing(false);
    }, 2000);
  };

  const handleSaveProductEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    onUpdateProductPrice(editingProduct.id, editingProduct.originalPrice, editingProduct.discountedPrice);
    onUpdateProductStock(editingProduct.id, editingProduct.stockCount, editingProduct.inStock);
    setEditingProduct(null);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    const created: Product = {
      id: `prod-${Date.now()}`,
      name: newProdName.trim(),
      nameUrdu: newProdNameUrdu.trim() || newProdName.trim(),
      brand: newProdBrand.trim() || 'KAAF Fresh',
      category: newProdCategory,
      originalPrice: Number(newProdOrigPrice),
      discountedPrice: Number(newProdDiscPrice),
      unit: newProdUnit,
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
      inStock: true,
      stockCount: Number(newProdStock),
      isPamphletDeal: newProdIsPamphlet,
      popularity: 80,
      createdAt: Date.now(),
      description: 'Added via Admin Management.'
    };

    onAddNewProduct(created);
    setIsAddProductOpen(false);
    setNewProdName('');
    setNewProdNameUrdu('');
  };

  const handleBroadcastNotification = (e: React.FormEvent) => {
    e.preventDefault();
    onTriggerFlashSale({
      id: `flash-${Date.now()}`,
      title: notifTitle,
      message: notifMsg,
      discountBadge: notifBadge,
      timeAgo: 'Just now',
      active: true
    });
    alert('Flash sale alert successfully broadcasted to all customer screens!');
  };

  // Filtered orders
  const filteredOrders = orders.filter(o => {
    if (!o) return false;
    const matchesStatus = orderStatusFilter === 'All' ? true : o.status === orderStatusFilter;
    const matchesBranch = orderBranchFilter === 'All' ? true : o.branch === orderBranchFilter;
    const search = (orderSearch || '').trim().toLowerCase();
    const matchesSearch = !search || 
      (o.orderNumber ? o.orderNumber.toLowerCase().includes(search) : false) ||
      (o.customerName ? o.customerName.toLowerCase().includes(search) : false) ||
      (o.customerPhone ? o.customerPhone.includes(search) : false);
    return matchesStatus && matchesBranch && matchesSearch;
  });

  // Filtered inventory
  const filteredInventory = products.filter(p => {
    if (!p) return false;
    const matchesCat = invCategory === 'All Products' ? true : p.category === invCategory;
    const search = (invSearch || '').trim().toLowerCase();
    const matchesSearch = !search ||
      (p.name ? p.name.toLowerCase().includes(search) : false) ||
      (p.brand ? p.brand.toLowerCase().includes(search) : false);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-slate-50 rounded-3xl max-w-6xl w-full shadow-2xl overflow-hidden border border-slate-200 flex flex-col h-[94vh]">
        
        {/* Top Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-md">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg">KAAF Cash & Carry Admin Portal</h3>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                  REAL-TIME POS & REPORTING
                </span>
              </div>
              <p className="text-xs text-slate-400">Jinnah Garden (0333-8951378) & River Garden (0333-8951377)</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white border-b border-slate-200 px-4 flex gap-2 overflow-x-auto no-scrollbar text-xs font-bold">
          {[
            { id: 'overview', label: 'Sales & Real-time Overview', icon: TrendingUp },
            { id: 'orders', label: `Orders Management (${orders.length})`, icon: ShoppingCart },
            { id: 'inventory', label: `Inventory & Stock (${products.length})`, icon: Package },
            { id: 'qurandazi', label: `Lucky Draw Qurandazi (${allQurandaziEntries.length})`, icon: Gift },
            { id: 'notifications', label: 'Flash Sale Broadcaster', icon: Bell }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3.5 border-b-2 flex items-center gap-2 whitespace-nowrap transition ${
                  isActive
                    ? 'border-emerald-700 text-emerald-800 bg-emerald-50/50'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-700' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Top Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <span className="text-xs text-slate-500 font-semibold block">Gross Sales Revenue</span>
                  <span className="text-xl sm:text-2xl font-black text-slate-900 mt-1 block">
                    {formatPKR(totalRevenue)}
                  </span>
                  <span className="text-[11px] text-emerald-600 font-bold mt-1 block">
                    ↑ Live web & WhatsApp orders
                  </span>
                </div>

                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <span className="text-xs text-slate-500 font-semibold block">Total Orders</span>
                  <span className="text-xl sm:text-2xl font-black text-slate-900 mt-1 block">
                    {totalOrdersCount}
                  </span>
                  <span className="text-[11px] text-amber-600 font-bold mt-1 block">
                    {pendingOrdersCount} Pending store processing
                  </span>
                </div>

                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <span className="text-xs text-slate-500 font-semibold block">Lucky Draw Qualifying Entries</span>
                  <span className="text-xl sm:text-2xl font-black text-amber-600 mt-1 block">
                    {allQurandaziEntries.length} Tokens
                  </span>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    {qurandaziEligibleOrders.length} eligible customer orders
                  </span>
                </div>

                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <span className="text-xs text-slate-500 font-semibold block">Inventory Status</span>
                  <span className="text-xl sm:text-2xl font-black text-emerald-700 mt-1 block">
                    {products.length} Products
                  </span>
                  <span className="text-[11px] text-red-500 font-bold mt-1 block">
                    {lowStockProducts.length} items low in stock
                  </span>
                </div>
              </div>

              {/* Branch Performance Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-emerald-700" />
                      <span>Jinnah Garden Branch (Main)</span>
                    </h4>
                    <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                      0333-8951378
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Total Orders:</span>
                      <span className="font-bold text-slate-900">{jinnahOrdersCount} Orders</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Gross Sales:</span>
                      <span className="font-bold text-slate-900">
                        {formatPKR(orders.filter(o => o.branch === 'Jinnah Garden').reduce((a, b) => a + b.grandTotal, 0))}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                      Primary branch handling automated WhatsApp dispatch slips.
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-emerald-700" />
                      <span>River Garden Branch</span>
                    </h4>
                    <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                      0333-8951377
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Total Orders:</span>
                      <span className="font-bold text-slate-900">{riverOrdersCount} Orders</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Gross Sales:</span>
                      <span className="font-bold text-slate-900">
                        {formatPKR(orders.filter(o => o.branch === 'River Garden').reduce((a, b) => a + b.grandTotal, 0))}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                      Handles River Garden housing scheme and surrounding residential delivery zones.
                    </div>
                  </div>
                </div>
              </div>

              {/* Low Stock Warning */}
              {lowStockProducts.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2 font-bold text-amber-900 text-xs sm:text-sm">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Low Stock Re-order Alerts:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {lowStockProducts.map(p => (
                      <span key={p.id} className="bg-white border border-amber-300 text-slate-800 text-xs px-2.5 py-1 rounded-xl shadow-2xs">
                        <strong>{p.name}</strong> ({p.brand}): Only {p.stockCount} left
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              
              {/* Filter controls */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-wrap gap-3 items-center justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    placeholder="Search by Order # or Phone..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs w-48 sm:w-64"
                  />

                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Packing">Packing</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>

                  <select
                    value={orderBranchFilter}
                    onChange={(e) => setOrderBranchFilter(e.target.value)}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  >
                    <option value="All">All Branches</option>
                    <option value="Jinnah Garden">Jinnah Garden</option>
                    <option value="River Garden">River Garden</option>
                  </select>
                </div>

                <div className="text-xs text-slate-500 font-semibold">
                  Orders: {filteredOrders.length}
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200 uppercase">
                      <tr>
                        <th className="p-3">Order ID</th>
                        <th className="p-3">Date</th>
                        <th className="p-3">Customer</th>
                        <th className="p-3">Branch</th>
                        <th className="p-3">Items</th>
                        <th className="p-3">Total Amount</th>
                        <th className="p-3">Lucky Draw</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="p-8 text-center text-slate-400">
                            No orders found matching your filter.
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((ord) => (
                          <tr key={ord.id} className="hover:bg-slate-50/80 transition">
                            <td className="p-3 font-mono font-bold text-slate-900">
                              #{ord.orderNumber}
                            </td>
                            <td className="p-3 text-slate-500 whitespace-nowrap">
                              {ord.date}
                            </td>
                            <td className="p-3">
                              <div className="font-bold text-slate-900">{ord.customerName}</div>
                              <div className="text-[11px] text-slate-500 font-mono">{ord.customerPhone}</div>
                            </td>
                            <td className="p-3 whitespace-nowrap">
                              <span className="bg-slate-100 font-bold px-2 py-0.5 rounded text-[11px]">
                                {ord.branch}
                              </span>
                            </td>
                            <td className="p-3 font-semibold">
                              {ord.items.length} items
                            </td>
                            <td className="p-3 font-black text-slate-900 whitespace-nowrap">
                              {formatPKR(ord.grandTotal)}
                              {ord.loyaltyDiscount && ord.loyaltyDiscount > 0 && (
                                <span className="text-[10px] text-amber-600 block font-normal">
                                  Points -Rs.{ord.loyaltyDiscount}
                                </span>
                              )}
                            </td>
                            <td className="p-3">
                              {ord.qurandaziTickets && ord.qurandaziTickets.length > 0 ? (
                                <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 w-max">
                                  <Gift className="w-3 h-3 text-amber-600" />
                                  <span>{ord.qurandaziTickets.length} Entry</span>
                                </span>
                              ) : (
                                <span className="text-slate-300">-</span>
                              )}
                            </td>
                            <td className="p-3 whitespace-nowrap">
                              <select
                                value={ord.status}
                                onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as OrderStatus)}
                                className={`text-[11px] font-bold px-2 py-1 rounded-lg border focus:outline-none ${
                                  ord.status === 'Delivered' 
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                                    : ord.status === 'Out for Delivery'
                                      ? 'bg-blue-50 text-blue-800 border-blue-300'
                                      : 'bg-amber-50 text-amber-800 border-amber-300'
                                }`}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Packing">Packing</option>
                                <option value="Out for Delivery">Out for Delivery</option>
                                <option value="Delivered">Delivered</option>
                              </select>
                            </td>
                            <td className="p-3 whitespace-nowrap">
                              <a
                                href={getWhatsAppUrl(ord, ord.branch === 'Jinnah Garden' ? '923338951378' : '923338951377')}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-[11px] inline-flex items-center gap-1 shadow-2xs"
                                title="Resend WhatsApp Slip"
                              >
                                <Send className="w-3 h-3" />
                                <span>WhatsApp</span>
                              </a>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: INVENTORY */}
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              
              <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-wrap gap-3 items-center justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    placeholder="Search product by name or brand..."
                    value={invSearch}
                    onChange={(e) => setInvSearch(e.target.value)}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs w-48 sm:w-64"
                  />

                  <select
                    value={invCategory}
                    onChange={(e) => setInvCategory(e.target.value)}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => setIsAddProductOpen(true)}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              </div>

              {/* Inventory Table */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200 uppercase">
                      <tr>
                        <th className="p-3">Product & Brand</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Original Price</th>
                        <th className="p-3">Discount Price</th>
                        <th className="p-3">Unit</th>
                        <th className="p-3">Stock Units</th>
                        <th className="p-3">Pamphlet Item</th>
                        <th className="p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredInventory.map((prod) => (
                        <tr key={prod.id} className="hover:bg-slate-50/80 transition">
                          <td className="p-3">
                            <div className="flex items-center gap-2.5">
                              <img src={prod.image} alt={prod.name} className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0" />
                              <div>
                                <span className="font-bold text-slate-900 block">{prod.name}</span>
                                <span className="text-[10px] text-slate-400 block font-semibold">{prod.brand}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 whitespace-nowrap text-slate-500">
                            {prod.category}
                          </td>
                          <td className="p-3 font-semibold line-through text-slate-400">
                            Rs. {prod.originalPrice}
                          </td>
                          <td className="p-3 font-black text-emerald-800">
                            Rs. {prod.discountedPrice}
                          </td>
                          <td className="p-3 text-slate-600 whitespace-nowrap">
                            {prod.unit}
                          </td>
                          <td className="p-3">
                            <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                              prod.stockCount <= 10 ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-800'
                            }`}>
                              {prod.stockCount} {prod.inStock ? 'In Stock' : '(Out of Stock)'}
                            </span>
                          </td>
                          <td className="p-3">
                            {prod.isPamphletDeal ? (
                              <span className="bg-red-100 text-red-700 text-[10px] font-black px-2 py-0.5 rounded">
                                Pamphlet Deal
                              </span>
                            ) : (
                              <span className="text-slate-300">-</span>
                            )}
                          </td>
                          <td className="p-3 whitespace-nowrap">
                            <button
                              onClick={() => setEditingProduct({ ...prod })}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-[11px] inline-flex items-center gap-1"
                            >
                              <Edit3 className="w-3 h-3 text-slate-600" />
                              <span>Edit</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: LUCKY DRAW QURANDAZI */}
          {activeTab === 'qurandazi' && (
            <div className="space-y-6">
              
              <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
                <div className="max-w-xl">
                  <div className="inline-flex items-center gap-2 bg-amber-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full mb-3 uppercase">
                    <Trophy className="w-3.5 h-3.5" /> Computerized Lucky Draw System
                  </div>
                  <h4 className="text-2xl sm:text-3xl font-black text-amber-300">
                    Grand Lucky Draw Winner Selection
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 mb-4">
                    All eligible customer tokens from orders exceeding Rs. 5,000 are registered in this database. Select a prize and run the randomized transparent winner draw.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                    <select
                      value={selectedPrizeToDraw}
                      onChange={(e) => setSelectedPrizeToDraw(e.target.value)}
                      className="bg-white/10 text-white border border-white/20 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:bg-slate-900"
                    >
                      <option value="Honda CD70 Motorcycle - 1st Grand Prize">
                        1st Grand Prize: Honda CD70 Motorcycle
                      </option>
                      <option value="50-Inch 4K Smart LED TV - 2nd Grand Prize">
                        2nd Grand Prize: 50" 4K Smart LED TV
                      </option>
                      <option value="Electric Rotisserie Baking Oven - 3rd Grand Prize">
                        3rd Grand Prize: Electric Rotisserie Oven
                      </option>
                      <option value="4-in-1 Juicer Blender Machine - Consolation">
                        Consolation: 4-in-1 Juicer Blender
                      </option>
                      <option value="Heavy Duty Electric Iron - Consolation">
                        Consolation: Heavy Duty Electric Iron
                      </option>
                      <option value="Pedestal Fan & Gift Pack - Consolation">
                        Consolation: Pedestal Fan & Hamper
                      </option>
                    </select>

                    <button
                      onClick={handleDrawWinner}
                      disabled={isDrawing || allQurandaziEntries.length === 0}
                      className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg transition flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                    >
                      {isDrawing ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                          <span>Drawing Winner...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Draw Lucky Winner</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Winner Card Presentation */}
                {drawnWinner && (
                  <div className="mt-6 bg-white text-slate-900 rounded-2xl p-5 border-2 border-amber-400 shadow-2xl animate-fade-in">
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-2.5 py-1 rounded-full uppercase">
                        🎉 OFFICIAL WINNER ANNOUNCED!
                      </span>
                      <span className="text-xs font-bold text-emerald-800">{drawnWinner.prize}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-2 text-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Winning Token Number</span>
                        <span className="text-lg font-black text-amber-600 font-mono">{drawnWinner.ticket}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Customer Full Name</span>
                        <span className="text-base font-bold text-slate-900">{drawnWinner.customerName}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Registered Mobile</span>
                        <span className="text-base font-bold text-emerald-800 font-mono">{drawnWinner.phone}</span>
                      </div>
                    </div>

                    <div className="text-right pt-2">
                      <a
                        href={`https://wa.me/${drawnWinner.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `Congratulations Mr./Ms. ${drawnWinner.customerName}! You have won the ${drawnWinner.prize} in the KAAF Cash & Carry Grand Lucky Draw with Token #${drawnWinner.ticket}! Please visit our Jinnah Garden Branch (0333-8951378) to claim your prize.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send WhatsApp Winner Notification</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* All Eligible Tickets Table */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4">
                <h5 className="font-bold text-sm text-slate-900 mb-3 flex items-center justify-between">
                  <span>Registered Lucky Draw Entries Database</span>
                  <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                    Total Tokens: {allQurandaziEntries.length}
                  </span>
                </h5>

                {allQurandaziEntries.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">
                    No qualifying orders (Rs. 5,000+) placed yet. Tokens will automatically generate upon order completion.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto">
                    {allQurandaziEntries.map((entry, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex justify-between items-center">
                        <div>
                          <div className="font-black font-mono text-emerald-800">{entry.ticket}</div>
                          <div className="text-slate-700 font-semibold">{entry.customerName} ({entry.customerPhone})</div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block">#{entry.orderNumber}</span>
                          <span className="font-bold text-slate-900">{formatPKR(entry.amount)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 5: FLASH SALES & PUSH ALERTS */}
          {activeTab === 'notifications' && (
            <div className="max-w-2xl bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
              <div>
                <h4 className="font-black text-base text-slate-900">
                  Broadcast Flash Sales & Push Notifications
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Publish instant discount announcements to all shopper devices and screens.
                </p>
              </div>

              <form onSubmit={handleBroadcastNotification} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Alert Title</label>
                  <input
                    type="text"
                    required
                    value={notifTitle}
                    onChange={(e) => setNotifTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Badge Text</label>
                  <input
                    type="text"
                    required
                    value={notifBadge}
                    onChange={(e) => setNotifBadge(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Message Details</label>
                  <textarea
                    rows={3}
                    required
                    value={notifMsg}
                    onChange={(e) => setNotifMsg(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-xs transition"
                >
                  <Bell className="w-4 h-4" />
                  <span>Broadcast Flash Sale Notification</span>
                </button>
              </form>
            </div>
          )}

        </div>

      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-extrabold text-base text-slate-900">Edit Product Pricing & Stock</h4>
              <button onClick={() => setEditingProduct(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProductEdit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Product Name</label>
                <input
                  type="text"
                  disabled
                  value={editingProduct.name}
                  className="w-full px-3 py-2 bg-slate-100 rounded-xl border border-slate-200 text-slate-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Original Price (PKR)</label>
                  <input
                    type="number"
                    value={editingProduct.originalPrice}
                    onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Discount Price (PKR)</label>
                  <input
                    type="number"
                    value={editingProduct.discountedPrice}
                    onChange={(e) => setEditingProduct({ ...editingProduct, discountedPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 font-bold text-emerald-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Stock Count</label>
                  <input
                    type="number"
                    value={editingProduct.stockCount}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stockCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Status</label>
                  <select
                    value={editingProduct.inStock ? 'true' : 'false'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, inStock: e.target.value === 'true' })}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 font-bold"
                  >
                    <option value="true">In Stock</option>
                    <option value="false">Out of Stock</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs transition"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Product Modal */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-extrabold text-base text-slate-900">Add New Product to Supermarket</h4>
              <button onClick={() => setIsAddProductOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. National Biryani Mix"
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Brand Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. National, Dalda, Tapal"
                    value={newProdBrand}
                    onChange={(e) => setNewProdBrand(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Category</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200"
                  >
                    {CATEGORIES.filter(c => c !== 'All Products' && c !== 'Pamphlet Specials').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Unit / Pack Size</label>
                  <input
                    type="text"
                    placeholder="e.g. 500 G, 1 KG, 1.5 L"
                    value={newProdUnit}
                    onChange={(e) => setNewProdUnit(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Original Price (PKR)</label>
                  <input
                    type="number"
                    required
                    value={newProdOrigPrice}
                    onChange={(e) => setNewProdOrigPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Discount Price (PKR)</label>
                  <input
                    type="number"
                    required
                    value={newProdDiscPrice}
                    onChange={(e) => setNewProdDiscPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 font-bold text-emerald-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Initial Stock</label>
                  <input
                    type="number"
                    required
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProdIsPamphlet}
                    onChange={(e) => setNewProdIsPamphlet(e.target.checked)}
                    className="rounded text-emerald-700 focus:ring-emerald-600"
                  />
                  <span className="font-semibold text-slate-700">Display this product in Pamphlet Specials</span>
                </label>
              </div>

              <div className="pt-4 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs transition"
                >
                  Add Product to Catalog
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2.5 bg-slate-200 text-slate-700 rounded-xl font-bold text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
