import { NextResponse } from "next/server";
import { replaceSkills } from "@/lib/database";
import { isOwnerRequest, parseSkillsBody } from "@/lib/requestParsers";

export async function PUT(request: Request) {
  if (!isOwnerRequest(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = parseSkillsBody(body);

  if (!parsed) {
    return NextResponse.json({ message: "Data skill tidak valid." }, { status: 400 });
  }

  const skills = await replaceSkills(parsed);

  return NextResponse.json(skills);
}
