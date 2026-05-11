"use client";

import { motion } from "framer-motion";

const techCategories = [
  {
    label: "Languages",
    items: ["Rust", "Go", "TypeScript", "Python", "JavaScript"],
  },
  {
    label: "Backend",
    items: ["Node.js", "Tokio", "Axum", "Express", "gRPC", "PostgreSQL"],
  },
  {
    label: "Frontend",
    items: ["React", "Next.js", "Tailwind", "Framer Motion"],
  },
  {
    label: "Tools",
    items: ["Tauri", "Docker", "Linux", "Git"],
  },
];

const marqueeTech = [
  "Rust",
  "Go",
  "TypeScript",
  "Python",
  "Tauri",
  "Next.js",
  "React",
  "Node.js",
  "Tailwind",
  "PostgreSQL",
  "Docker",
  "Linux",
  "gRPC",
  "Tokio",
];

export function Stack() {
  return (
    <section className="relative border-t border-foreground/10 py-32 overflow-hidden">
      <div className="px-6 sm:px-12 lg:px-24">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mb-16 flex items-center gap-4"
          >
            <span className="text-[10px] font-mono tracking-[0.2em] text-muted uppercase">
              § Toolkit
            </span>
            <span className="h-px flex-1 bg-foreground/10" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mb-16 max-w-3xl font-serif text-4xl leading-[1.1] tracking-tight sm:text-5xl md:text-6xl"
          >
            Tools I reach for <span className="italic text-muted">daily</span>.
          </motion.h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {techCategories.map((cat, i) => (
              <motion.div
                key={cat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div className="mb-4 flex items-center gap-2 text-[10px] font-mono tracking-widest text-muted uppercase">
                  <span className="font-serif italic text-sm lowercase tracking-normal">
                    {`0${i + 1}`}
                  </span>
                  <span className="h-px w-6 bg-muted/40" />
                  {cat.label}
                </div>
                <ul className="space-y-2">
                  {cat.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-sm text-foreground/80 transition-colors hover:text-foreground"
                    >
                      <span className="h-1 w-1 rounded-full bg-muted/60" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative mt-24 flex overflow-hidden border-y border-foreground/10 py-8">
        <div className="animate-marquee flex shrink-0 items-center gap-16 whitespace-nowrap">
          {[...marqueeTech, ...marqueeTech].map((tech, i) => (
            <div
              key={i}
              className="flex items-center gap-16 font-serif text-5xl italic text-muted sm:text-6xl md:text-7xl"
            >
              <span>{tech}</span>
              <span className="text-foreground">✦</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
