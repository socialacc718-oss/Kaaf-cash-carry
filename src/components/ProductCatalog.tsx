import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ShoppingBag, 
  Plus, 
  Minus, 
  SlidersHorizontal,
  Sparkles,
  X,
  RotateCcw,
  Check,
  Tag,
  ArrowUpDown,
  Flame,
  Clock
} from 'lucide-react';
import { Product, CartItem, SortOption, FilterState } from '../types';
import { CATEGORIES, BRANDS } from '../data/products';
import { formatPKR } from '../utils/helpers';

interface ProductCatalogProps {
  products: Product[];
  cartItems: CartItem[];
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  cartItems,
  onAddToCart,
  onUpdateQuantity,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory
}) => {
  // Advanced filters state
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(4500);
  const [onlyPamphlet, setOnlyPamphlet] = useState<boolean>(false);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [showFilterDrawer, setShowFilterDrawer] = useState<boolean>(false);
  const [brandSearchInput, setBrandSearchInput] = useState<string>('');

  const getItemQuantity = (productId: string): number => {
    const item = (cartItems || []).find(i => i?.product?.id === productId);
    return item ? (item.quantity || 0) : 0;
  };

  // Toggle brand selection
  const handleToggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  // Clear all filters
  const handleResetFilters = () => {
    onSearchChange('');
    onSelectCategory('All Products');
    setSelectedBrands([]);
    setMinPrice(0);
    setMaxPrice(4500);
    setOnlyPamphlet(false);
    setOnlyInStock(false);
    setSortBy('featured');
  };

  // Active filter count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'All Products') count++;
    if (searchQuery.trim()) count++;
    if (selectedBrands.length > 0) count += selectedBrands.length;
    if (minPrice > 0 || maxPrice < 4500) count++;
    if (onlyPamphlet) count++;
    if (onlyInStock) count++;
    return count;
  }, [selectedCategory, searchQuery, selectedBrands, minPrice, maxPrice, onlyPamphlet, onlyInStock]);

  // Available brands in the catalog
  const availableBrands = useMemo(() => {
    const bSet = new Set(
      products
        .map(p => p?.brand)
        .filter((b): b is string => Boolean(b && typeof b === 'string' && b.trim().length > 0))
    );
    return Array.from(bSet).sort();
  }, [products]);

  // Filtered brands for the brand search input
  const filteredBrandList = useMemo(() => {
    const search = (brandSearchInput || '').trim().toLowerCase();
    if (!search) return availableBrands;
    return availableBrands.filter(b => b && typeof b === 'string' && b.toLowerCase().includes(search));
  }, [availableBrands, brandSearchInput]);

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      if (!product) return false;

      // 1. Search Query
      const rawSearch = (searchQuery || '').trim();
      if (rawSearch) {
        const query = rawSearch.toLowerCase();
        const matchesName = product.name ? product.name.toLowerCase().includes(query) : false;
        const matchesBrand = product.brand ? product.brand.toLowerCase().includes(query) : false;
        const matchesCategory = product.category ? product.category.toLowerCase().includes(query) : false;
        const matchesDesc = product.description ? product.description.toLowerCase().includes(query) : false;
        const matchesUrdu = product.nameUrdu ? product.nameUrdu.includes(rawSearch) : false;
        if (!matchesName && !matchesBrand && !matchesCategory && !matchesDesc && !matchesUrdu) {
          return false;
        }
      }

      // 2. Category
      if (selectedCategory !== 'All Products') {
        if (selectedCategory === 'Pamphlet Specials') {
          if (!product.isPamphletDeal) return false;
        } else if (product.category !== selectedCategory) {
          return false;
        }
      }

      // 3. Brands
      if (selectedBrands.length > 0) {
        if (!product.brand || !selectedBrands.includes(product.brand)) {
          return false;
        }
      }

      // 4. Price range
      if (product.discountedPrice < minPrice || product.discountedPrice > maxPrice) {
        return false;
      }

      // 5. Only Pamphlet Deals
      if (onlyPamphlet && !product.isPamphletDeal) {
        return false;
      }

      // 6. Only in stock
      if (onlyInStock && (!product.inStock || product.stockCount <= 0)) {
        return false;
      }

      return true;
    });
  }, [products, searchQuery, selectedCategory, selectedBrands, minPrice, maxPrice, onlyPamphlet, onlyInStock]);

  // Sorting
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortBy) {
      case 'price-asc':
        return list.sort((a, b) => a.discountedPrice - b.discountedPrice);
      case 'price-desc':
        return list.sort((a, b) => b.discountedPrice - a.discountedPrice);
      case 'popularity':
        return list.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
      case 'newest':
        return list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      case 'discount':
        return list.sort((a, b) => {
          const discA = a.originalPrice - a.discountedPrice;
          const discB = b.originalPrice - b.discountedPrice;
          return discB - discA;
        });
      case 'featured':
      default:
        return list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
  }, [filteredProducts, sortBy]);

  return (
    <section id="all-products" className="py-6 sm:py-12 px-2.5 sm:px-4 max-w-7xl mx-auto w-full max-w-full overflow-hidden">
      
      {/* Title & Top Toolbar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 min-w-0">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs uppercase tracking-wider mb-1">
            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="truncate">Complete Supermarket</span>
          </div>
          <h3 className="text-lg sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
            Browse All Products & Essentials
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Cooking oils, basmati rice, lentils, teas, baby formula, diapers, and cleaning supplies at guaranteed wholesale rates.
          </p>
        </div>

        {/* Action Buttons: Filter Drawer Trigger & Sort Dropdown */}
        <div className="flex items-center gap-2 self-start md:self-auto text-xs flex-wrap max-w-full">
          
          {/* Mobile / Tablet Filter Button */}
          <button
            onClick={() => setShowFilterDrawer(true)}
            className="lg:hidden flex items-center gap-1.5 px-2.5 py-1.5 sm:py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 shadow-xs shrink-0"
          >
            <Filter className="w-3.5 h-3.5 text-emerald-700" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-emerald-700 text-white text-[10px] flex items-center justify-center font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-2 sm:px-3 py-1.5 shadow-xs max-w-full">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-500 font-medium hidden sm:inline shrink-0">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer text-xs max-w-[130px] sm:max-w-none truncate"
            >
              <option value="featured">Featured (Recommended)</option>
              <option value="popularity">Popularity (Best Sellers)</option>
              <option value="newest">Newest Arrivals</option>
              <option value="discount">Biggest Discount (% Off)</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills Slider */}
      <div className="w-full max-w-full overflow-x-auto no-scrollbar pb-2 mb-4 sm:mb-6">
        <div className="flex items-center gap-1.5 sm:gap-2 w-max">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 shadow-xs shrink-0 ${
                  isActive
                    ? 'bg-emerald-800 text-white shadow-emerald-800/20'
                    : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat === 'Pamphlet Specials' && <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
                <span>{cat}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Filter Chips Bar */}
      {activeFiltersCount > 0 && (
        <div className="mb-6 p-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-bold text-emerald-900">Active Filters:</span>
            
            {searchQuery && (
              <span className="bg-white border border-emerald-300 text-emerald-900 px-2.5 py-0.5 rounded-lg flex items-center gap-1 font-semibold">
                Keyword: "{searchQuery}"
                <button onClick={() => onSearchChange('')} className="hover:text-red-500">✕</button>
              </span>
            )}

            {selectedCategory !== 'All Products' && (
              <span className="bg-white border border-emerald-300 text-emerald-900 px-2.5 py-0.5 rounded-lg flex items-center gap-1 font-semibold">
                Category: {selectedCategory}
                <button onClick={() => onSelectCategory('All Products')} className="hover:text-red-500">✕</button>
              </span>
            )}

            {selectedBrands.map(b => (
              <span key={b} className="bg-white border border-emerald-300 text-emerald-900 px-2.5 py-0.5 rounded-lg flex items-center gap-1 font-semibold">
                Brand: {b}
                <button onClick={() => handleToggleBrand(b)} className="hover:text-red-500">✕</button>
              </span>
            ))}

            {(minPrice > 0 || maxPrice < 4500) && (
              <span className="bg-white border border-emerald-300 text-emerald-900 px-2.5 py-0.5 rounded-lg flex items-center gap-1 font-semibold">
                Price: Rs.{minPrice} - Rs.{maxPrice}
                <button onClick={() => { setMinPrice(0); setMaxPrice(4500); }} className="hover:text-red-500">✕</button>
              </span>
            )}

            {onlyPamphlet && (
              <span className="bg-white border border-emerald-300 text-emerald-900 px-2.5 py-0.5 rounded-lg flex items-center gap-1 font-semibold">
                Pamphlet Deals
                <button onClick={() => setOnlyPamphlet(false)} className="hover:text-red-500">✕</button>
              </span>
            )}

            {onlyInStock && (
              <span className="bg-white border border-emerald-300 text-emerald-900 px-2.5 py-0.5 rounded-lg flex items-center gap-1 font-semibold">
                In Stock Only
                <button onClick={() => setOnlyInStock(false)} className="hover:text-red-500">✕</button>
              </span>
            )}
          </div>

          <button
            onClick={handleResetFilters}
            className="text-red-600 hover:text-red-700 font-bold flex items-center gap-1 hover:underline text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        </div>
      )}

      {/* Main Layout: Desktop Sidebar Filters + Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* DESKTOP FILTER SIDEBAR */}
        <aside className="hidden lg:block bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-6 sticky top-28">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
              <span>Filters & Refinements</span>
            </h4>
            {activeFiltersCount > 0 && (
              <button
                onClick={handleResetFilters}
                className="text-[11px] text-red-600 font-bold hover:underline"
              >
                Reset
              </button>
            )}
          </div>

          {/* Quick Checkboxes */}
          <div className="space-y-2.5 text-xs font-semibold text-slate-700">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyPamphlet}
                onChange={(e) => setOnlyPamphlet(e.target.checked)}
                className="rounded text-emerald-700 focus:ring-emerald-600"
              />
              <span>Pamphlet Deals Only</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="rounded text-emerald-700 focus:ring-emerald-600"
              />
              <span>In Stock Items Only</span>
            </label>
          </div>

          {/* Price Range Filter */}
          <div className="pt-3 border-t border-slate-100">
            <label className="block text-xs font-extrabold text-slate-900 mb-2">
              Price Range (PKR)
            </label>
            <div className="flex items-center gap-2 mb-2 text-xs">
              <input
                type="number"
                min={0}
                max={maxPrice}
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                placeholder="Min"
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-center font-bold"
              />
              <span className="text-slate-400 font-bold">-</span>
              <input
                type="number"
                min={minPrice}
                max={5000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                placeholder="Max"
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-center font-bold"
              />
            </div>
            <input
              type="range"
              min={0}
              max={4500}
              step={50}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-emerald-700 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>Rs. 0</span>
              <span>Rs. 4,500+</span>
            </div>
          </div>

          {/* Brands Filter */}
          <div className="pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-extrabold text-slate-900">
                Filter by Brand
              </label>
              {selectedBrands.length > 0 && (
                <button
                  onClick={() => setSelectedBrands([])}
                  className="text-[10px] text-slate-400 hover:text-red-500"
                >
                  Clear ({selectedBrands.length})
                </button>
              )}
            </div>

            {/* Brand search filter */}
            <div className="relative mb-2">
              <input
                type="text"
                placeholder="Find brand..."
                value={brandSearchInput}
                onChange={(e) => setBrandSearchInput(e.target.value)}
                className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px]"
              />
            </div>

            {/* Brand checkbox list */}
            <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1 text-xs">
              {filteredBrandList.map((brand) => {
                const isChecked = selectedBrands.includes(brand);
                const count = products.filter(p => p.brand === brand).length;

                return (
                  <label
                    key={brand}
                    className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleBrand(brand)}
                        className="rounded text-emerald-700 focus:ring-emerald-600"
                      />
                      <span className={isChecked ? 'font-bold text-emerald-950' : 'text-slate-700'}>
                        {brand}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">({count})</span>
                  </label>
                );
              })}
            </div>
          </div>

        </aside>

        {/* PRODUCTS GRID (3 COLUMNS ON DESKTOP) */}
        <div className="lg:col-span-3">
          
          {/* Results summary header */}
          <div className="flex items-center justify-between mb-4 text-xs text-slate-500 font-medium">
            <span>
              Showing <strong className="text-slate-900">{sortedProducts.length}</strong> of {products.length} products
            </span>
          </div>

          {sortedProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Search className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-800">No Products Found</h4>
              <p className="text-xs text-slate-500 mt-1 mb-4 max-w-sm mx-auto">
                No items match your active search and filter criteria. Try adjusting your brand or price filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-xs"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-4 w-full max-w-full">
              {sortedProducts.map((product) => {
                const quantity = getItemQuantity(product.id);
                const savings = product.originalPrice - product.discountedPrice;

                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-xl sm:rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden group hover:border-emerald-600/40 min-w-0 w-full"
                  >
                    {/* Image & Badges */}
                    <div className="relative h-36 sm:h-48 bg-slate-50 overflow-hidden w-full">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      
                      {/* Pamphlet Deal tag */}
                      {product.isPamphletDeal && (
                        <div className="absolute top-1.5 left-1.5 bg-red-600 text-white text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded-md shadow-xs">
                          Pamphlet Deal
                        </div>
                      )}

                      {/* Savings tag */}
                      {savings > 0 && (
                        <div className="absolute top-1.5 right-1.5 bg-amber-400 text-slate-950 text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-xs">
                          Save Rs.{savings}
                        </div>
                      )}

                      {/* Brand & Unit Pill */}
                      <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 max-w-[90%] flex-wrap">
                        <span className="bg-black/75 backdrop-blur-xs text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded truncate max-w-[70px] sm:max-w-none">
                          {product.brand}
                        </span>
                        <span className="bg-emerald-950/80 backdrop-blur-xs text-emerald-200 text-[9px] sm:text-[10px] font-medium px-1.5 py-0.5 rounded">
                          {product.unit}
                        </span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between min-w-0">
                      <div className="min-w-0">
                        <div className="text-[9px] sm:text-[10px] text-slate-400 font-semibold uppercase truncate">
                          {product.category}
                        </div>
                        <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm line-clamp-1 group-hover:text-emerald-700 transition">
                          {product.name}
                        </h4>
                        <div className="text-[10px] sm:text-[11px] text-slate-400 line-clamp-1 mb-1.5 font-serif">
                          {product.nameUrdu}
                        </div>

                        {/* Price */}
                        <div className="flex flex-wrap items-baseline gap-1 sm:gap-1.5 mb-2">
                          <span className="text-sm sm:text-lg font-black text-slate-900">
                            {formatPKR(product.discountedPrice)}
                          </span>
                          {savings > 0 && (
                            <span className="text-[10px] sm:text-xs text-slate-400 line-through">
                              Rs.{product.originalPrice}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity Stepper / Add button */}
                      <div className="pt-2 border-t border-slate-100">
                        {quantity === 0 ? (
                          <button
                            onClick={() => onAddToCart(product)}
                            disabled={!product.inStock}
                            className={`w-full py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg sm:rounded-xl font-bold text-xs flex items-center justify-center gap-1 sm:gap-1.5 transition ${
                              product.inStock
                                ? 'bg-slate-900 hover:bg-emerald-700 text-white active:scale-95 shadow-xs'
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            }`}
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>{product.inStock ? 'Add to Cart' : 'Sold Out'}</span>
                          </button>
                        ) : (
                          <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg sm:rounded-xl p-0.5">
                            <button
                              onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                              className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-white text-emerald-800 shadow-xs flex items-center justify-center hover:bg-emerald-100 font-bold active:scale-90 transition shrink-0"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="font-black text-emerald-950 text-xs px-1 truncate">
                              {quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                              className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-emerald-700 text-white shadow-xs flex items-center justify-center hover:bg-emerald-800 font-bold active:scale-90 transition shrink-0"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}

                        <div className="mt-1 text-center">
                          <span className="text-[9px] sm:text-[10px] text-slate-400">
                            {product.stockCount > 0 ? `Stock: ${product.stockCount}` : 'Out of Stock'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

      {/* MOBILE FILTER MODAL DRAWER */}
      {showFilterDrawer && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs" onClick={() => setShowFilterDrawer(false)} />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-sm bg-white shadow-2xl flex flex-col justify-between p-5 overflow-y-auto">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h4 className="font-black text-slate-900 text-base flex items-center gap-2">
                  <Filter className="w-4 h-4 text-emerald-700" />
                  <span>Filter Products</span>
                </h4>
                <button onClick={() => setShowFilterDrawer(false)} className="p-1 text-slate-400 hover:text-slate-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Filter Options */}
              <div className="space-y-5 my-4">
                
                {/* Pamphlet & Stock check */}
                <div className="space-y-2 text-xs font-semibold">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={onlyPamphlet}
                      onChange={(e) => setOnlyPamphlet(e.target.checked)}
                      className="rounded text-emerald-700"
                    />
                    <span>Only Pamphlet Specials</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={onlyInStock}
                      onChange={(e) => setOnlyInStock(e.target.checked)}
                      className="rounded text-emerald-700"
                    />
                    <span>In Stock Only</span>
                  </label>
                </div>

                {/* Price range */}
                <div className="pt-3 border-t border-slate-100">
                  <label className="block text-xs font-bold text-slate-900 mb-2">Max Price: Rs. {maxPrice}</label>
                  <input
                    type="range"
                    min={0}
                    max={4500}
                    step={50}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-emerald-700"
                  />
                </div>

                {/* Brands */}
                <div className="pt-3 border-t border-slate-100">
                  <label className="block text-xs font-bold text-slate-900 mb-2">Brands</label>
                  <div className="space-y-1 max-h-48 overflow-y-auto text-xs">
                    {availableBrands.map(b => (
                      <label key={b} className="flex items-center gap-2 p-1">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(b)}
                          onChange={() => handleToggleBrand(b)}
                          className="rounded text-emerald-700"
                        />
                        <span>{b}</span>
                      </label>
                    ))}
                  </div>
                </div>

              </div>

              {/* Drawer Footer Buttons */}
              <div className="pt-3 border-t border-slate-100 flex gap-2">
                <button
                  onClick={() => setShowFilterDrawer(false)}
                  className="flex-1 py-3 bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs"
                >
                  Apply Filters ({sortedProducts.length} Results)
                </button>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs"
                >
                  Reset
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </section>
  );
};
