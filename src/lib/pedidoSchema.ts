import { z } from "zod";

// Todos los valores del formulario son strings (igual que el formulario de producto)
export const pedidoSchema = z
  .object({
    tipoEntrega: z.enum(["RETIRO", "ENVIO"]),
    sucursal: z.string(),
    // id de una dirección guardada, o "nueva" para cargar una
    direccion: z.string(),
    calle: z.string().trim(),
    numero: z.string().trim(),
    ciudad: z.string().trim(),
    codigoPostal: z.string().trim(),
  })
  .superRefine((v, ctx) => {
    const falta = (path: keyof typeof v, message: string) =>
      ctx.addIssue({ code: "custom", path: [path], message });

    if (v.tipoEntrega === "RETIRO") {
      if (!v.sucursal) falta("sucursal", "Elegí una sucursal para retirar");
      return;
    }

    if (v.direccion !== "nueva") return;
    if (v.calle.length < 3) falta("calle", "Ingresá la calle");
    if (v.numero.length < 1) falta("numero", "Ingresá el número");
    if (v.ciudad.length < 2) falta("ciudad", "Ingresá la ciudad");
    if (v.codigoPostal.length < 3) falta("codigoPostal", "Ingresá el código postal");
  });

export type PedidoFormValues = z.infer<typeof pedidoSchema>;
