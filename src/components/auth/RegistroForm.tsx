"use client";

import { useState } from "react";
import Link from "next/link";
import { registrarCliente } from "@/app/actions";

const campo =
  "w-full rounded-lg border border-madera/40 bg-background px-4 py-3 text-base text-foreground placeholder:text-tinta/40 focus:border-madera focus:outline-2 focus:outline-madera/30";

type DatosRegistro = {
  username: string;
  email: string;
  nombre: string;
  apellido: string;
  telefono: string;
  password: string;
  password_confirm: string;
};

const inicial: DatosRegistro = {
  username: "",
  email: "",
  nombre: "",
  apellido: "",
  telefono: "",
  password: "",
  password_confirm: "",
};

export default function RegistroForm() {
  const [datos, setDatos] = useState(inicial);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const [enviando, setEnviando] = useState(false);

  function cambiar(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    setDatos((actuales) => ({
      ...actuales,
      [e.target.name]: e.target.value,
    }));
  }

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setExito("");

    if (datos.password !== datos.password_confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setEnviando(true);

    try {
      const resultado = await registrarCliente(datos);

      if ("error" in resultado) {
        setError(resultado.error);
      } else {
        setExito(resultado.message);
        setDatos(inicial);
      }
    } catch {
      setError("No se pudo completar el registro. Intentá nuevamente.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form
      onSubmit={enviar}
      className="w-full max-w-xl rounded-2xl border border-madera/30 bg-card p-8 shadow-sm sm:p-10"
    >
      <h1 className="text-3xl font-light text-cafe">Crear una cuenta</h1>
      <p className="mb-8 mt-2 text-sm text-tinta/60">
        Registrate en PlacarApp para realizar tus compras.
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm font-medium text-tinta">
          Nombre
          <input
            name="nombre"
            value={datos.nombre}
            onChange={cambiar}
            autoComplete="given-name"
            required
            maxLength={100}
            className={campo}
          />
        </label>

        <label className="grid gap-1.5 text-sm font-medium text-tinta">
          Apellido
          <input
            name="apellido"
            value={datos.apellido}
            onChange={cambiar}
            autoComplete="family-name"
            required
            maxLength={100}
            className={campo}
          />
        </label>

        <label className="grid gap-1.5 text-sm font-medium text-tinta sm:col-span-2">
          Correo electrónico
          <input
            name="email"
            type="email"
            value={datos.email}
            onChange={cambiar}
            autoComplete="email"
            required
            maxLength={254}
            className={campo}
          />
        </label>

        <label className="grid gap-1.5 text-sm font-medium text-tinta sm:col-span-2">
          Nombre de usuario
          <input
            name="username"
            value={datos.username}
            onChange={cambiar}
            autoComplete="username"
            required
            minLength={3}
            maxLength={150}
            className={campo}
          />
        </label>

        <label className="grid gap-1.5 text-sm font-medium text-tinta">
          Teléfono <span className="font-normal text-tinta/50">(opcional)</span>
          <input
            name="telefono"
            type="tel"
            value={datos.telefono}
            onChange={cambiar}
            autoComplete="tel"
            maxLength={30}
            className={campo}
          />
        </label>

        <div className="hidden sm:block" />

        <label className="grid gap-1.5 text-sm font-medium text-tinta">
          Contraseña
          <input
            name="password"
            type="password"
            value={datos.password}
            onChange={cambiar}
            autoComplete="new-password"
            required
            minLength={8}
            className={campo}
          />
        </label>

        <label className="grid gap-1.5 text-sm font-medium text-tinta">
          Confirmar contraseña
          <input
            name="password_confirm"
            type="password"
            value={datos.password_confirm}
            onChange={cambiar}
            autoComplete="new-password"
            required
            minLength={8}
            className={campo}
          />
        </label>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-5 rounded-lg bg-red-100 px-3 py-2 text-sm text-red-800"
        >
          {error}
        </p>
      )}

      {exito && (
        <div
          role="status"
          className="mt-5 rounded-lg bg-green-100 px-4 py-3 text-sm text-green-900"
        >
          {exito}
          <p className="mt-2">
            <Link href="/login" className="font-semibold underline">
              Ir a iniciar sesión
            </Link>
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={enviando}
        className="mt-8 w-full rounded-full bg-oliva px-6 py-3 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
      >
        {enviando ? "Creando cuenta..." : "Crear cuenta"}
      </button>

      <p className="mt-6 text-center text-sm text-tinta/70">
        ¿Ya tenés una cuenta?{" "}
        <Link href="/login" className="font-semibold text-accent underline">
          Iniciar sesión
        </Link>
      </p>
    </form>
  );
}
