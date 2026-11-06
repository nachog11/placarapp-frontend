import Link from "next/link";
import { buttonStyles } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
      <p className="text-6xl font-bold text-accent">404</p>
      <h1 className="mt-4 text-3xl font-bold">
        No encontramos esa página
      </h1>
      <p className="mt-3 text-muted">
        La dirección que buscás no existe o fue movida. Volvé al inicio o mirá
        nuestro catálogo.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/" className={buttonStyles()}>
          Ir al inicio
        </Link>
        <Link
          href="/productos"
          className={buttonStyles({ variant: "outline" })}
        >
          Ver productos
        </Link>
      </div>
    </section>
  );
}
