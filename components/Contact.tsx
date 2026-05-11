"use client";

import { motion } from "framer-motion";
import { Mail, ArrowUpRight, Copy, Check } from "lucide-react";
import { useState } from "react";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.38 7.86 10.9.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.73 1.27 3.4.97.1-.76.4-1.27.74-1.56-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.28 1.18-3.08-.12-.3-.51-1.48.11-3.08 0 0 .97-.31 3.18 1.18a11.01 11.01 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.6.24 2.78.12 3.08.74.8 1.18 1.82 1.18 3.08 0 4.43-2.7 5.4-5.27 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

const socials = [
  { name: "GitHub", handle: "rayenking", href: "https://github.com/rayenking", icon: GithubIcon },
  { name: "Blog", handle: "itsryns.cyou", href: "https://itsryns.cyou", icon: Mail },
];

const EMAIL = "hello@itsryns.cyou";

export function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <section id="contact" className="relative border-t border-foreground/10 px-6 py-32 sm:px-12 lg:px-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mb-16 flex items-center gap-4"
        >
          <span className="text-[10px] font-mono tracking-[0.2em] text-muted uppercase">
            § Contact
          </span>
          <span className="h-px flex-1 bg-foreground/10" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-12"
        >
          <div className="lg:col-span-7">
            <h2 className="font-serif text-5xl leading-[1.02] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
              Let&apos;s build
              <br />
              <span className="italic text-muted">something good</span>
              <span className="text-muted">.</span>
            </h2>
            <p className="mt-8 max-w-md text-base leading-relaxed text-muted">
              Punya project backend yang butuh performa, tool internal yang
              perlu dibangun, atau mau kolaborasi open source? Kirim aja.
            </p>

            <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href={`mailto:${EMAIL}`}
                className="group inline-flex items-center gap-3 border-b border-foreground pb-2 font-serif text-2xl italic transition-colors hover:text-foreground"
              >
                {EMAIL}
                <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <button
                onClick={copyEmail}
                className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-4 py-2 text-xs font-mono tracking-wider uppercase transition-colors hover:border-foreground/50"
                aria-label="Copy email"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" /> Copy
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 lg:pl-8 lg:border-l lg:border-foreground/10">
            <div className="mb-6 text-[10px] font-mono tracking-widest text-muted uppercase">
              → Elsewhere
            </div>
            <ul className="space-y-3">
              {socials.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between rounded-xl border border-foreground/10 bg-foreground/[0.02] px-5 py-4 transition-all hover:-translate-y-0.5 hover:border-foreground/40"
                  >
                    <div className="flex items-center gap-3">
                      <s.icon className="h-4 w-4 text-muted transition-colors group-hover:text-foreground" />
                      <span className="text-sm">{s.name}</span>
                    </div>
                    <span className="flex items-center gap-2 text-sm text-muted transition-colors group-hover:text-foreground">
                      @{s.handle}
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-xl border border-foreground/10 bg-foreground/[0.02] p-5">
              <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-muted uppercase">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500/60 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                </span>
                Responds within 24h
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-32 flex flex-col items-start justify-between gap-4 border-t border-foreground/10 pt-8 text-[10px] font-mono tracking-widest text-muted uppercase sm:flex-row sm:items-center">
          <span>© 2026 Ryns · rayenking</span>
          <span className="flex items-center gap-3">
            <span>Next.js</span>
            <span>×</span>
            <span>Tailwind</span>
            <span>×</span>
            <span>Framer Motion</span>
          </span>
        </div>
      </div>
    </section>
  );
}
