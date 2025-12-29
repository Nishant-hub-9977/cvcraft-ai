/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * ARCHITECTURE LOCK — atsEngine.js
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * STATUS: FROZEN SCORING LOGIC (v1.0)
 * LAST AUDIT: 2024-12-29
 * 
 * This file contains the DETERMINISTIC ATS scoring engine.
 * All functions are PURE — they derive values from resume data without side effects.
 * 
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ SCORING WEIGHT INVARIANTS (DO NOT MODIFY WITHOUT BUSINESS REVIEW)          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │   Keywords & Skills:      35 points max                                    │
 * │   Section Completeness:   25 points max                                    │
 * │   Experience Quality:     20 points max                                    │
 * │   Formatting & Structure: 20 points max                                    │
 * │   ─────────────────────────────────────                                    │
 * │   TOTAL:                 100 points                                        │
 * └─────────────────────────────────────────────────────────────────────────────┘
 * 
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ PUBLIC API CONTRACT                                                        │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │   scoreResume(resume)          → Integer 0-100 (total ATS score)           │
 * │   getATSBreakdown(resume)      → Full breakdown object with categories     │
 * │   getKeywordCoverage(resume)   → Keyword/skill matching details            │
 * │   getSectionCompleteness(resume) → Section-by-section completion status    │
 * │   getFormattingSignals(resume) → Formatting quality signals                │
 * │   getResumeReadiness(resume)   → Export readiness checklist                │
 * │   isResumeReadyForExport(resume) → Boolean gate for export eligibility     │
 * └─────────────────────────────────────────────────────────────────────────────┘
 * 
 * INVARIANTS:
 *   1. All functions are PURE — same input always produces same output
 *   2. No function modifies resume data — all transformations create new values
 *   3. Scoring weights are business-critical — changes require stakeholder review
 *   4. All scores are clamped to valid ranges (0-100 or 0-weight)
 * 
 * GUARD: Changing scoring weights affects user perception of resume quality.
 *        Any changes must be tested against sample resumes first.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════════
// SCORING CONSTANTS — Business-critical values
// Guard: Modifying these affects all users' ATS scores immediately.
// ═══════════════════════════════════════════════════════════════════════════════

const ACTION_VERBS = [
  'led', 'managed', 'architected', 'built', 'created', 'developed', 'designed', 'implemented',
  'launched', 'shipped', 'optimized', 'improved', 'reduced', 'increased', 'accelerated',
  'automated', 'modernized', 'migrated', 'scaled', 'mentored', 'collaborated', 'delivered',
];

/**
 * KEYWORD BUCKETS — Categories of impactful resume language
 * Guard: These buckets drive keyword coverage scoring.
 */
const KEYWORD_BUCKETS = {
  impact: ['improved', 'reduced', 'increased', 'accelerated', 'boosted', 'cut', 'optimized'],
  delivery: ['shipped', 'launched', 'deployed', 'released', 'delivered'],
  leadership: ['led', 'managed', 'mentored', 'coached', 'owned'],
  collaboration: ['collaborated', 'partnered', 'cross-functional', 'stakeholder'],
  quality: ['reliability', 'availability', 'performance', 'scalability', 'security', 'quality'],
};

/** Date format for experience entries: YYYY-MM */
const DATE_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/;

// ═══════════════════════════════════════════════════════════════════════════════
// INTERNAL HELPERS — Pure utility functions
// ═══════════════════════════════════════════════════════════════════════════════

/** Clamp value to range [min, max]. Pure function. */
const clamp = (value, min = 0, max = 100) => Math.min(Math.max(value, min), max);

/** Normalize text to lowercase string. Pure function. */
const normalizeText = (value) => (value || '').toString().toLowerCase();

// ═══════════════════════════════════════════════════════════════════════════════
// PUBLIC: RESUME READINESS — Export eligibility gate
// Guard: This function determines if export is allowed. Changes affect monetization.
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * PUBLIC: Get resume readiness status for export gating
 * 
 * INVARIANT: This is a PURE DERIVATION — no side effects.
 * INVARIANT: missingSections.length === 0 means ready for export.
 * 
 * @param {Object} resume - Resume object conforming to resumeSchema
 * @returns {Object} { completenessScore: number, missingSections: string[] }
 */
