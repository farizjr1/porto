import { NextResponse } from "next/server";
import { createBlogPost, getBlogPosts } from "@/lib/database";
import { BlogBody, parseBlogBody } from "@/lib/requestParsers";

export async function GET() {
  const posts = await getBlogPosts();
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const body = (await request.json()) as BlogBody;
  const parsedBody = parseBlogBody(body);

  if (!parsedBody) {
    return NextResponse.json({ message: "Data blog tidak valid." }, { status: 400 });
  }

  const post = await createBlogPost(parsedBody);

  return NextResponse.json(post, { status: 201 });
}
