"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";

import Button from "@/components/ui/Button";
import { contactSchema, type ContactFormValues } from "@/lib/schemas/contact";

const inputClass =
  "mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground " +
  "placeholder:text-muted focus-visible:outline-2 focus-visible:outline-offset-1 " +
  "focus-visible:outline-accent aria-[invalid=true]:border-red-500";

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Formulario de contacto con React Hook Form + Zod.
 * Client Component: maneja estado y eventos del formulario.
 */
export default function ContactForm() {
  const [enviado, setEnviado] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { nombre: "", email: "", asunto: "", mensaje: "" },
  });

  const onSubmit = async (values: ContactFormValues) => {
    // El Back todavía no tiene un endpoint de contacto: se simula el envío.
    // Cuando exista, reemplazar por un fetch a la API (ver lib/api.ts).
    console.info("Consulta enviada:", values);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setEnviado(true);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-4 rounded-xl border border-border bg-card p-6"
    >
      {enviado && (
        <p
          role="status"
          className="rounded-lg border border-accent px-4 py-3 text-sm text-accent"
        >
          ¡Gracias! Recibimos tu consulta y te vamos a responder pronto.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="nombre" label="Nombre" error={errors.nombre?.message}>
          <input
            id="nombre"
            type="text"
            autoComplete="name"
            className={inputClass}
            aria-invalid={errors.nombre ? "true" : "false"}
            aria-describedby={errors.nombre ? "nombre-error" : undefined}
            {...register("nombre")}
          />
        </Field>

        <Field id="email" label="Email" error={errors.email?.message}>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className={inputClass}
            aria-invalid={errors.email ? "true" : "false"}
            aria-describedby={errors.email ? "email-error" : undefined}
            {...register("email")}
          />
        </Field>
      </div>

      <Field id="asunto" label="Asunto" error={errors.asunto?.message}>
        <input
          id="asunto"
          type="text"
          className={inputClass}
          aria-invalid={errors.asunto ? "true" : "false"}
          aria-describedby={errors.asunto ? "asunto-error" : undefined}
          {...register("asunto")}
        />
      </Field>

      <Field id="mensaje" label="Mensaje" error={errors.mensaje?.message}>
        <textarea
          id="mensaje"
          rows={5}
          className={inputClass}
          aria-invalid={errors.mensaje ? "true" : "false"}
          aria-describedby={errors.mensaje ? "mensaje-error" : undefined}
          {...register("mensaje")}
        />
      </Field>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Enviando..." : "Enviar consulta"}
      </Button>
    </form>
  );
}
