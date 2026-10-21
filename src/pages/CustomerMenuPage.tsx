import React, { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, X, Sparkles, Utensils, Leaf, ShieldCheck } from 'lucide-react'
import { MENU_CATEGORIES, MENU_ITEMS, RESTAURANT_INFO } from '../data/menuData'
import type { MenuCategory, MenuItem } from '../types'
import { useCart } from '../context/CartContext'
import { CustomerHeader } from '../components/customer/CustomerHeader'
import { CategoryNav } from '../components/customer/CategoryNav'
import { FoodCard } from '../components/customer/FoodCard'
import { StickyCartBar } from '../components/customer/StickyCartBar'
import { CartDrawer } from '../components/customer/CartDrawer'
import { getTableSeatingGroup, STORAGE_CHANGE_EVENT } from '../services/storageService'

const QUICK_FILTERS = [
  { id: 'all', label: 'All Dishes' },
  { id: 'signature', label: '⭐ Chef Signatures' },
  { id: 'jain', label: '🌿 100% Jain' },
  { id: 'spicy', label: '🌶️ Spicy Curries' },
  { id: 'desserts', label: '🍨 Sweets & Ice Cream' },
]

export const CustomerMenuPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const tableParam = searchParams.get('table') || '07'
  const tableNumber = tableParam.padStart(2, '0')

  const {
    addItem,
    updateQuantity,
    getItemQuantity,
    totalCount,
    subtotal,
    setIsCartOpen,
  } = useCart()

  const [activeCategory, setActiveCategory] = useState<MenuCategory | 'All'>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeQuickFilter, setActiveQuickFilter] = useState('all')
  const [seatingGroup, setSeatingGroup] = useState(() => getTableSeatingGroup(tableNumber))

  // Listen to storage events to reflect table combination changes immediately
  useEffect(() => {
    const checkGroup = () => {
      setSeatingGroup(getTableSeatingGroup(tableNumber))
    }
    window.addEventListener(STORAGE_CHANGE_EVENT, checkGroup)
    window.addEventListener('storage', checkGroup)
    return () => {
      window.removeEventListener(STORAGE_CHANGE_EVENT, checkGroup)
      window.removeEventListener('storage', checkGroup)
    }
  }, [tableNumber])

  // Count items per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    MENU_CATEGORIES.forEach(cat => {
      counts[cat] = MENU_ITEMS.filter(item => item.category === cat).length
    })
    return counts
  }, [])

  // Handle search input
  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    if (query.trim() && activeCategory !== 'All') {
      setActiveCategory('All')
    }
    if (query.trim() && activeQuickFilter !== 'all') {
      setActiveQuickFilter('all')
    }
  }

  // Filtered menu items
  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter(item => {
      // Category filter
      if (activeCategory !== 'All' && item.category !== activeCategory) {
        return false
      }

      // Quick filter
      if (activeQuickFilter === 'signature' && !item.badge?.toLowerCase().includes('chef') && !item.badge?.toLowerCase().includes('signature') && !item.badge?.toLowerCase().includes('bestseller') && !item.badge?.toLowerCase().includes('popular')) {
        return false
      }
      if (activeQuickFilter === 'jain' && !item.isJain && item.category !== 'Jain Sabji') {
        return false
      }
      if (activeQuickFilter === 'spicy' && !item.isSpicy) {
        return false
      }
      if (activeQuickFilter === 'desserts' && item.category !== 'Desserts' && item.category !== 'Ice Cream') {
        return false
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const matchName = item.name.toLowerCase().includes(query)
        const matchSub = (item.subCategory || '').toLowerCase().includes(query)
        const matchDesc = item.description.toLowerCase().includes(query)
        const matchCat = item.category.toLowerCase().includes(query)
        if (!matchName && !matchSub && !matchDesc && !matchCat) return false
      }
      return true
    })
  }, [activeCategory, activeQuickFilter, searchQuery])

  // Group filtered items by category if "All" is active, no search query, and no specific quick filter
  const groupedItems = useMemo(() => {
    if (activeCategory !== 'All' || searchQuery.trim() || activeQuickFilter !== 'all') {
      return null
    }
    const map = new Map<MenuCategory, MenuItem[]>()
    MENU_CATEGORIES.forEach(cat => {
      const itemsInCat = filteredItems.filter(i => i.category === cat)
      if (itemsInCat.length > 0) {
        map.set(cat, itemsInCat)
      }
    })
    return map
  }, [activeCategory, activeQuickFilter, searchQuery, filteredItems])

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E1B18] flex flex-col pb-28">
      {/* Header */}
      <CustomerHeader
        tableNumber={tableNumber}
        seatingGroup={seatingGroup}
        cartCount={totalCount}
        onCartClick={() => setIsCartOpen(true)}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#FFFDF9] to-[#FAF7F2] border-b border-[#EAE2D5] py-5 px-4 shadow-2xs">
        <div className="max-w-4xl mx-auto space-y-3.5">
          {seatingGroup && seatingGroup.active && (
            <div className="p-3 rounded-2xl bg-[#8E2818]/10 border border-[#8E2818]/20 text-[#8E2818] flex items-center gap-2.5 text-xs font-semibold">
              <Sparkles className="w-4 h-4 shrink-0 text-[#8E2818]" />
              <span>
                <strong>Combined Seating Active:</strong> Your table is linked with <strong>Group G12 ({seatingGroup.name})</strong>. Food will be prepared and served together.
              </span>
            </div>
          )}

          {/* Hero Branding Headline */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#8C7662] font-semibold mb-1">
                <span className="flex items-center gap-1 text-[#2E7D32] bg-[#E8F5E9] px-2.5 py-0.5 rounded-full border border-[#C8E6C9]">
                  <Leaf className="w-3 h-3" />
                  100% Pure Vegetarian
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1 text-[#8E2818] bg-[#8E2818]/10 px-2 py-0.5 rounded-full border border-[#8E2818]/20">
                  <ShieldCheck className="w-3 h-3" />
                  Jain Food Available
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#1E1B18] tracking-tight">
                {RESTAURANT_INFO.name}
              </h2>
              <p className="text-xs sm:text-sm text-[#6E5C4E] mt-1 max-w-xl">
                {RESTAURANT_INFO.tagline}. Fresh ingredients, authentic clay-tandoor flatbreads, homestyle Gujarati shaak, and North Indian curries.
              </p>
            </div>

            {/* Table Badge on Hero */}
            <div className="shrink-0 bg-white border border-[#E3D9CC] rounded-2xl p-2.5 px-4 shadow-xs flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#8E2818]/10 text-[#8E2818] flex items-center justify-center font-bold">
                <Utensils className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-[#8C7662]">Current Table</div>
                <div className="font-serif text-base font-bold text-[#1E1B18]">Table {tableNumber}</div>
              </div>
            </div>
          </div>

          {/* Modern Search Field */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#8C7662] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => handleSearchChange(e.target.value)}
              placeholder="Search dishes (paneer tikka, soup, chaas, dal makhani, undhiyu, naan, biryani, ice cream)..."
              className="w-full pl-10 pr-9 py-2.5 rounded-2xl text-xs sm:text-sm bg-white border border-[#DCD1C2] focus:outline-none focus:ring-2 focus:ring-[#8E2818]/20 focus:border-[#8E2818] text-[#1E1B18] placeholder:text-[#9A8675] shadow-xs transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                aria-label="Clear search query"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C7662] hover:text-[#1E1B18] p-0.5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
            {QUICK_FILTERS.map(qf => (
              <button
                key={qf.id}
                onClick={() => {
                  setActiveQuickFilter(qf.id)
                  if (activeCategory !== 'All') setActiveCategory('All')
                }}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer border ${
                  activeQuickFilter === qf.id
                    ? 'bg-[#1E1B18] text-white border-[#1E1B18] shadow-xs'
                    : 'bg-white hover:bg-[#F6EFE5] text-[#5A4D43] border-[#E0D7C9]'
                }`}
              >
                {qf.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Sticky Categories Navigation */}
      <CategoryNav
        activeCategory={activeCategory}
        onSelectCategory={cat => {
          setActiveCategory(cat)
          if (activeQuickFilter !== 'all') setActiveQuickFilter('all')
          if (searchQuery) setSearchQuery('')
        }}
        categoryCounts={categoryCounts}
      />

      {/* Main Food Menu Grid */}
      <main className="max-w-4xl mx-auto px-4 pt-6 flex-1 w-full">
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white rounded-3xl border border-[#EAE2D5] shadow-xs my-6">
            <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-[#8E2818]/10 text-[#8E2818] flex items-center justify-center">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#1E1B18] mb-1">
              No dishes found
            </h3>
            <p className="text-xs sm:text-sm text-[#7D6B5C] max-w-sm mx-auto mb-4">
              We couldn't find any dishes matching "{searchQuery || activeQuickFilter}". Try searching for Paneer, Soup, Biryani, or Naan.
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setActiveCategory('All')
                setActiveQuickFilter('all')
              }}
              className="text-xs font-bold px-4 py-2 bg-[#8E2818] text-white rounded-xl shadow-xs hover:bg-[#782012] cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : groupedItems ? (
          /* Render by Category Sections when "All" is active */
          <div className="space-y-10">
            {Array.from(groupedItems.entries()).map(([category, items]) => (
              <section key={category} id={category.replace(/\s+/g, '-').toLowerCase()} className="space-y-4">
                <div className="flex items-baseline justify-between border-b border-[#E8DFC8] pb-2">
                  <div className="flex items-center gap-2">
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1E1B18] tracking-tight">
                      {category}
                    </h2>
                    <span className="text-xs text-[#8C7662] font-semibold bg-[#EFE8DD] px-2 py-0.5 rounded-full">
                      {items.length} dishes
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveCategory(category)}
                    className="text-xs text-[#8E2818] font-semibold hover:underline cursor-pointer"
                  >
                    View Only &rarr;
                  </button>
                </div>

                {/* Big Image Grid: 1 col on mobile, 2 cols on tablet/desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                  {items.map(item => (
                    <FoodCard
                      key={item.id}
                      item={item}
                      quantity={getItemQuantity(item.id)}
                      onAdd={() => addItem(item)}
                      onUpdateQuantity={qty => updateQuantity(item.id, qty)}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          /* Flat Grid for filtered or specific category view */
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2">
              <div className="text-sm font-bold text-[#6B5A4D]">
                Showing {filteredItems.length} {filteredItems.length === 1 ? 'dish' : 'dishes'}
                {activeCategory !== 'All' && <span> in <strong className="text-[#1E1B18]">{activeCategory}</strong></span>}
                {activeQuickFilter !== 'all' && <span> &bull; Filter: {activeQuickFilter}</span>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              {filteredItems.map(item => (
                <FoodCard
                  key={item.id}
                  item={item}
                  quantity={getItemQuantity(item.id)}
                  onAdd={() => addItem(item)}
                  onUpdateQuantity={qty => updateQuantity(item.id, qty)}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Sticky Bottom Cart Bar */}
      <StickyCartBar
        itemCount={totalCount}
        subtotal={subtotal}
        onClick={() => setIsCartOpen(true)}
      />

      {/* Cart Drawer */}
      <CartDrawer
        tableNumber={tableNumber}
        seatingGroup={seatingGroup}
      />
    </div>
  )
}
