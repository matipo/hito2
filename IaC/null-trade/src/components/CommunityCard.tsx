/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'preact/hooks'
import communityData from '../data/community.json'
import { Gamepad, Arrowright, Facelaugh, HeartIcon, CheckIcon } from './Icons'
import { addItem, type CartItemType } from '../store/cart'
import { showToast } from './Toast'

interface CommunityItem {
  id: string
  title: string
  description: string
  icon: string
  items: Record<string, string | number>[]
}

export const communityItems: CommunityItem[] = communityData as CommunityItem[]

const icons: Record<string, (props: { className?: string }) => any> = {
  Gamepad: ({ className }) => <Gamepad className={className} />,
  Arrowright: ({ className }) => <Arrowright className={className} />,
  Facelaugh: ({ className }) => <Facelaugh className={className} />,
}

function AddToCartButton({ id, title, price, type, subtitle }: { id: string; title: string; price: number; type: CartItemType; subtitle: string }) {
  const handleClick = (e: MouseEvent) => {
    e.preventDefault()
    addItem({ id, title, price, type, subtitle })
    showToast(`${title} agregado al carrito`)
  }

  return (
    <button
      onClick={handleClick}
      className="mt-2 w-full py-1.5 text-[11px] font-bold rounded bg-(--accent) text-white cursor-pointer hover:opacity-90 active:scale-95 transition-all"
    >
      AGREGAR_AL_CARRITO
    </button>
  )
}

function AccountCard({ item }: { item: Record<string, string | number> }) {
  return (
    <div className="border border-(--border) rounded p-4 bg-(--bg) hover:border-(--accent-border) hover:shadow-(--shadow) transition-all">
      <h3 className="font-bold text-(--text-h) text-sm truncate">{item.title}</h3>
      <div className="flex flex-col gap-0.5 mt-1.5 text-xs text-(--text)">
        <p>Plataforma: <span className="text-(--text-h)">{item.platform}</span></p>
        {item.level && <p>Nivel: <span className="text-(--text-h)">{item.level}</span></p>}
        <p>Vendedor: <span className="text-(--text-h)">{item.seller}</span></p>
      </div>
      <p className="text-(--accent) font-bold text-sm mt-2">${Number(item.price).toLocaleString('es-CL')}</p>
      <AddToCartButton id={`account-${item.title}`} title={String(item.title)} price={Number(item.price)} type="account" subtitle={String(item.platform)} />
    </div>
  )
}

function SkinCard({ item }: { item: Record<string, string | number> }) {
  return (
    <div className="border border-(--border) rounded p-4 bg-(--bg) hover:border-(--accent-border) hover:shadow-(--shadow) transition-all">
      <h3 className="font-bold text-(--text-h) text-sm truncate">{item.title}</h3>
      <div className="flex flex-col gap-0.5 mt-1.5 text-xs text-(--text)">
        <p>Juego: <span className="text-(--text-h)">{item.game}</span></p>
        <p>Rareza: <span className="text-(--accent)">{item.rarity}</span></p>
        <p>Vendedor: <span className="text-(--text-h)">{item.seller}</span></p>
      </div>
      <p className="text-(--accent) font-bold text-sm mt-2">${Number(item.price).toLocaleString('es-CL')}</p>
      <AddToCartButton id={`skin-${item.title}`} title={String(item.title)} price={Number(item.price)} type="skin" subtitle={String(item.game)} />
    </div>
  )
}

