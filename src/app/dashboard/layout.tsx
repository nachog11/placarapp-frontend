import type { ReactNode } from "react";
import Link from "next/link";
import { logout } from "@/app/actions";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-madera/30 bg-arena/50">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-lg font-light text-cafe">
              PlacarApp · Panel
            </Link>
            <Link href="/dashboard/productos" className="text-sm text-tinta hover:text-cafe">
              Productos
            </Link>
            <Link href="/productos" className="text-sm text-tinta hover:text-cafe">
              Ver tienda
            </Link>
          </div>
          <form action={logout}>
            <button className="rounded-full border border-madera/50 px-4 py-1.5 text-sm text-cafe hover:bg-arena">
              Cerrar sesión
            </button>
          </form>
        </nav>
      </header>
      {children}
    </div>
  );
}