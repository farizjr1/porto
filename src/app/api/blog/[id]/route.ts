import { NextResponse } from "next/server";
import { updateBlogPost } from "@/lib/database";

type BlogBody = {
  title?: string;
  summary?: string;
  content?: string;
};

const isInvalidBody = (body: BlogBody) =>
  !body.title?.trim() || !body.summary?.trim() || !body.content?.trim();

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const params = await context.params;
  const id = Number(params.id);
  const body = (await request.json()) as BlogBody;

  if (Number.isNaN(id) || id < 1) {
    return NextResponse.json({ message: "ID blog tidak valid." }, { status: 400 });
  }

  if (isInvalidBody(body)) {
    return NextResponse.json({ message: "Data blog tidak valid." }, { status: 400 });
  }

  const updated = await updateBlogPost(id, {
    title: body.title ?? "",
    summary: body.summary ?? "",
    content: body.content ?? "",
  });

  if (!updated) {
    return NextResponse.json({ message: "Blog tidak ditemukan." }, { status: 404 });
  }

  return NextResponse.json(updated);
}
