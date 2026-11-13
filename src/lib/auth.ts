import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getToken() {
  return (await cookies()).get("token")?.value;
}

export async function requireToken() {
  const token = await getToken();
  if (!token) redirect("/login");
  return token;
}

// Solo el personal (is_staff) entra al panel. El back igual lo exige al escribir.
export async function requireStaff() {
  const token = await requireToken();
  const esStaff = (await cookies()).get("staff")?.value === "1";
  if (!esStaff) redirect("/");
  return token;
}
