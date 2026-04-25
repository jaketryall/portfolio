import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type ProjectFrontmatter = {
  title: string;
  client: string;
  year: number;
  role: string;
  cover: string;          // /images/projects/<slug>/cover.jpg
  coverVideo?: string;    // optional /videos/...
  summary: string;        // 1-2 sentences
  stack?: string[];
  externalUrl?: string;
  order?: number;         // sort order, ascending
};

export type Project = ProjectFrontmatter & {
  slug: string;
  body: string;           // raw MDX content
  nextSlug: string;       // wraps around
  prevSlug: string;
};

const CONTENT_DIR = path.join(process.cwd(), "content", "work");

function readSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

function loadOne(slug: string): {
  frontmatter: ProjectFrontmatter;
  body: string;
} {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, "utf-8");
  const parsed = matter(raw);
  return {
    frontmatter: parsed.data as ProjectFrontmatter,
    body: parsed.content,
  };
}

export function getAllProjects(): Project[] {
  const slugs = readSlugs();
  const items = slugs.map((slug) => {
    const { frontmatter, body } = loadOne(slug);
    return { slug, frontmatter, body };
  });

  items.sort((a, b) => {
    const oa = a.frontmatter.order ?? 0;
    const ob = b.frontmatter.order ?? 0;
    if (oa !== ob) return oa - ob;
    return b.frontmatter.year - a.frontmatter.year;
  });

  return items.map((item, i) => {
    const next = items[(i + 1) % items.length];
    const prev = items[(i - 1 + items.length) % items.length];
    return {
      ...item.frontmatter,
      slug: item.slug,
      body: item.body,
      nextSlug: next.slug,
      prevSlug: prev.slug,
    };
  });
}

export function getProjectBySlug(slug: string): Project | null {
  const all = getAllProjects();
  return all.find((p) => p.slug === slug) ?? null;
}

export function getAllSlugs(): string[] {
  return readSlugs();
}
