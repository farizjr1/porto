import { NextResponse } from "next/server";
import {
  loginDashboardUser,
  registerDashboardUser,
} from "@/lib/dashboardAuth";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { mode?: string; email?: string; password?: string }
    | null;
  const mode = body?.mode?.trim();
  const email = body?.email?.trim() ?? "";
  const password = body?.password?.trim() ?? "";

  if (mode !== "login" && mode !== "register") {
    return NextResponse.json({ message: "Mode autentikasi tidak valid." }, { status: 400 });
  }

  try {
    if (mode === "login") {
      const result = await loginDashboardUser(email, password);

      return NextResponse.json({
        ok: true,
        accessToken: result.accessToken,
        email: result.user.email ?? email,
      });
    }

    const result = await registerDashboardUser(email, password);

    if (result.requiresEmailConfirmation) {
      return NextResponse.json({
        ok: true,
        requiresEmailConfirmation: true,
        accessToken: "",
        email: result.user.email ?? email,
        message: "Akun berhasil dibuat. Cek email Anda untuk verifikasi, lalu login.",
      });
    }

    return NextResponse.json({
      ok: true,
      requiresEmailConfirmation: false,
      accessToken: result.accessToken,
      email: result.user.email ?? email,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Autentikasi gagal.";
    return NextResponse.json({ message }, { status: 401 });
  }
}
