import styles from "./page.module.css";
import { getPortfolioData } from "@/lib/database";

export default async function Home() {
  const data = await getPortfolioData();

  return (
    <div className={styles.page}>
      <section id="profil" className={styles.hero}>
        <p className={styles.label}>Portfolio Akuntansi</p>
        <h1>{data.profile.fullName}</h1>
        <h2>{data.profile.headline}</h2>
        <p className={styles.bio}>{data.profile.bio}</p>
        <div className={styles.meta}>
          <span>{data.profile.location}</span>
          <a href={`mailto:${data.profile.email}`}>{data.profile.email}</a>
        </div>
      </section>

      <section id="pengalaman" className={styles.card}>
        <h3>Pengalaman Kerja</h3>
        <div className={styles.list}>
          {data.experiences.map((experience) => (
            <article key={experience.id} className={styles.item}>
              <h4>{experience.role}</h4>
              <p className={styles.subTitle}>
                {experience.company} · {experience.period}
              </p>
              <p>{experience.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="skill" className={styles.card}>
        <h3>Skill</h3>
        <ul className={styles.skillList}>
          {data.skills.map((skill) => (
            <li key={skill.id}>
              <span>{skill.name}</span>
              <strong>{skill.level}</strong>
            </li>
          ))}
        </ul>
      </section>

      <section id="cv" className={styles.card}>
        <div className={styles.cvHeader}>
          <h3>CV ATS (Simple)</h3>
          <a href="/api/portfolio/cv/pdf" className={styles.cvButton}>
            Export PDF
          </a>
        </div>
        <pre className={styles.cvText}>{data.profile.cvContent}</pre>
      </section>
    </div>
  );
}
