import { serverApiFetch } from "@/lib/server-api";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = searchParams.get("limit");
  const queryString = limit ? `?limit=${limit}` : "";

  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  return serverApiFetch(`/lessons${queryString}`, { method: 'GET' }, token);
}
