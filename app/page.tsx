import { AtmosphereLayer } from "@/components/atmosphere/AtmosphereLayer";
import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/about/About";

export default function Home() {
  return (
    <>
      <AtmosphereLayer />
      <Hero />
      <About />
      {/* Work, Process, Testimonials, Footer → coming in next phases */}
      <div className="h-[60vh]" />
    </>
  );
}
