import { NextResponse } from "next/server";
import { updateBlogPost } from "@/lib/database";
import { BlogBody, parseBlogBody } from "@/lib/requestParsers";

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const params = await context.params;
  const id = Number(params.id);
  const body = (await request.json()) as BlogBody;
  const parsedBody = parseBlogBody(body);

  if (Number.isNaN(id) || id < 1) {
    return NextResponse.json({ message: "ID blog tidak valid." }, { status: 400 });
  }

  if (!parsedBody) {
    return NextResponse.json({ message: "Data blog tidak valid." }, { status: 400 });
  }

  const updated = await updateBlogPost(id, parsedBody);

  if (!updated) {
    return NextResponse.json({ message: "Blog tidak ditemukan." }, { status: 404 });
  }

  return NextResponse.json(updated);
}
