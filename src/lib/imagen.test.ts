import { describe, expect, it } from "vitest";
import { extraerImagen, unirImagen, urlDeImagen } from "./imagen";

describe("imagen", () => {
  it("guarda y recupera el link de la imagen sin perder la descripción", () => {
    const guardado = unirImagen("Mesa de roble hermosa", "https://sitio.com/foto.jpg");
    expect(extraerImagen(guardado)).toEqual({
      texto: "Mesa de roble hermosa",
      imagen: "https://sitio.com/foto.jpg",
    });
  });

  it("no agrega nada si no hay imagen", () => {
    expect(unirImagen("Mesa de roble hermosa", "")).toBe("Mesa de roble hermosa");
  });

  it("devuelve la descripción intacta si no tiene marca de imagen", () => {
    expect(extraerImagen("Mesa de roble hermosa")).toEqual({
      texto: "Mesa de roble hermosa",
      imagen: "",
    });
  });

  it("convierte un link de Drive en una URL de imagen y deja otros links igual", () => {
    expect(urlDeImagen("https://drive.google.com/file/d/ABC123/view?usp=sharing")).toBe(
      "https://drive.google.com/thumbnail?id=ABC123&sz=w1000",
    );
    expect(urlDeImagen("https://sitio.com/foto.jpg")).toBe("https://sitio.com/foto.jpg");
  });
});