import { useState } from 'preact/hooks'
import { GameCard, games, genres } from '../components/GameCard'

export function Videogames({ path: _path }: { path?: string }) {
  const [search, setSearch] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('')

  const filtered = games.filter(g => {
    const matchSearch = g.title.toLowerCase().includes(search.toLowerCase())
    const matchGenre = selectedGenre === '' || g.genre === selectedGenre
    return matchSearch && matchGenre
  })

  return (
    <div className="pt-13">
      <main className="w-281.5 max-w-full mx-auto border-x border-(--border) min-h-svh flex flex-col box-border">
        <section className="p-6 max-lg:p-4" aria-label="Catálogo de videojuegos">
          <h1 className="font-bold text-(--text-h) text-2xl mb-6 max-lg:text-xl">Catálogo de videojuegos</h1>

          <div className="flex gap-3 mb-6 max-lg:flex-col">
            <label className="sr-only" for="game-search">Buscar juego</label>
            <input
              id="game-search"
              type="text"
              placeholder="Buscar juego..."
              value={search}
              onInput={(e) => setSearch((e.target as HTMLInputElement).value)}
              className="flex-1 px-3 py-2 rounded border border-(--border) bg-(--bg) text-(--text-h) text-sm outline-none focus:border-(--accent-border) focus:shadow-[0_0_8px_var(--accent-bg)] transition-all"
            />
            <label className="sr-only" for="genre-filter">Filtrar por género</label>
            <select
              id="genre-filter"
              value={selectedGenre}
              onChange={(e) => setSelectedGenre((e.target as HTMLSelectElement).value)}
              className="px-3 py-2 rounded border border-(--border) bg-(--bg) text-(--text-h) text-sm outline-none focus:border-(--accent-border) focus:shadow-[0_0_8px_var(--accent-bg)] transition-all cursor-pointer"
            >
              <option value="">Todos los géneros</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3 max-lg:grid-cols-2 max-sm:grid-cols-1">
            {filtered.map(game => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-(--text) text-sm text-center mt-8">No se encontraron juegos.</p>
          )}
        </section>
      </main>
    </div>
  )
}