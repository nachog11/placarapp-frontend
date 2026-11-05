"use client";

import { useActionState } from "react";
import { login } from "@/app/actions";

const campo =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-amber-700 focus:outline-2 focus:outline-amber-700/30";

export default function LoginPage() {
  const [estado, accion, pendiente] = useActionState(login, null);

  return (
    <div className="grid min-h-screen place-items-center bg-stone-100 px-5">
      <form
        action={accion}
        className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        <h1 className="text-2xl font-semibold text-slate-900">Iniciar sesión</h1>
        <p className="mb-6 mt-1 text-sm text-slate-500">PlacarApp · Mueblería</p>

        <div className="grid gap-4">
          <label className="grid gap-1.5 text-sm font-medium text-slate-700">
            Usuario
            <input name="username" autoComplete="username" required autoFocus className={campo} />
          </label>
          <label className="grid gap-1.5 text-sm font-medium text-slate-700">
            Contraseña
            <input name="password" type="password" autoComplete="current-password" required className={campo} />
          </label>
        </div>

        {estado?.error && (
          <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
            {estado.error}
          </p>
        )}

        <button
          disabled={pendiente}
          className="mt-6 w-full rounded-lg bg-amber-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-amber-900 disabled:opacity-60"
        >
          {pendiente ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}