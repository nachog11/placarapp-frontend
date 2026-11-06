"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "@/app/actions";
import {
  loginSchema,
  type LoginFormValues,
} from "@/lib/schemas/loginSchema";

const campo =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-amber-700 focus:outline-2 focus:outline-amber-700/30";

export default function LoginForm() {
  const [errorServidor, setErrorServidor] = useState("");
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(datos: LoginFormValues) {
  setErrorServidor("");

  const formData = new FormData();
  formData.append("username", datos.username);
  formData.append("password", datos.password);

  try {
    const resultado = await login(null, formData);

    if (resultado && "error" in resultado) {
      setErrorServidor(resultado.error);
      setError("root", { message: resultado.error });
      return;
    }

    if (resultado && "success" in resultado && resultado.success) {
      router.push("/dashboard");
      router.refresh();
    }
  } catch {
    setErrorServidor("Ocurrió un error al iniciar sesión.");
  }
}

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
    >
      <h1 className="text-2xl font-semibold text-slate-900">
        Iniciar sesión
      </h1>

      <p className="mb-6 mt-1 text-sm text-slate-500">
        PlacarApp · Mueblería
      </p>

      <div className="grid gap-4">
        <label className="grid gap-1.5 text-sm font-medium text-slate-700">
          Usuario
          <input
            {...register("username")}
            autoComplete="username"
            autoFocus
            className={campo}
          />
          {errors.username && (
            <span className="text-xs text-red-600">
              {errors.username.message}
            </span>
          )}
        </label>

        <label className="grid gap-1.5 text-sm font-medium text-slate-700">
          Contraseña
          <input
            {...register("password")}
            type="password"
            autoComplete="current-password"
            className={campo}
          />
          {errors.password && (
            <span className="text-xs text-red-600">
              {errors.password.message}
            </span>
          )}
        </label>
      </div>

      {errorServidor && (
        <p
          role="alert"
          className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800"
        >
          {errorServidor}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 w-full rounded-lg bg-amber-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-amber-900 disabled:opacity-60"
      >
        {isSubmitting ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}