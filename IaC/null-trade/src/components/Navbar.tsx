import { useState } from 'preact/hooks'
import { useCart } from '../store/cart'
import { CartIcon } from './Icons'

export function Navbar({ onCartOpen }: { onCartOpen: () => void }) {
    const cart = useCart()
    const [menuOpen, setMenuOpen] = useState(false)

    return (
        <>
            <header className="fixed top-0 left-0 w-full z-100 bg-(--bg) border-b border-(--border) text-(--text-h) backdrop-blur-sm">
                <div className="max-w-281.5 mx-auto flex items-center justify-between px-6 py-2.5 max-lg:px-4">
                    <a href="/"><span className="font-bold text-[16px] tracking-[-0.5px] text-(--accent)">NULL_TRADE</span></a>
                    <nav className="flex items-center gap-4 max-lg:hidden">
                        <a href="/videogames" className="text-(--text) no-underline text-[14px] transition-colors duration-200 hover:text-(--accent)">Videojuegos</a>
                        <a href="/community" className="text-(--text) no-underline text-[14px] transition-colors duration-200 hover:text-(--accent)">Comunidad</a>
                        <button onClick={onCartOpen} className="relative cursor-pointer p-1 rounded hover:bg-(--social-bg) transition-colors">
                            <CartIcon width={22} height={22} fill="var(--accent)" />
                            {cart.count > 0 && (
                                <span className="absolute -top-1 -right-1 bg-(--accent) text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">{cart.count}</span>
                            )}
                        </button>
                    </nav>
                    <div className="hidden max-lg:flex items-center gap-3">
                        <button onClick={onCartOpen} className="relative cursor-pointer p-1 rounded hover:bg-(--social-bg) transition-colors">
                            <CartIcon width={22} height={22} fill="var(--accent)" />
                            {cart.count > 0 && (
                                <span className="absolute -top-1 -right-1 bg-(--accent) text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">{cart.count}</span>
                            )}
                        </button>
                        <button onClick={() => setMenuOpen(!menuOpen)} className="cursor-pointer p-1.5 rounded hover:bg-(--social-bg) transition-colors">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text-h)" stroke-width="2" stroke-linecap="round">
                                {menuOpen ? (
                                    <>
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </>
                                ) : (
                                    <>
                                        <line x1="3" y1="6" x2="21" y2="6" />
                                        <line x1="3" y1="12" x2="21" y2="12" />
                                        <line x1="3" y1="18" x2="21" y2="18" />
                                    </>
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
                {menuOpen && (
                    <div className="hidden max-lg:flex flex-col gap-2 px-4 pb-4 border-t border-(--border) animate-slide-in">
                        <a href="/videogames" onClick={() => setMenuOpen(false)} className="text-(--text) no-underline text-[14px] py-2 transition-colors duration-200 hover:text-(--accent)">Videojuegos</a>
                        <a href="/community" onClick={() => setMenuOpen(false)} className="text-(--text) no-underline text-[14px] py-2 transition-colors duration-200 hover:text-(--accent)">Comunidad</a>
                    </div>
                )}
            </header>
        </>
    )
}
