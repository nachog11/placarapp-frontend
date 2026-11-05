"use server";

import { revalidatePath } from "next/cache";
import { API_URL, getProducto } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { ENDPOINTS_PEDIDOS, getCliente } from "@/lib/pedidos";
import { pedidoSchema, type PedidoFormValues } from "@/lib/pedidoSchema";

export type ItemCarrito = { id: number; cantidad: number };
export type ResultadoPedido = { ok: true; id: number } | { ok?: false; error: string };

const ENDPOINT_DETALLES = "/api/ventas/detalles/";

async function llamar(path: string, token: string, method: "POST" | "DELETE", body?: unknown) {
  return fetch(`${API_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json", Authorization: `Token ${token}` },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  }).catch(() => null);
}

// El back responde errores con formas distintas ({campo: [msg]}, {non_field_errors: [msg]}, ...)
function mensajeDeError(data: unknown): string {
  if (typeof data === "string") return data;
  if (Array.isArray(data)) return data.map(mensajeDeError).filter(Boolean).join(" ");
  if (data && typeof data === "object") {
    return Object.values(data).map(mensajeDeError).filter(Boolean).join(" ");
  }
  return "";
}

const SESION_VENCIDA = "Tu sesión venció. Volvé a iniciar sesión.";

/**
 * El back de ventas no crea los items junto con el pedido, no calcula el total
 * y no controla el stock. Por eso este flujo lo hace acá, en el servidor de Next:
 *   1. valida cada producto contra el catálogo (existe, está activo, hay stock)
 *   2. toma el PRECIO del catálogo (nunca el que manda el navegador) y calcula el total
 *   3. crea la dirección (si es nueva), el pedido y un detalle por producto
 *   4. si algo falla a mitad de camino, borra el pedido para no dejarlo a medias
 */
export async function crearPedido(
  valores: PedidoFormValues,
  items: ItemCarrito[],
): Promise<ResultadoPedido> {
  const token = await getToken();
  if (!token) return { error: SESION_VENCIDA };

  const parsed = pedidoSchema.safeParse(valores);
  if (!parsed.success) return { error: "Los datos del formulario no son válidos." };
  const v = parsed.data;

  if (items.length === 0) return { error: "Tu carrito está vacío." };
  if (items.some((i) => !Number.isInteger(i.cantidad) || i.cantidad < 1)) {
    return { error: "Hay una cantidad inválida en el carrito." };
  }

  // 0. El pedido necesita el id del perfil de cliente
  const cliente = await getCliente().catch(() => null);
  if (!cliente) return { error: "Necesitás un perfil de cliente para hacer pedidos." };

  // 1 y 2. Productos reales: precio y stock salen del catálogo
  const lineas: { producto: number; cantidad: number; precio: string }[] = [];
  let totalCentavos = 0;
  for (const item of items) {
    const producto = await getProducto(String(item.id)).catch(() => null);
    if (!producto || !producto.activo) {
      return { error: "Un producto de tu carrito ya no está disponible." };
    }
    if (item.cantidad > producto.stock) {
      return {
        error: `No hay stock suficiente de "${producto.nombre}" (disponible: ${producto.stock}).`,
      };
    }
    lineas.push({ producto: producto.id, cantidad: item.cantidad, precio: producto.precio });
    totalCentavos += Math.round(Number(producto.precio) * 100) * item.cantidad;
  }

  // 3a. Envío con dirección nueva: primero se guarda la dirección
  let direccionId: number | null = null;
  if (v.tipoEntrega === "ENVIO") {
    if (v.direccion === "nueva") {
      const res = await llamar(ENDPOINTS_PEDIDOS.direcciones, token, "POST", {
        calle: v.calle,
        numero: v.numero,
        ciudad: v.ciudad,
        codigo_postal: v.codigoPostal,
      });
      if (!res) return { error: "No se pudo conectar con la API." };
      if (res.status === 401 || res.status === 403) return { error: SESION_VENCIDA };
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        return { error: mensajeDeError(data) || "No se pudo guardar la dirección." };
      }
      direccionId = (await res.json()).id;
    } else {
      direccionId = Number(v.direccion);
    }
  }

  // 3b. El pedido
  const resPedido = await llamar(ENDPOINTS_PEDIDOS.pedidos, token, "POST", {
    cliente: cliente.id,
    tipo_entrega: v.tipoEntrega,
    sucursal_retiro: v.tipoEntrega === "RETIRO" ? Number(v.sucursal) : null,
    direccion_envio: direccionId,
    monto_total: (totalCentavos / 100).toFixed(2),
  });
  if (!resPedido) return { error: "No se pudo conectar con la API." };
  if (resPedido.status === 401 || resPedido.status === 403) return { error: SESION_VENCIDA };
  if (!resPedido.ok) {
    const data = await resPedido.json().catch(() => null);
    return { error: mensajeDeError(data) || "No se pudo registrar el pedido." };
  }
  const pedido = await resPedido.json();

  // 3c. Un detalle por producto
  for (const linea of lineas) {
    const resDetalle = await llamar(ENDPOINT_DETALLES, token, "POST", {
      pedido: pedido.id,
      producto: linea.producto,
      cantidad: linea.cantidad,
      precio_unitario: linea.precio,
    });
    if (!resDetalle || !resDetalle.ok) {
      // 4. Rollback: el back borra en cascada los detalles ya creados
      await llamar(`${ENDPOINTS_PEDIDOS.pedidos}${pedido.id}/`, token, "DELETE");
      const data = resDetalle ? await resDetalle.json().catch(() => null) : null;
      return { error: mensajeDeError(data) || "No se pudo registrar el pedido. Probá de nuevo." };
    }
  }

  revalidatePath("/pedidos");
  return { ok: true, id: pedido.id };
}
