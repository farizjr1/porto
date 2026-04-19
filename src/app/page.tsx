import styles from "./page.module.css";
import { profile } from "@/lib/portfolioData";

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.avatarWrapper}>
        <div className={styles.avatarGlow} />
        <div className={styles.avatar}>
          <span className={styles.avatarInitials}>FJ</span>
        </div>
      </div>

      <div className={styles.hero}>
        <p className={styles.greeting}>Hello World, I&apos;m</p>
        <h1 className={styles.name}>{profile.fullName}</h1>
        <p className={styles.role}>
          <span className={styles.typingText}>{profile.tagline}</span>
        </p>
        <p className={styles.welcome}>{profile.welcomeText}</p>
      </div>
    </div>
  );
}
