import type { Metadata } from "next";

import ContactForm from "@/components/forms/ContactForm";

export const metadata: Metadata = {
  title: "Nosotros",
  description: "Conocé al equipo y la historia detrás de PlacarApp.",
};

const equipo = [
  { nombre: "Valentina", rol: "Catálogo y productos" },
  { nombre: "Ignacio", rol: "Clientes y autenticación" },
  { nombre: "Marcos A", rol: "Ventas y pedidos" },
  { nombre: "Marcos F", rol: "Logística y envíos" },
];

export default function NosotrosPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <header className="max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight">Sobre nosotros</h1>
        <p className="mt-4 text-lg text-muted">
          PlacarApp nació como un proyecto de la materia Ingeniería de Software:
          una mueblería online con catálogo, clientes, ventas y logística,
          construida con Django REST Framework en el Back y Next.js en el
          Front.
        </p>
      </header>

      <section className="mt-12" aria-labelledby="equipo-titulo">
        <h2 id="equipo-titulo" className="text-2xl font-bold">
          El equipo
        </h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {equipo.map((persona) => (
            <li
              key={persona.nombre}
              className="rounded-xl border border-border bg-card p-5"
            >
              <p className="font-semibold text-accent">{persona.nombre}</p>
              <p className="mt-1 text-sm text-muted">{persona.rol}</p>
            </li>
          ))}
        </ul>
      </section>

      <section
        id="contacto"
        className="mt-16 scroll-mt-24"
        aria-labelledby="contacto-titulo"
      >
        <h2 id="contacto-titulo" className="text-2xl font-bold">
          Contacto
        </h2>
        <p className="mt-2 max-w-2xl text-muted">
          ¿Querés consultar por un producto o pedir un presupuesto? Completá el
          formulario y te respondemos.
        </p>
        <div className="mt-6 max-w-2xl">
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
