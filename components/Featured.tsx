"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowUpRight, Terminal, Shield, Zap, Package, Camera, Sparkles, Layout, Share2 } from "lucide-react";

type FeaturedProject = {
  num: string;
  badge: string;
  icon: string;
  name: string;
  tagline: string;
  description: string;
  caseStudy: {
    heading: React.ReactNode;
    body: string;
  };
  stack: string[];
  features: { icon: React.ComponentType<{ className?: string }>; label: string; desc: string }[];
  cta: { primary: { label: string; href: string }; secondary?: { label: string; href: string } };
  mock: "terminal" | "photobooth";
  tint: string;
};

const projects: FeaturedProject[] = [
  {
    num: "01",
    badge: "Open Source · MIT",
    icon: "i",
    name: "iris-ssh-manager",
    tagline: "Flagship",
    description:
      "A modern, cross-platform SSH client built with Tauri + Rust. Personal alternative to Termius / Bitvise — fast, lightweight, and fully open source.",
    caseStudy: {
      heading: (
        <>
          Building the SSH client I <span className="italic">wished</span> existed.
        </>
      ),
      body: "After years of switching between Termius, iTerm, and raw OpenSSH, I built Iris to unify everything: connection management, terminal, SFTP, and port forwarding — in a single native app under 20MB.",
    },
    stack: ["Tauri 2.0", "Rust", "React", "TypeScript", "Tailwind v4", "xterm.js", "russh"],
    features: [
      { icon: Terminal, label: "SSH Terminal", desc: "xterm.js + WebGL, russh streaming" },
      { icon: Zap, label: "Split Panes", desc: "Draggable dividers, multi-session" },
      { icon: Package, label: "SFTP Browser", desc: "Dual-pane, drag & drop, r2r" },
      { icon: Shield, label: "OS Keychain", desc: "Native credential storage" },
    ],
    cta: {
      primary: { label: "View on GitHub", href: "https://github.com/rayenking/iris-ssh-manager" },
      secondary: { label: "Download", href: "https://github.com/rayenking/iris-ssh-manager/releases" },
    },
    mock: "terminal",
    tint: "from-pink-500/10 to-purple-500/10",
  },
  {
    num: "02",
    badge: "Product · Live",
    icon: "n",
    name: "na-booth",
    tagline: "Main Product",
    description:
      "Digital photobooth untuk event — capture langsung di browser, pilih layout (strip, square, portrait), dan print atau share instan.",
    caseStudy: {
      heading: (
        <>
          Digital photobooth untuk <span className="italic">event profesional</span>.
        </>
      ),
      body: "Dibangun untuk operator event yang butuh kontrol penuh: multiple print sizes (4×3 strip, 4×6 landscape, 6×6 square, 6×4 portrait), capture multi-shot langsung dari browser, dan customizable template per event.",
    },
    stack: ["React", "Vite", "Express", "Bun", "Tailwind"],
    features: [
      { icon: Camera, label: "Live Capture", desc: "Browser camera, multi-shot sequence" },
      { icon: Layout, label: "Print Sizes", desc: "Strip, square, portrait, landscape" },
      { icon: Sparkles, label: "Custom Templates", desc: "Per-event branding & styling" },
    ],
    cta: {
      primary: { label: "Try it live", href: "https://na-booth.itsryns.cyou" },
    },
    mock: "photobooth",
    tint: "from-amber-500/10 to-rose-500/10",
  },
];

