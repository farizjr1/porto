import { NextResponse } from "next/server";
import { replaceExperiences } from "@/lib/database";
import { isOwnerRequest, parseExperiencesBody } from "@/lib/requestParsers";

export async function PUT(request: Request) {
  if (!isOwnerRequest(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = parseExperiencesBody(body);

  if (!parsed) {
    return NextResponse.json({ message: "Data pengalaman tidak valid." }, { status: 400 });
  }

  const experiences = await replaceExperiences(parsed);

  return NextResponse.json(experiences);
}
