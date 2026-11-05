"use client";

import { useState } from "react";
import { urlDeImagen } from "@/lib/imagen";

export default function ProductImage({
  imagen,
  nombre,
  className = "",
}: {
  imagen: string;
  nombre: string;
  className?: string;
}) {
  const [fallo, setFallo] = useState(false);

  return (
    <div
      className={`relative grid place-items-center overflow-hidden rounded-full bg-arena font-light text-madera ${className}`}
    >
      {imagen && !fallo ? (
        <img
          src={urlDeImagen(imagen)}
          alt={nombre}
          referrerPolicy="no-referrer"
          onError={() => setFallo(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span>{nombre.charAt(0).toUpperCase()}</span>
      )}
    </div>
  );
}