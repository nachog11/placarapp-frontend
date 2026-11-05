import { describe, expect, it } from "vitest";
import { productoSchema, type ProductoFormValues } from "./schemas";

const valido: ProductoFormValues = {
  nombre: "Mesa de roble",
  descripcion: "Mesa de comedor de roble macizo para seis personas",
  imagen: "",
  precio: "150000",
  stock: "5",
  categoria: "1",
  materiales: ["1", "2"],
  destacado: false,
  activo: true,
};

describe("productoSchema", () => {
  it("acepta un producto válido", () => {
    expect(productoSchema.safeParse(valido).success).toBe(true);
  });

  it("rechaza un nombre de menos de 3 caracteres", () => {
    const resultado = productoSchema.safeParse({ ...valido, nombre: "ab" });
    expect(resultado.success).toBe(false);
    if (!resultado.success) {
      expect(resultado.error.issues[0].message).toBe(
        "El nombre debe tener al menos 3 caracteres",
      );
    }
  });

  it("rechaza un precio que no es un número positivo", () => {
    for (const precio of ["abc", "-5", "0", ""]) {
      expect(productoSchema.safeParse({ ...valido, precio }).success).toBe(false);
    }
  });

  it("rechaza un stock con decimales o negativo y acepta 0", () => {
    expect(productoSchema.safeParse({ ...valido, stock: "2.5" }).success).toBe(false);
    expect(productoSchema.safeParse({ ...valido, stock: "-1" }).success).toBe(false);
    expect(productoSchema.safeParse({ ...valido, stock: "0" }).success).toBe(true);
  });

  it("exige elegir una categoría", () => {
    expect(productoSchema.safeParse({ ...valido, categoria: "" }).success).toBe(false);
  });

  it("elimina los espacios al inicio y al final del nombre", () => {
    const resultado = productoSchema.safeParse({ ...valido, nombre: "  Mesa de roble  " });
    expect(resultado.success).toBe(true);
    if (resultado.success) expect(resultado.data.nombre).toBe("Mesa de roble");
  });

  it("acepta una imagen vacía o con link, y rechaza un texto que no es link", () => {
    expect(productoSchema.safeParse({ ...valido, imagen: "" }).success).toBe(true);
    expect(
      productoSchema.safeParse({ ...valido, imagen: "https://drive.google.com/file/d/abc/view" })
        .success,
    ).toBe(true);
    expect(productoSchema.safeParse({ ...valido, imagen: "hola" }).success).toBe(false);
  });
});