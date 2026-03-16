import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { decodeJwt } from "@/lib/auth-utils";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const payload = decodeJwt(token);
  
  if (!payload) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  // The payload usually has 'name' or 'email' or 'sub' (ID)
  // Based on the user's request, we expect a name property to be there.
  return NextResponse.json({
    name: payload.name || payload.email || "Professor",
    id: payload.sub
  });
}
