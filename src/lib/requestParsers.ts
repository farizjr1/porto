import { Experience, Profile, Skill } from "@/lib/portfolioData";
import { extractBearerToken, verifyDashboardAccessToken } from "@/lib/dashboardAuth";

const ownerDashboardKey = process.env.OWNER_DASHBOARD_KEY?.trim() ?? "";
const supabasePublishableKey =
  process.env.SUPABASE_PUBLISHABLE_KEY?.trim() ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ??
  "";
const OWNER_KEY = ownerDashboardKey || supabasePublishableKey;

const normalize = (value: unknown) => (typeof value === "string" ? value.trim() : "");

const normalizeNumber = (value: unknown, fallback: number) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const isOwnerKeyRequest = (request: Request) => {
  if (!OWNER_KEY) {
    return false;
  }

  const key = request.headers.get("x-owner-key")?.trim();
  return key === OWNER_KEY;
};

export const isAuthorizedDashboardRequest = async (request: Request) => {
  const bearerToken = extractBearerToken(request);

  if (bearerToken) {
    const { isValid } = await verifyDashboardAccessToken(bearerToken);

    if (isValid) {
      return true;
    }
  }

  return isOwnerKeyRequest(request);
};

export const parseProfileBody = (body: unknown): Profile | null => {
  if (!body || typeof body !== "object") {
    return null;
  }

  const input = body as Partial<Profile>;

  const parsed: Profile = {
    fullName: normalize(input.fullName),
    headline: normalize(input.headline),
    bio: normalize(input.bio),
    email: normalize(input.email),
    location: normalize(input.location),
    cvContent: normalize(input.cvContent),
  };

  if (!parsed.fullName || !parsed.headline || !parsed.bio || !parsed.email || !parsed.location) {
    return null;
  }

  return parsed;
};

export const parseSkillsBody = (body: unknown): Skill[] | null => {
  if (!Array.isArray(body)) {
    return null;
  }

  const parsed = body
    .map((item, index) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const value = item as Partial<Skill>;

      return {
        id: normalizeNumber(value.id, index + 1),
        name: normalize(value.name),
        level: normalize(value.level) || "Intermediate",
        sortOrder: normalizeNumber(value.sortOrder, index + 1),
      } satisfies Skill;
    })
    .filter((item): item is Skill => Boolean(item && item.name));

  return parsed;
};

export const parseExperiencesBody = (body: unknown): Experience[] | null => {
  if (!Array.isArray(body)) {
    return null;
  }

  const parsed = body
    .map((item, index) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const value = item as Partial<Experience>;

      const result: Experience = {
        id: normalizeNumber(value.id, index + 1),
        role: normalize(value.role),
        company: normalize(value.company),
        period: normalize(value.period),
        description: normalize(value.description),
        sortOrder: normalizeNumber(value.sortOrder, index + 1),
      };

      if (!result.role || !result.company || !result.period || !result.description) {
        return null;
      }

      return result;
    })
    .filter((item): item is Experience => Boolean(item));

  return parsed;
};

export const parseCvBody = (body: unknown) => {
  if (!body || typeof body !== "object") {
    return null;
  }

  const cvContent = normalize((body as { cvContent?: string }).cvContent);

  if (!cvContent) {
    return null;
  }

  return cvContent;
};
