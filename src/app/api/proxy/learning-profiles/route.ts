import { serverApiFetch } from "@/lib/server-api";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  return serverApiFetch('/learning-profiles', { method: 'GET' }, token);
}
