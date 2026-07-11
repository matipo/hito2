export function Privacy({ path: _path }: { path?: string }) {
  return (
    <div className="pt-13">
      <main className="w-281.5 max-w-full mx-auto border-x border-(--border) min-h-svh flex flex-col box-border">
        <article className="p-6 max-lg:p-4 text-(--text) text-sm leading-relaxed">
          <h1 className="font-bold text-(--text-h) text-2xl mb-6 max-lg:text-xl">Política de Privacidad</h1>

          <p className="mb-4">Última actualización: {new Date().getFullYear()}</p>

          <h2 className="font-bold text-(--text-h) text-lg mt-6 mb-2">1. Información que Recopilamos</h2>
          <p className="mb-4">Recopilamos información que usted proporciona directamente, como nombre de usuario, correo electrónico y datos de transacción. También recopilamos datos de uso automático como dirección IP, tipo de navegador y páginas visitadas.</p>

          <h2 className="font-bold text-(--text-h) text-lg mt-6 mb-2">2. Cómo Usamos su Información</h2>
          <p className="mb-2">Utilizamos su información para:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Proveer y mejorar nuestros servicios</li>
            <li>Procesar transacciones y verificar identidades</li>
            <li>Comunicarnos sobre actualizaciones y novedades</li>
            <li>Prevenir fraude y asegurar la plataforma</li>
          </ul>

          <h2 className="font-bold text-(--text-h) text-lg mt-6 mb-2">3. Compartir Información</h2>
          <p className="mb-4">No vendemos su información personal. Podemos compartir datos con otros usuarios según sea necesario para completar transacciones, y con autoridades legales cuando sea requerido por ley.</p>

          <h2 className="font-bold text-(--text-h) text-lg mt-6 mb-2">4. Cookies</h2>
          <p className="mb-4">Utilizamos cookies y tecnologías similares para mejorar su experiencia, recordar preferencias y analizar el tráfico del sitio. Puede configurar su navegador para rechazar cookies.</p>

          <h2 className="font-bold text-(--text-h) text-lg mt-6 mb-2">5. Seguridad</h2>
          <p className="mb-4">Implementamos medidas de seguridad técnicas y organizativas para proteger su información. Sin embargo, ningún sistema es completamente infalible.</p>

          <h2 className="font-bold text-(--text-h) text-lg mt-6 mb-2">6. Sus Derechos</h2>
          <p className="mb-4">Usted tiene derecho a acceder, corregir, eliminar y portar sus datos personales. Para ejercer estos derechos, contacte a nuestro equipo de privacidad.</p>

          <h2 className="font-bold text-(--text-h) text-lg mt-6 mb-2">7. Cambios a esta Política</h2>
          <p>Podemos actualizar esta política periódicamente. Le notificaremos sobre cambios significativos a través de la plataforma.</p>
        </article>
      </main>
    </div>
  )
}