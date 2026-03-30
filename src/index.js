const DEFAULT_OPTIONS = {
  title: { min: 10, max: 60, required: true },
  description: { min: 50, max: 160, required: true },
  canonical: { required: false, requireAbsoluteUrl: true },
  slug: { required: false, pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/ },
  openGraphTitle: { required: false, max: 95 },
  openGraphDescription: { required: false, max: 200 },
  robots: { required: false },
  requireOpenGraph: false
};

function mergeOptions(options = {}) {
  return {
    ...DEFAULT_OPTIONS,
    ...options,
    title: { ...DEFAULT_OPTIONS.title, ...(options.title || {}) },
    description: { ...DEFAULT_OPTIONS.description, ...(options.description || {}) },
    canonical: { ...DEFAULT_OPTIONS.canonical, ...(options.canonical || {}) },
    slug: { ...DEFAULT_OPTIONS.slug, ...(options.slug || {}) },
    openGraphTitle: { ...DEFAULT_OPTIONS.openGraphTitle, ...(options.openGraphTitle || {}) },
    openGraphDescription: {
      ...DEFAULT_OPTIONS.openGraphDescription,
      ...(options.openGraphDescription || {})
    },
    robots: { ...DEFAULT_OPTIONS.robots, ...(options.robots || {}) }
  };
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isAbsoluteUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function pushIssue(issues, severity, field, code, message) {
  issues.push({ severity, field, code, message });
}

function validateLength(issues, field, value, rules, label) {
  if (!isNonEmptyString(value)) {
    if (rules.required) {
      pushIssue(issues, 'error', field, 'required', `${label} is required.`);
    }
    return;
  }

  const length = value.trim().length;

  if (typeof rules.min === 'number' && length < rules.min) {
    pushIssue(
      issues,
      'warning',
      field,
      'too_short',
      `${label} is shorter than recommended (${length}/${rules.min}).`
    );
  }

  if (typeof rules.max === 'number' && length > rules.max) {
    pushIssue(
      issues,
      'warning',
      field,
      'too_long',
      `${label} is longer than recommended (${length}/${rules.max}).`
    );
  }
}

export function validatePage(page = {}, options = {}) {
  const rules = mergeOptions(options);
  const issues = [];

  validateLength(issues, 'title', page.title, rules.title, 'Title');
  validateLength(issues, 'description', page.description, rules.description, 'Meta description');
  validateLength(issues, 'openGraphTitle', page.openGraphTitle, rules.openGraphTitle, 'Open Graph title');
  validateLength(
    issues,
    'openGraphDescription',
    page.openGraphDescription,
    rules.openGraphDescription,
    'Open Graph description'
  );

  if (rules.requireOpenGraph) {
    if (!isNonEmptyString(page.openGraphTitle)) {
      pushIssue(issues, 'warning', 'openGraphTitle', 'recommended', 'Open Graph title is recommended.');
    }
    if (!isNonEmptyString(page.openGraphDescription)) {
      pushIssue(
        issues,
        'warning',
        'openGraphDescription',
        'recommended',
        'Open Graph description is recommended.'
      );
    }
  }

  if (rules.canonical.required && !isNonEmptyString(page.canonical)) {
    pushIssue(issues, 'error', 'canonical', 'required', 'Canonical URL is required.');
  }

  if (isNonEmptyString(page.canonical) && rules.canonical.requireAbsoluteUrl && !isAbsoluteUrl(page.canonical)) {
    pushIssue(
      issues,
      'error',
      'canonical',
      'invalid_url',
      'Canonical URL must be absolute and start with http or https.'
    );
  }

  if (rules.slug.required && !isNonEmptyString(page.slug)) {
    pushIssue(issues, 'error', 'slug', 'required', 'Slug is required.');
  }

  if (isNonEmptyString(page.slug) && rules.slug.pattern && !rules.slug.pattern.test(page.slug)) {
    pushIssue(
      issues,
      'warning',
      'slug',
      'format',
      'Slug should use lowercase letters, numbers, and hyphens only.'
    );
  }

  if (isNonEmptyString(page.robots) && !/^(index|noindex)(, ?(follow|nofollow))?$/i.test(page.robots.trim())) {
    pushIssue(
      issues,
      'warning',
      'robots',
      'unrecognized',
      'Robots value may not match a common directive pattern.'
    );
  }

  const errors = issues.filter((issue) => issue.severity === 'error').length;
  const warnings = issues.filter((issue) => issue.severity === 'warning').length;

  return {
    ok: errors === 0,
    errors,
    warnings,
    issues
  };
}

export function validatePages(pages = [], options = {}) {
  const results = pages.map((page, index) => ({
    index,
    page,
    result: validatePage(page, options)
  }));

  return summarizeResults(results);
}

export function summarizeResults(results = []) {
  const summary = {
    total: results.length,
    passed: 0,
    failed: 0,
    warnings: 0,
    errors: 0,
    results
  };

  for (const item of results) {
    if (item.result.ok) {
      summary.passed += 1;
    } else {
      summary.failed += 1;
    }

    summary.warnings += item.result.warnings;
    summary.errors += item.result.errors;
  }

  return summary;
}

export default {
  validatePage,
  validatePages,
  summarizeResults
};
