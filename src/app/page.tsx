import Link from "next/link";
import styles from "./page.module.css";
import {
  defaultBlogPosts,
  defaultExperiences,
  profile,
  skillCategories,
} from "@/lib/portfolioData";

export default function Home() {
  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.badge}>Portofolio Akuntansi</p>
        <h1>{profile.name}</h1>
        <p>{profile.headline}</p>
        <p>{profile.about}</p>
        <div className={styles.actions}>
          <Link href="/dashboard" className={styles.primaryButton}>
            Buka Dashboard
          </Link>
          <a href={`mailto:${profile.email}`} className={styles.secondaryButton}>
            Hubungi Saya
          </a>
        </div>
      </header>

      <section className={styles.section}>
        <h2>Keahlian</h2>
        <div className={styles.grid}>
          {skillCategories.map((category) => (
            <article key={category.title} className={styles.card}>
              <h3>{category.title}</h3>
              <ul>
                {category.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2>Blog Terbaru</h2>
        <div className={styles.list}>
          {defaultBlogPosts.map((blog) => (
            <article key={blog.id} className={styles.card}>
              <h3>{blog.title}</h3>
              <p>{blog.summary}</p>
              <small>{blog.publishedAt}</small>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2>Pengalaman Kerja</h2>
        <div className={styles.list}>
          {defaultExperiences.map((experience) => (
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

      <footer className={styles.footer}>
        <p>
          {profile.location} • {profile.email}
        </p>
      </footer>
    </div>
  );
}
