"use client";

import { RevealText } from "@/components/motion/RevealText";
import { ToolsMarquee } from "./ToolsMarquee";
import { Stats } from "./Stats";
import { AboutGhostBackdrop } from "./AboutGhostBackdrop";

export function About() {
  return (
    <section
      id="about"
      data-section="about"
      aria-label="About"
      className="relative overflow-hidden rounded-t-[32px] px-6 pt-32 pb-32 md:rounded-t-[56px] md:px-12 md:pt-44 md:pb-44 lg:px-20"
      style={{
        background: "transparent",
        // subtle inset border traces the rounded corner shape so the curve
        // is visible even though the slab has no tonal fill — atmosphere
        // shows through uniformly with no corner-cutout contrast
        boxShadow: "inset 0 1px 0 rgba(14,14,14,0.06)",
      }}
    >
      {/* echoing ghost-text motif — tied to the hero's JAKE/RYALL backdrop */}
      <AboutGhostBackdrop />

      <div className="relative mx-auto grid max-w-[1600px] grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
        {/* portrait slot — invisible placeholder; the FloatingPortrait arrives here via scroll-morph */}
        <div className="md:col-span-5 md:col-start-1">
          <div
            data-portrait-target="about"
            className="w-[min(70vw,440px)] aspect-4/5"
            aria-hidden
          />
        </div>

        {/* about copy */}
        <div className="flex flex-col gap-10 md:col-span-6 md:col-start-7 md:pt-6">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink font-semibold">
              5 yrs designing · Scottsdale, AZ
            </span>
          </div>

          <h2
            className="display-black text-ink"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}
          >
            <RevealText
              as="span"
              splitBy="char"
              stagger={0.018}
              weightFrom={200}
              weightTo={800}
              className="block"
              start="top 85%"
            >
              Hey — I&rsquo;m Jake.
            </RevealText>
          </h2>

          <RevealText
            as="p"
            splitBy="char"
            stagger={0.004}
            weightFrom={300}
            weightTo={500}
            delay={0.3}
            className="max-w-xl text-pretty text-base leading-relaxed text-ink-soft md:text-lg"
            start="top 85%"
          >
            Based in Scottsdale, working with ambitious teams worldwide. I focus on motion, typography, and the small details that make a product feel considered. Tools are just tools — taste is the job.
          </RevealText>

          <Stats />
        </div>
      </div>

      {/* tools marquee — full bleed */}
      <div className="mt-28 md:mt-40 -mx-6 md:-mx-12 lg:-mx-20">
        <ToolsMarquee />
      </div>
    </section>
  );
}
