import { z } from "zod";

export const contactSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(2, "Ingresá tu nombre (mínimo 2 caracteres)")
    .max(80, "El nombre es demasiado largo"),
  email: z.string().trim().email("Ingresá un email válido"),
  asunto: z
    .string()
    .trim()
    .min(3, "El asunto debe tener al menos 3 caracteres")
    .max(100, "El asunto es demasiado largo"),
  mensaje: z
    .string()
    .trim()
    .min(10, "El mensaje debe tener al menos 10 caracteres")
    .max(500, "El mensaje no puede superar los 500 caracteres"),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
