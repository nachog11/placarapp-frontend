export type Categoria = {
    id: number;
    nombre: string;
    descripcion?: string;
    activa?: boolean;
  };
  
  export type Material = {
    id: number;
    nombre: string;
    descripcion?: string;
  };
  
  // Lo que devuelve GET /api/productos/ (categoría y materiales anidados)
  export type ProductoLista = {
    id: number;
    nombre: string;
    descripcion: string;
    precio: string;
    stock: number;
    categoria: Categoria | null;
    materiales: Material[];
    destacado: boolean;
    activo: boolean;
  };
  
  // Lo que devuelve el detalle y lo que se envía al crear o editar (solo ids)
  export type ProductoDetalle = {
    id: number;
    nombre: string;
    descripcion: string;
    precio: string;
    stock: number;
    categoria: number | null;
    materiales: number[];
    destacado: boolean;
    activo: boolean;
  };