import { serverApiFetch } from "@/lib/server-api";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  return serverApiFetch(`/lessons/${id}`, { method: 'GET' }, token);
}
