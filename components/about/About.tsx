"use client";

import { RevealText } from "@/components/motion/RevealText";
import { ToolsMarquee } from "./ToolsMarquee";
import { Stats } from "./Stats";
import { PortraitFrame } from "@/components/hero/PortraitFrame";

export function About() {
  return (
    <section
      id="about"
      aria-label="About"
      className="relative px-6 pt-28 md:px-12 md:pt-40 lg:px-20"
    >
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
        {/* about photo — the morph target (hero portrait visually lands near here) */}
        <div className="md:col-span-5 md:col-start-1">
          <div className="w-[min(70vw,440px)]">
            <PortraitFrame
              src="/images/about-source.jpg"
              alt="Jake Ryall — candid"
              aspect="4/5"
            />
          </div>
        </div>

        {/* about copy */}
        <div className="flex flex-col gap-10 md:col-span-6 md:col-start-7 md:pt-6">
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="inline-block h-px w-10 bg-ink"
            />
            <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink font-semibold">
              About
            </span>
          </div>

          {/* headline — char-mode stagger with variable-weight morph (agency reveal) */}
          <h2
            className="display-black text-ink"
            style={{
              fontSize: "clamp(2.25rem, 4.2vw, 4rem)",
            }}
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
            <RevealText
              as="span"
              splitBy="char"
              stagger={0.012}
              weightFrom={200}
              weightTo={800}
              delay={0.15}
              className="block text-ink-soft"
              start="top 85%"
            >
              I design interfaces that move.
            </RevealText>
          </h2>

          <RevealText
            as="p"
            splitBy="word"
            stagger={0.018}
            className="max-w-xl text-pretty text-base font-medium leading-relaxed text-ink-soft md:text-lg"
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
