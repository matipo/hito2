import { useReducer, useEffect } from 'preact/hooks'

export type CartItemType = 'game' | 'account' | 'skin'

export interface CartItem {
  id: string
  title: string
  price: number
  type: CartItemType
  quantity: number
  subtitle?: string
}

type Listener = () => void

let items: CartItem[] = []
const listeners = new Set<Listener>()

function notify() {
  listeners.forEach(l => l())
}

function getItemKey(id: string, type: CartItemType) {
  return `${type}:${id}`
}

export function subscribe(listener: Listener) {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}

export function getItems() { return [...items] }

export function addItem(item: Omit<CartItem, 'quantity'>) {
  const key = getItemKey(item.id, item.type)
  const existing = items.find(i => getItemKey(i.id, i.type) === key)
  if (existing) {
    items = items.map(i => getItemKey(i.id, i.type) === key ? { ...i, quantity: i.quantity + 1 } : i)
  } else {
    items = [...items, { ...item, quantity: 1 }]
  }
  notify()
}

export function removeItem(id: string, type: CartItemType) {
  items = items.filter(i => getItemKey(i.id, i.type) !== getItemKey(id, type))
  notify()
}

export function updateQuantity(id: string, type: CartItemType, quantity: number) {
  if (quantity <= 0) {
    removeItem(id, type)
    return
  }
  items = items.map(i => getItemKey(i.id, i.type) === getItemKey(id, type) ? { ...i, quantity } : i)
  notify()
}

export function getTotal() {
  return items.reduce((sum, i) => sum + i.price * i.quantity, 0)
}

export function getCount() {
  return items.reduce((sum, i) => sum + i.quantity, 0)
}

export function clearCart() {
  items = []
  notify()
}

export function useCart() {
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0)

  useEffect(() => {
    return subscribe(() => { forceUpdate(0) })
  }, [])

  return {
    items: getItems(),
    total: getTotal(),
    count: getCount(),
    add: addItem,
    remove: removeItem,
    updateQuantity,
    clear: clearCart,
  }
}