export function Featured() {
  return (
    <section className="relative border-t border-foreground/10 px-6 py-32 sm:px-12 lg:px-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 flex items-center gap-4"
        >
          <span className="text-[10px] font-mono tracking-[0.2em] text-muted uppercase">
            § Featured
          </span>
          <span className="h-px flex-1 bg-foreground/10" />
          <span className="text-[10px] font-mono tracking-[0.2em] text-muted uppercase">
            Highlights
          </span>
        </motion.div>

        <div className="space-y-24">
          {projects.map((project, i) => (
            <FeaturedRow key={project.name} project={project} reversed={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedRow({ project, reversed }: { project: FeaturedProject; reversed: boolean }) {
  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`lg:col-span-7 ${reversed ? "lg:order-2" : ""}`}
      >
        <a
          href={project.cta.primary.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block overflow-hidden rounded-2xl border border-foreground/10 bg-gradient-to-br from-foreground/[0.03] to-transparent p-8 transition-all hover:border-foreground/30 sm:p-12"
        >
          <div className={`absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br ${project.tint} blur-3xl transition-opacity group-hover:opacity-60`} />

          <div className="relative flex flex-col gap-8">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-foreground/10 bg-background font-serif text-lg italic">
                  {project.icon}
                </div>
                <div>
                  <div className="font-mono text-xs tracking-wider text-muted uppercase">
                    {project.badge}
                  </div>
                  <div className="font-serif text-2xl tracking-tight">{project.name}</div>
                </div>
              </div>
              <ArrowUpRight className="h-5 w-5 text-muted transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-foreground" />
            </div>

            {project.mock === "terminal" ? <TerminalMock /> : <PhotoboothMock />}

            <p className="max-w-lg text-base leading-relaxed text-muted">{project.description}</p>

            <div className="flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-foreground/10 bg-background/60 px-3 py-1 text-xs font-mono text-muted backdrop-blur"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </a>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className={`lg:col-span-5 ${reversed ? "lg:order-1" : ""}`}
      >
        <div className="sticky top-24 space-y-8">
          <div>
            <div className="mb-3 flex items-center gap-2 text-[10px] font-mono tracking-widest text-muted uppercase">
              <span>→ {project.tagline === "Main Product" ? "Product" : "Case study"}</span>
              <span className="h-px w-6 bg-muted/40" />
              <span>{project.num}</span>
            </div>
            <h3 className="font-serif text-3xl leading-[1.1] tracking-tight sm:text-4xl">
              {project.caseStudy.heading}
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-muted">{project.caseStudy.body}</p>
          </div>

          <div className="space-y-3">
            {project.features.map((feat, i) => (
              <motion.div
                key={feat.label}
                initial={{ opacity: 0, x: 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex items-start gap-4 rounded-xl border border-foreground/10 bg-foreground/[0.02] p-4"
              >
                <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md border border-foreground/10 bg-background">
                  <feat.icon className="h-3.5 w-3.5 text-foreground" />
                </div>
                <div>
                  <div className="text-sm font-medium">{feat.label}</div>
                  <div className="text-xs text-muted">{feat.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col gap-3 pt-4 sm:flex-row">
            <a
              href={project.cta.primary.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-foreground bg-foreground px-5 py-3 text-sm text-background transition-colors hover:bg-foreground/90"
            >
              {project.cta.primary.label}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            {project.cta.secondary && (
              <a
                href={project.cta.secondary.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-foreground/20 px-5 py-3 text-sm transition-colors hover:border-foreground/50"
              >
                {project.cta.secondary.label}
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function TerminalMock() {
  return (
    <div className="aspect-video overflow-hidden rounded-xl border border-foreground/10 bg-[#0a0a0a]">
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
          <div className="ml-4 font-mono text-[10px] tracking-wider text-white/40 uppercase">
            iris · production.server
          </div>
        </div>
        <div className="flex flex-1 font-mono text-xs">
          <div className="w-48 border-r border-white/10 p-3">
            <div className="mb-2 text-[9px] tracking-wider text-white/40 uppercase">
              Connections
            </div>
            <div className="space-y-1">
              <div className="rounded bg-pink-500/10 px-2 py-1 text-pink-300">● production</div>
              <div className="px-2 py-1 text-white/50">● staging</div>
              <div className="px-2 py-1 text-white/50">● dev-vm</div>
              <div className="px-2 py-1 text-white/50">● raspberry</div>
            </div>
          </div>
          <div className="flex-1 p-3 text-white/70">
            <div className="text-green-400">ryns@production:~$</div>
            <div className="text-white/50">$ systemctl status iris-api</div>
            <div className="mt-2 text-white/60">
              <span className="text-green-400">●</span> iris-api.service
            </div>
            <div className="text-white/40">
              {" "}Active: <span className="text-green-400">active (running)</span>
            </div>
            <div className="mt-2 inline-flex items-center text-green-400">
              ryns@production:~$
              <span className="ml-1 inline-block h-3 w-1.5 cursor-blink bg-green-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PhotoboothMock() {
  const slides = [
    { src: "/nabooth-1.png", label: "Booth Interface" },
    { src: "/nabooth-2.png", label: "Landing Page" },
    { src: "/nabooth-3.png", label: "Plans" },
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 3200);
    return () => clearInterval(t);
  }, [slides.length]);

  return (
    <div className="relative aspect-video overflow-hidden rounded-xl border border-foreground/10 bg-stone-100 dark:bg-stone-900">
      {/* Corner frame accents */}
      <div className="pointer-events-none absolute inset-2 z-20 rounded-lg">
        <span className="absolute left-0 top-0 h-3 w-3 border-l border-t border-white/40" />
        <span className="absolute right-0 top-0 h-3 w-3 border-r border-t border-white/40" />
        <span className="absolute bottom-0 left-0 h-3 w-3 border-b border-l border-white/40" />
        <span className="absolute bottom-0 right-0 h-3 w-3 border-b border-r border-white/40" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={slides[index].src}
            alt={`na-booth ${slides[index].label}`}
            fill
            sizes="(max-width: 1024px) 100vw, 600px"
            className="object-cover object-top"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Label tag */}
      <div className="absolute bottom-3 left-3 z-10 flex gap-1.5">
        <span className="rounded-full bg-black/70 px-2 py-0.5 text-[9px] font-mono text-white tracking-wider uppercase backdrop-blur">
          ● LIVE
        </span>
        <motion.span
          key={`label-${index}`}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-full bg-black/70 px-2 py-0.5 text-[9px] font-mono text-white tracking-wider uppercase backdrop-blur"
        >
          {slides[index].label}
        </motion.span>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-3 right-3 z-10 flex gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1 rounded-full transition-all ${
              i === index ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
