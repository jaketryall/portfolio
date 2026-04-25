import "server-only";
import { getAllProjects } from "@/lib/projects";
import { COVER_TREATMENTS, type CoverTreatment } from "@/lib/coverTreatments";

/** Look up a project's cover treatment by slug — based on its index in
 *  the sorted projects list. Used so a cover renders identically on the
 *  home card and on the case study hero, making the view-transition
 *  morph visually continuous.
 *
 *  Server-only: depends on `lib/projects.ts` which uses `node:fs`. */
export function getCoverTreatmentForSlug(slug: string): CoverTreatment {
  const projects = getAllProjects();
  const idx = projects.findIndex((p) => p.slug === slug);
  return COVER_TREATMENTS[(idx >= 0 ? idx : 0) % COVER_TREATMENTS.length];
}
