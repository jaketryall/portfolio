/**
 * Per-project duotone/wash treatments. Used by both ProjectCard (in the
 * grid) and CaseStudyHero (on the detail page) so that the cover image
 * looks identical at the start and end of the view-transition morph.
 */

import { getAllProjects } from "@/lib/projects";

export type CoverTreatment = {
  bg: string;
  filter: string;
  blend: "normal" | "luminosity" | "multiply" | "screen" | "overlay";
  opacity: number;
  wash: string;
  titleColor: string;
  titleShadow: string;
  metaColor: string;
};

export const COVER_TREATMENTS: CoverTreatment[] = [
  // 1. graphite + cream typeblock (Atlas)
  {
    bg: "#0e0e0e",
    filter: "grayscale(1) contrast(1.05) brightness(0.55)",
    blend: "luminosity",
    opacity: 0.55,
    wash: "linear-gradient(135deg, rgba(14,14,14,0.55), rgba(14,14,14,0.15))",
    titleColor: "#fcfcfb",
    titleShadow: "none",
    metaColor: "rgba(252,252,251,0.9)",
  },
  // 2. soft cream + sage tint (North)
  {
    bg: "#dbe6dc",
    filter: "grayscale(0.7) contrast(0.95) brightness(1.05)",
    blend: "multiply",
    opacity: 0.45,
    wash: "linear-gradient(180deg, rgba(43,182,115,0.18), rgba(14,14,14,0.04))",
    titleColor: "#0e0e0e",
    titleShadow: "none",
    metaColor: "#0e0e0e",
  },
  // 3. high-contrast b&w (Folio)
  {
    bg: "#fcfcfb",
    filter: "grayscale(1) contrast(1.4) brightness(0.95)",
    blend: "normal",
    opacity: 0.85,
    wash: "linear-gradient(180deg, rgba(252,252,251,0.0) 60%, rgba(14,14,14,0.4))",
    titleColor: "#fcfcfb",
    titleShadow: "0 2px 30px rgba(14,14,14,0.45)",
    metaColor: "#fcfcfb",
  },
  // 4. warm clay (Sundial)
  {
    bg: "#caa581",
    filter: "grayscale(0.9) sepia(0.3) contrast(1) brightness(0.95)",
    blend: "multiply",
    opacity: 0.65,
    wash: "linear-gradient(135deg, rgba(202,165,129,0.35), rgba(14,14,14,0.18))",
    titleColor: "#0e0e0e",
    titleShadow: "none",
    metaColor: "#0e0e0e",
  },
  // 5. cool slate (Orbit)
  {
    bg: "#1a2330",
    filter: "grayscale(0.95) contrast(1.05) brightness(0.6)",
    blend: "luminosity",
    opacity: 0.5,
    wash: "linear-gradient(135deg, rgba(26,35,48,0.6), rgba(26,35,48,0.2))",
    titleColor: "#fcfcfb",
    titleShadow: "none",
    metaColor: "rgba(252,252,251,0.9)",
  },
  // 6. paper-white minimal (Quill)
  {
    bg: "#f4f2ee",
    filter: "grayscale(1) contrast(0.85) brightness(1.1)",
    blend: "multiply",
    opacity: 0.35,
    wash: "linear-gradient(180deg, rgba(244,242,238,0.0), rgba(14,14,14,0.06))",
    titleColor: "#0e0e0e",
    titleShadow: "none",
    metaColor: "#0e0e0e",
  },
];

/** Look up a project's cover treatment by slug — based on its index in the
 *  sorted projects list. Used so a cover renders identically on the home
 *  card and on the case study hero, making the view-transition morph
 *  visually continuous. */
export function getCoverTreatmentForSlug(slug: string): CoverTreatment {
  const projects = getAllProjects();
  const idx = projects.findIndex((p) => p.slug === slug);
  return COVER_TREATMENTS[(idx >= 0 ? idx : 0) % COVER_TREATMENTS.length];
}
