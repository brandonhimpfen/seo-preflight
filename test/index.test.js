import test from 'node:test';
import assert from 'node:assert/strict';
import { validatePage, validatePages } from '../src/index.js';

test('validatePage passes a valid page', () => {
  const result = validatePage({
    title: 'A Valid SEO Title for Testing',
    description: 'This is a valid meta description that is comfortably within the recommended length range.',
    canonical: 'https://example.com/test-page',
    slug: 'test-page',
    openGraphTitle: 'Open Graph Title',
    openGraphDescription: 'Open Graph description text.',
    robots: 'index,follow'
  }, {
    canonical: { required: true },
    slug: { required: true },
    requireOpenGraph: true
  });

  assert.equal(result.ok, true);
  assert.equal(result.errors, 0);
});

test('validatePage reports missing required fields', () => {
  const result = validatePage({}, {
    canonical: { required: true },
    slug: { required: true }
  });

  assert.equal(result.ok, false);
  assert.ok(result.errors >= 2);
});

test('validatePage warns on poor slug format and bad lengths', () => {
  const result = validatePage({
    title: 'Short',
    description: 'Too short',
    slug: 'Bad Slug'
  });

  const codes = result.issues.map((issue) => issue.code);
  assert.ok(codes.includes('too_short'));
  assert.ok(codes.includes('format'));
});

test('validatePages returns a summary', () => {
  const summary = validatePages([
    {
      title: 'A Valid SEO Title for Testing',
      description: 'This is a valid meta description that is comfortably within the recommended length range.'
    },
    {
      title: '',
      description: ''
    }
  ]);

  assert.equal(summary.total, 2);
  assert.equal(summary.passed + summary.failed, 2);
});
