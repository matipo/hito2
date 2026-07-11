import { useState, useEffect } from 'preact/hooks'

interface Toast {
  id: number
  message: string
}

let toasts: Toast[] = []
let nextId = 0
const listeners = new Set<() => void>()

function notify() {
  listeners.forEach(l => l())
}

export function showToast(message: string) {
  const id = nextId++
  toasts = [...toasts, { id, message }]
  notify()
  setTimeout(() => {
    toasts = toasts.filter(t => t.id !== id)
    notify()
  }, 3000)
}

export function ToastContainer() {
  const [, forceUpdate] = useState(0)

  useEffect(() => {
    const unsub = () => forceUpdate(n => n + 1)
    listeners.add(unsub)
    return () => { listeners.delete(unsub) }
  }, [])

  return (
    <div className="fixed bottom-6 right-6 z-200 flex flex-col gap-2 max-lg:bottom-4 max-lg:left-4 max-lg:right-4">
      {toasts.map(t => (
        <div
          key={t.id}
          className="bg-(--bg) border border-(--accent-border) text-(--text-h) text-sm px-4 py-3 rounded shadow-(--shadow) animate-slide-in"
        >
          {t.message}
        </div>
      ))}
    </div>
  )
}