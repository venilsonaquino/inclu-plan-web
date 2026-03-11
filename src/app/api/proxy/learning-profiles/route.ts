import { serverApiFetch } from "@/lib/server-api";
import { NextResponse } from "next/server";

export async function GET() {
  // Conforme o Postman collection, a rota real é /learning-profiles (para buscar neurodivergências baseadas na collection original do sistema)
  return serverApiFetch('/learning-profiles', { method: 'GET' });
}
