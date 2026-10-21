import type { Order, OrderStatus, SeatingGroup, OrderLineItem } from '../types'

const STORAGE_KEY_ORDERS = 'xyz_restaurant_orders_v1'
const STORAGE_KEY_SEATING = 'xyz_restaurant_seating_v1'
export const STORAGE_CHANGE_EVENT = 'xyz_storage_changed'

export const INITIAL_SEATING_GROUPS: SeatingGroup[] = [
  {
    id: 'G12',
    name: 'Tables 07 + 08',
    tables: ['07', '08'],
    active: false,
  },
]

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'XYZ-101',
    orderNumber: '#XYZ-101',
    tableNumber: '02',
    seatingGroup: null,
    items: [
      { id: 'starter-1', name: 'Tandoori Paneer Tikka', price: 240, quantity: 1, category: 'Starters / Appetizers', servingInfo: 'Serves 2 • 6 Pcs' },
      { id: 'punjabi-1', name: 'Paneer Butter Masala (Makhani)', price: 260, quantity: 1, category: 'Punjabi Sabji', servingInfo: 'Serves 2 • Rich & Mild' },
      { id: 'roti-1', name: 'Tandoori Butter Garlic Naan', price: 75, quantity: 3, category: 'Roti & Naan', servingInfo: '1 Big Naan' },
      { id: 'bev-1', name: 'Nadiadi Masala Chaas', price: 50, quantity: 2, category: 'Beverages', servingInfo: '300ml Glass' },
    ],
    subtotal: 825,
    tax: 41.25, // 5% GST
    total: 866.25,
    status: 'ready',
    customerNotes: 'Please serve hot garlic butter on naan and extra mint chutney on the side.',
    createdAt: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
  },
  {
    id: 'XYZ-102',
    orderNumber: '#XYZ-102',
    tableNumber: '07',
    seatingGroup: null,
    items: [
      { id: 'gujarati-1', name: 'Authentic Surti Undhiyu', price: 240, quantity: 1, category: 'Gujarati Sabji', servingInfo: 'Serves 2 • Traditional' },
      { id: 'gujarati-3', name: 'Gujarati Sweet & Sour Kadhi', price: 130, quantity: 1, category: 'Gujarati Sabji', servingInfo: 'Bowl 350ml' },
      { id: 'rice-2', name: 'Jeera Rice in Desi Ghee', price: 150, quantity: 1, category: 'Rice & Pulao', servingInfo: 'Serves 2' },
      { id: 'bev-1', name: 'Nadiadi Masala Chaas', price: 50, quantity: 2, category: 'Beverages', servingInfo: '300ml Glass' },
    ],
    subtotal: 620,
    tax: 31,
    total: 651,
    status: 'preparing',
    customerNotes: 'Serve hot with extra green coriander.',
    createdAt: new Date(Date.now() - 11 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 60 * 1000).toISOString(),
  },
  {
    id: 'XYZ-103',
    orderNumber: '#XYZ-103',
    tableNumber: '05',
    seatingGroup: null,
    items: [
      { id: 'jain-1', name: 'Jain Shahi Paneer Korma', price: 265, quantity: 1, category: 'Jain Sabji', servingInfo: '100% Jain Pure', isJain: true },
      { id: 'roti-3', name: 'Tandoori Butter Roti', price: 35, quantity: 4, category: 'Roti & Naan', servingInfo: '100% Atta', isJain: true },
      { id: 'dessert-1', name: 'Shahi Gulab Jamun with Rabdi', price: 140, quantity: 1, category: 'Desserts', servingInfo: '2 Pcs with Rabdi', isJain: true },
    ],
    subtotal: 545,
    tax: 27.25,
    total: 572.25,
    status: 'served',
    customerNotes: 'Strictly 100% Jain food. No potato, onion, or garlic.',
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
  },
]

function emitStorageChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(STORAGE_CHANGE_EVENT))
  }
}

export function getOrders(): Order[] {
  if (typeof window === 'undefined') return INITIAL_ORDERS
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ORDERS)
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(INITIAL_ORDERS))
      return INITIAL_ORDERS
    }
    return JSON.parse(raw)
  } catch {
    return INITIAL_ORDERS
  }
}

export function getOrderById(id: string): Order | undefined {
  const orders = getOrders()
  return orders.find(o => o.id === id || o.orderNumber === id)
}

export function saveOrders(orders: Order[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders))
  emitStorageChange()
}

export function createDemoOrder(
  tableNumber: string,
  items: OrderLineItem[],
  customerNotes?: string
): Order {
  const currentOrders = getOrders()
  const orderCount = currentOrders.length + 1
  const orderNumber = `#XYZ-${(100 + orderCount).toString()}`
  const id = `XYZ-${Date.now().toString().slice(-4)}`

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.05
  const total = subtotal + tax

  const seatingGroup = getTableSeatingGroup(tableNumber)

  const newOrder: Order = {
    id,
    orderNumber,
    tableNumber,
    seatingGroup: seatingGroup && seatingGroup.active ? seatingGroup.id : null,
    items,
    subtotal,
    tax,
    total,
    status: 'received',
    customerNotes: customerNotes?.trim() || undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const updatedOrders = [newOrder, ...currentOrders]
  saveOrders(updatedOrders)
  return newOrder
}

export function updateOrderStatus(orderId: string, status: OrderStatus): void {
  const orders = getOrders()
  const index = orders.findIndex(o => o.id === orderId)
  if (index !== -1) {
    orders[index] = {
      ...orders[index],
      status,
      updatedAt: new Date().toISOString(),
    }
    saveOrders(orders)
  }
}

export function getSeatingGroups(): SeatingGroup[] {
  if (typeof window === 'undefined') return INITIAL_SEATING_GROUPS
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SEATING)
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_SEATING, JSON.stringify(INITIAL_SEATING_GROUPS))
      return INITIAL_SEATING_GROUPS
    }
    return JSON.parse(raw)
  } catch {
    return INITIAL_SEATING_GROUPS
  }
}

export function saveSeatingGroups(groups: SeatingGroup[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY_SEATING, JSON.stringify(groups))
  emitStorageChange()
}

export function getTableSeatingGroup(tableNumber: string): SeatingGroup | null {
  const groups = getSeatingGroups()
  return groups.find(g => g.tables.includes(tableNumber) && g.active) || null
}

export function toggleTableCombination(groupId: string, active?: boolean): void {
  const groups = getSeatingGroups()
  const updated = groups.map(g => (g.id === groupId ? { ...g, active: active !== undefined ? active : !g.active } : g))
  saveSeatingGroups(updated)
}

export function rejectDemoOrder(orderId: string, reason?: string): void {
  const orders = getOrders()
  const index = orders.findIndex(o => o.id === orderId)
  if (index !== -1) {
    orders[index] = {
      ...orders[index],
      status: 'rejected',
      customerNotes: reason ? `Rejected: ${reason}` : orders[index].customerNotes,
      updatedAt: new Date().toISOString(),
    }
    saveOrders(orders)
  }
}

export function resetDemoData(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY_ORDERS)
  localStorage.removeItem(STORAGE_KEY_SEATING)
  emitStorageChange()
}

export const resetDemo = resetDemoData
