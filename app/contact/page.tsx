import type { Metadata } from "next";
import { RevealText } from "@/components/motion/RevealText";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { AvailabilityPill } from "@/components/ui/AvailabilityPill";
import { ContactGhostBackdrop } from "@/components/contact/ContactGhostBackdrop";
import { ContactForm } from "@/components/contact/ContactForm";

const EMAIL = "hello@jakeryall.com";

const SOCIALS = [
  { label: "LinkedIn", href: "https://linkedin.com/in/jakeryall" },
  { label: "Twitter", href: "https://twitter.com/jakeryall" },
  { label: "Dribbble", href: "https://dribbble.com/jakeryall" },
  { label: "Read.cv", href: "https://read.cv/jakeryall" },
];

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Jake Ryall — web designer based in Scottsdale, currently available for select projects.",
};

export default function ContactPage() {
  return (
    <section
      aria-label="Contact"
      className="relative min-h-svh overflow-hidden px-6 pt-32 pb-32 md:px-12 md:pt-44 md:pb-44 lg:px-20"
    >
      <ContactGhostBackdrop />

      <div className="relative mx-auto grid max-w-[1600px] grid-cols-1 gap-16 md:grid-cols-12 md:gap-16">
        {/* left: hero copy + email + socials */}
        <div className="flex flex-col gap-12 md:col-span-7 md:col-start-1">
          <div className="flex items-center gap-3">
            <span aria-hidden className="inline-block h-px w-10 bg-ink" />
            <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink font-semibold">
              Available · Q3 2026
            </span>
          </div>

          <h1
            className="display-black max-w-3xl text-ink"
            style={{ fontSize: "clamp(2.75rem, 6vw, 6rem)" }}
          >
            <RevealText as="span" splitBy="word" stagger={0.05} className="block">
              Have a project
            </RevealText>
            <RevealText as="span" splitBy="word" stagger={0.05} delay={0.15} className="block">
              in mind?
            </RevealText>
            <RevealText
              as="span"
              splitBy="word"
              stagger={0.05}
              delay={0.3}
              className="block text-ink-soft"
            >
              Let&rsquo;s talk.
            </RevealText>
          </h1>

          <p className="max-w-lg text-pretty text-base font-medium leading-relaxed text-ink-soft md:text-lg">
            I take on a small number of projects each quarter. Drop a few details below — or email me directly. I usually reply within a day.
          </p>

          <div className="flex flex-col items-start gap-4">
            <MagneticButton
              as="a"
              href={`mailto:${EMAIL}`}
              data-cursor="view"
              data-cursor-label="WRITE"
              className="rounded-full bg-ink px-8 py-5 font-mono text-[13px] tracking-[0.2em] uppercase text-canvas font-semibold"
            >
              {EMAIL}
            </MagneticButton>
            <AvailabilityPill>Replies within ~24h</AvailabilityPill>
          </div>

          <div className="mt-4 flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-8">
            {SOCIALS.map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="hover"
                className="nav-link relative inline-flex overflow-hidden font-mono text-[12px] tracking-[0.18em] uppercase text-ink font-semibold"
              >
                <span className="nav-link-inner">{s.label}</span>
                <span className="nav-link-clone">{s.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* right: form card */}
        <div className="md:col-span-5 md:col-start-8">
          <div
            className="rounded-[28px] p-7 md:p-10"
            style={{
              background: "rgba(244, 242, 238, 0.55)",
              boxShadow:
                "inset 0 0 0 1px rgba(14,14,14,0.06), 0 30px 80px -40px rgba(14,14,14,0.18)",
            }}
          >
            <div className="mb-8 flex items-center justify-between">
              <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink font-semibold">
                Project brief
              </span>
              <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-ink-mute font-semibold">
                Optional
              </span>
            </div>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
