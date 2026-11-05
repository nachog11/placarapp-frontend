"use client";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 text-center">
      <h2 className="text-2xl font-light text-cafe">No pudimos cargar tus pedidos</h2>
      <p className="mt-2 text-sm text-tinta/70">
        Hubo un problema al conectar con el servidor, o tu sesión venció. Probá de nuevo.
      </p>
      <button
        onClick={reset}
        className="mt-6 rounded-full bg-oliva px-6 py-2 text-sm text-white hover:opacity-90"
      >
        Reintentar
      </button>
    </main>
  );
}
