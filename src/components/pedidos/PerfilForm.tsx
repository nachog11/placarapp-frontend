"use client";

import { useActionState, type ReactNode } from "react";
import { crearPerfil } from "@/app/perfil/actions";

const campo =
  "w-full rounded-lg border border-madera/40 bg-white px-3 py-2.5 text-sm text-tinta focus:border-madera focus:outline-2 focus:outline-madera/30";

function Campo({ etiqueta, error, children }: { etiqueta: string; error?: string; children: ReactNode }) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-tinta">
      {etiqueta}
      {children}
      {error && (
        <span role="alert" className="text-xs font-normal text-red-700">
          {error}
        </span>
      )}
    </label>
  );
}

export function PerfilForm() {
  const [estado, accion, pendiente] = useActionState(crearPerfil, null);

  return (
    <form
      action={accion}
      className="grid h-fit gap-5 rounded-2xl border border-madera/30 bg-white p-6 shadow-sm"
    >
      <div className="grid grid-cols-2 gap-4">
        <Campo etiqueta="Nombre" error={estado?.errores?.nombre}>
          <input name="nombre" autoComplete="given-name" required className={campo} />
        </Campo>
        <Campo etiqueta="Apellido" error={estado?.errores?.apellido}>
          <input name="apellido" autoComplete="family-name" required className={campo} />
        </Campo>
      </div>
      <Campo etiqueta="Email" error={estado?.errores?.email}>
        <input name="email" type="email" autoComplete="email" required className={campo} />
      </Campo>
      <Campo etiqueta="Teléfono (opcional)" error={estado?.errores?.telefono}>
        <input name="telefono" type="tel" autoComplete="tel" className={campo} />
      </Campo>

      {estado?.error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
          {estado.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pendiente}
        className="rounded-full bg-cafe py-3 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
      >
        {pendiente ? "Guardando..." : "Guardar perfil"}
      </button>
    </form>
  );
}
