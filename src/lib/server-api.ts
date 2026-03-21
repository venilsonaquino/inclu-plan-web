import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

/**
 * Interface padronizada para erros na API BFF
 */
export interface ApiProxyError {
  error: string;
  status: number;
}

/**
 * Função utilitária (Proxy) centralizada para conectar o Next.js (Server/API) ao backend real (NestJS).
 * Garante padronização de Headers, tratamento de erros de rede (503), e coerência de módulos.
 */
export async function serverApiFetch<T>(
  endpoint: string,
  options?: RequestInit,
  token?: string
): Promise<NextResponse<T | ApiProxyError | any[]>> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options?.headers as Record<string, string> || {}),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Se o backend retornou Not Found ou Server Error
    if (!res.ok) {
      let errorData;
      try {
        errorData = await res.json();
      } catch (e) {
        errorData = { message: res.statusText };
      }
      return NextResponse.json(
        { error: errorData.message || "Falha na comunicação com o backend", status: res.status },
        { status: res.status }
      );
    }

    // Retornos com status 204 (No Content)
    if (res.status === 204) {
      return NextResponse.json({ success: true } as any, { status: 204 });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error(`[Server API Error] on ${endpoint}:`, error);
    // Para evitar falsos positivos de sucesso ("200 OK" com dados vazios),
    // sempre repassamos o erro da infraestrutura (ex: 503 Service Unavailable).
    // O frontend React deve lidar com esse cenário adequadamente (ex: mostrando mensagem de erro).
    
    return NextResponse.json(
      { error: "Backend indispovível ou fora do ar (Service Unavailable)", status: 503 },
      { status: 503 }
    );
  }
}
