"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./BottomNav.module.css";

const navItems = [
  { label: "Home", href: "/" },
  { label: "CV", href: "/#cv" },
  { label: "Skill", href: "/#skill" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [hash, setHash] = useState("");

  useEffect(() => {
    const syncHash = () => {
      setHash(window.location.hash);
    };

    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        {navItems.map((item) => {
          const [itemPath, itemHash = ""] = item.href.split("#");
          const isActivePath = pathname === itemPath;
          const isActiveHash = itemHash ? hash === `#${itemHash}` : !hash;
          const isActive = isActivePath && isActiveHash;

          return (
            <a
              key={item.label}
              href={item.href}
              className={`${styles.item} ${isActive ? styles.active : ""}`}
            >
              {item.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
