"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";
import { Experience, PortfolioData, Profile, Skill } from "@/lib/portfolioData";

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
  const [ownerKey, setOwnerKey] = useState(
    () => (typeof window === "undefined" ? "" : window.localStorage.getItem("owner-dashboard-key") ?? ""),
  );
  const [savedKey, setSavedKey] = useState(
    () => (typeof window === "undefined" ? "" : window.localStorage.getItem("owner-dashboard-key") ?? ""),
  );
  const [data, setData] = useState<PortfolioData>(emptyPortfolio);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/portfolio", { cache: "no-store" });
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

  const requestHeaders = useMemo(
    () => ({
      "Content-Type": "application/json",
      "x-owner-key": savedKey,
    }),
    [savedKey],
  );

  const saveKey = (event: FormEvent) => {
    event.preventDefault();
    window.localStorage.setItem("owner-dashboard-key", ownerKey.trim());
    setSavedKey(ownerKey.trim());
    setStatus("Kunci pemilik tersimpan di browser ini.");
  };

  const updateSection = async (path: string, body: unknown) => {
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
      setStatus("Gagal menyimpan profil. Pastikan owner key benar.");
    }
  };

  const saveSkills = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const skills = (await updateSection("/api/portfolio/skills", data.skills)) as Skill[];
      setData((current) => ({ ...current, skills }));
      setStatus("Skill berhasil diperbarui.");
    } catch {
      setStatus("Gagal menyimpan skill. Pastikan owner key benar.");
    }
  };

  const saveExperiences = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const experiences = (await updateSection("/api/portfolio/experiences", data.experiences)) as Experience[];
      setData((current) => ({ ...current, experiences }));
      setStatus("Pengalaman berhasil diperbarui.");
    } catch {
      setStatus("Gagal menyimpan pengalaman. Pastikan owner key benar.");
    }
  };

  const generateCv = async () => {
    try {
      const response = await fetch("/api/portfolio/cv/generate", {
        method: "POST",
        headers: { "x-owner-key": savedKey },
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
      setStatus("Gagal generate CV ATS. Pastikan owner key benar.");
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
      setStatus("Gagal menyimpan CV. Pastikan owner key benar.");
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Dashboard Pemilik (Tersembunyi)</h1>
        <p>Akses halaman ini langsung lewat URL /dashboard.</p>
      </header>

      <form onSubmit={saveKey} className={styles.card}>
        <h2>Owner Access Key</h2>
        <p className={styles.help}>Isi key dari environment variable OWNER_DASHBOARD_KEY.</p>
        <input
          type="password"
          value={ownerKey}
          onChange={(event) => setOwnerKey(event.target.value)}
          placeholder="Masukkan owner key"
          required
        />
        <button type="submit">Simpan Key</button>
      </form>

      {status && <p className={styles.status}>{status}</p>}
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
                experiences: [
                  ...current.experiences,
                  createExperience(current.experiences),
                ],
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
    </div>
  );
}
