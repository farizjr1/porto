export type SkillCategory = {
  title: string;
  items: string[];
};

export type Skill = {
  name: string;
  level?: string;
  icon: string;
  iconBg: string;
  iconColor: string;
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

export type Project = {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  techStack: string;
  githubUrl: string;
  liveUrl?: string;
};

export const profile = {
  name: "Fariz",
  fullName: "Fariz Jelang Ramadhan",
  headline: "Spesialis Akuntansi",
  tagline: "Spesialis Akuntansi",
  about:
    "Halo! Nama saya Fariz, Spesialis Akuntansi dengan keahlian di bidang pelaporan keuangan, budgeting, dan kepatuhan pajak. Saya membantu perusahaan menata laporan keuangan, menganalisis arus kas, dan meningkatkan akurasi data agar keputusan bisnis lebih tepat. Saya percaya bahwa akuntansi yang baik bukan sekadar angka, melainkan fondasi strategi bisnis yang kuat.",
  about2:
    "Pengalaman saya mencakup tutup buku bulanan, rekonsiliasi bank, pelaporan PPh & PPN, serta audit internal. Jika Anda memerlukan profesional akuntansi yang teliti dan berdedikasi, saya siap membantu.",
  location: "Indonesia",
  email: "fariz.akuntan@email.com",
  githubUrl: "https://github.com/farizjr1",
  welcomeText: "Selamat datang di portofolio akuntansi saya. 👋",
};

export const techStackSkills: Skill[] = [
  { name: "Laporan Keuangan", icon: "LK", iconBg: "#1a3a6b", iconColor: "#5b9cf6" },
  { name: "Analisis Arus Kas", icon: "AK", iconBg: "#1a4a2e", iconColor: "#4caf7d" },
  { name: "Budgeting", icon: "BG", iconBg: "#4a2d1a", iconColor: "#f0883e" },
  { name: "Rekonsiliasi Bank", icon: "RB", iconBg: "#3a1a5a", iconColor: "#b57bee" },
  { name: "PPh & PPN", icon: "TX", iconBg: "#1a3a3a", iconColor: "#4dd0e1" },
  { name: "Internal Control", icon: "IC", iconBg: "#3a3a1a", iconColor: "#dce775" },
  { name: "Financial Analysis", icon: "FA", iconBg: "#4a1a1a", iconColor: "#ef9a9a" },
  { name: "Cost Accounting", icon: "CA", iconBg: "#1a2a4a", iconColor: "#90caf9" },
];

export const toolsSkills: Skill[] = [
  { name: "Microsoft Excel", icon: "XL", iconBg: "#1a4a2e", iconColor: "#4caf7d" },
  { name: "Accurate", icon: "AC", iconBg: "#4a2d1a", iconColor: "#f0883e" },
  { name: "SAP", icon: "SA", iconBg: "#1a3a6b", iconColor: "#5b9cf6" },
  { name: "Google Sheets", icon: "GS", iconBg: "#1a4a2e", iconColor: "#4caf7d" },
  { name: "Power BI", icon: "BI", iconBg: "#3a1a5a", iconColor: "#b57bee" },
  { name: "Jurnal.id", icon: "JR", iconBg: "#1a3a3a", iconColor: "#4dd0e1" },
  { name: "Zahir", icon: "ZH", iconBg: "#4a1a1a", iconColor: "#ef9a9a" },
  { name: "MYOB", level: "Beginner", icon: "MY", iconBg: "#1a2a4a", iconColor: "#90caf9" },
];

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
  {
    id: 3,
    title: "Optimasi Tax Planning Akhir Tahun",
    summary:
      "Strategi legal untuk meminimalkan beban pajak melalui perencanaan yang tepat sebelum tutup tahun.",
    content:
      "Perencanaan pajak yang baik dimulai dari pemahaman mendalam tentang peraturan yang berlaku.",
    publishedAt: "2026-04-05",
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

export const defaultProjects: Project[] = [
  {
    id: 1,
    title: "Sistem Pelaporan Keuangan UMKM",
    description:
      "Merancang template laporan keuangan otomatis berbasis Excel untuk memudahkan UMKM dalam menyusun laporan bulanan dan tahunan dengan akurasi tinggi.",
    techStack: "Microsoft Excel, Power Query, VBA",
    githubUrl: "https://github.com/farizjr1",
  },
  {
    id: 2,
    title: "Dashboard Monitoring Arus Kas",
    description:
      "Membangun dashboard interaktif untuk monitoring arus kas real-time menggunakan Power BI yang terhubung langsung dengan data akuntansi perusahaan.",
    techStack: "Power BI, Excel, SQL",
    githubUrl: "https://github.com/farizjr1",
  },
  {
    id: 3,
    title: "Audit Internal & Compliance Report",
    description:
      "Menyusun prosedur audit internal dan laporan kepatuhan yang membantu perusahaan mencapai standar pelaporan yang lebih baik dan transparan.",
    techStack: "SAP, Accurate, Excel",
    githubUrl: "https://github.com/farizjr1",
  },
];
