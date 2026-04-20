"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import {
  BlogPost,
  WorkExperience,
} from "@/lib/portfolioData";

type BlogForm = {
  title: string;
  summary: string;
  content: string;
};

type ExperienceForm = {
  role: string;
  company: string;
  period: string;
  description: string;
};

const initialBlogForm: BlogForm = {
  title: "",
  summary: "",
  content: "",
};

const initialExperienceForm: ExperienceForm = {
  role: "",
  company: "",
  period: "",
  description: "",
};

export default function DashboardPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [experiences, setExperiences] = useState<WorkExperience[]>([]);
  const [blogForm, setBlogForm] = useState<BlogForm>(initialBlogForm);
  const [experienceForm, setExperienceForm] = useState<ExperienceForm>(initialExperienceForm);
  const [editingBlogId, setEditingBlogId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isBlogSubmitting, setIsBlogSubmitting] = useState(false);
  const [isExperienceSubmitting, setIsExperienceSubmitting] = useState(false);

  const blogSubmitLabel = useMemo(
    () => (editingBlogId ? "Simpan Perubahan Blog" : "Upload Blog"),
    [editingBlogId],
  );

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const [blogResponse, experienceResponse] = await Promise.all([
          fetch("/api/blog"),
          fetch("/api/experiences"),
        ]);

        if (!blogResponse.ok || !experienceResponse.ok) {
          throw new Error("Gagal memuat data dashboard.");
        }

        const [blogData, experienceData] = await Promise.all([
          (blogResponse.json() as Promise<BlogPost[]>),
          (experienceResponse.json() as Promise<WorkExperience[]>),
        ]);

        setBlogPosts(blogData);
        setExperiences(experienceData);
      } catch {
        setErrorMessage("Terjadi kendala saat mengambil data dari database.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadDashboardData();
  }, []);

  const handleBlogSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setIsBlogSubmitting(true);

    try {
      const response = await fetch(
        editingBlogId ? `/api/blog/${editingBlogId}` : "/api/blog",
        {
          method: editingBlogId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(blogForm),
        },
      );

      if (!response.ok) {
        throw new Error("Gagal menyimpan blog.");
      }

      const savedBlog = (await response.json()) as BlogPost;

      if (editingBlogId) {
        setBlogPosts((current) =>
          current.map((item) => (item.id === editingBlogId ? savedBlog : item)),
        );
        setEditingBlogId(null);
      } else {
        setBlogPosts((current) => [savedBlog, ...current]);
      }

      setBlogForm(initialBlogForm);
    } catch {
      setErrorMessage("Gagal menyimpan blog ke database.");
    } finally {
      setIsBlogSubmitting(false);
    }
  };

  const handleEditBlog = (blog: BlogPost) => {
    setEditingBlogId(blog.id);
    setBlogForm({
      title: blog.title,
      summary: blog.summary,
      content: blog.content,
    });
  };

  const handleExperienceSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setIsExperienceSubmitting(true);

    try {
      const response = await fetch("/api/experiences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(experienceForm),
      });

      if (!response.ok) {
        throw new Error("Gagal menambah pengalaman.");
      }

      const savedExperience = (await response.json()) as WorkExperience;
      setExperiences((current) => [savedExperience, ...current]);
      setExperienceForm(initialExperienceForm);
    } catch {
      setErrorMessage("Gagal menyimpan pengalaman ke database.");
    } finally {
      setIsExperienceSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Dashboard Konten</h1>
        <p>Kelola blog dan pengalaman kerja dari satu tempat.</p>
        <Link href="/">← Kembali ke Portofolio</Link>
      </header>

      {errorMessage && <p className={styles.error}>{errorMessage}</p>}
      {isLoading && <p className={styles.info}>Memuat data dari database...</p>}

      <section className={styles.cardSection}>
        <h2>Upload / Edit Blog</h2>
        <form className={styles.form} onSubmit={handleBlogSubmit}>
          <input
            value={blogForm.title}
            onChange={(event) => setBlogForm((prev) => ({ ...prev, title: event.target.value }))}
            placeholder="Judul blog"
            required
          />
          <input
            value={blogForm.summary}
            onChange={(event) => setBlogForm((prev) => ({ ...prev, summary: event.target.value }))}
            placeholder="Ringkasan"
            required
          />
          <textarea
            value={blogForm.content}
            onChange={(event) => setBlogForm((prev) => ({ ...prev, content: event.target.value }))}
            placeholder="Isi konten"
            required
            rows={4}
          />
          <button type="submit" disabled={isBlogSubmitting}>
            {isBlogSubmitting ? "Menyimpan..." : blogSubmitLabel}
          </button>
        </form>

        <div className={styles.list}>
          {blogPosts.map((blog) => (
            <article key={blog.id} className={styles.card}>
              <h3>{blog.title}</h3>
              <p>{blog.summary}</p>
              <small>{blog.publishedAt}</small>
              <button type="button" onClick={() => handleEditBlog(blog)}>
                Edit
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.cardSection}>
        <h2>Tambah Pengalaman Kerja</h2>
        <form className={styles.form} onSubmit={handleExperienceSubmit}>
          <input
            value={experienceForm.role}
            onChange={(event) =>
              setExperienceForm((prev) => ({ ...prev, role: event.target.value }))
            }
            placeholder="Posisi"
            required
          />
          <input
            value={experienceForm.company}
            onChange={(event) =>
              setExperienceForm((prev) => ({ ...prev, company: event.target.value }))
            }
            placeholder="Perusahaan"
            required
          />
          <input
            value={experienceForm.period}
            onChange={(event) =>
              setExperienceForm((prev) => ({ ...prev, period: event.target.value }))
            }
            placeholder="Periode"
            required
          />
          <textarea
            value={experienceForm.description}
            onChange={(event) =>
              setExperienceForm((prev) => ({ ...prev, description: event.target.value }))
            }
            placeholder="Deskripsi singkat"
            required
            rows={3}
          />
          <button type="submit" disabled={isExperienceSubmitting}>
            {isExperienceSubmitting ? "Menyimpan..." : "Tambah Pengalaman"}
          </button>
        </form>

        <div className={styles.list}>
          {experiences.map((experience) => (
            <article key={experience.id} className={styles.card}>
              <h3>{experience.role}</h3>
              <p>
                {experience.company} • {experience.period}
              </p>
              <p>{experience.description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
