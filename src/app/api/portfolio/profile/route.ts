import { NextResponse } from "next/server";
import { updateProfile } from "@/lib/database";
import { isAuthorizedDashboardRequest, parseProfileBody } from "@/lib/requestParsers";

export async function PUT(request: Request) {
  if (!(await isAuthorizedDashboardRequest(request))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = parseProfileBody(body);

  if (!parsed) {
    return NextResponse.json({ message: "Data profil tidak valid." }, { status: 400 });
  }

  const profile = await updateProfile(parsed);

  return NextResponse.json(profile);
}
