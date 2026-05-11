"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
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
          className="group relative flex items-center font-serif text-xl tracking-tight"
        >
          <span className="relative z-0 flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-foreground/15 bg-background transition-all group-hover:scale-105 group-hover:border-foreground/40">
            <Image
              src="/logo-black.png"
              alt="Ryns logo"
              width={36}
              height={36}
              className="h-full w-full object-cover logo-light"
              priority
            />
            <Image
              src="/logo.png"
              alt=""
              width={36}
              height={36}
              className="absolute inset-0 h-full w-full object-cover logo-dark"
              aria-hidden
              priority
            />
          </span>
          <span className="relative z-10 -ml-3 transition-opacity group-hover:opacity-60">
            yns<span className="italic text-muted">.</span>
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
