import { API_URL, list } from "@/lib/api";
import { getToken } from "@/lib/auth";

export const ENDPOINTS_PEDIDOS = {
  pedidos: "/api/ventas/pedidos/",
  sucursales: "/api/logistica/sucursales/",
  direcciones: "/api/clientes/direcciones/",
  clientes: "/api/clientes/clientes/",
};

export type EstadoPedido = "PENDIENTE" | "PAGADO" | "ENVIADO" | "ENTREGADO" | "CANCELADO";

export type DetallePedido = {
  id: number;
  pedido: number;
  producto: number;
  cantidad: number;
  precio_unitario: string;
};

export type Pago = {
  id: number;
  metodo: string;
  monto: string;
  aprobado: boolean;
};

export type Pedido = {
  id: number;
  cliente: number;
  fecha_venta: string;
  monto_total: string;
  estado: EstadoPedido;
  tipo_entrega: "RETIRO" | "ENVIO";
  sucursal_retiro: number | null;
  direccion_envio: number | null;
  detalles_pedido: DetallePedido[];
  pago: Pago | null;
};

export type Sucursal = { id: number; nombre: string; direccion: string; ciudad: string };

export type Direccion = {
  id: number;
  calle: string;
  numero: string;
  ciudad: string;
  codigo_postal: string;
};

export type Cliente = { id: number; nombre: string; apellido: string; email: string };

export const getPedidos = () => list<Pedido>(ENDPOINTS_PEDIDOS.pedidos);

export const getSucursales = () => list<Sucursal>(ENDPOINTS_PEDIDOS.sucursales);

// El back ya filtra: solo devuelve las direcciones del usuario logueado
export const getDirecciones = () => list<Direccion>(ENDPOINTS_PEDIDOS.direcciones);

// El back ya filtra: devuelve solo el perfil del usuario logueado (o ninguno)
export async function getCliente(): Promise<Cliente | null> {
  const clientes = await list<Cliente>(ENDPOINTS_PEDIDOS.clientes);
  return clientes[0] ?? null;
}

// OJO: el back devuelve los pedidos de todos los usuarios, así que filtramos por nuestro cliente acá
export async function getMisPedidos(): Promise<Pedido[]> {
  const [cliente, pedidos] = await Promise.all([getCliente(), getPedidos()]);
  if (!cliente) return [];
  return pedidos.filter((p) => p.cliente === cliente.id);
}

export async function getPedido(id: string): Promise<Pedido | null> {
  const token = await getToken();
  const headers: HeadersInit = token ? { Authorization: `Token ${token}` } : {};

  const res = await fetch(`${API_URL}${ENDPOINTS_PEDIDOS.pedidos}${id}/`, {
    headers,
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`La API respondió ${res.status} al pedir el pedido ${id}`);
  return res.json();
}
