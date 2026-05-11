import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Featured } from "@/components/Featured";
import { Projects } from "@/components/Projects";
import { Stack } from "@/components/Stack";
import { Contact } from "@/components/Contact";

export default function Home() {
  return (
    <main className="relative">
      <Nav />
      <Hero />
      <About />
      <Featured />
      <Projects />
      <Stack />
      <Contact />
    </main>
  );
}
