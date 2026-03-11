import { serverApiFetch } from "@/lib/server-api";
import { NextResponse } from "next/server";

export async function GET() {
  return serverApiFetch('/grades', { method: 'GET' });
}
