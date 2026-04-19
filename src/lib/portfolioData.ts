export type SkillCategory = {
  title: string;
  items: string[];
};

export type BlogPost = {
  id: number;
  title: string;
  summary: string;
  content: string;
  publishedAt: string;
};

export type WorkExperience = {
  id: number;
  role: string;
  company: string;
  period: string;
  description: string;
};

export const profile = {
  name: "Fariz",
  headline: "Spesialis Akuntansi untuk pelaporan keuangan, budgeting, dan kepatuhan pajak",
  about:
    "Saya membantu perusahaan menata laporan keuangan, menganalisis arus kas, dan meningkatkan akurasi data agar keputusan bisnis lebih tepat.",
  location: "Indonesia",
  email: "fariz.akuntan@email.com",
};

export const skillCategories: SkillCategory[] = [
  {
    title: "Kompetensi Inti",
    items: [
      "Penyusunan Laporan Keuangan",
      "Analisis Arus Kas",
      "Budgeting & Forecasting",
      "Rekonsiliasi Bank",
    ],
  },
  {
    title: "Perpajakan & Kepatuhan",
    items: ["PPh & PPN", "Tax Planning", "Audit Support", "Internal Control"],
  },
  {
    title: "Tools",
    items: ["Microsoft Excel (Advanced)", "Accurate", "SAP", "Google Sheets"],
  },
];

export const defaultBlogPosts: BlogPost[] = [
  {
    id: 1,
    title: "3 Cara Mengurangi Selisih Rekonsiliasi Bulanan",
    summary:
      "Langkah praktis untuk mempercepat tutup buku bulanan dengan kontrol data transaksi yang konsisten.",
    content:
      "Mulai dari pemetaan akun, jadwal cut-off, hingga review dokumen pendukung agar proses tutup buku lebih cepat.",
    publishedAt: "2026-01-15",
  },
  {
    id: 2,
    title: "Menyusun Dashboard Keuangan untuk UMKM",
    summary:
      "Metode sederhana memilih metrik penting: gross margin, cash runway, dan rasio biaya operasional.",
    content:
      "Fokuskan dashboard pada metrik yang berdampak langsung terhadap keputusan harian pemilik bisnis.",
    publishedAt: "2026-03-01",
  },
];

export const defaultExperiences: WorkExperience[] = [
  {
    id: 1,
    role: "Senior Accountant",
    company: "PT Maju Finansial",
    period: "2022 - Sekarang",
    description:
      "Memimpin proses closing bulanan, menyusun laporan manajemen, dan meningkatkan ketepatan pelaporan hingga 30%.",
  },
  {
    id: 2,
    role: "Finance & Tax Staff",
    company: "CV Sukses Bersama",
    period: "2019 - 2022",
    description:
      "Mengelola pelaporan pajak rutin dan rekonsiliasi akun untuk lebih dari 500 transaksi per bulan.",
  },
];