function TradeCard({ item }: { item: Record<string, string | number> }) {
  const [proposed, setProposed] = useState(false)

  const handlePropose = (e: MouseEvent) => {
    e.preventDefault()
    setProposed(true)
    showToast(`Intercambio propuesto: ${item.offer} → ${item.want}`)
  }

  return (
    <div className="border border-(--border) rounded p-4 bg-(--bg) hover:border-(--accent-border) hover:shadow-(--shadow) transition-all">
      <h3 className="font-bold text-(--text-h) text-sm truncate">{item.title}</h3>
      <div className="flex items-center gap-2 mt-1.5 text-xs">
        <span className="px-2 py-0.5 rounded bg-green-900/40 text-green-400 border border-green-800">{item.offer}</span>
        <Arrowright width={14} height={14} />
        <span className="px-2 py-0.5 rounded bg-(--accent-bg) text-(--accent) border border-(--accent-border)">{item.want}</span>
      </div>
      <p className="text-xs text-(--text) mt-2">Por <span className="text-(--text-h)">{item.user}</span></p>
      {proposed ? (
        <button disabled className="mt-2 w-full py-1.5 text-[11px] font-bold rounded bg-green-900/40 text-green-400 border border-green-800 cursor-default flex items-center justify-center gap-1">
          <CheckIcon width={14} height={14} fill="#4ade80" /> PROPUESTO
        </button>
      ) : (
        <button
          onClick={handlePropose}
          className="mt-2 w-full py-1.5 text-[11px] font-bold rounded bg-(--accent-bg) text-(--accent) border border-(--accent-border) cursor-pointer hover:bg-(--accent) hover:text-white transition-all active:scale-95"
        >
          PROPONER_INTERCAMBIO
        </button>
      )}
    </div>
  )
}

function GuideCard({ item }: { item: Record<string, string | number> }) {
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(Number(item.likes))
  const [saved, setSaved] = useState(false)

  const handleLike = (e: MouseEvent) => {
    e.preventDefault()
    setLiked(!liked)
    setLikes(prev => liked ? prev - 1 : prev + 1)
  }

  const handleSave = (e: MouseEvent) => {
    e.preventDefault()
    setSaved(!saved)
    showToast(saved ? 'Guía eliminada de guardados' : 'Guía guardada')
  }

  return (
    <div className="border border-(--border) rounded p-4 bg-(--bg) hover:border-(--accent-border) hover:shadow-(--shadow) transition-all">
      <h3 className="font-bold text-(--text-h) text-sm truncate">{item.title}</h3>
      <div className="flex flex-col gap-0.5 mt-1.5 text-xs text-(--text)">
        <p>Juego: <span className="text-(--text-h)">{item.game}</span></p>
        <p>Autor: <span className="text-(--text-h)">{item.author}</span></p>
      </div>
      <p className="text-xs text-(--text) mt-2">&#9829; {likes} likes</p>
      <div className="flex gap-2 mt-2">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold rounded cursor-pointer transition-all active:scale-95 ${
            liked
              ? 'bg-(--accent) text-white border border-(--accent)'
              : 'bg-(--accent-bg) text-(--accent) border border-(--accent-border) hover:bg-(--accent) hover:text-white'
          }`}
        >
          <HeartIcon width={14} height={14} filled={liked} fill={liked ? '#fff' : undefined} /> {liked ? 'Liked' : 'Like'}
        </button>
        <button
          onClick={handleSave}
          className={`flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold rounded cursor-pointer transition-all active:scale-95 ${
            saved
              ? 'bg-green-900/40 text-green-400 border border-green-800'
              : 'bg-(--social-bg) text-(--text-h) border border-(--border) hover:border-(--accent-border)'
          }`}
        >
          <CheckIcon width={14} height={14} fill={saved ? '#4ade80' : undefined} /> {saved ? 'Guardado' : 'Guardar'}
        </button>
      </div>
    </div>
  )
}

const renderers: Record<string, (item: Record<string, string | number>) => any> = {
  cuentas: (item) => <AccountCard item={item} />,
  skins: (item) => <SkinCard item={item} />,
  tradeos: (item) => <TradeCard item={item} />,
  guias: (item) => <GuideCard item={item} />,
}

interface CommunitySectionProps {
  item: CommunityItem
}

export function CommunitySection({ item }: CommunitySectionProps) {
  const Icon = icons[item.icon] || icons['Gamepad']
  const CardRenderer = renderers[item.id]

  return (
    <section id={item.id} className="p-6 max-lg:p-4">
      <div className="max-lg:text-center">
        <Icon className="mb-4 max-lg:mx-auto" />
      </div>
      <h2 className="font-bold text-[24px] leading-[118%] tracking-[-0.24px] mb-2 text-(--text-h) max-lg:text-[20px]">{item.title}</h2>
      <p className="m-0 text-(--text)">{item.description}</p>

      <div className="grid grid-cols-3 gap-3 mt-6 max-lg:grid-cols-2 max-sm:grid-cols-1">
        {item.items.map((card) => (
          CardRenderer ? CardRenderer(card) : null
        ))}
      </div>
    </section>
  )
}