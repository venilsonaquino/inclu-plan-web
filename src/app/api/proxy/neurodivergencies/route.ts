import { serverApiFetch } from "@/lib/server-api";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  
  // Per user request, searching in /neurodivergencies
  return serverApiFetch('/neurodivergencies', { method: 'GET' }, token);
}
