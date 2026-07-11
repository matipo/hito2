import ghostoftsushima from '../assets/ghostoftsushima.webp'
import gamesData from '../data/games.json'
import { addItem } from '../store/cart'
import { showToast } from './Toast'

export interface Game {
  id: string
  title: string
  price: number
  platform: string
  genre: string
  image: string
  description: string
  developer: string
  releaseYear: number
  rating: number
}

export const games: Game[] = gamesData as Game[]

export const genres = [...new Set(games.map(g => g.genre))].sort()

export function getGameImage(game: Game): string {
  try {
    return new URL(`/src/assets/${game.image}`, import.meta.url).href
  } catch {
    return ghostoftsushima
  }
}

interface GameCardProps {
  game: Game
}

export function GameCard({ game }: GameCardProps) {
  const handleAddToCart = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({ id: game.id, title: game.title, price: game.price, type: 'game', subtitle: game.platform })
    showToast(`${game.title} agregado al carrito`)
  }

  return (
    <a href={`/videogames/${game.id}`} className="group flex border border-(--border) rounded bg-(--bg) overflow-hidden transition-shadow duration-200 hover:shadow-(--shadow) hover:border-(--accent-border) no-underline">
      <div className="shrink-0 overflow-hidden bg-(--bg)">
        <img
          src={getGameImage(game)}
          alt={game.title}
          className="w-24 h-30 object-cover transition-transform duration-200 group-hover:scale-105 drop-shadow-[0_0_4px_rgba(103,58,184,0.5)]"
        />
      </div>
      <div className="flex flex-col justify-center px-3 py-2 min-w-0 flex-1">
        <h3 className="font-bold text-(--text-h) text-sm leading-tight truncate">{game.title}</h3>
        <p className="text-(--text) text-xs mt-0.5">{game.platform}</p>
        <span className="text-[10px] mt-1 px-1.5 py-0.5 rounded bg-(--accent-bg) text-(--accent) border border-(--accent-border) w-fit">{game.genre}</span>
        <div className="flex items-center justify-between mt-1">
          <p className="text-(--accent) text-sm font-bold">${game.price.toLocaleString('es-CL')}</p>
          <button
            onClick={handleAddToCart}
            className="text-[10px] px-2 py-0.5 rounded bg-(--accent-bg) text-(--accent) border border-(--accent-border) cursor-pointer hover:bg-(--accent) hover:text-white transition-all active:scale-95"
          >
            + Carrito
          </button>
        </div>
      </div>
    </a>
  )
}