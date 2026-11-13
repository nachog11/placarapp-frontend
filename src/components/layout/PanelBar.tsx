"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuth } from "@/context/auth/AuthContext";

const enlaces = [
  { href: "/dashboard", label: "Resumen" },
  { href: "/dashboard/productos", label: "Gestionar productos" },
  { href: "/dashboard/productos/nuevo", label: "Nuevo producto" },
];

export default function PanelBar() {
  const pathname = usePathname();
  const { authenticated, loading, staff } = useAuth();

  if (loading || !authenticated || !staff) return null;

  const activo = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    if (href === "/dashboard/productos") {
      return pathname.startsWith("/dashboard/productos") && !pathname.endsWith("/nuevo");
    }
    return pathname === href;
  };

  return (
    <div className="sticky top-16 z-30 border-b border-madera/30 bg-arena/90 backdrop-blur">
      <nav
        aria-label="Panel de administración"
        className="mx-auto flex max-w-6xl items-center gap-6 overflow-x-auto px-6 py-3"
      >
        <Link href="/dashboard" className="shrink-0 text-lg font-light text-cafe">
          PlacarApp · Panel
        </Link>
        {enlaces.map((enlace) => (
          <Link
            key={enlace.href}
            href={enlace.href}
            aria-current={activo(enlace.href) ? "page" : undefined}
            className={`shrink-0 text-sm hover:text-cafe ${
              activo(enlace.href) ? "font-medium text-cafe underline underline-offset-4" : "text-tinta"
            }`}
          >
            {enlace.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
