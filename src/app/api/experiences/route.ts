import { NextResponse } from "next/server";
import { createExperience, getExperiences } from "@/lib/database";
import { ExperienceBody, parseExperienceBody } from "@/lib/requestParsers";

export async function GET() {
  const experiences = await getExperiences();
  return NextResponse.json(experiences);
}

export async function POST(request: Request) {
  const body = (await request.json()) as ExperienceBody;
  const parsedBody = parseExperienceBody(body);

  if (!parsedBody) {
    return NextResponse.json({ message: "Data pengalaman tidak valid." }, { status: 400 });
  }

  const experience = await createExperience(parsedBody);

  return NextResponse.json(experience, { status: 201 });
}
