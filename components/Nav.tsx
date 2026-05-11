"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { name: "About", href: "#about" },
  { name: "Featured", href: "#work" },
  { name: "Contact", href: "#contact" },
];

export function Nav() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  return (
    <motion.nav
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-foreground/10 bg-background/70 backdrop-blur-xl"
          : ""
      }`}
    >
      <div className="flex items-center justify-between px-6 py-5 sm:px-12 lg:px-24">
        <a
          href="#top"
          className="group flex items-center gap-2 font-serif text-xl tracking-tight"
        >
          <span className="relative flex h-8 w-8 items-center justify-center rounded-full border border-foreground/15 bg-background italic transition-all group-hover:border-foreground/40">
            r
          </span>
          <span className="transition-opacity group-hover:opacity-60">
            ryns<span className="italic text-muted">.</span>
          </span>
        </a>
        <ul className="hidden items-center gap-1 rounded-full border border-foreground/10 bg-background/50 p-1 backdrop-blur md:flex">
          {links.map((link) => (
            <li key={link.name}>
              <a
                href={link.href}
                className="rounded-full px-4 py-1.5 text-xs text-muted transition-all hover:bg-foreground/5 hover:text-foreground"
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className="group inline-flex items-center gap-2 rounded-full border border-foreground bg-foreground px-4 py-1.5 text-xs text-background transition-all hover:bg-transparent hover:text-foreground"
          >
            Say hi
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </a>
          <ThemeToggle />
        </div>
      </div>
    </motion.nav>
  );
}
