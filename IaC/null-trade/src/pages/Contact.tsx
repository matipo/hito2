export function Contact({ path: _path }: { path?: string }) {
  return (
    <div className="pt-13">
      <main className="w-281.5 max-w-full mx-auto border-x border-(--border) min-h-svh flex flex-col box-border">
        <article className="p-6 max-lg:p-4 text-(--text) text-sm leading-relaxed">
          <h1 className="font-bold text-(--text-h) text-2xl mb-6 max-lg:text-xl">Contacto</h1>

          <p className="mb-6">¿Tienes preguntas, sugerencias o necesitas soporte? Estamos aquí para ayudarte.</p>

          <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
            <div className="border border-(--border) rounded p-4">
              <h2 className="font-bold text-(--text-h) text-base mb-1">Soporte Técnico</h2>
              <p>soporte@nulltrade.cl</p>
              <p className="text-(--text) mt-1">Respuesta en 24-48 horas hábiles.</p>
            </div>

            <div className="border border-(--border) rounded p-4">
              <h2 className="font-bold text-(--text-h) text-base mb-1">Ventas y Transacciones</h2>
              <p>ventas@nulltrade.cl</p>
              <p className="text-(--text) mt-1">Consultas sobre compras, ventas y tradeos.</p>
            </div>

            <div className="border border-(--border) rounded p-4">
              <h2 className="font-bold text-(--text-h) text-base mb-1">Reportar un Problema</h2>
              <p>reportes@nulltrade.cl</p>
              <p className="text-(--text) mt-1">Fraude, estafas o conducta indebida.</p>
            </div>

            <div className="border border-(--border) rounded p-4">
              <h2 className="font-bold text-(--text-h) text-base mb-1">Redes Sociales</h2>
              <p>Discord: NULL_TRADE</p>
              <p className="text-(--text) mt-1">Comunidad y soporte en tiempo real.</p>
            </div>
          </div>
        </article>
      </main>
    </div>
  )
}