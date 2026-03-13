import { NextRequest, NextResponse } from "next/server";
import { serverApiFetch } from "@/lib/server-api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // We assume the NestJS backend has a /auth/register endpoint.
    // Replace with the correct endpoint if different.
    const response = await serverApiFetch<{ id: string; email: string }>('/identity/register', {
      method: "POST",
      body: JSON.stringify(body),
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to process registration request" },
      { status: 500 }
    );
  }
}
