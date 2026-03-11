import { serverApiFetch } from "@/lib/server-api";
import { NextResponse } from "next/server";

export async function GET() {
  return serverApiFetch('/school-classes', { method: 'GET' });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    return serverApiFetch('/school-classes', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
  }
}
