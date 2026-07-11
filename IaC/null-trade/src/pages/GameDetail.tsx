import { games, getGameImage } from '../components/GameCard';
import { addItem } from '../store/cart';
import { showToast } from '../components/Toast';

export function GameDetail({ path: _path }: { path?: string }) {
  const urlPath = window.location.pathname;
  const id = urlPath.split('/').pop();
  const game = games.find(g => g.id === id);

  if (!game) {
    return (
      <div className="pt-13">
        <main className="w-281.5 max-w-full mx-auto border-x border-(--border) min-h-svh flex flex-col items-center justify-center box-border">
          <h1 className="font-bold text-(--text-h) text-2xl">Juego no encontrado</h1>
          <a href="/videogames" className="text-(--accent) mt-4 hover:underline">Volver al catálogo</a>
        </main>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({ id: game.id, title: game.title, price: game.price, type: 'game', subtitle: game.platform })
    showToast(`${game.title} agregado al carrito`)
  }

  return (
    <div className="pt-13">
      <main className="w-281.5 max-w-full mx-auto border-x border-(--border) min-h-svh flex flex-col box-border">
        <a href="/videogames" className="text-(--accent) text-sm p-6 pb-0 hover:underline max-lg:p-4">&larr; Volver al catálogo</a>

        <section className="flex gap-6 p-6 max-lg:flex-col max-lg:p-4 max-lg:gap-4">
          <div className="shrink-0 max-lg:self-center bg-(--bg)">
            <img
              src={getGameImage(game)}
              alt={game.title}
              className="w-55 h-70 object-cover rounded border border-(--border) max-lg:w-44 max-lg:h-56 drop-shadow-[0_0_8px_rgba(103,58,184,0.5)]"
            />
          </div>

          <div className="flex flex-col justify-center min-w-0">
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-(--accent-bg) text-(--accent) border border-(--accent-border) w-fit mb-2">{game.genre}</span>
            <h1 className="font-bold text-(--text-h) text-2xl max-lg:text-xl">{game.title}</h1>
            <p className="text-(--text) text-sm mt-2 max-w-xl">{game.description}</p>

            <div className="flex flex-col gap-1.5 mt-4 text-xs text-(--text)">
              <p><span className="text-(--text-h) font-bold">Plataforma:</span> {game.platform}</p>
              <p><span className="text-(--text-h) font-bold">Desarrollador:</span> {game.developer}</p>
              <p><span className="text-(--text-h) font-bold">Año de lanzamiento:</span> {game.releaseYear}</p>
              <p><span className="text-(--text-h) font-bold">Rating:</span> {game.rating}/10</p>
            </div>

            <div className="flex items-center gap-4 mt-4">
              <p className="text-(--accent) text-xl font-bold">${game.price.toLocaleString('es-CL')}</p>
              <button
                onClick={handleAddToCart}
                className="px-6 py-2.5 bg-(--accent) text-white font-bold rounded cursor-pointer hover:opacity-90 active:scale-95 transition-all text-sm"
              >
                AGREGAR_AL_CARRITO
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}