const getResumeReadiness = (resume) => {
  const missingSections = [];
  let passed = 0;

  const fullName = resume?.basics?.fullName?.trim();
  const headline = resume?.basics?.headline?.trim();
  if (!fullName) missingSections.push('Full name');
  if (!headline) missingSections.push('Headline');
  if (fullName && headline) passed++;

  const summary = (resume?.summary || '').trim();
  if (summary.length >= 60) {
    passed++;
  } else {
    missingSections.push('Summary (min 60 characters)');
  }

  const experiences = resume?.experience || [];
  const hasStrongExperience = experiences.some(
    (exp) => (exp?.bullets || []).filter((b) => b && b.trim().length).length >= 2
  );
  if (experiences.length && hasStrongExperience) {
    passed++;
  } else {
    missingSections.push('Experience with at least 2 bullets');
  }

  const skills = (resume?.skills || []).filter(Boolean);
  if (skills.length >= 5) {
    passed++;
  } else {
    missingSections.push('Add at least 5 skills');
  }

  const completenessScore = clamp(Math.round((passed / 4) * 100), 0, 100);

  return {
    completenessScore,
    missingSections,
  };
};

/**
 * PUBLIC: Boolean gate for export eligibility
 * 
 * INVARIANT: Returns true IFF all required sections are present.
 * Guard: This is the authoritative export gate. ExportPage may add additional
 *        constraints (e.g., ATS score threshold) for monetization.
 * 
 * @param {Object} resume - Resume object
 * @returns {boolean} True if resume meets minimum export requirements
 */
const isResumeReadyForExport = (resume) => getResumeReadiness(resume).missingSections.length === 0;

// ═══════════════════════════════════════════════════════════════════════════════
// INTERNAL: Text collection for keyword analysis
// ═══════════════════════════════════════════════════════════════════════════════

/** Collect all resume text for keyword matching. Pure function. */
const collectResumeText = (resume) => {
  const summary = normalizeText(resume.summary);
  const experienceText = (resume.experience || [])
    .map((exp) => `${exp.role} ${exp.company} ${exp.bullets?.join(' ')}`)
    .join(' ');
  const projectText = (resume.projects || [])
    .map((proj) => `${proj.name} ${proj.description} ${proj.bullets?.join(' ')}`)
    .join(' ');
  const skills = (resume.skills || []).join(' ');
  return normalizeText(`${summary} ${experienceText} ${projectText} ${skills}`);
};

/** Score a bucket of keywords against text. Pure function. */
const scoreKeywordBucket = (text, keywords) => {
  const matches = keywords.filter((kw) => text.includes(kw));
  const ratio = keywords.length ? matches.length / keywords.length : 0;
  return { matches, missing: keywords.filter((kw) => !text.includes(kw)), ratio };
};

// ═══════════════════════════════════════════════════════════════════════════════
// PUBLIC: KEYWORD COVERAGE — 35 points max
// Guard: Weight = 35. Changes affect total score calculation.
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * PUBLIC: Calculate keyword and skill coverage score
 * 
 * SCORING BREAKDOWN (35 points total):
 *   - Skill coverage in narrative:  20 points max
 *   - Keyword bucket coverage:      15 points max
 * 
 * @param {Object} resume - Resume object
 * @returns {Object} Keyword coverage analysis with score
 */
const getKeywordCoverage = (resume) => {
  const text = collectResumeText(resume);
  const skills = (resume.skills || []).map(normalizeText);

  // Skill coverage: do listed skills appear in narrative text?
  const matchedSkills = skills.filter((skill) => skill && text.includes(skill));
  const skillCoverageRatio = skills.length ? matchedSkills.length / skills.length : 0;
  const skillScore = skillCoverageRatio * 20; // out of 20

  // Keyword buckets coverage
  const bucketResults = Object.entries(KEYWORD_BUCKETS).map(([bucket, keywords]) => ({
    bucket,
    ...scoreKeywordBucket(text, keywords),
  }));
  const bucketRatio = bucketResults.length
    ? bucketResults.reduce((acc, b) => acc + b.ratio, 0) / bucketResults.length
    : 0;
  const bucketScore = bucketRatio * 15; // out of 15

  const score = clamp(skillScore + bucketScore, 0, 35);

  return {
    score,
    matchedSkills,
    missingSkills: skills.filter((skill) => skill && !text.includes(skill)).slice(0, 10),
    bucketResults,
    coverageRatio: skills.length ? skillCoverageRatio : bucketRatio,
    missingKeywords: bucketResults.flatMap((b) => b.missing).slice(0, 10),
  };
};

// ═══════════════════════════════════════════════════════════════════════════════
// PUBLIC: SECTION COMPLETENESS — 25 points max
// Guard: Weight = 25. Section weights are business-tuned.
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * PUBLIC: Calculate section completeness score
 * 
 * SECTION WEIGHTS (business-tuned):
 *   - basics:     6 points (contact info critical for callbacks)
 *   - summary:    5 points (first impression)
 *   - experience: 6 points (core resume content)
 *   - education:  4 points (important but less than experience)
 *   - skills:     2 points (list presence)
 *   - projects:   2 points (bonus content)
 * 
 * Guard: These weights reflect hiring manager priorities.
 * 
 * @param {Object} resume - Resume object
 * @returns {Object} Section completeness analysis with score
 */
