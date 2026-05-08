import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CASE_STUDIES_DIR = path.join(process.cwd(), 'content', 'case-studies');

export interface CaseStudyMeta {
  slug:         string;
  cardTitle?:   string;
  title:        string;
  subtitle:     string;
  category:     string;
  year:         string;
  role:         string;
  company?:     string;
  type?:        string;
  coverImage:   string;
  cardImage?:   string;
  featured?:    boolean;
  externalUrl?: string;
  teams?:       string[];
  tools?:       string[];
  timeline?:    string;
  order?:       number;
}

export interface CaseStudyFull extends CaseStudyMeta {
  content:     string;
  readingTime: string;
  tools:       string[];
  teams:       string[];
  timeline:    string;
  overview:    string;
}

function minutesToRead(text: string): string {
  const words = text.trim().split(/\s+/).length;
  const mins  = Math.ceil(words / 200);
  return `${mins} min read`;
}

export function getAllCaseStudies(): CaseStudyMeta[] {
  if (!fs.existsSync(CASE_STUDIES_DIR)) return [];

  const files = fs
    .readdirSync(CASE_STUDIES_DIR)
    .filter((f) => f.endsWith('.mdx') || f.endsWith('.md'));

  return files
    .map((filename) => {
      const slug = filename.replace(/\.(mdx|md)$/, '');
      const raw  = fs.readFileSync(path.join(CASE_STUDIES_DIR, filename), 'utf8');
      const { data } = matter(raw);
      return { slug, ...data } as CaseStudyMeta;
    })
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}

export function getCaseStudy(slug: string): CaseStudyFull | null {
  const mdxPath = path.join(CASE_STUDIES_DIR, `${slug}.mdx`);
  const mdPath  = path.join(CASE_STUDIES_DIR, `${slug}.md`);
  const filePath = fs.existsSync(mdxPath) ? mdxPath : fs.existsSync(mdPath) ? mdPath : null;

  if (!filePath) return null;

  const raw       = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);

  return {
    slug,
    content,
    readingTime: minutesToRead(content),
    ...(data as Omit<CaseStudyFull, 'slug' | 'content' | 'readingTime'>),
  };
}

export function getAdjacentCaseStudies(slug: string): {
  prev: CaseStudyMeta | null;
  next: CaseStudyMeta | null;
} {
  const all   = getAllCaseStudies();
  const index = all.findIndex((s) => s.slug === slug);
  return {
    prev: index > 0             ? all[index - 1] : null,
    next: index < all.length - 1 ? all[index + 1] : null,
  };
}
