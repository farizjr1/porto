import Link from "next/link";
import styles from "./Navbar.module.css";
import { profile } from "@/lib/portfolioData";

export default function Navbar() {
  return (
    <header className={styles.navbar}>
      <Link href="/" className={styles.name}>
        {profile.fullName}
      </Link>
      <a
        href={profile.githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.githubLink}
        aria-label="GitHub"
      >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          width="28"
          height="28"
          aria-hidden="true"
        >
          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.34-3.369-1.34-.454-1.155-1.11-1.463-1.11-1.463-.907-.62.069-.607.069-.607 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.912.832.091-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.03-2.682-.103-.253-.447-1.27.098-2.646 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.547 1.376.203 2.394.1 2.646.64.698 1.027 1.591 1.027 2.682 0 3.841-2.337 4.687-4.565 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.164 22 16.417 22 12c0-5.523-4.477-10-10-10z" />
        </svg>
      </a>
    </header>
  );
}
