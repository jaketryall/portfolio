import { AtmosphereLayer } from "@/components/atmosphere/AtmosphereLayer";
import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/about/About";
import { FloatingPortrait } from "@/components/hero/FloatingPortrait";
import { WorkGrid } from "@/components/work/WorkGrid";
import { Process } from "@/components/process/Process";
import { Testimonials } from "@/components/testimonials/Testimonials";
import { Footer } from "@/components/footer/Footer";

export default function Home() {
  return (
    <>
      <AtmosphereLayer />

      <div data-portrait-scrub="true" className="relative">
        <FloatingPortrait
          heroSrc="/images/hero-source.jpg"
          aboutSrc="/images/about-source.jpg"
          alt="Jake Ryall"
        />
        <Hero />
        <About />
      </div>

      <WorkGrid />
      <Process />
      <Testimonials />
      <Footer />
    </>
  );
}
