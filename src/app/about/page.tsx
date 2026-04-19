"use client";

import { useState } from "react";
import styles from "./page.module.css";
import { profile, techStackSkills, toolsSkills } from "@/lib/portfolioData";

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState<"tech" | "tools">("tech");
  const skills = activeTab === "tech" ? techStackSkills : toolsSkills;

  return (
    <div className={styles.page}>
      {/* About Me Card */}
      <section className={styles.card}>
        <h2 className={styles.sectionTitle}>
          About Me <span className={styles.titleLine} />
        </h2>

        <div className={styles.avatarWrapper}>
          <div className={styles.avatarCircle}>
            <span className={styles.avatarInitials}>FJ</span>
          </div>
        </div>

        <p className={styles.bio}>{profile.about}</p>
        <p className={styles.bio}>{profile.about2}</p>
      </section>

      {/* Skills */}
      <section className={styles.skillsSection}>
        <h2 className={styles.skillsTitle}>
          <span className={styles.skillsTitleLine} /> Skills
        </h2>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === "tech" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("tech")}
          >
            Tech Stack
          </button>
          <button
            className={`${styles.tab} ${activeTab === "tools" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("tools")}
          >
            Tools
          </button>
        </div>

        <div className={styles.skillGrid}>
          {skills.map((skill) => (
            <div key={skill.name} className={styles.skillCard}>
              <div
                className={styles.skillIcon}
                style={{ background: skill.iconBg, color: skill.iconColor }}
              >
                {skill.icon}
              </div>
              <div className={styles.skillInfo}>
                <span className={styles.skillName}>{skill.name}</span>
                {skill.level && (
                  <span className={styles.skillLevel}>{skill.level}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
