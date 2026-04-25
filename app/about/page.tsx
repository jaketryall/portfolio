import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "next-view-transitions";
import { RevealText } from "@/components/motion/RevealText";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { AboutPageGhostBackdrop } from "@/components/about/AboutPageGhostBackdrop";
import { ToolsMarquee } from "@/components/about/ToolsMarquee";
import { Stats } from "@/components/about/Stats";

export const metadata: Metadata = {
  title: "About",
  description:
    "Jake Ryall is a web designer in Scottsdale, AZ. Five years designing motion-driven interfaces for ambitious teams.",
};

const PRINCIPLES = [
  {
    n: "01",
    title: "Taste over tools.",
    body: "Software is the easy part. Knowing what to put on the screen is the work.",
  },
  {
    n: "02",
    title: "Motion as language.",
    body: "Every transition should carry meaning. If it doesn't, it's noise — even when it looks good.",
  },
  {
    n: "03",
    title: "Ship the design.",
    body: "I write production code. The thing that lives on the internet is the design — there's no hand-off.",
  },
  {
    n: "04",
    title: "Edit relentlessly.",
    body: "Every section, label, micro-interaction earns its place. The best designs are the ones with the most cuts.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* HERO — page anchor */}
      <section
        aria-label="About Jake Ryall"
        className="relative overflow-hidden px-6 pt-32 pb-20 md:px-12 md:pt-44 md:pb-28 lg:px-20"
      >
        <AboutPageGhostBackdrop />

        <div className="relative mx-auto grid max-w-[1600px] grid-cols-1 gap-16 md:grid-cols-12 md:gap-16">
          {/* left: portrait */}
          <div className="md:col-span-5 md:col-start-1">
            <div
              className="relative aspect-4/5 w-full overflow-hidden rounded-[24px] glass"
              style={{
                boxShadow:
                  "0 30px 80px -30px rgba(14,14,14,0.22), inset 0 0 0 1px rgba(14,14,14,0.06)",
              }}
            >
              <Image
                src="/images/hero-source.jpg"
                alt="Jake Ryall"
                fill
                priority
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* right: bio */}
          <div className="flex flex-col gap-10 md:col-span-6 md:col-start-7">
            <div className="flex items-center gap-3">
              <span aria-hidden className="inline-block h-px w-10 bg-ink" />
              <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink font-semibold">
                Designer · Scottsdale, AZ
              </span>
            </div>

            <h1
              className="display-black text-ink"
              style={{ fontSize: "clamp(2.75rem, 5.5vw, 5.5rem)" }}
            >
              <RevealText as="span" splitBy="word" stagger={0.05} className="block">
                Hey — I&rsquo;m Jake.
              </RevealText>
              <RevealText
                as="span"
                splitBy="word"
                stagger={0.05}
                delay={0.15}
                className="block text-ink-soft"
              >
                I make things move.
              </RevealText>
            </h1>

            <RevealText
              as="p"
              splitBy="word"
              stagger={0.018}
              delay={0.3}
              className="max-w-xl text-pretty text-base font-medium leading-relaxed text-ink-soft md:text-lg"
            >
              I&rsquo;m a web designer based in Scottsdale, working with ambitious teams worldwide. Five years in, my obsession is the same as it was on day one — interfaces that feel considered, motion that carries meaning, and shipping things that look like they were built by a small studio that cares.
            </RevealText>

            <RevealText
              as="p"
              splitBy="word"
              stagger={0.014}
              delay={0.5}
              className="max-w-xl text-pretty text-base font-medium leading-relaxed text-ink-soft md:text-lg"
            >
              I work end-to-end: brief, type system, motion language, layouts, then I write the production code myself. No hand-off. The thing that ships is the design.
            </RevealText>

            <Stats />
          </div>
        </div>
      </section>

      {/* PRINCIPLES — what I believe */}
      <section
        aria-label="Principles"
        className="relative px-6 py-28 md:px-12 md:py-40 lg:px-20"
      >
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-16 flex flex-col gap-8 md:mb-24">
            <div className="flex items-center gap-3">
              <span aria-hidden className="inline-block h-px w-10 bg-ink" />
              <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink font-semibold">
                Principles
              </span>
            </div>
            <h2
              className="display-black max-w-3xl text-ink"
              style={{ fontSize: "clamp(2rem, 4vw, 4rem)" }}
            >
              <RevealText as="span" splitBy="word" stagger={0.04} className="block">
                What I believe about
              </RevealText>
              <RevealText
                as="span"
                splitBy="word"
                stagger={0.04}
                delay={0.1}
                className="block text-ink-soft"
              >
                designing for the web.
              </RevealText>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
            {PRINCIPLES.map((p) => (
              <article
                key={p.n}
                data-cursor="hover"
                className="group hover-lift relative flex flex-col gap-5 rounded-3xl bg-canvas p-7 md:p-10"
                style={{
                  boxShadow:
                    "0 20px 60px -30px rgba(14,14,14,0.18), inset 0 0 0 1px rgba(14,14,14,0.06)",
                }}
              >
                <span
                  className="text-ink"
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "clamp(2.5rem, 4vw, 4rem)",
                    fontWeight: 700,
                    fontVariationSettings: '"wght" 700',
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                  }}
                >
                  {p.n}
                </span>
                <h3
                  className="text-ink"
                  style={{
                    fontSize: "clamp(1.4rem, 2.2vw, 2rem)",
                    fontFamily: "var(--font-sans)",
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    lineHeight: 1.1,
                  }}
                >
                  {p.title}
                </h3>
                <p className="max-w-md text-pretty text-base font-medium leading-relaxed text-ink-soft">
                  {p.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* TOOLS — full bleed marquee */}
      <section
        aria-label="Tools"
        className="relative py-20 md:py-28"
      >
        <div className="mx-auto max-w-[1600px] px-6 md:px-12 lg:px-20">
          <div className="mb-12 flex items-center gap-3">
            <span aria-hidden className="inline-block h-px w-10 bg-ink" />
            <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink font-semibold">
              Tools I reach for
            </span>
          </div>
        </div>
        <ToolsMarquee />
      </section>

      {/* CTA */}
      <section
        aria-label="Get in touch"
        className="relative px-6 pb-32 md:px-12 md:pb-44 lg:px-20"
      >
        <div className="mx-auto max-w-[1600px]">
          <div
            className="relative overflow-hidden rounded-[28px] p-10 md:p-16"
            style={{
              background: "rgba(244, 242, 238, 0.55)",
              boxShadow:
                "inset 0 0 0 1px rgba(14,14,14,0.06), 0 30px 80px -40px rgba(14,14,14,0.18)",
            }}
          >
            <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
              <h2
                className="display-black max-w-2xl text-ink"
                style={{ fontSize: "clamp(1.75rem, 3.5vw, 3.5rem)" }}
              >
                Building something soon?
              </h2>
              <MagneticButton
                as={Link}
                href="/contact"
                data-cursor="view"
                data-cursor-label="WRITE"
                className="rounded-full bg-ink px-8 py-5 font-mono text-[13px] tracking-[0.2em] uppercase text-canvas font-semibold"
              >
                Start a project →
              </MagneticButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
