import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-24 text-center">
      <p className="text-7xl font-light text-madera">404</p>
      <h1 className="mt-4 text-2xl font-light text-cafe">No encontramos lo que buscás</h1>
      <Link
        href="/productos"
        className="mt-8 inline-block rounded-full bg-oliva px-6 py-2 text-sm text-white hover:opacity-90"
      >
        Ver productos
      </Link>
    </main>
  );
}