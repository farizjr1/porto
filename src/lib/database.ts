import { createClient } from "@supabase/supabase-js";
import {
  defaultPortfolioData,
  generateAtsCv,
  PortfolioData,
  Profile,
  Skill,
  Experience,
} from "@/lib/portfolioData";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const isSupabaseEnabled = Boolean(supabaseUrl && supabaseServiceKey);

let fallbackStore: PortfolioData = {
  profile: { ...defaultPortfolioData.profile },
  skills: defaultPortfolioData.skills.map((item) => ({ ...item })),
  experiences: defaultPortfolioData.experiences.map((item) => ({ ...item })),
};

const normalizeText = (value: string) => value.trim();

const toNumber = (value: unknown, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const getSupabase = () => {
  if (!supabaseUrl || !supabaseServiceKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
};

const normalizeProfile = (value: Partial<Profile>): Profile => ({
  fullName: normalizeText(value.fullName ?? defaultPortfolioData.profile.fullName),
  headline: normalizeText(value.headline ?? defaultPortfolioData.profile.headline),
  bio: normalizeText(value.bio ?? defaultPortfolioData.profile.bio),
  email: normalizeText(value.email ?? defaultPortfolioData.profile.email),
  location: normalizeText(value.location ?? defaultPortfolioData.profile.location),
  cvContent: normalizeText(value.cvContent ?? ""),
});

const normalizeSkills = (skills: Partial<Skill>[]): Skill[] =>
  skills
    .map((item, index) => ({
      id: toNumber(item.id, index + 1),
      name: normalizeText(item.name ?? ""),
      level: normalizeText(item.level ?? "Intermediate"),
      sortOrder: toNumber(item.sortOrder, index + 1),
    }))
    .filter((item) => item.name.length > 0)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((item, index) => ({ ...item, sortOrder: index + 1 }));

const normalizeExperiences = (experiences: Partial<Experience>[]): Experience[] =>
  experiences
    .map((item, index) => ({
      id: toNumber(item.id, index + 1),
      role: normalizeText(item.role ?? ""),
      company: normalizeText(item.company ?? ""),
      period: normalizeText(item.period ?? ""),
      description: normalizeText(item.description ?? ""),
      sortOrder: toNumber(item.sortOrder, index + 1),
    }))
    .filter((item) => item.role.length > 0 && item.company.length > 0)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((item, index) => ({ ...item, sortOrder: index + 1 }));

const ensureCvContent = (data: PortfolioData): PortfolioData => {
  const cvContent = data.profile.cvContent || generateAtsCv(data);

  return {
    ...data,
    profile: {
      ...data.profile,
      cvContent,
    },
  };
};

export const getPortfolioData = async (): Promise<PortfolioData> => {
  if (!isSupabaseEnabled) {
    fallbackStore = ensureCvContent(fallbackStore);
    return {
      profile: { ...fallbackStore.profile },
      skills: fallbackStore.skills.map((item) => ({ ...item })),
      experiences: fallbackStore.experiences.map((item) => ({ ...item })),
    };
  }

  const supabase = getSupabase();

  if (!supabase) {
    fallbackStore = ensureCvContent(fallbackStore);
    return fallbackStore;
  }

  try {
    const [profileResult, skillResult, experienceResult] = await Promise.all([
      supabase.from("portfolio_profile").select("*").eq("id", 1).maybeSingle(),
      supabase.from("portfolio_skills").select("*").order("sort_order", { ascending: true }),
      supabase
        .from("portfolio_experiences")
        .select("*")
        .order("sort_order", { ascending: true }),
    ]);

    if (profileResult.error || skillResult.error || experienceResult.error) {
      throw new Error("Failed to fetch Supabase data");
    }

    const profile = normalizeProfile({
      fullName: profileResult.data?.full_name,
      headline: profileResult.data?.headline,
      bio: profileResult.data?.bio,
      email: profileResult.data?.email,
      location: profileResult.data?.location,
      cvContent: profileResult.data?.cv_content,
    });

    const skills = normalizeSkills(
      (skillResult.data ?? []).map((item) => ({
        id: item.id,
        name: item.name,
        level: item.level,
        sortOrder: item.sort_order,
      })),
    );

    const experiences = normalizeExperiences(
      (experienceResult.data ?? []).map((item) => ({
        id: item.id,
        role: item.role,
        company: item.company,
        period: item.period,
        description: item.description,
        sortOrder: item.sort_order,
      })),
    );

    const portfolioData = ensureCvContent({ profile, skills, experiences });
    fallbackStore = portfolioData;

    return portfolioData;
  } catch {
    fallbackStore = ensureCvContent(fallbackStore);
    return {
      profile: { ...fallbackStore.profile },
      skills: fallbackStore.skills.map((item) => ({ ...item })),
      experiences: fallbackStore.experiences.map((item) => ({ ...item })),
    };
  }
};

export const updateProfile = async (profileInput: Profile) => {
  const profile = normalizeProfile(profileInput);
  fallbackStore = {
    ...fallbackStore,
    profile,
  };

  if (!isSupabaseEnabled) {
    return profile;
  }

  const supabase = getSupabase();

  if (!supabase) {
    return profile;
  }

  try {
    await supabase.from("portfolio_profile").upsert({
      id: 1,
      full_name: profile.fullName,
      headline: profile.headline,
      bio: profile.bio,
      email: profile.email,
      location: profile.location,
      cv_content: profile.cvContent,
    });
  } catch {
    return profile;
  }

  return profile;
};

export const replaceSkills = async (skillsInput: Skill[]) => {
  const skills = normalizeSkills(skillsInput);
  fallbackStore = {
    ...fallbackStore,
    skills,
  };

  if (!isSupabaseEnabled) {
    return skills;
  }

  const supabase = getSupabase();

  if (!supabase) {
    return skills;
  }

  try {
    const existingSkills = await supabase.from("portfolio_skills").select("id");

    if (existingSkills.data && existingSkills.data.length > 0) {
      await supabase
        .from("portfolio_skills")
        .delete()
        .in(
          "id",
          existingSkills.data.map((item) => item.id),
        );
    }

    if (skills.length > 0) {
      await supabase.from("portfolio_skills").insert(
        skills.map((item) => ({
          name: item.name,
          level: item.level,
          sort_order: item.sortOrder,
        })),
      );
    }
  } catch {
    return skills;
  }

  return skills;
};

export const replaceExperiences = async (experiencesInput: Experience[]) => {
  const experiences = normalizeExperiences(experiencesInput);
  fallbackStore = {
    ...fallbackStore,
    experiences,
  };

  if (!isSupabaseEnabled) {
    return experiences;
  }

  const supabase = getSupabase();

  if (!supabase) {
    return experiences;
  }

  try {
    const existingExperiences = await supabase.from("portfolio_experiences").select("id");

    if (existingExperiences.data && existingExperiences.data.length > 0) {
      await supabase
        .from("portfolio_experiences")
        .delete()
        .in(
          "id",
          existingExperiences.data.map((item) => item.id),
        );
    }

    if (experiences.length > 0) {
      await supabase.from("portfolio_experiences").insert(
        experiences.map((item) => ({
          role: item.role,
          company: item.company,
          period: item.period,
          description: item.description,
          sort_order: item.sortOrder,
        })),
      );
    }
  } catch {
    return experiences;
  }

  return experiences;
};

export const regenerateCv = async () => {
  const data = await getPortfolioData();
  const cvContent = generateAtsCv(data);

  const profile = await updateProfile({
    ...data.profile,
    cvContent,
  });

  return profile.cvContent;
};

export const updateCvContent = async (cvContentInput: string) => {
  const data = await getPortfolioData();
  const cvContent = normalizeText(cvContentInput);

  const profile = await updateProfile({
    ...data.profile,
    cvContent,
  });

  return profile.cvContent;
};
