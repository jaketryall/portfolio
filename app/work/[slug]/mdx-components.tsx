import type { MDXComponents } from "mdx/types";

export const caseStudyMdxComponents: MDXComponents = {
  h2: (props) => (
    <h2
      {...props}
      className="display mt-16 mb-6 text-ink"
      style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}
    />
  ),
  h3: (props) => (
    <h3
      {...props}
      className="mt-10 mb-3 text-ink"
      style={{
        fontFamily: "var(--font-sans)",
        fontWeight: 700,
        fontSize: "clamp(1.25rem, 2vw, 1.5rem)",
        letterSpacing: "-0.02em",
        lineHeight: 1.2,
      }}
    />
  ),
  p: (props) => (
    <p
      {...props}
      className="my-5 max-w-2xl text-pretty text-base font-medium leading-relaxed text-ink-soft md:text-lg"
    />
  ),
  ul: (props) => (
    <ul {...props} className="my-5 max-w-2xl list-inside list-disc text-base font-medium leading-relaxed text-ink-soft md:text-lg" />
  ),
  ol: (props) => (
    <ol {...props} className="my-5 max-w-2xl list-inside list-decimal text-base font-medium leading-relaxed text-ink-soft md:text-lg" />
  ),
  li: (props) => <li {...props} className="my-2" />,
  a: (props) => (
    <a {...props} className="text-ink underline decoration-line decoration-2 underline-offset-4 transition hover:decoration-ink" />
  ),
  blockquote: (props) => (
    <blockquote
      {...props}
      className="my-10 max-w-2xl border-l-2 border-ink pl-6 text-pretty"
      style={{
        fontFamily: "var(--font-sans)",
        fontWeight: 600,
        fontSize: "clamp(1.25rem, 2vw, 1.6rem)",
        lineHeight: 1.3,
        letterSpacing: "-0.02em",
      }}
    />
  ),
  hr: () => <hr className="my-12 border-line" />,
};
