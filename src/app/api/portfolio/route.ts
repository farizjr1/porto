import { NextResponse } from "next/server";
import { getPortfolioData } from "@/lib/database";

export const dynamic = "force-static";

export async function GET() {
  const data = await getPortfolioData();
  return NextResponse.json(data);
}
