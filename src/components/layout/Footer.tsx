import Link from "next/link";

const navegacion = [
  { href: "/", label: "Inicio" },
  { href: "/productos", label: "Productos" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/carrito", label: "Carrito" },
];

/**
 * Server Component: es contenido estático, no necesita estado ni eventos del
 * navegador, así que no manda JavaScript al cliente.
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <p className="text-lg font-bold text-accent">PlacarApp</p>
          <p className="mt-2 text-sm text-muted">
            Muebles y placares para cada ambiente de tu casa. Proyecto de la EFI
            de Ingeniería de Software.
          </p>
        </div>

        <nav aria-label="Pie de página">
          <p className="text-sm font-semibold">Navegación</p>
          <ul className="mt-3 space-y-2 text-sm">
            {navegacion.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-muted transition-colors hover:text-accent"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="text-sm font-semibold">Contacto</p>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>Mendoza, Argentina</li>
            <li>contacto@placarapp.com</li>
            <li>
              <Link href="/nosotros#contacto" className="hover:text-accent">
                Escribinos desde el formulario
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border py-4 text-center text-xs text-muted">
        © {year} PlacarApp. Todos los derechos reservados.
      </div>
    </footer>
  );
}
