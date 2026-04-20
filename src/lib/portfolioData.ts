export type Profile = {
  fullName: string;
  headline: string;
  bio: string;
  email: string;
  location: string;
  cvContent: string;
};

export type Skill = {
  id: number;
  name: string;
  level: string;
  sortOrder: number;
};

export type Experience = {
  id: number;
  role: string;
  company: string;
  period: string;
  description: string;
  sortOrder: number;
};

export type PortfolioData = {
  profile: Profile;
  skills: Skill[];
  experiences: Experience[];
};

export const defaultPortfolioData: PortfolioData = {
  profile: {
    fullName: "Fariz Jelang Ramadhan",
    headline: "Accounting Specialist",
    bio: "Akuntan dengan fokus pada pelaporan keuangan, rekonsiliasi, perpajakan, dan kontrol internal untuk bisnis yang bertumbuh.",
    email: "fariz.akuntan@email.com",
    location: "Indonesia",
    cvContent: "",
  },
  skills: [
    { id: 1, name: "Financial Reporting", level: "Advanced", sortOrder: 1 },
    { id: 2, name: "Tax Compliance (PPh/PPN)", level: "Advanced", sortOrder: 2 },
    { id: 3, name: "Budgeting & Forecasting", level: "Intermediate", sortOrder: 3 },
    { id: 4, name: "Microsoft Excel", level: "Advanced", sortOrder: 4 },
  ],
  experiences: [
    {
      id: 1,
      role: "Senior Accountant",
      company: "PT Maju Finansial",
      period: "2022 - Sekarang",
      description:
        "Memimpin tutup buku bulanan, menyusun laporan manajemen, dan meningkatkan ketepatan pelaporan keuangan.",
      sortOrder: 1,
    },
    {
      id: 2,
      role: "Finance & Tax Staff",
      company: "CV Sukses Bersama",
      period: "2019 - 2022",
      description:
        "Menangani pelaporan pajak rutin, rekonsiliasi akun, serta dokumentasi audit eksternal.",
      sortOrder: 2,
    },
  ],
};

export const generateAtsCv = (data: PortfolioData) => {
  const skillText = data.skills
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((skill) => `- ${skill.name} (${skill.level})`)
    .join("\n");

  const experienceText = data.experiences
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(
      (experience) =>
        `${experience.role} | ${experience.company} | ${experience.period}\n${experience.description}`,
    )
    .join("\n\n");

  return [
    data.profile.fullName,
    data.profile.headline,
    `${data.profile.location} | ${data.profile.email}`,
    "",
    "PROFIL SINGKAT",
    data.profile.bio,
    "",
    "PENGALAMAN KERJA",
    experienceText,
    "",
    "KEAHLIAN",
    skillText,
  ].join("\n");
};
