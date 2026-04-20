import { promises as fs } from "node:fs";
import path from "node:path";
import { BlogPost, WorkExperience, defaultBlogPosts, defaultExperiences } from "@/lib/portfolioData";

type PortfolioDatabase = {
  blogPosts: BlogPost[];
  experiences: WorkExperience[];
};

type BlogPayload = {
  title: string;
  summary: string;
  content: string;
};

type ExperiencePayload = {
  role: string;
  company: string;
  period: string;
  description: string;
};

const databasePath = path.join(process.cwd(), "src", "data", "portfolio-db.json");

const initialDatabase: PortfolioDatabase = {
  blogPosts: defaultBlogPosts,
  experiences: defaultExperiences,
};

const ensureDatabaseFile = async () => {
  try {
    await fs.access(databasePath);
  } catch {
    await fs.mkdir(path.dirname(databasePath), { recursive: true });
    await fs.writeFile(databasePath, JSON.stringify(initialDatabase, null, 2), "utf-8");
  }
};

const readDatabase = async (): Promise<PortfolioDatabase> => {
  await ensureDatabaseFile();
  const raw = await fs.readFile(databasePath, "utf-8");
  const parsed = JSON.parse(raw) as Partial<PortfolioDatabase>;

  return {
    blogPosts: parsed.blogPosts ?? initialDatabase.blogPosts,
    experiences: parsed.experiences ?? initialDatabase.experiences,
  };
};

const writeDatabase = async (data: PortfolioDatabase) => {
  await fs.writeFile(databasePath, JSON.stringify(data, null, 2), "utf-8");
};

const sanitizeText = (value: string) => value.trim();

const nextId = (items: Array<{ id: number }>) =>
  items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1;

export const getBlogPosts = async () => {
  const data = await readDatabase();
  return data.blogPosts;
};

export const getExperiences = async () => {
  const data = await readDatabase();
  return data.experiences;
};

export const createBlogPost = async (payload: BlogPayload) => {
  const data = await readDatabase();
  const blogPost: BlogPost = {
    id: nextId(data.blogPosts),
    title: sanitizeText(payload.title),
    summary: sanitizeText(payload.summary),
    content: sanitizeText(payload.content),
    publishedAt: new Date().toISOString().slice(0, 10),
  };

  const updated = {
    ...data,
    blogPosts: [blogPost, ...data.blogPosts],
  };
  await writeDatabase(updated);
  return blogPost;
};

export const updateBlogPost = async (id: number, payload: BlogPayload) => {
  const data = await readDatabase();
  const index = data.blogPosts.findIndex((item) => item.id === id);

  if (index < 0) {
    return null;
  }

  const updatedPost: BlogPost = {
    ...data.blogPosts[index],
    title: sanitizeText(payload.title),
    summary: sanitizeText(payload.summary),
    content: sanitizeText(payload.content),
  };

  const updatedBlogPosts = [...data.blogPosts];
  updatedBlogPosts[index] = updatedPost;

  await writeDatabase({
    ...data,
    blogPosts: updatedBlogPosts,
  });

  return updatedPost;
};

export const createExperience = async (payload: ExperiencePayload) => {
  const data = await readDatabase();
  const experience: WorkExperience = {
    id: nextId(data.experiences),
    role: sanitizeText(payload.role),
    company: sanitizeText(payload.company),
    period: sanitizeText(payload.period),
    description: sanitizeText(payload.description),
  };

  await writeDatabase({
    ...data,
    experiences: [experience, ...data.experiences],
  });

  return experience;
};
