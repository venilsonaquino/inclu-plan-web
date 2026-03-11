import { serverApiFetch } from "@/lib/server-api";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Opcionalmente: Orquestração.
    // Se o backend real de /students já aceitar `neurodivergencies` no POST principal, só passamos.
    // Se precisarmos bater no `/student-learning-profiles/assign`, fazemos as duas chamadas aqui via BFF!
    
    return serverApiFetch('/students', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
  }
}
