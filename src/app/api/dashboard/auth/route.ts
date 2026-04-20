import { NextResponse } from "next/server";
import { isOwnerRequest } from "@/lib/requestParsers";

export const dynamic = "force-static";

export async function GET(request: Request) {
  if (!isOwnerRequest(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
