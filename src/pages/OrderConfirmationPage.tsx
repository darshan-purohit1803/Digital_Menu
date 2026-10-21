import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import {
  CheckCircle2,
  ArrowLeft,
  LayoutDashboard,
  BellRing,
  Sparkles,
  Info,
  ChefHat,
  Flame,
} from 'lucide-react'
import { getOrderById, STORAGE_CHANGE_EVENT } from '../services/storageService'
import type { Order, OrderStatus } from '../types'
import { VegIndicator } from '../components/common/VegIndicator'

const STATUS_STEPS: { key: OrderStatus; label: string; sublabel: string; icon: React.ElementType }[] = [
  { key: 'received', label: 'Order Received', sublabel: 'Queued in kitchen', icon: CheckCircle2 },
  { key: 'preparing', label: 'In Kitchen Cooking', sublabel: 'Freshly prepared by Chef', icon: Flame },
  { key: 'ready', label: 'Food Plated & Ready', sublabel: 'Awaiting table runner', icon: BellRing },
  { key: 'served', label: 'Served at Table', sublabel: 'Enjoy your meal!', icon: Sparkles },
]

export const OrderConfirmationPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const orderId = searchParams.get('orderId') || ''
  const tableParam = searchParams.get('table') || '07'

  const [order, setOrder] = useState<Order | undefined>(() => getOrderById(orderId))

  useEffect(() => {
    const handleUpdate = () => {
      setOrder(getOrderById(orderId))
    }
    window.addEventListener(STORAGE_CHANGE_EVENT, handleUpdate)
    window.addEventListener('storage', handleUpdate)
    return () => {
      window.removeEventListener(STORAGE_CHANGE_EVENT, handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [orderId])

  const getStepStatus = (stepKey: OrderStatus) => {
    if (!order) return 'upcoming'
    const stepOrder: OrderStatus[] = ['received', 'preparing', 'ready', 'served']
    const currentIndex = stepOrder.indexOf(order.status)
    const targetIndex = stepOrder.indexOf(stepKey)

    if (order.status === 'rejected') return 'rejected'
    if (currentIndex === targetIndex) return 'current'
    if (currentIndex > targetIndex) return 'completed'
    return 'upcoming'
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E1B18] flex flex-col py-8 px-4">
      <div className="max-w-xl mx-auto w-full space-y-6">
        {/* Navigation back */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(`/menu?table=${tableParam}`)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6E5C4E] hover:text-[#1E1B18] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to XYZ Restaurant Menu</span>
          </button>

          <Link
            to="/staff"
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-white border border-[#E0D7C9] text-[#8E2818] hover:bg-[#8E2818]/10 transition-colors shadow-2xs"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Open Kitchen Display</span>
          </Link>
        </div>

        {/* Confirmation Card */}
        <div className="bg-white rounded-3xl border border-[#EAE2D5] shadow-xs p-6 sm:p-8 space-y-6 text-center">
          {/* Success Icon & Header */}
          <div className="space-y-3">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#8E2818] to-[#69180C] text-white flex items-center justify-center shadow-sm">
              <ChefHat className="w-9 h-9 text-amber-200" />
            </div>

            <div>
              <span className="inline-block text-[11px] font-bold tracking-wider uppercase text-[#8E2818] bg-[#8E2818]/10 px-3 py-0.5 rounded-full mb-1">
                XYZ Restaurant &bull; Live Order
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E1B18]">
                Order Confirmed!
              </h1>
              <p className="text-xs sm:text-sm text-[#7D6B5C] mt-1 max-w-sm mx-auto">
                Thank you! Your dishes are sent to the kitchen and will be freshly cooked.
              </p>
            </div>
          </div>

          {/* Table & Order Metadata Chips */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#EBE2D5]">
              <div className="text-[10px] uppercase font-bold text-[#8C7662]">Table</div>
              <div className="text-base font-bold text-[#1E1B18]">
                Table {order?.tableNumber || tableParam}
              </div>
              {order?.seatingGroup && (
                <div className="text-[10px] text-[#8E2818] font-semibold mt-0.5">
                  Group G12 &bull; Combined
                </div>
              )}
            </div>

            <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#EBE2D5]">
              <div className="text-[10px] uppercase font-bold text-[#8C7662]">Order Number</div>
              <div className="text-base font-bold font-mono text-[#1E1B18]">
                #{order?.orderNumber || 'XYZ-101'}
              </div>
              <div className="text-[10px] text-[#2E7D32] font-semibold mt-0.5">
                100% Pure Veg
              </div>
            </div>
          </div>

          {/* Live Progress Tracker */}
          <div className="pt-4 border-t border-[#F2ECE2] text-left">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs uppercase font-bold tracking-wider text-[#8C7662]">
                Kitchen Preparation Status
              </h2>
              <span className="text-[11px] text-[#8E2818] font-bold bg-[#8E2818]/10 px-2.5 py-0.5 rounded-full capitalize">
                {order?.status || 'received'}
              </span>
            </div>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#EAE2D5]">
              {STATUS_STEPS.map(step => {
                const status = getStepStatus(step.key)
                const Icon = step.icon

                return (
                  <div key={step.key} className="relative flex items-start gap-3.5">
                    {/* Circle Node */}
                    <div
                      className={`absolute -left-6 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-white transition-all shadow-2xs ${
                        status === 'completed'
                          ? 'bg-[#2E7D32]'
                          : status === 'current'
                          ? 'bg-[#8E2818] ring-4 ring-[#8E2818]/20 animate-pulse'
                          : 'bg-[#DCD1C2]'
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                    </div>

                    <div>
                      <div
                        className={`text-xs font-bold ${
                          status === 'current'
                            ? 'text-[#8E2818]'
                            : status === 'completed'
                            ? 'text-[#1E1B18]'
                            : 'text-[#8C7662]'
                        }`}
                      >
                        {step.label}
                      </div>
                      <div className="text-[11px] text-[#7A6756]">{step.sublabel}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Ordered Items Summary */}
          {order && (
            <div className="pt-4 border-t border-[#F2ECE2] text-left space-y-2.5">
              <div className="text-xs uppercase font-bold tracking-wider text-[#8C7662]">
                Ordered Dishes
              </div>

              <div className="divide-y divide-[#F4EFE6] text-xs">
                {order.items.map(item => (
                  <div key={item.id} className="py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <VegIndicator isVeg={true} size="sm" />
                      <div>
                        <span className="font-semibold text-[#1E1B18]">
                          {item.quantity}x {item.name}
                        </span>
                        {item.servingInfo && (
                          <span className="text-[10px] text-[#8C7662] block">
                            {item.servingInfo}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="font-bold text-[#1E1B18]">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-[#EAE2D5] space-y-1 text-xs">
                <div className="flex justify-between text-[#6E5C4E]">
                  <span>Subtotal</span>
                  <span>₹{order.subtotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-[#6E5C4E]">
                  <span>GST (5%)</span>
                  <span>₹{order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#1E1B18] pt-1">
                  <span>Total Amount</span>
                  <span className="text-[#8E2818] font-extrabold text-base">
                    ₹{order.total.toFixed(2)}
                  </span>
                </div>
              </div>

              {order.customerNotes && (
                <div className="mt-3 p-3 rounded-xl bg-[#FAF7F2] border border-[#EAE2D5] text-xs text-[#5C4F44]">
                  <strong>Special Instructions:</strong> {order.customerNotes}
                </div>
              )}
            </div>
          )}

          {/* Demo Notice */}
          <div className="rounded-2xl bg-[#EFE8DD]/70 border border-[#E2D6C5] p-3.5 text-xs text-[#6B5A4D] flex items-start gap-2.5 text-left">
            <Info className="w-4 h-4 text-[#8E2818] shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-[11px] leading-relaxed">
              <strong className="text-[#3D3128] block">Interactive Digital Demo:</strong>
              Open the staff dashboard to change this order status from "Received" to "Cooking", "Ready", or "Served" and watch this screen update live!
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate(`/menu?table=${tableParam}`)}
              className="flex-1 py-3 px-4 rounded-xl border border-[#D5C9B8] hover:bg-[#FAF7F2] font-semibold text-xs text-[#1E1B18] transition-colors cursor-pointer"
            >
              Order More Dishes
            </button>
            <Link
              to="/staff"
              className="flex-1 py-3 px-4 rounded-xl bg-[#8E2818] hover:bg-[#782012] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Open Staff Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
