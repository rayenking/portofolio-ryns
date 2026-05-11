"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "16", label: "Open source repos" },
  { value: "3+", label: "Years building" },
  { value: "5+", label: "Languages" },
];

const facts = [
  "Writes Rust when Go isn't low-level enough, Go when Python is too slow.",
  "Obsessed with developer tooling — SSH clients, bots, CLIs, automation.",
  "Ships real projects, not tutorials. Prefers MIT-licensed open source.",
];

export function About() {
  return (
    <section id="about" className="relative border-t border-foreground/10 px-6 py-32 sm:px-12 lg:px-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 flex items-center gap-4"
        >
          <span className="text-[10px] font-mono tracking-[0.2em] text-muted uppercase">
            § About
          </span>
          <span className="h-px flex-1 bg-foreground/10" />
        </motion.div>

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7"
          >
            <h2 className="font-serif text-4xl leading-[1.1] tracking-tight sm:text-5xl md:text-6xl">
              I&apos;m <span className="italic text-muted">Ryns</span>,
              <br />
              a backend developer
              <br />
              who<span className="italic"> ships</span>.
            </h2>

            <div className="mt-10 space-y-6 text-base leading-relaxed text-foreground/80 max-w-xl">
              <p>
                Based in Indonesia. I build tools I&apos;d actually use —
                from SSH clients to WhatsApp bots to Telegram AI agents.
                Backend is my home base (Rust, Go, TypeScript, Python),
                but I pick up frontend when a project needs it.
              </p>
              <p className="text-muted">
                When I&apos;m not writing code, I&apos;m probably refactoring
                code I wrote yesterday.
              </p>
            </div>

            <ul className="mt-10 space-y-3">
              {facts.map((fact, i) => (
                <motion.li
                  key={fact}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex items-start gap-3 text-sm text-foreground/70"
                >
                  <span className="mt-[10px] h-px w-4 flex-shrink-0 bg-muted" />
                  <span>{fact}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 lg:pl-8 lg:border-l lg:border-foreground/10"
          >
            <div className="grid grid-cols-3 gap-6">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="font-serif text-4xl tracking-tight sm:text-5xl">
                    {stat.value}
                  </div>
                  <div className="mt-2 text-[10px] font-mono tracking-widest text-muted uppercase leading-tight">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-6">
              <div className="mb-4 flex items-center gap-2 text-[10px] font-mono tracking-widest text-muted uppercase">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500/60 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                </span>
                Now
              </div>
              <p className="text-sm leading-relaxed">
                Shipping{" "}
                <span className="font-serif italic">Iris SSH Manager</span> v0.x
                — a Tauri + Rust SSH client with split panes, SFTP, and
                command palette.
              </p>
            </div>

            <div className="mt-8 space-y-3 text-sm">
              <div className="flex justify-between border-b border-foreground/10 pb-3">
                <span className="text-muted">Location</span>
                <span>Indonesia</span>
              </div>
              <div className="flex justify-between border-b border-foreground/10 pb-3">
                <span className="text-muted">Handle</span>
                <a
                  href="https://github.com/rayenking"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-muted underline-offset-4 transition-colors hover:decoration-foreground"
                >
                  @rayenking
                </a>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Status</span>
                <span className="text-green-600 dark:text-green-500">Available</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
