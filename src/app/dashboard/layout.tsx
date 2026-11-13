import type { ReactNode } from "react";
import { requireStaff } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  await requireStaff();

  return <div className="min-h-screen">{children}</div>;
}
