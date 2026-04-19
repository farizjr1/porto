import styles from "./page.module.css";
import { defaultBlogPosts } from "@/lib/portfolioData";

export default function BlogPage() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <span className={styles.titleLine} /> Blog
        </h1>
        <p className={styles.subtitle}>Tulisan & insight seputar akuntansi</p>
      </div>

      <div className={styles.postList}>
        {defaultBlogPosts.map((post) => (
          <article key={post.id} className={styles.postCard}>
            <div className={styles.postMeta}>
              <time className={styles.postDate}>{post.publishedAt}</time>
            </div>
            <h2 className={styles.postTitle}>{post.title}</h2>
            <p className={styles.postSummary}>{post.summary}</p>
            <button className={styles.readMore}>Baca Selengkapnya →</button>
          </article>
        ))}
      </div>
    </div>
  );
}
