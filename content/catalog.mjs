import { articles } from './articles.mjs';
import { techNotes } from './tech-notes.mjs';
import { blogPosts } from './blog.mjs';
import { papers } from './papers.mjs';

function readingTime(entry) {
  const practical = entry.practical;
  const practicalText = practical ? [practical.question, practical.answer, practical.useWhen, practical.title, practical.intro, ...practical.checks, practical.record, practical.completion, practical.limit] : [];
  const words = [entry.standfirst, entry.abstract || '', entry.thesis || '', ...practicalText, ...entry.sections.flatMap(section => [section.heading, ...(section.text || []), ...(section.bullets || []), section.code || ''])].join(' ').split(/\s+/).filter(Boolean).length;
  return `${Math.max(2, Math.ceil(words / 210))} min read`;
}
const originalCategories = ['Product thinking', 'Building AI', 'Building AI'];
const originalTags = [['Product outcomes', 'Evaluation', 'Workflows'], ['Production', 'Product commitments', 'Reliability'], ['Context engineering', 'Retrieval', 'Architecture']];

export const publications = [
  ...papers.map(entry => ({ ...entry, collection: 'papers', route: `/papers/${entry.slug}/`, readTime: readingTime(entry) })),
  ...blogPosts.map(entry => ({ ...entry, collection: 'blog', route: `/blog/${entry.slug}/`, readTime: readingTime(entry) })),
  ...articles.map((entry, index) => ({ ...entry, category: originalCategories[index], tags: originalTags[index], collection: 'blog', route: `/writing/${entry.slug}/`, readTime: entry.readTime })),
  ...techNotes.map(entry => ({ ...entry, collection: 'notes', route: `/notes/${entry.slug}/`, readTime: readingTime(entry) }))
];
export const collections = {
  papers: {
    title: 'Papers', route: '/papers/', eyebrow: 'THE ARGUMENT BEHIND THE WORK',
    headline: 'A position.', emphasis: 'And its reasoning.',
    description: 'Full-length technical papers on evaluation, system diagnosis, and human–AI work. Each develops an argument, tests it against an example, and makes its limits explicit.',
    context: 'Original technical positions with worked cases, counterarguments, and references. Written to inform engineering decisions.',
    noun: 'paper', label: 'TECHNICAL POSITION PAPERS', libraryTitle: 'Read the complete papers',
    categories: ['Evaluation & decisions', 'Systems engineering', 'Work & ownership'],
    entries: publications.filter(entry => entry.collection === 'papers')
  },
  notes: {
    title: 'Technical notes', route: '/notes/', eyebrow: 'THE ENGINEERING LIBRARY',
    headline: 'Inside the', emphasis: 'engineering.',
    description: 'Practical reference notes on designing, evaluating, and operating AI systems. For the people working through the details.',
    context: 'Methods, worked examples, and questions to bring to your next engineering decision.',
    noun: 'note', label: 'TECHNICAL NOTES', libraryTitle: 'The reference library',
    categories: ['Evaluation', 'Systems design', 'Engineering practice'],
    entries: publications.filter(entry => entry.collection === 'notes')
  },
  blog: {
    title: 'Blog', route: '/blog/', eyebrow: 'IDEAS FROM EML SYSTEMS',
    headline: 'Thinking beyond', emphasis: 'the model.',
    description: 'Essays on AI products, engineering, and the people around them. A place to work through what useful progress actually looks like.',
    context: 'Perspectives on product decisions, the systems we build, and how teams learn.',
    noun: 'essay', label: 'ESSAYS & PERSPECTIVES', libraryTitle: 'All perspectives',
    categories: ['Product thinking', 'Building AI', 'Teams & practice'],
    entries: publications.filter(entry => entry.collection === 'blog')
  }
};
export function findPublication(pathname) {
  return publications.find(entry => pathname === entry.route || pathname === `${entry.route}index.html` || pathname === entry.route.slice(0, -1));
}
export function relatedPublications(entry) {
  const score = candidate => (candidate.tags || []).filter(tag => (entry.tags || []).includes(tag)).length;
  const ranked = publications.filter(candidate => candidate.slug !== entry.slug).sort((a, b) => score(b) - score(a));
  return [...ranked.filter(candidate => candidate.collection === entry.collection).slice(0, 2), ...ranked.filter(candidate => candidate.collection !== entry.collection).slice(0, 1)];
}
