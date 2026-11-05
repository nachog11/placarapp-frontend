import type { Metadata } from "next";
import { CartView } from "@/components/carrito/CartView";

export const metadata: Metadata = {
  title: "Carrito | PlacarApp",
};

// Server Component: solo arma la página. La lógica con useCart vive en CartView (Client).
export default function CartPage() {
  return <CartView />;
}
