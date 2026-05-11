"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Sparkles } from "lucide-react";
import { useRef } from "react";
import { PixelGlobe } from "./PixelGlobe";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex min-h-screen flex-col justify-between overflow-hidden px-6 pt-36 pb-12 sm:px-12 lg:px-24 cursor-crosshair select-none"
    >
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />

      <PixelGlobe parentRef={ref} />

      <motion.div style={{ y, opacity }} className="relative z-10 flex flex-1 flex-col justify-center max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 flex items-center gap-3 text-[10px] font-mono tracking-[0.2em] text-muted uppercase"
        >
          <span className="h-px w-10 bg-muted/50" />
          <span>Portfolio / 2026</span>
          <span className="h-px w-10 bg-muted/50" />
        </motion.div>

        <h1 className="font-serif text-[clamp(3.5rem,14vw,12rem)] leading-[0.9] tracking-[-0.04em]">
          <AnimatedWord word="Ryns" delay={0.1} />
          <span className="inline-block text-muted italic">.</span>
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-12"
        >
          <div className="md:col-span-7">
            <p className="text-lg leading-[1.4] text-foreground sm:text-xl md:text-2xl">
              <span className="font-serif italic">Passionate programmer</span>
              <span className="text-muted"> with 5+ years of </span>
              <span>freelance experience</span>
              <span className="text-muted">.</span>
              <br />
              <span className="text-muted">Fluent in </span>
              <span className="font-mono text-sm sm:text-base md:text-lg">Go · TS · Python · Rust</span>
              <span className="text-muted">.</span>
            </p>
          </div>

          <div className="md:col-span-5 md:pl-8 md:border-l md:border-foreground/10">
            <CurrentFocus />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 flex items-center gap-8 text-sm"
        >
          <a
            href="#work"
            className="group relative inline-flex items-center gap-3 rounded-full border border-foreground bg-foreground px-6 py-3 text-background transition-all hover:bg-transparent hover:text-foreground"
          >
            <span>Selected work</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
          <a
            href="#contact"
            className="group inline-flex items-center gap-2 text-muted transition-colors hover:text-foreground"
          >
            <span className="relative">
              Get in touch
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-foreground transition-all duration-300 group-hover:w-full" />
            </span>
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.4 }}
        className="relative z-10 flex items-end justify-between text-[10px] font-mono tracking-widest text-muted uppercase"
      >
        <div className="flex items-center gap-3">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500/60 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          Available for collaboration
        </div>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex items-center gap-2"
        >
          Scroll to explore
          <ArrowDown className="h-3 w-3" />
        </motion.div>
      </motion.div>
    </section>
  );
}

function AnimatedWord({ word, delay = 0 }: { word: string; delay?: number }) {
  return (
    <span className="inline-block">
      {word.split("").map((letter, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 80, rotateX: -90 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            duration: 0.9,
            delay: delay + i * 0.06,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="inline-block"
          style={{ transformOrigin: "50% 100%" }}
        >
          {letter}
        </motion.span>
      ))}
    </span>
  );
}

function CurrentFocus() {
  return (
    <div className="pointer-events-none">
      <div className="mb-6 flex items-center gap-2 text-[10px] font-mono tracking-widest text-muted uppercase">
        <Sparkles className="h-3 w-3" />
        Current focus
      </div>
      <p className="text-sm leading-relaxed text-foreground/80">
        Building{" "}
        <a
          href="https://github.com/rayenking/iris-ssh-manager"
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto underline decoration-muted underline-offset-4 transition-colors hover:decoration-foreground"
        >
          Iris SSH Manager
        </a>
        {" "}— a Tauri + Rust SSH client as a personal alternative to Termius.
      </p>
    </div>
  );
}
