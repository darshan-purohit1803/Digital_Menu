import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { RotateCcw, ChevronDown, ChevronUp, ExternalLink, Utensils, LayoutDashboard } from 'lucide-react'
import { resetDemo } from '../../services/storageService'

export const PresenterBar: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isExpanded, setIsExpanded] = useState(false)
  const [resetSuccess, setResetSuccess] = useState(false)

  const currentPath = location.pathname
  const searchParams = new URLSearchParams(location.search)
  const currentTable = searchParams.get('table')

  const handleReset = () => {
    if (window.confirm('Reset demo orders and table assignments to default XYZ Restaurant sample state?')) {
      resetDemo()
      setResetSuccess(true)
      setTimeout(() => setResetSuccess(false), 2000)
    }
  }

  return (
    <aside 
      aria-label="Presenter Demo Switcher" 
      className="fixed bottom-20 sm:bottom-3 right-3 z-50 print:hidden select-none"
    >
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#1C1917]/95 hover:bg-[#1C1917] text-white shadow-xl text-xs font-semibold backdrop-blur-md border border-white/10 transition-all cursor-pointer"
          title="Open restaurant demo controls"
        >
          <Utensils className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>Demo Controls</span>
          <ChevronUp className="w-3.5 h-3.5 text-stone-300" />
        </button>
      ) : (
        <div className="bg-[#1C1917] text-stone-200 rounded-2xl shadow-2xl border border-stone-800 p-4 w-76 backdrop-blur-lg animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-stone-800">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-100 tracking-wide font-serif">
              <Utensils className="w-4 h-4 text-[#8E2818]" />
              <span>XYZ Restaurant Demo</span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-stone-400 hover:text-white p-1 rounded-md cursor-pointer"
              aria-label="Collapse demo controls"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold px-1">
              Customer QR Menus
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => {
                  navigate('/menu?table=07')
                  setIsExpanded(false)
                }}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl font-medium transition-colors cursor-pointer ${
                  currentPath === '/menu' && currentTable === '07'
                    ? 'bg-[#8E2818] text-white font-semibold'
                    : 'bg-stone-800/80 hover:bg-stone-700 text-stone-200'
                }`}
              >
                <span>Table 07</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </button>
              <button
                onClick={() => {
                  navigate('/menu?table=08')
                  setIsExpanded(false)
                }}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl font-medium transition-colors cursor-pointer ${
                  currentPath === '/menu' && currentTable === '08'
                    ? 'bg-[#8E2818] text-white font-semibold'
                    : 'bg-stone-800/80 hover:bg-stone-700 text-stone-200'
                }`}
              >
                <span>Table 08</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </button>
            </div>

            <div className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold px-1 pt-1">
              Restaurant Staff & Kitchen
            </div>
            <button
              onClick={() => {
                navigate('/staff')
                setIsExpanded(false)
              }}
              className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-medium transition-colors cursor-pointer ${
                currentPath === '/staff'
                  ? 'bg-[#8E2818] text-white font-semibold'
                  : 'bg-stone-800/80 hover:bg-stone-700 text-stone-200'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Kitchen Display & Table Terminal</span>
            </button>

            <div className="pt-2 border-t border-stone-800 flex items-center justify-between">
              <span className="text-[10px] text-stone-400">Pure Veg Sales Demo</span>
              <button
                onClick={handleReset}
                className="flex items-center gap-1 text-[11px] text-stone-300 hover:text-white px-2 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 transition cursor-pointer"
                title="Reset sample orders and table groups"
              >
                <RotateCcw className={`w-3 h-3 ${resetSuccess ? 'text-emerald-400' : ''}`} />
                <span>{resetSuccess ? 'Reset Done!' : 'Reset Demo'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
