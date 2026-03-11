import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333/api";

export async function GET() {
  try {
    const res = await fetch(`${API_BASE_URL}/turmas`);
    
    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch turmas from backend" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Backend connection error:", error);
    // Returning an empty array to allow the frontend to show the "Empty State" gracefully and not crash
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await fetch(`${API_BASE_URL}/turmas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to create turma on backend" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Backend connection error:", error);
    // Returning an error object to let the frontend handle the fallback
    return NextResponse.json({ error: "Backend unreachable" }, { status: 503 });
  }
}
