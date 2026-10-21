export type MenuCategory =
  | 'Starters / Appetizers'
  | 'Soup'
  | 'Beverages'
  | 'Veg Sabji'
  | 'Punjabi Sabji'
  | 'Gujarati Sabji'
  | 'Jain Sabji'
  | 'Chinese'
  | 'Rice & Pulao'
  | 'Roti & Naan'
  | 'Desserts'
  | 'Ice Cream'

export interface MenuItem {
  id: string
  name: string
  subCategory?: string
  category: MenuCategory
  description: string
  price: number
  isVeg: boolean
  isJain?: boolean
  isSpicy?: boolean
  isAvailable: boolean
  prepTimeMinutes?: number
  servingInfo?: string
  imageUrl: string
  badge?: string
}

export interface CartItem {
  item: MenuItem
  quantity: number
  notes?: string
}

export type OrderStatus = 'received' | 'preparing' | 'ready' | 'served' | 'rejected'

export interface OrderLineItem {
  id: string
  name: string
  price: number
  quantity: number
  category: MenuCategory
  servingInfo?: string
  isJain?: boolean
}

export interface Order {
  id: string
  orderNumber: string
  tableNumber: string
  seatingGroup?: string | null
  items: OrderLineItem[]
  subtotal: number
  tax: number
  total: number
  status: OrderStatus
  customerNotes?: string
  createdAt: string
  updatedAt: string
}

export interface SeatingGroup {
  id: string
  name: string
  tables: string[]
  active: boolean
}
