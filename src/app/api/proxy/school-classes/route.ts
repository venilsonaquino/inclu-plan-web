import { serverApiFetch } from "@/lib/server-api";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  return serverApiFetch('/school-classes', { method: 'GET' }, token);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    
    return serverApiFetch('/school-classes', {
      method: 'POST',
      body: JSON.stringify(body),
    }, token);
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
  }
}