const getSectionCompleteness = (resume) => {
  const sections = [];
  const basics = resume.basics || {};
  const basicsFields = ['fullName', 'email', 'phone', 'location'];
  const basicsFilled = basicsFields.filter((field) => basics[field]);
  sections.push({ key: 'basics', weight: 6, filled: basicsFilled.length === basicsFields.length });

  const summaryFilled = (resume.summary || '').trim().length >= 50;
  sections.push({ key: 'summary', weight: 5, filled: summaryFilled });

  const experiences = resume.experience || [];
  const experienceFilled = experiences.length > 0 && experiences.every((exp) => exp.role && exp.company && exp.startDate);
  sections.push({ key: 'experience', weight: 6, filled: experienceFilled });

  const education = resume.education || [];
  const educationFilled = education.length > 0 && education.every((e) => e.institution && e.degree);
  sections.push({ key: 'education', weight: 4, filled: educationFilled });

  const skills = resume.skills || [];
  const skillsFilled = skills.length >= 5;
  sections.push({ key: 'skills', weight: 2, filled: skillsFilled });

  const projects = resume.projects || [];
  const projectsFilled = projects.length > 0;
  sections.push({ key: 'projects', weight: 2, filled: projectsFilled });

  const totalWeight = sections.reduce((acc, s) => acc + s.weight, 0) || 1;
  const filledWeight = sections.filter((s) => s.filled).reduce((acc, s) => acc + s.weight, 0);
  const score = clamp((filledWeight / totalWeight) * 25, 0, 25);

  return {
    score,
    sections,
    missingSections: sections.filter((s) => !s.filled).map((s) => s.key),
  };
};

// ═══════════════════════════════════════════════════════════════════════════════
// PUBLIC: EXPERIENCE QUALITY — 20 points max
// Guard: Weight = 20. Bullet quality is critical for ATS parsing.
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * PUBLIC: Calculate experience section quality score
 * 
 * SCORING BREAKDOWN (20 points total):
 *   - Bullet count (aim for 6+):    6 points max
 *   - Action verb usage:            6 points max
 *   - Quantified metrics:           4 points max
 *   - Date coverage:                4 points max
 * 
 * @param {Object} resume - Resume object
 * @returns {Object} Experience quality analysis with score and issues
 */
const getExperienceQuality = (resume) => {
  const experiences = resume.experience || [];
  if (!experiences.length) {
    return {
      score: 0,
      details: { totalBullets: 0, actionVerbRatio: 0, dateCoverage: 0, metricBullets: 0 },
      issues: ['Add at least one experience entry with dates and bullets.'],
    };
  }

  const bullets = experiences.flatMap((exp) => exp.bullets || []);
  const totalBullets = bullets.length;
  const bulletsWithActionVerb = bullets.filter((b) => {
    const firstWord = normalizeText(b).split(/\s+/)[0];
    return ACTION_VERBS.includes(firstWord);
  });
  const actionVerbRatio = totalBullets ? bulletsWithActionVerb.length / totalBullets : 0;

  const bulletsWithMetric = bullets.filter((b) => /\d/.test(b));
  const metricRatio = totalBullets ? bulletsWithMetric.length / totalBullets : 0;

  const datedExperiences = experiences.filter((exp) => exp.startDate);
  const dateCoverage = experiences.length ? datedExperiences.length / experiences.length : 0;

  const bulletScore = clamp(Math.min(totalBullets / 8, 1) * 6, 0, 6);
  const verbScore = actionVerbRatio * 6;
  const metricScore = metricRatio * 4;
  const dateScore = dateCoverage * 4;
  const score = clamp(bulletScore + verbScore + metricScore + dateScore, 0, 20);

  const issues = [];
  if (totalBullets < 6) issues.push('Add more accomplishment bullets (aim for 6+ across roles).');
  if (actionVerbRatio < 0.6) issues.push('Start bullets with strong action verbs.');
  if (metricRatio < 0.5) issues.push('Quantify impact with numbers or percentages.');
  if (dateCoverage < 1) issues.push('Ensure each role has a start date and optional end date.');

  return {
    score,
    details: { totalBullets, actionVerbRatio, dateCoverage, metricBullets: bulletsWithMetric.length },
    issues,
  };
};

// ═══════════════════════════════════════════════════════════════════════════════
// PUBLIC: FORMATTING SIGNALS — 20 points max
// Guard: Weight = 20. Formatting affects ATS parsing success.
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * PUBLIC: Calculate formatting and structure quality score
 * 
 * EVALUATES:
 *   - Contact block completeness
 *   - Date format consistency (YYYY-MM)
 *   - Bullet length readability (20-220 chars)
 *   - Summary length balance (80-600 chars)
 * 
 * @param {Object} resume - Resume object
 * @returns {Object} Formatting analysis with score and warnings
 */
