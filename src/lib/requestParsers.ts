export type BlogBody = {
  title?: string;
  summary?: string;
  content?: string;
};

export type ExperienceBody = {
  role?: string;
  company?: string;
  period?: string;
  description?: string;
};

export const parseBlogBody = (body: BlogBody) => {
  const title = body.title?.trim();
  const summary = body.summary?.trim();
  const content = body.content?.trim();

  if (!title || !summary || !content) {
    return null;
  }

  return { title, summary, content };
};

export const parseExperienceBody = (body: ExperienceBody) => {
  const role = body.role?.trim();
  const company = body.company?.trim();
  const period = body.period?.trim();
  const description = body.description?.trim();

  if (!role || !company || !period || !description) {
    return null;
  }

  return { role, company, period, description };
};
