import Link from "next/link";
import { buttonStyles } from "@/components/ui/Button";

const categorias = [
  { nombre: "Placares", detalle: "A medida, con puertas corredizas o batientes." },
  { nombre: "Cómodas", detalle: "Orden y estilo para el dormitorio." },
  { nombre: "Escritorios", detalle: "Espacios de trabajo cómodos y funcionales." },
  { nombre: "Bibliotecas", detalle: "Estantes para libros y decoración." },
];

const ventajas = [
  {
    titulo: "Materiales seleccionados",
    texto: "Trabajamos con maderas y melaminas de calidad, con buena terminación.",
  },
  {
    titulo: "Retiro o envío",
    texto: "Elegí retirar en una sucursal o recibir tu pedido en tu domicilio.",
  },
  {
    titulo: "Seguimiento online",
    texto: "Mirá el estado de tu pedido y de tu envío desde tu cuenta.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center md:py-28">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">
            Muebles y placares
          </p>
          <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
            Armá cada ambiente de tu casa con PlacarApp
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
            Explorá el catálogo, elegí tus muebles y hacé tu pedido online, con
            retiro en sucursal o envío a domicilio.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/productos" className={buttonStyles({ size: "lg" })}>
              Ver productos
            </Link>
            <Link
              href="/nosotros"
              className={buttonStyles({ variant: "outline", size: "lg" })}
            >
              Conocenos
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-bold md:text-3xl">Categorías</h2>
        <p className="mt-2 text-muted">
          Encontrá lo que necesitás para tu hogar.
        </p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categorias.map((categoria) => (
            <li key={categoria.nombre}>
              <Link
                href="/productos"
                className="block h-full rounded-xl border border-border bg-card p-5 transition-colors hover:border-accent"
              >
                <h3 className="text-lg font-semibold text-accent">
                  {categoria.nombre}
                </h3>
                <p className="mt-2 text-sm text-muted">
                  {categoria.detalle}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl font-bold md:text-3xl">
            ¿Por qué PlacarApp?
          </h2>
          <ul className="mt-8 grid gap-6 md:grid-cols-3">
            {ventajas.map((ventaja, index) => (
              <li key={ventaja.titulo}>
                <span
                  aria-hidden="true"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground"
                >
                  {index + 1}
                </span>
                <h3 className="mt-3 font-semibold">{ventaja.titulo}</h3>
                <p className="mt-1 text-sm text-muted">{ventaja.texto}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 text-center">
        <h2 className="text-2xl font-bold md:text-3xl">
          ¿Tenés dudas o querés un presupuesto?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-muted">
          Escribinos desde el formulario de contacto y te respondemos a la
          brevedad.
        </p>
        <Link
          href="/nosotros#contacto"
          className={buttonStyles({ className: "mt-6" })}
        >
          Contactanos
        </Link>
      </section>
    </>
  );
}
