"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";
import { Experience, PortfolioData, Profile, Skill } from "@/lib/portfolioData";

const DASHBOARD_USER_STORAGE_KEY = "dashboard-user-email";
const DASHBOARD_SESSION_TOKEN_STORAGE_KEY = "dashboard-session-token";

const emptyPortfolio: PortfolioData = {
  profile: {
    fullName: "",
    headline: "",
    bio: "",
    email: "",
    location: "",
    cvContent: "",
  },
  skills: [],
  experiences: [],
};

let tempId = -1;
const createTempId = () => {
  tempId -= 1;
  return tempId;
};

const createSkill = (skills: Skill[]): Skill => ({
  id: createTempId(),
  name: "",
  level: "Intermediate",
  sortOrder: skills.length + 1,
});

const createExperience = (experiences: Experience[]): Experience => ({
  id: createTempId(),
  role: "",
  company: "",
  period: "",
  description: "",
  sortOrder: experiences.length + 1,
});

export default function DashboardPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [data, setData] = useState<PortfolioData>(emptyPortfolio);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/portfolio-data");
        const result = (await response.json()) as PortfolioData;
        setData(result);
      } catch {
        setStatus("Gagal memuat data portfolio.");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  useEffect(() => {
    const storedUser = window.localStorage.getItem(DASHBOARD_USER_STORAGE_KEY)?.trim() ?? "";
    const storedToken = window.localStorage.getItem(DASHBOARD_SESSION_TOKEN_STORAGE_KEY)?.trim() ?? "";

    if (storedToken) {
      setEmail(storedUser);
      setAccessToken(storedToken);
      setIsAuthenticated(true);
    }

    setAuthReady(true);
  }, []);

  const requestHeaders = useMemo(() => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    return headers;
  }, [accessToken]);

  const login = async (event: FormEvent) => {
    event.preventDefault();

    const nextEmail = email.trim().toLowerCase();
    const nextPassword = password.trim();

    if (!nextEmail || !nextPassword) {
      setStatus("Email dan password wajib diisi.");
      return;
    }

    try {
      const response = await fetch("/api/dashboard/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode: "login",
          email: nextEmail,
          password: nextPassword,
        }),
      });

      if (!response.ok) {
        throw new Error("Unauthorized");
      }

      const result = (await response.json()) as { accessToken: string; email?: string };
      const token = result.accessToken?.trim();

      if (!token) {
        throw new Error("Unauthorized");
      }

      window.localStorage.setItem(DASHBOARD_USER_STORAGE_KEY, result.email ?? nextEmail);
      window.localStorage.setItem(DASHBOARD_SESSION_TOKEN_STORAGE_KEY, token);
      setEmail(result.email ?? nextEmail);
      setAccessToken(token);
      setIsAuthenticated(true);
      setStatus(`Login berhasil. Selamat datang, ${result.email ?? nextEmail}.`);
    } catch {
      setAccessToken("");
      setIsAuthenticated(false);
      setStatus("Login gagal. Periksa email/password Anda.");
    }
  };

  const createAccount = async () => {
    const nextEmail = email.trim().toLowerCase();
    const nextPassword = password.trim();

    if (!nextEmail || !nextPassword) {
      setStatus("Email dan password wajib diisi.");
      return;
    }

    try {
      const response = await fetch("/api/dashboard/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode: "register",
          email: nextEmail,
          password: nextPassword,
        }),
      });
      const result = (await response.json()) as {
        accessToken?: string;
        email?: string;
        requiresEmailConfirmation?: boolean;
        message?: string;
      };

      if (!response.ok) {
        throw new Error(result.message || "Register gagal.");
      }

      if (result.requiresEmailConfirmation || !result.accessToken) {
        setStatus(
          result.message ||
            "Akun berhasil dibuat. Cek email verifikasi Anda, lalu login dengan akun tersebut.",
        );
        return;
      }

      const token = result.accessToken.trim();
      window.localStorage.setItem(DASHBOARD_USER_STORAGE_KEY, result.email ?? nextEmail);
      window.localStorage.setItem(DASHBOARD_SESSION_TOKEN_STORAGE_KEY, token);
      setEmail(result.email ?? nextEmail);
      setAccessToken(token);
      setIsAuthenticated(true);
      setStatus(`Akun berhasil dibuat dan login sebagai ${result.email ?? nextEmail}.`);
    } catch (error) {
      setAccessToken("");
      setIsAuthenticated(false);
      const message = error instanceof Error ? error.message : "Gagal membuat akun.";
      setStatus(message);
    }
  };

  const logout = () => {
    window.localStorage.removeItem(DASHBOARD_USER_STORAGE_KEY);
    window.localStorage.removeItem(DASHBOARD_SESSION_TOKEN_STORAGE_KEY);
    setAccessToken("");
    setPassword("");
    setIsAuthenticated(false);
    setStatus("Anda berhasil logout.");
  };

  const updateSection = async (path: string, body: unknown) => {
    if (!accessToken) {
      throw new Error("Kredensial autentikasi tidak tersedia");
    }

    const response = await fetch(path, {
      method: "PUT",
      headers: requestHeaders,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error("Unauthorized");
    }

    return response.json();
  };

  const saveProfile = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const profile = (await updateSection("/api/portfolio/profile", data.profile)) as Profile;
      setData((current) => ({ ...current, profile }));
      setStatus("Profil berhasil diperbarui.");
    } catch {
      setStatus("Gagal menyimpan profil. Pastikan login Anda benar.");
    }
  };

  const saveSkills = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const skills = (await updateSection("/api/portfolio/skills", data.skills)) as Skill[];
      setData((current) => ({ ...current, skills }));
      setStatus("Skill berhasil diperbarui.");
    } catch {
      setStatus("Gagal menyimpan skill. Pastikan login Anda benar.");
    }
  };

  const saveExperiences = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const experiences = (await updateSection("/api/portfolio/experiences", data.experiences)) as Experience[];
      setData((current) => ({ ...current, experiences }));
      setStatus("Pengalaman berhasil diperbarui.");
    } catch {
      setStatus("Gagal menyimpan pengalaman. Pastikan login Anda benar.");
    }
  };

  const generateCv = async () => {
    try {
      const response = await fetch("/api/portfolio/cv/generate", {
        method: "POST",
        headers: requestHeaders,
      });

      if (!response.ok) {
        throw new Error("Unauthorized");
      }

      const result = (await response.json()) as { cvContent: string };

      setData((current) => ({
        ...current,
        profile: {
          ...current.profile,
          cvContent: result.cvContent,
        },
      }));

      setStatus("CV ATS berhasil digenerate.");
    } catch {
      setStatus("Gagal generate CV ATS. Pastikan login Anda benar.");
    }
  };

  const saveCv = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const response = (await updateSection("/api/portfolio/cv", {
        cvContent: data.profile.cvContent,
      })) as { cvContent: string };

      setData((current) => ({
        ...current,
        profile: {
          ...current.profile,
          cvContent: response.cvContent,
        },
      }));

      setStatus("CV ATS berhasil diperbarui.");
    } catch {
      setStatus("Gagal menyimpan CV. Pastikan login Anda benar.");
    }
  };

  if (!authReady) {
    return (
      <div className={styles.page}>
        <p className={styles.status}>Memeriksa sesi login...</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Dashboard Pemilik (Tersembunyi)</h1>
        <p>Akses halaman ini langsung lewat URL /dashboard.</p>
      </header>

      {!isAuthenticated ? (
        <form onSubmit={login} className={styles.card}>
          <h2>Login Dashboard</h2>
          <p className={styles.help}>
            Gunakan email dan password Supabase Auth. Jika belum punya akun, klik tombol Buat Akun.
          </p>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            required
          />
          <div className={styles.buttonRow}>
            <button type="submit">Login</button>
            <button type="button" onClick={createAccount}>
              Buat Akun
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className={styles.buttonRow}>
            <p className={styles.help}>Login sebagai: {email}</p>
            <button type="button" onClick={logout}>
              Logout
            </button>
          </div>

          {loading && <p className={styles.status}>Memuat data...</p>}

          <form onSubmit={saveProfile} className={styles.card}>
            <h2>Profil</h2>
            <input
              value={data.profile.fullName}
              onChange={(event) =>
                setData((current) => ({
                  ...current,
                  profile: { ...current.profile, fullName: event.target.value },
                }))
              }
              placeholder="Nama lengkap"
              required
            />
            <input
              value={data.profile.headline}
              onChange={(event) =>
                setData((current) => ({
                  ...current,
                  profile: { ...current.profile, headline: event.target.value },
                }))
              }
              placeholder="Headline"
              required
            />
            <textarea
              rows={4}
              value={data.profile.bio}
              onChange={(event) =>
                setData((current) => ({
                  ...current,
                  profile: { ...current.profile, bio: event.target.value },
                }))
              }
              placeholder="Biodata"
              required
            />
            <input
              type="email"
              value={data.profile.email}
              onChange={(event) =>
                setData((current) => ({
                  ...current,
                  profile: { ...current.profile, email: event.target.value },
                }))
              }
              placeholder="Email"
              required
            />
            <input
              value={data.profile.location}
              onChange={(event) =>
                setData((current) => ({
                  ...current,
                  profile: { ...current.profile, location: event.target.value },
                }))
              }
              placeholder="Lokasi"
              required
            />
            <button type="submit">Simpan Profil</button>
          </form>

          <form onSubmit={saveSkills} className={styles.card}>
            <h2>Skill</h2>
            {data.skills.map((skill) => (
              <div key={skill.id} className={styles.itemGrid}>
                <input
                  value={skill.name}
                  onChange={(event) =>
                    setData((current) => ({
                      ...current,
                      skills: current.skills.map((item) =>
                        item.id === skill.id ? { ...item, name: event.target.value } : item,
                      ),
                    }))
                  }
                  placeholder="Nama skill"
                  required
                />
                <input
                  value={skill.level}
                  onChange={(event) =>
                    setData((current) => ({
                      ...current,
                      skills: current.skills.map((item) =>
                        item.id === skill.id ? { ...item, level: event.target.value } : item,
                      ),
                    }))
                  }
                  placeholder="Level"
                  required
                />
                <button
                  type="button"
                  onClick={() =>
                    setData((current) => ({
                      ...current,
                      skills: current.skills.filter((item) => item.id !== skill.id),
                    }))
                  }
                >
                  Hapus
                </button>
              </div>
            ))}
            <div className={styles.buttonRow}>
              <button
                type="button"
                onClick={() =>
                  setData((current) => ({
                    ...current,
                    skills: [...current.skills, createSkill(current.skills)],
                  }))
                }
              >
                Tambah Skill
              </button>
              <button type="submit">Simpan Skill</button>
            </div>
          </form>

          <form onSubmit={saveExperiences} className={styles.card}>
            <h2>Pengalaman</h2>
            {data.experiences.map((experience) => (
              <div key={experience.id} className={styles.itemGridBlock}>
                <input
                  value={experience.role}
                  onChange={(event) =>
                    setData((current) => ({
                      ...current,
                      experiences: current.experiences.map((item) =>
                        item.id === experience.id ? { ...item, role: event.target.value } : item,
                      ),
                    }))
                  }
                  placeholder="Posisi"
                  required
                />
                <input
                  value={experience.company}
                  onChange={(event) =>
                    setData((current) => ({
                      ...current,
                      experiences: current.experiences.map((item) =>
                        item.id === experience.id ? { ...item, company: event.target.value } : item,
                      ),
                    }))
                  }
                  placeholder="Perusahaan"
                  required
                />
                <input
                  value={experience.period}
                  onChange={(event) =>
                    setData((current) => ({
                      ...current,
                      experiences: current.experiences.map((item) =>
                        item.id === experience.id ? { ...item, period: event.target.value } : item,
                      ),
                    }))
                  }
                  placeholder="Periode"
                  required
                />
                <textarea
                  rows={3}
                  value={experience.description}
                  onChange={(event) =>
                    setData((current) => ({
                      ...current,
                      experiences: current.experiences.map((item) =>
                        item.id === experience.id ? { ...item, description: event.target.value } : item,
                      ),
                    }))
                  }
                  placeholder="Deskripsi pekerjaan"
                  required
                />
                <button
                  type="button"
                  onClick={() =>
                    setData((current) => ({
                      ...current,
                      experiences: current.experiences.filter((item) => item.id !== experience.id),
                    }))
                  }
                >
                  Hapus Pengalaman
                </button>
              </div>
            ))}
            <div className={styles.buttonRow}>
              <button
                type="button"
                onClick={() =>
                  setData((current) => ({
                    ...current,
                    experiences: [...current.experiences, createExperience(current.experiences)],
                  }))
                }
              >
                Tambah Pengalaman
              </button>
              <button type="submit">Simpan Pengalaman</button>
            </div>
          </form>

          <form onSubmit={saveCv} className={styles.card}>
            <div className={styles.buttonRow}>
              <h2>CV ATS</h2>
              <button type="button" onClick={generateCv}>
                Generate ATS
              </button>
            </div>
            <textarea
              rows={14}
              value={data.profile.cvContent}
              onChange={(event) =>
                setData((current) => ({
                  ...current,
                  profile: { ...current.profile, cvContent: event.target.value },
                }))
              }
              placeholder="Isi CV ATS"
              required
            />
            <div className={styles.buttonRow}>
              <button type="submit">Simpan CV</button>
              <a className={styles.linkButton} href="/api/portfolio/cv/pdf">
                Export PDF
              </a>
            </div>
          </form>
        </>
      )}

      {status && <p className={styles.status}>{status}</p>}
    </div>
  );
}
