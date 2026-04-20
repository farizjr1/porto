import Link from "next/link";
import styles from "./Navbar.module.css";

const links = [
  { href: "#profil", label: "Profil" },
  { href: "#pengalaman", label: "Pengalaman" },
  { href: "#skill", label: "Skill" },
  { href: "#cv", label: "CV ATS" },
];

export default function Navbar() {
  return (
    <header className={styles.navbar}>
      <Link href="/" className={styles.brand}>
        Portfolio Akuntansi
      </Link>
      <nav className={styles.links}>
        {links.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
