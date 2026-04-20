import { NextResponse } from "next/server";
import { createExperience, getExperiences } from "@/lib/database";

type ExperienceBody = {
  role?: string;
  company?: string;
  period?: string;
  description?: string;
};

const isInvalidBody = (body: ExperienceBody) =>
  !body.role?.trim() ||
  !body.company?.trim() ||
  !body.period?.trim() ||
  !body.description?.trim();

export async function GET() {
  const experiences = await getExperiences();
  return NextResponse.json(experiences);
}

export async function POST(request: Request) {
  const body = (await request.json()) as ExperienceBody;

  if (isInvalidBody(body)) {
    return NextResponse.json({ message: "Data pengalaman tidak valid." }, { status: 400 });
  }

  const experience = await createExperience({
    role: body.role ?? "",
    company: body.company ?? "",
    period: body.period ?? "",
    description: body.description ?? "",
  });

  return NextResponse.json(experience, { status: 201 });
}
