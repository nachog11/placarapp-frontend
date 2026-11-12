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
  "w-full rounded-lg border border-madera/40 bg-background px-4 py-3 text-base text-foreground placeholder:text-tinta/40 focus:border-madera focus:outline-2 focus:outline-madera/30";

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
      className="w-full max-w-md rounded-2xl border border-madera/30 bg-card p-10 shadow-sm"
    >
      <h1 className="text-3xl font-light text-cafe">Iniciar sesión</h1>

      <p className="mb-8 mt-2 text-sm text-tinta/60">PlacarApp · Mueblería</p>

      <div className="grid gap-5">
        <label className="grid gap-1.5 text-sm font-medium text-tinta">
          Usuario
          <input
            {...register("username")}
            autoComplete="username"
            autoFocus
            className={campo}
          />
          {errors.username && (
            <span className="text-xs font-normal text-red-700 dark:text-red-400">
              {errors.username.message}
            </span>
          )}
        </label>

        <label className="grid gap-1.5 text-sm font-medium text-tinta">
          Contraseña
          <input
            {...register("password")}
            type="password"
            autoComplete="current-password"
            className={campo}
          />
          {errors.password && (
            <span className="text-xs font-normal text-red-700 dark:text-red-400">
              {errors.password.message}
            </span>
          )}
        </label>
      </div>

      {errorServidor && (
        <p
          role="alert"
          className="mt-5 rounded-lg bg-red-100 px-3 py-2 text-sm text-red-800"
        >
          {errorServidor}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-8 w-full rounded-full bg-oliva px-6 py-3 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
      >
        {isSubmitting ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}