import { validatePage, validatePages } from '../src/index.js';

const page = {
  title: 'SEO Preflight: Validate Pages Before Publish',
  description: 'A lightweight utility for validating SEO-critical page fields before content goes live.',
  canonical: 'https://www.example.com/projects/seo-preflight/',
  slug: 'seo-preflight',
  openGraphTitle: 'SEO Preflight',
  openGraphDescription: 'Catch common SEO issues before publishing.',
  robots: 'index,follow'
};

console.log(validatePage(page, {
  canonical: { required: true },
  slug: { required: true },
  requireOpenGraph: true
}));

console.log(validatePages([
  page,
  { title: 'Bad', description: '', canonical: '/relative-url', slug: 'Bad Slug' }
], {
  canonical: { required: true },
  slug: { required: true },
  requireOpenGraph: true
}));
