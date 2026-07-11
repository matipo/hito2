export function Footer(){
    return(
        <footer className="w-full bg-(--bg) border-t border-(--border) text-[12px] text-(--text)">
            <div className="max-w-281.5 mx-auto px-6 py-4">
                <div className="flex justify-between max-lg:flex-col max-lg:gap-4">
                    <div className="flex flex-col gap-1">
                        <span className="text-(--accent) font-bold text-sm">NULL_TRADE</span>
                        <span>&copy; {new Date().getFullYear()} NULL_TRADE. Todos los derechos reservados.</span>
                    </div>
                    <div className="flex gap-6 max-lg:gap-4 max-lg:flex-col">
                        <a href="/terms" className="text-(--text) no-underline hover:text-(--accent) transition-colors duration-200">Términos y Condiciones</a>
                        <a href="/privacy" className="text-(--text) no-underline hover:text-(--accent) transition-colors duration-200">Política de Privacidad</a>
                        
                        <a href="/contact" className="text-(--text) no-underline hover:text-(--accent) transition-colors duration-200">Contacto</a>
                    </div>
                </div>
                <div className="border-t border-(--border) mt-3 pt-3 text-(--text) flex justify-between max-lg:flex-col max-lg:gap-1">
                    <span>Chile</span>
                    <span className="text-(--accent) font-bold">SYSTEM: ONLINE</span>
                </div>
            </div>
        </footer>
    )
}