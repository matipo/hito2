import heroImg from '../assets/icon.webp'
import { GameCard, games } from '../components/GameCard'
import { Gamepad, Arrowright, Facelaugh, CheckIcon } from '../components/Icons'

export function Home({ path: _path }: { path?: string }) {
  const featured = games.slice(0, 4)

  return (
    <div className="pt-13">
      <main className="w-281.5 max-w-full mx-auto border-x border-(--border) min-h-svh flex flex-col box-border">

        <section className="flex flex-col gap-6.25 justify-center items-center grow p-8 max-lg:py-8 max-lg:px-5 max-lg:gap-4.5" aria-label="Inicio">
          <div className="relative">
            <img src={heroImg} className="relative z-0 w-67.5" width="270" height="279" alt="NULL_TRADE logo" />
          </div>
          
          <h1 className="font-bold text-[56px] tracking-[-1.68px] my-8 text-(--text-h) max-lg:text-[36px] max-lg:my-5">NULL_TRADE</h1>
          
          <p className="text-(--text) text-base max-w-md mx-auto max-lg:text-sm">Tu plataforma para comprar, vender e intercambiar videojuegos, cuentas, skins y más con la comunidad.</p>
          
          <button onClick={() => { window.location.href = '/videogames' }} className="active:scale-95 active:shadow-[0_0_5px_var(--glow-color)] bg-white px-10 py-4 transition-all cursor-pointer hover:shadow-[0_0_30px_var(--glow-color)]">
            INITIALIZE_TERMINAL
          </button>
        </section>

        <section className="border-t border-(--border) p-8 max-lg:p-5">
          <h2 className="font-bold text-[24px] leading-[118%] tracking-[-0.24px] mb-2 text-(--text-h) max-lg:text-[20px]">Juegos destacados</h2>
          <p className="text-(--text) text-sm mb-6">Los títulos más buscados por la comunidad chilena</p>
          <div className="grid grid-cols-2 gap-3 max-lg:grid-cols-1">
            {featured.map(game => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
          <div className="mt-6 text-center">
            <a href="/videogames" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-(--social-bg) text-(--text-h) text-sm transition-shadow hover:shadow-(--shadow) no-underline">
              <Arrowright width={16} height={16} /> Ver todo el catálogo
            </a>
          </div>
        </section>

        <section className="border-t border-(--border) flex max-lg:flex-col max-lg:text-center">
          <div className="flex-1 p-8 border-r border-(--border) max-lg:border-r-0 max-lg:border-b max-lg:p-5">
            <Gamepad className="mb-4 max-lg:mx-auto" />
            <h2 className="font-bold text-[24px] leading-[118%] tracking-[-0.24px] mb-2 text-(--text-h) max-lg:text-[20px]">Videojuegos digitales y físicos</h2>
            <p className="text-(--text) m-0 text-sm">Compra títulos originales para PC, PlayStation, Xbox y Nintendo Switch. Claves digitales instantáneas o copias físicas con despacho a todo Chile.</p>
            <ul className="list-none p-0 flex gap-2 mt-6 max-lg:flex-wrap max-lg:justify-center">
              <li>
                <a href="/videogames" className="flex items-center gap-2 p-[6px_12px] rounded-md bg-(--social-bg) text-(--text-h) text-sm transition-shadow hover:shadow-(--shadow) no-underline">
                  <Arrowright width={16} height={16} /> Explorar catálogo
                </a>
              </li>
            </ul>
          </div>

          <div className="flex-1 p-8 max-lg:p-5">
            <Facelaugh className="mb-4 max-lg:mx-auto" />
            <h2 className="font-bold text-[24px] leading-[118%] tracking-[-0.24px] mb-2 text-(--text-h) max-lg:text-[20px]">Comunidad y trueque</h2>
            <p className="text-(--text) m-0 text-sm">Vende cuentas verificadas, intercambia skins exclusivas y propone tradeos directos con otros jugadores. Sin intermediarios, sin comisiones.</p>
            <ul className="list-none p-0 flex gap-2 mt-6 max-lg:flex-wrap max-lg:justify-center">
              <li>
                <a href="/community" className="flex items-center gap-2 p-[6px_12px] rounded-md bg-(--social-bg) text-(--text-h) text-sm transition-shadow hover:shadow-(--shadow) no-underline">
                  <Arrowright width={16} height={16} /> Ir a comunidad
                </a>
              </li>
            </ul>
          </div>
        </section>

        <section className="border-t border-(--border) p-8 max-lg:p-5">
          <h2 className="font-bold text-[24px] leading-[118%] tracking-[-0.24px] mb-6 text-(--text-h) max-lg:text-[20px] text-center">¿Cómo funciona NULL_TRADE?</h2>
          <div className="grid grid-cols-3 gap-6 max-lg:grid-cols-1 max-lg:gap-5">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-14 h-14 rounded-full bg-(--accent-bg) border border-(--accent-border) flex items-center justify-center text-(--accent) font-bold text-xl">1</div>
              <h3 className="font-bold text-(--text-h) text-sm">Elige tu juego</h3>
              <p className="text-(--text) text-xs m-0">Explora nuestro catálogo con precios en CLP. Filtra por género, plataforma o busca directamente el título que quieras.</p>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-14 h-14 rounded-full bg-(--accent-bg) border border-(--accent-border) flex items-center justify-center text-(--accent) font-bold text-xl">2</div>
              <h3 className="font-bold text-(--text-h) text-sm">Agrega al carrito</h3>
              <p className="text-(--text) text-xs m-0">Añade juegos, cuentas o skins a tu carrito. Paga de forma segura y recibe tus claves digitales al instante.</p>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-14 h-14 rounded-full bg-(--accent-bg) border border-(--accent-border) flex items-center justify-center text-(--accent) font-bold text-xl">3</div>
              <h3 className="font-bold text-(--text-h) text-sm">Juega o intercambia</h3>
              <p className="text-(--text) text-xs m-0">Activa tu juego y empieza a jugar, o únete a la comunidad para hacer trueques y encontrar ofertas exclusivas.</p>
            </div>
          </div>
        </section>

        <section className="border-t border-(--border) p-8 max-lg:p-5">
          <div className="grid grid-cols-4 gap-4 max-lg:grid-cols-2 max-lg:gap-3">
            <div className="border border-(--border) rounded p-5 text-center max-lg:p-4">
              <p className="text-(--accent) font-bold text-2xl max-lg:text-xl">500+</p>
              <p className="text-(--text) text-xs mt-1 m-0">Juegos disponibles</p>
            </div>
            <div className="border border-(--border) rounded p-5 text-center max-lg:p-4">
              <p className="text-(--accent) font-bold text-2xl max-lg:text-xl">12K+</p>
              <p className="text-(--text) text-xs mt-1 m-0">Usuarios activos</p>
            </div>
            <div className="border border-(--border) rounded p-5 text-center max-lg:p-4">
              <p className="text-(--accent) font-bold text-2xl max-lg:text-xl">98%</p>
              <p className="text-(--text) text-xs mt-1 m-0">Satisfacción</p>
            </div>
            <div className="border border-(--border) rounded p-5 text-center max-lg:p-4">
              <p className="text-(--accent) font-bold text-2xl max-lg:text-xl">24h</p>
              <p className="text-(--text) text-xs mt-1 m-0">Soporte Chile</p>
            </div>
          </div>
        </section>

        <section className="border-t border-(--border) p-8 max-lg:p-5">
          <div className="border border-(--border) rounded p-6 max-lg:p-5 flex flex-col gap-4">
            <h3 className="font-bold text-(--text-h) text-center max-lg:text-[20px]">¿Por qué elegir NULL_TRADE?</h3>
            <div className="grid grid-cols-2 gap-4 max-lg:grid-cols-1">
              <div className="flex gap-3">
                <CheckIcon width={20} height={20} fill="var(--accent)" className="shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-(--text-h) text-sm m-0">Entrega instantánea</p>
                  <p className="text-(--text) text-xs m-0 mt-0.5">Recibe claves digitales en segundos tras la compra.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckIcon width={20} height={20} fill="var(--accent)" className="shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-(--text-h) text-sm m-0">Sin comisiones en trueques</p>
                  <p className="text-(--text) text-xs m-0 mt-0.5">Intercambia directamente con otros jugadores.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckIcon width={20} height={20} fill="var(--accent)" className="shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-(--text-h) text-sm m-0">Pagos en CLP</p>
                  <p className="text-(--text) text-xs m-0 mt-0.5">Todos los precios en pesos chilenos, sin sorpresas.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckIcon width={20} height={20} fill="var(--accent)" className="shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-(--text-h) text-sm m-0">Comunidad verificada</p>
                  <p className="text-(--text) text-xs m-0 mt-0.5">Vendedores y cuentas con sistema de reputación.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="h-22 border-t border-(--border) max-lg:h-12"></div>
      </main>
    </div>
  );
}