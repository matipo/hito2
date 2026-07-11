export function Terms({ path: _path }: { path?: string }) {
  return (
    <div className="pt-13">
      <main className="w-281.5 max-w-full mx-auto border-x border-(--border) min-h-svh flex flex-col box-border">
        <article className="p-6 max-lg:p-4 text-(--text) text-sm leading-relaxed">
          <h1 className="font-bold text-(--text-h) text-2xl mb-6 max-lg:text-xl">Términos y Condiciones</h1>

          <p className="mb-4">Última actualización: {new Date().getFullYear()}</p>

          <h2 className="font-bold text-(--text-h) text-lg mt-6 mb-2">1. Aceptación de los Términos</h2>
          <p className="mb-4">Al acceder y utilizar NULL_TRADE, usted acepta estar sujeto a estos Términos y Condiciones. Si no está de acuerdo con alguno de estos términos, no utilice el servicio.</p>

          <h2 className="font-bold text-(--text-h) text-lg mt-6 mb-2">2. Descripción del Servicio</h2>
          <p className="mb-4">NULL_TRADE es una plataforma de intercambio y compra-venta de videojuegos, cuentas, skins y contenidos digitales entre usuarios. No somos propietarios de los artículos listados y actuamos como intermediario entre compradores y vendedores.</p>

          <h2 className="font-bold text-(--text-h) text-lg mt-6 mb-2">3. Registro de Cuenta</h2>
          <p className="mb-4">Para utilizar ciertas funciones, deberá crear una cuenta. Usted es responsable de mantener la confidencialidad de sus credenciales y de todas las actividades realizadas bajo su cuenta.</p>

          <h2 className="font-bold text-(--text-h) text-lg mt-6 mb-2">4. Transacciones</h2>
          <p className="mb-4">Todas las transacciones se realizan entre usuarios. NULL_TRADE no garantiza la calidad, legality o disponibilidad de los artículos. Los precios son establecidos por los vendedores y pueden cambiar sin previo aviso.</p>

          <h2 className="font-bold text-(--text-h) text-lg mt-6 mb-2">5. Prohibiciones</h2>
          <p className="mb-2">Se prohíbe estrictamente:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Vender artículos robados o obtenidos de forma ilícita</li>
            <li>Publicar contenido fraudulento o engañoso</li>
            <li>Utilizar exploits, hacks o cualquier método que comprometa la integridad de la plataforma</li>
            <li>Realizar acoso o comportamiento abusivo hacia otros usuarios</li>
          </ul>

          <h2 className="font-bold text-(--text-h) text-lg mt-6 mb-2">6. Responsabilidad</h2>
          <p className="mb-4">NULL_TRADE no será responsable por pérdidas directas, indirectas, incidentales o consecuentes derivadas del uso de la plataforma. El usuario asume todos los riesgos asociados con las transacciones.</p>

          <h2 className="font-bold text-(--text-h) text-lg mt-6 mb-2">7. Modificaciones</h2>
          <p className="mb-4">Nos reservamos el derecho de modificar estos términos en cualquier momento. Las modificaciones entrarán en vigencia al ser publicadas en la plataforma.</p>

          <h2 className="font-bold text-(--text-h) text-lg mt-6 mb-2">8. Ley Aplicable</h2>
          <p>Estos términos se rigen por las leyes de la República de Chile. Cualquier disputa será sometida a los tribunales de Santiago de Chile.</p>
        </article>
      </main>
    </div>
  )
}