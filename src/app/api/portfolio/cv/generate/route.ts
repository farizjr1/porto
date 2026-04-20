import { NextResponse } from "next/server";
import { regenerateCv } from "@/lib/database";
import { isAuthorizedDashboardRequest } from "@/lib/requestParsers";

export async function POST(request: Request) {
  if (!(await isAuthorizedDashboardRequest())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const cvContent = await regenerateCv();

  return NextResponse.json({ cvContent });
}
