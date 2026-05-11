"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Star, Code2 } from "lucide-react";

type Project = {
  name: string;
  description: string;
  stack: string[];
  url: string;
  live?: string;
  language: string;
  stars?: number;
  year: string;
  category: string;
};

const projects: Project[] = [
  {
    name: "LPK NSISCHOOL",
    description:
      "Landing page for Indonesian vocational training institution sending workers to Japan. Trilingual (EN/JP/ID), gallery, news, FAQ, contact form.",
    stack: ["Next.js", "TypeScript", "Tailwind"],
    url: "https://lpknsischool.nsiia.co.id",
    live: "https://lpknsischool.nsiia.co.id",
    language: "TypeScript",
    year: "2025",
    category: "Client Work",
  },
  {
    name: "whatsapperha",
    description:
      "WhatsApp bot library with hook-based architecture, written in TypeScript.",
    stack: ["TypeScript", "Baileys", "Node.js"],
    url: "https://github.com/rayenking/whatsapperha",
    language: "TypeScript",
    stars: 3,
    year: "2025",
    category: "Library",
  },
  {
    name: "pembantu-ai",
    description:
      "Telegram AI bot built in Rust for the Devover ID community.",
    stack: ["Rust", "Tokio", "Telegram API"],
    url: "https://github.com/rayenking/pembantu-ai",
    language: "Rust",
    year: "2026",
    category: "Bot",
  },
  {
    name: "discord-mcp",
    description:
      "Model Context Protocol server for Discord — bridging AI agents to Discord workspaces.",
    stack: ["TypeScript", "MCP", "Discord API"],
    url: "https://github.com/rayenking/discord-mcp",
    language: "TypeScript",
    year: "2026",
    category: "Infrastructure",
  },
  {
    name: "watch2gether-local",
    description:
      "Real-time video sync app that runs entirely on your device — no server uploads.",
    stack: ["JavaScript", "WebRTC", "P2P"],
    url: "https://github.com/rayenking/watch2gether-local",
    language: "JavaScript",
    year: "2026",
    category: "P2P Tool",
  },
  {
    name: "ztef670block",
    description:
      "Network scanner & device blocker for ZTEF670 routers, automated via Puppeteer.",
    stack: ["TypeScript", "Puppeteer", "Automation"],
    url: "https://github.com/rayenking/ztef670block",
    language: "TypeScript",
    year: "2025",
    category: "Automation",
  },
];

const langColors: Record<string, string> = {
  TypeScript: "bg-blue-500",
  Rust: "bg-orange-500",
  JavaScript: "bg-yellow-500",
  Go: "bg-cyan-500",
  Python: "bg-emerald-500",
  PowerShell: "bg-sky-500",
};

export function Projects() {
  return (
    <section
      id="work"
      className="relative border-t border-foreground/10 px-6 py-32 sm:px-12 lg:px-24"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 flex items-end justify-between"
        >
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="text-[10px] font-mono tracking-[0.2em] text-muted uppercase">
                § Selected work
              </span>
            </div>
            <h2 className="font-serif text-4xl tracking-tight sm:text-5xl md:text-6xl">
              More <span className="italic text-muted">projects</span>
            </h2>
          </div>
          <a
            href="https://github.com/rayenking?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="group hidden items-center gap-2 text-sm text-muted transition-colors hover:text-foreground md:inline-flex"
          >
            All repositories
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {projects.map((project, i) => (
            <ProjectCard key={project.name} project={project} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 flex items-center justify-between border-t border-foreground/10 pt-8"
        >
          <p className="text-xs text-muted">
            + 10 more repos on GitHub
          </p>
          <a
            href="https://github.com/rayenking"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 text-sm transition-colors hover:text-foreground"
          >
            @rayenking
            <ArrowUpRight className="h-3.5 w-3.5 text-muted transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.a
      href={project.live || project.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative overflow-hidden rounded-2xl border border-foreground/10 bg-gradient-to-br from-foreground/[0.02] to-transparent p-6 transition-all hover:-translate-y-1 hover:border-foreground/30 sm:p-8"
    >
      <div className="flex h-full flex-col">
        <div className="mb-6 flex items-start justify-between">
          <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-muted uppercase">
            <Code2 className="h-3 w-3" />
            {project.category}
          </div>
          <div className="flex items-center gap-3 text-xs text-muted">
            {project.stars !== undefined && project.stars > 0 && (
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                {project.stars}
              </span>
            )}
            <span className="font-mono">{project.year}</span>
          </div>
        </div>

        <h3 className="font-serif text-3xl tracking-tight transition-transform duration-500 group-hover:-translate-y-0.5">
          {project.name}
          <ArrowUpRight className="ml-1 inline-block h-4 w-4 -translate-y-1 text-muted transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1.5 group-hover:text-foreground" />
        </h3>

        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
          {project.description}
        </p>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {project.stack.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-foreground/10 px-2.5 py-0.5 text-[10px] font-mono text-muted"
              >
                {tech}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted">
            <span
              className={`h-2 w-2 rounded-full ${
                langColors[project.language] || "bg-gray-500"
              }`}
            />
            {project.language}
          </div>
        </div>
      </div>
    </motion.a>
  );
}
