"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import {
  BlogPost,
  WorkExperience,
  defaultBlogPosts,
  defaultExperiences,
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
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(defaultBlogPosts);
  const [experiences, setExperiences] = useState<WorkExperience[]>(defaultExperiences);
  const [blogForm, setBlogForm] = useState<BlogForm>(initialBlogForm);
  const [experienceForm, setExperienceForm] = useState<ExperienceForm>(initialExperienceForm);
  const [editingBlogId, setEditingBlogId] = useState<number | null>(null);

  const blogSubmitLabel = useMemo(
    () => (editingBlogId ? "Simpan Perubahan Blog" : "Upload Blog"),
    [editingBlogId],
  );

  const handleBlogSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (editingBlogId) {
      setBlogPosts((current) =>
        current.map((item) =>
          item.id === editingBlogId
            ? {
                ...item,
                title: blogForm.title,
                summary: blogForm.summary,
                content: blogForm.content,
              }
            : item,
        ),
      );
      setEditingBlogId(null);
    } else {
      setBlogPosts((current) => [
        {
          id: Date.now(),
          title: blogForm.title,
          summary: blogForm.summary,
          content: blogForm.content,
          publishedAt: new Date().toISOString().slice(0, 10),
        },
        ...current,
      ]);
    }

    setBlogForm(initialBlogForm);
  };

  const handleEditBlog = (blog: BlogPost) => {
    setEditingBlogId(blog.id);
    setBlogForm({
      title: blog.title,
      summary: blog.summary,
      content: blog.content,
    });
  };

  const handleExperienceSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setExperiences((current) => [
      {
        id: Date.now(),
        role: experienceForm.role,
        company: experienceForm.company,
        period: experienceForm.period,
        description: experienceForm.description,
      },
      ...current,
    ]);

    setExperienceForm(initialExperienceForm);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Dashboard Konten</h1>
        <p>Kelola blog dan tambah pengalaman kerja.</p>
        <Link href="/">Kembali ke Portofolio</Link>
      </header>

      <section className={styles.section}>
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
          <button type="submit">{blogSubmitLabel}</button>
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

      <section className={styles.section}>
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
          <button type="submit">Tambah Pengalaman</button>
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
