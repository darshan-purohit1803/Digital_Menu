import React from 'react'
import { ShoppingBag, Sparkles } from 'lucide-react'
import type { SeatingGroup } from '../../types'
import { FoodLogo } from '../common/FoodLogo'

interface CustomerHeaderProps {
  tableNumber: string
  seatingGroup?: SeatingGroup | null
  cartCount: number
  onCartClick: () => void
}

export const CustomerHeader: React.FC<CustomerHeaderProps> = ({
  tableNumber,
  seatingGroup,
  cartCount,
  onCartClick,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EAE2D5] transition-all">
      <div className="max-w-4xl mx-auto px-4 py-2.5 sm:py-3 flex items-center justify-between gap-3">
        {/* Restaurant Brand & Table Badge */}
        <div className="flex items-center gap-3 min-w-0">
          <FoodLogo size="md" />

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#1E1B18] truncate">
                XYZ Restaurant
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded-full border border-[#C8E6C9]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]" />
                100% Pure Veg
              </span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {seatingGroup && seatingGroup.active ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#8E2818] bg-[#8E2818]/10 px-2 py-0.5 rounded-full border border-[#8E2818]/20">
                  <Sparkles className="w-3 h-3" />
                  Table {tableNumber} (Group G12 &bull; {seatingGroup.name})
                </span>
              ) : (
                <span className="inline-flex items-center text-[11px] font-semibold text-[#5A4D43] bg-[#EFE8DD] px-2.5 py-0.5 rounded-full">
                  Table {tableNumber}
                </span>
              )}
              <span className="text-[11px] text-[#8C7662] hidden xs:inline">&bull; Fine Dining & Authentic Tastes</span>
            </div>
          </div>
        </div>

        {/* Cart Button */}
        <button
          onClick={onCartClick}
          aria-label={`Shopping cart with ${cartCount} items`}
          className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#E0D7C9] hover:border-[#8E2818]/50 shadow-xs hover:shadow-sm text-[#1E1B18] transition-all cursor-pointer active:scale-95"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 text-[#8E2818]" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#8E2818] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-in zoom-in-75 duration-150 shadow-xs">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </div>
          <span className="text-xs font-bold hidden xs:inline text-[#1E1B18]">
            Order
          </span>
        </button>
      </div>
    </header>
  )
}
