import { getAllProjects } from "@/lib/projects";
import { ProjectCard } from "./ProjectCard";
import { WorkGhostBackdrop } from "./WorkGhostBackdrop";
import { RevealText } from "@/components/motion/RevealText";

export function WorkGrid() {
  const projects = getAllProjects();

  return (
    <section
      id="work"
      data-section="work"
      aria-label="Selected work"
      className="relative px-6 pt-64 md:px-12 md:pt-80 lg:px-20"
    >
      <WorkGhostBackdrop />

      <div className="relative mx-auto max-w-[1600px]">
        {/* section header */}
        <div className="mb-20 flex flex-col gap-8 md:mb-28">
          <div className="flex items-center gap-3">
            <span aria-hidden className="inline-block h-px w-10 bg-ink" />
            <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink font-semibold">
              Selected Work · 2024 — present
            </span>
          </div>
          <h2
            className="display-black max-w-3xl text-ink"
            style={{ fontSize: "clamp(2.25rem, 4.5vw, 4.5rem)" }}
          >
            <RevealText
              as="span"
              splitBy="char"
              stagger={0.012}
              weightFrom={200}
              weightTo={800}
              className="block"
              start="top 85%"
            >
              Six projects I&rsquo;m proud of.
            </RevealText>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-x-12 gap-y-16 md:grid-cols-2 md:gap-x-16 md:gap-y-32">
          {projects.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
