"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./BottomNav.module.css";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Blog", href: "/blog" },
  { label: "Dashboard", href: "/dashboard" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.item} ${isActive ? styles.active : ""}`}
            >
              <span className={styles.label}>{item.label}</span>
              {isActive && <span className={styles.underline} />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
