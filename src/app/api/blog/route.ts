import { NextResponse } from "next/server";
import { createBlogPost, getBlogPosts } from "@/lib/database";

type BlogBody = {
  title?: string;
  summary?: string;
  content?: string;
};

const isInvalidBody = (body: BlogBody) =>
  !body.title?.trim() || !body.summary?.trim() || !body.content?.trim();

export async function GET() {
  const posts = await getBlogPosts();
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const body = (await request.json()) as BlogBody;

  if (isInvalidBody(body)) {
    return NextResponse.json({ message: "Data blog tidak valid." }, { status: 400 });
  }

  const post = await createBlogPost({
    title: body.title ?? "",
    summary: body.summary ?? "",
    content: body.content ?? "",
  });

  return NextResponse.json(post, { status: 201 });
}
