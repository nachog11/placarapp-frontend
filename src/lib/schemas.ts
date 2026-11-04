import { z } from "zod";

export const productoSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede superar los 100 caracteres"),
  descripcion: z
    .string()
    .trim()
    .min(10, "La descripción debe tener al menos 10 caracteres"),
  imagen: z
    .string()
    .trim()
    .refine(
      (v) => v === "" || /^https?:\/\//i.test(v),
      "Ingresá un link que empiece con http:// o https://",
    ),
  precio: z
    .string()
    .min(1, "Ingresá un precio")
    .refine(
      (v) => !Number.isNaN(Number(v)) && Number(v) > 0,
      "Ingresá un precio válido mayor a 0 (ej: 150000)",
    ),
  stock: z
    .string()
    .min(1, "Ingresá el stock")
    .refine(
      (v) => Number.isInteger(Number(v)) && Number(v) >= 0,
      "El stock debe ser un número entero, 0 o mayor",
    ),
  categoria: z.string().min(1, "Elegí una categoría"),
  materiales: z.array(z.string()),
  destacado: z.boolean(),
  activo: z.boolean(),
});

export type ProductoFormValues = z.infer<typeof productoSchema>;