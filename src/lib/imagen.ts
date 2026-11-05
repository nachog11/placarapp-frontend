// La imagen se guarda al final de la descripción como "[imagen]: <link>"

export function extraerImagen(descripcion: string): { texto: string; imagen: string } {
    const m = descripcion.match(/\n*\[imagen\]:\s*(\S+)\s*$/);
    if (!m) return { texto: descripcion, imagen: "" };
    return { texto: descripcion.slice(0, m.index ?? descripcion.length).trim(), imagen: m[1] };
  }
  
  export function unirImagen(texto: string, imagen: string): string {
    const t = texto.trim();
    const i = imagen.trim();
    return i ? `${t}\n\n[imagen]: ${i}` : t;
  }
  
  // Convierte un link de Google Drive en una URL que sirve para <img>
  export function urlDeImagen(imagen: string): string {
    const drive =
      imagen.match(/drive\.google\.com\/file\/d\/([^/?#]+)/) ??
      imagen.match(/drive\.google\.com\/(?:open|uc)\?[^#]*id=([^&#]+)/);
    if (drive) return `https://drive.google.com/thumbnail?id=${drive[1]}&sz=w1000`;
    return imagen;
  }