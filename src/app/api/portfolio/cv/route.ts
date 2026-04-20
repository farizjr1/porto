import { NextResponse } from "next/server";
import { updateCvContent } from "@/lib/database";
import { isAuthorizedDashboardRequest, parseCvBody } from "@/lib/requestParsers";

export async function PUT(request: Request) {
  if (!(await isAuthorizedDashboardRequest())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = parseCvBody(body);

  if (!parsed) {
    return NextResponse.json({ message: "Data CV tidak valid." }, { status: 400 });
  }

  const cvContent = await updateCvContent(parsed);

  return NextResponse.json({ cvContent });
}
