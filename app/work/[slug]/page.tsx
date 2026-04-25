import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { Metadata } from "next";
import { getAllSlugs, getProjectBySlug } from "@/lib/projects";
import { getCoverTreatmentForSlug } from "@/lib/coverTreatments";
import { CaseStudyHero } from "@/components/work/CaseStudyHero";
import { NextProject } from "@/components/work/NextProject";
import { caseStudyMdxComponents } from "./mdx-components";

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      images: [project.cover],
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const next = getProjectBySlug(project.nextSlug);
  const treatment = getCoverTreatmentForSlug(project.slug);
  const nextTreatment = next ? getCoverTreatmentForSlug(next.slug) : null;

  return (
    <>
      <CaseStudyHero
        slug={project.slug}
        title={project.title}
        client={project.client}
        year={project.year}
        role={project.role}
        cover={project.cover}
        summary={project.summary}
        treatment={treatment}
      />

      {/* MDX body */}
      <article className="relative px-6 py-20 md:px-12 md:py-28 lg:px-20">
        <div className="mx-auto max-w-[1600px]">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
            {/* sticky meta */}
            <aside className="md:col-span-3 md:col-start-1">
              <div className="md:sticky md:top-32 flex flex-col gap-6">
                <div>
                  <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink-soft font-semibold">
                    Year
                  </div>
                  <div className="mt-1 text-ink" style={{ fontWeight: 600 }}>
                    {project.year}
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink-soft font-semibold">
                    Client
                  </div>
                  <div className="mt-1 text-ink" style={{ fontWeight: 600 }}>
                    {project.client}
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink-soft font-semibold">
                    Role
                  </div>
                  <div className="mt-1 text-ink" style={{ fontWeight: 600 }}>
                    {project.role}
                  </div>
                </div>
                {project.stack && project.stack.length > 0 && (
                  <div>
                    <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink-soft font-semibold">
                      Stack
                    </div>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {project.stack.map((s) => (
                        <span
                          key={s}
                          className="font-mono text-[11px] tracking-wider uppercase text-ink font-semibold"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </aside>

            {/* MDX content */}
            <div className="md:col-span-8 md:col-start-5">
              <MDXRemote
                source={project.body}
                components={caseStudyMdxComponents}
              />
            </div>
          </div>
        </div>
      </article>

      {next && nextTreatment && <NextProject project={next} treatment={nextTreatment} />}
    </>
  );
}
