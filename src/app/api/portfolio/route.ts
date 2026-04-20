import { NextResponse } from "next/server";
import { getPortfolioData } from "@/lib/database";

export async function GET() {
  const data = await getPortfolioData();
  return NextResponse.json(data);
}