const getFormattingSignals = (resume) => {
  const signals = [];
  const deductions = [];

  const basics = resume.basics || {};
  if (basics.email && basics.phone && basics.location) {
    signals.push('Contact block complete.');
  } else {
    deductions.push('Add missing contact details (email, phone, location).');
  }

  const experiences = resume.experience || [];
  const dateFormats = experiences
    .map((exp) => exp.startDate)
    .filter(Boolean)
    .map((d) => DATE_REGEX.test(d));
  const dateConsistency = dateFormats.length ? dateFormats.filter(Boolean).length / dateFormats.length : 0;
  if (dateConsistency < 1 && dateFormats.length) {
    deductions.push('Use consistent YYYY-MM dates for roles.');
  } else if (dateFormats.length) {
    signals.push('Consistent date formatting across roles.');
  }

  const bulletLengthOk = experiences.every((exp) => (exp.bullets || []).every((b) => b.length >= 20 && b.length <= 220));
  if (bulletLengthOk && experiences.length) {
    signals.push('Bullets have readable length.');
  } else if (experiences.length) {
    deductions.push('Keep bullets concise (20-220 characters).');
  }

  const summaryLength = (resume.summary || '').length;
  if (summaryLength >= 80 && summaryLength <= 600) {
    signals.push('Summary length is balanced.');
  } else if (summaryLength) {
    deductions.push('Keep summary between 80-600 characters.');
  }

  // Start from full 20 and subtract minor deductions
  const rawScore = 20 - deductions.length * 4 + signals.length * 1;
  const score = clamp(rawScore, 0, 20);

  return {
    score,
    positive: signals,
    warnings: deductions,
  };
};

// ═══════════════════════════════════════════════════════════════════════════════
// PUBLIC: ATS BREAKDOWN — Master scoring function
// Guard: This is the primary entry point for ATS analysis.
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * PUBLIC: Get complete ATS breakdown with all category scores
 * 
 * TOTAL SCORE COMPOSITION (100 points):
 *   - keywordCoverage:     35 points max
 *   - sectionCompleteness: 25 points max
 *   - experienceQuality:   20 points max
 *   - formattingSignals:   20 points max
 * 
 * INVARIANT: totalScore = sum of all category scores, clamped to 0-100.
 * INVARIANT: This is a PURE FUNCTION — same resume always produces same score.
 * 
 * @param {Object} resume - Resume object conforming to resumeSchema
 * @returns {Object} Complete ATS analysis with scores and improvement suggestions
 */
const getATSBreakdown = (resume) => {
  const keywordCoverage = getKeywordCoverage(resume);
  const sectionCompleteness = getSectionCompleteness(resume);
  const experienceQuality = getExperienceQuality(resume);
  const formattingSignals = getFormattingSignals(resume);

  const totalScore = clamp(
    keywordCoverage.score +
      sectionCompleteness.score +
      experienceQuality.score +
      formattingSignals.score,
    0,
    100
  );

  const improvementAreas = [
    ...keywordCoverage.missingSkills.map((skill) => `Use skill "${skill}" in your bullets.`),
    ...keywordCoverage.missingKeywords.map((kw) => `Work in keyword "${kw}" for ATS relevance.`),
    ...sectionCompleteness.missingSections.map((sec) => `Complete the ${sec} section.`),
    ...experienceQuality.issues,
    ...formattingSignals.warnings,
  ].filter(Boolean);

  return {
    totalScore: Math.round(totalScore),
    categories: {
      keywords: Math.round(keywordCoverage.score),
      completeness: Math.round(sectionCompleteness.score),
      experience: Math.round(experienceQuality.score),
      formatting: Math.round(formattingSignals.score),
    },
    keywordCoverage,
    sectionCompleteness,
    experienceQuality,
    formattingSignals,
    improvementAreas: improvementAreas.slice(0, 8),
  };
};

/**
 * PUBLIC: Convenience function to get just the total score
 * @param {Object} resume - Resume object
 * @returns {number} Integer 0-100
 */
const scoreResume = (resume) => getATSBreakdown(resume).totalScore;

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS — Public API surface
// Guard: All exports are intentional. Internal helpers are NOT exported.
// ═══════════════════════════════════════════════════════════════════════════════

export {
  scoreResume,
  getATSBreakdown,
  getKeywordCoverage,
  getSectionCompleteness,
  getFormattingSignals,
  getResumeReadiness,
  isResumeReadyForExport,
};
export default scoreResume;
