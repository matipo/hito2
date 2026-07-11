import { useState } from 'preact/hooks'
import { useCart } from '../store/cart'
import { XIcon, MinusIcon, PlusIcon, TrashIcon } from './Icons'
import { showToast } from './Toast'

interface CartProps {
  isOpen: boolean
  onClose: () => void
}

declare global {
  interface Window { __API_URL__?: string }
}

function getApiUrl(): string {
  const url = window.__API_URL__
  if (url) return url
  return 'http://localhost:8080'
}

export function CartSidebar({ isOpen, onClose }: CartProps) {
  const cart = useCart()
  const [loading, setLoading] = useState(false)

  const typeLabels: Record<string, string> = {
    game: 'Juego',
    account: 'Cuenta',
    skin: 'Skin',
  }

  const handleCheckout = async () => {
    if (cart.items.length === 0) return
    setLoading(true)
    try {
      const res = await fetch(`${getApiUrl()}/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.items.map(i => ({ id: i.id, title: i.title, price: i.price, quantity: i.quantity })),
          total: cart.total,
        }),
      })
      const data = await res.json()
      if (data.order_id) {
        const orderId = data.order_id.slice(0, 8)
        cart.clear()
        showToast(`Orden #${orderId} creada con éxito!`)
        onClose()
      } else {
        showToast(data.error || 'Error al procesar el pago')
      }
    } catch {
      showToast('Error de conexión con el servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-150" onClick={onClose} />
      )}

      <aside className={`fixed top-0 right-0 h-full w-96 max-lg:w-full bg-(--bg) border-l border-(--border) z-160 flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-(--border)">
          <h2 className="font-bold text-(--text-h) text-lg">Carrito</h2>
          <button onClick={onClose} className="cursor-pointer p-1 rounded hover:bg-(--social-bg) transition-colors">
            <XIcon width={20} height={20} />
          </button>
        </div>

        {cart.items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-(--text) text-sm">Tu carrito está vacío</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.items.map(item => (
                <div key={`${item.type}:${item.id}`} className="border border-(--border) rounded p-3 bg-(--bg) flex flex-col gap-2">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0">
                      <h4 className="font-bold text-(--text-h) text-sm truncate">{item.title}</h4>
                      {item.subtitle && <p className="text-xs text-(--text)">{item.subtitle}</p>}
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-(--accent-bg) text-(--accent) border border-(--accent-border) w-fit mt-0.5 inline-block">{typeLabels[item.type] || item.type}</span>
                    </div>
                    <button
                      onClick={() => cart.remove(item.id, item.type)}
                      className="cursor-pointer p-1 rounded hover:bg-(--social-bg) transition-colors shrink-0"
                    >
                      <TrashIcon width={16} height={16} fill="#ef4444" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => cart.updateQuantity(item.id, item.type, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center border border-(--border) rounded cursor-pointer hover:border-(--accent-border) transition-colors bg-(--bg)"
                      >
                        <MinusIcon width={12} height={12} />
                      </button>
                      <span className="text-sm text-(--text-h) font-bold w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => cart.updateQuantity(item.id, item.type, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center border border-(--border) rounded cursor-pointer hover:border-(--accent-border) transition-colors bg-(--bg)"
                      >
                        <PlusIcon width={12} height={12} />
                      </button>
                    </div>
                    <p className="text-(--accent) text-sm font-bold">${(item.price * item.quantity).toLocaleString('es-CL')}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-(--border) p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-(--text) text-sm">Total ({cart.count} {cart.count === 1 ? 'producto' : 'productos'})</span>
                <span className="font-bold text-(--text-h) text-lg">${cart.total.toLocaleString('es-CL')}</span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full py-3 bg-(--accent) text-white font-bold rounded cursor-pointer hover:opacity-90 active:scale-[0.98] transition-all text-sm disabled:opacity-50"
              >
                {loading ? 'PROCESANDO...' : 'PROCEDIR_AL_PAGO'}
              </button>
              <button
                onClick={() => cart.clear()}
                className="w-full py-2 border border-(--border) rounded cursor-pointer text-(--text) text-sm hover:border-(--accent-border) transition-colors"
              >
                Vaciar carrito
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  )
}