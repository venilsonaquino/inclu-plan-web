import { NextRequest, NextResponse } from "next/server";
import { serverApiFetch } from "@/lib/server-api";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Proxy the login request to the NestJS backend
    const response = await serverApiFetch<{ accessToken?: string; token?: string }>(
      '/auth/login',
      {
        method: "POST",
        body: JSON.stringify(body),
      }
    );

    // If the login was successful, extract the token and set it as a cookie
    if (response.ok) {
      const data: any = await response.json();
      const token = data.accessToken || data.token;

      if (token) {
        const cookieStore = await cookies();
        cookieStore.set("auth_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 7, // 1 week
        });

        // Return success response to the client
        return NextResponse.json({ success: true });
      }
    }

    return response;
  } catch (error: any) {
    console.error("[Login Proxy Error]:", error);
    return NextResponse.json(
      { error: error.message || "Falha ao processar solicitação de login" },
      { status: 500 }
    );
  }
}
