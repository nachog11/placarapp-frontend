"use server";

import { revalidatePath } from "next/cache";
import { API_URL } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { getDirecciones } from "@/lib/pedidos";
import { pedidoSchema, type PedidoFormValues } from "@/lib/pedidoSchema";

export type ItemCarrito = { id: number; cantidad: number };
export type ResultadoPedido =
  | { ok: true; id: number }
  | { ok?: false; error: string };

const SESION_VENCIDA = "Tu sesión venció. Volvé a iniciar sesión.";

function mensajeDeError(data: unknown): string {
  if (typeof data === "string") return data;

  if (Array.isArray(data)) {
    return data.map(mensajeDeError).filter(Boolean).join(" ");
  }

  if (data && typeof data === "object") {
    return Object.values(data).map(mensajeDeError).filter(Boolean).join(" ");
  }

  return "";
}

export async function crearPedido(
  valores: PedidoFormValues,
  items: ItemCarrito[],
): Promise<ResultadoPedido> {
  const token = await getToken();

  if (!token) return { error: SESION_VENCIDA };

  const parsed = pedidoSchema.safeParse(valores);

  if (!parsed.success) {
    return { error: "Los datos del formulario no son válidos." };
  }

  const v = parsed.data;

  if (items.length === 0) {
    return { error: "Tu carrito está vacío." };
  }

  if (
    items.some(
      (item) =>
        !Number.isInteger(item.id) ||
        !Number.isInteger(item.cantidad) ||
        item.cantidad < 1
    )
  ) {
    return { error: "Hay un producto o una cantidad inválida en el carrito." };
  }

  let direccionEnvio: {
    calle: string;
    numero: string;
    ciudad: string;
    codigo_postal: string;
  } | null = null;

  if (v.tipoEntrega === "ENVIO") {
    if (v.direccion === "nueva") {
      direccionEnvio = {
        calle: v.calle,
        numero: v.numero,
        ciudad: v.ciudad,
        codigo_postal: v.codigoPostal,
      };
    } else {
      const direcciones = await getDirecciones().catch(() => null);

      const direccionGuardada = direcciones?.find(
        (direccion) => direccion.id === Number(v.direccion)
      );

      if (!direccionGuardada) {
        return {
          error: "La dirección seleccionada no existe o ya no está disponible.",
        };
      }

      direccionEnvio = {
        calle: direccionGuardada.calle,
        numero: direccionGuardada.numero,
        ciudad: direccionGuardada.ciudad,
        codigo_postal: direccionGuardada.codigo_postal,
      };
    }
  }

  const payload = {
    tipo_entrega: v.tipoEntrega,
    sucursal_retiro:
      v.tipoEntrega === "RETIRO" ? Number(v.sucursal) : null,
    direccion_envio: direccionEnvio,
    productos: items.map((item) => ({
      producto_id: item.id,
      cantidad: item.cantidad,
    })),
  };

  const response = await fetch(
    `${API_URL}/api/ventas/pedidos/crear_completo/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    },
  ).catch(() => null);

  if (!response) {
    return { error: "No se pudo conectar con la API." };
  }

  if (response.status === 401 || response.status === 403) {
    return { error: SESION_VENCIDA };
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    return {
      error: mensajeDeError(data) || "No se pudo registrar el pedido.",
    };
  }

  if (!data?.id) {
    return { error: "La API no devolvió el identificador del pedido." };
  }

  revalidatePath("/pedidos");

  return { ok: true, id: data.id };
}
