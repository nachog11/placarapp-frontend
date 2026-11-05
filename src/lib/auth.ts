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