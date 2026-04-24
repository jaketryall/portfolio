import { AtmosphereLayer } from "@/components/atmosphere/AtmosphereLayer";
import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/about/About";
import { FloatingPortrait } from "@/components/hero/FloatingPortrait";

export default function Home() {
  return (
    <>
      <AtmosphereLayer />

      {/* Shared portrait scrub wrapper — the FloatingPortrait lives inside,
          physically travels between Hero and About slots as you scroll. */}
      <div data-portrait-scrub="true" className="relative">
        <FloatingPortrait
          heroSrc="/images/hero-source.jpg"
          aboutSrc="/images/about-source.jpg"
          alt="Jake Ryall"
        />
        <Hero />
        <About />
      </div>

      {/* Work, Process, Testimonials, Footer — coming in later phases */}
      <div className="h-[60vh]" />
    </>
  );
}
