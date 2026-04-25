import { getAllProjects } from "@/lib/projects";
import { ProjectCard } from "./ProjectCard";
import { WorkGhostBackdrop } from "./WorkGhostBackdrop";

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
        <div className="mb-20 flex items-end justify-between gap-6 md:mb-28">
          <div className="flex items-center gap-3">
            <span aria-hidden className="inline-block h-px w-10 bg-ink" />
            <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink font-semibold">
              Selected Work · {new Date().getFullYear()}
            </span>
          </div>
          <span className="hidden font-mono text-[11px] tracking-[0.18em] uppercase text-ink-soft md:inline-block">
            {projects.length} projects
          </span>
        </div>

        {/* staggered 2-column grid (azizkhaldi-inspired simplicity) */}
        <div className="grid grid-cols-1 gap-x-12 gap-y-16 md:grid-cols-2 md:gap-x-16 md:gap-y-24">
          {projects.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
