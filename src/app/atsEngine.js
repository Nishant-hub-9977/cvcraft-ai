// Deterministic ATS scoring engine
// Pure functions that derive ATS-friendly signals from resumeSchema-shaped data.

const ACTION_VERBS = [
  'led', 'managed', 'architected', 'built', 'created', 'developed', 'designed', 'implemented',
  'launched', 'shipped', 'optimized', 'improved', 'reduced', 'increased', 'accelerated',
  'automated', 'modernized', 'migrated', 'scaled', 'mentored', 'collaborated', 'delivered',
];

const KEYWORD_BUCKETS = {
  impact: ['improved', 'reduced', 'increased', 'accelerated', 'boosted', 'cut', 'optimized'],
  delivery: ['shipped', 'launched', 'deployed', 'released', 'delivered'],
  leadership: ['led', 'managed', 'mentored', 'coached', 'owned'],
  collaboration: ['collaborated', 'partnered', 'cross-functional', 'stakeholder'],
  quality: ['reliability', 'availability', 'performance', 'scalability', 'security', 'quality'],
};

const DATE_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/; // YYYY-MM

const clamp = (value, min = 0, max = 100) => Math.min(Math.max(value, min), max);

const normalizeText = (value) => (value || '').toString().toLowerCase();

// Derived readiness selector (pure, no state mutation)
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

const isResumeReadyForExport = (resume) => getResumeReadiness(resume).missingSections.length === 0;

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

const scoreKeywordBucket = (text, keywords) => {
  const matches = keywords.filter((kw) => text.includes(kw));
  const ratio = keywords.length ? matches.length / keywords.length : 0;
  return { matches, missing: keywords.filter((kw) => !text.includes(kw)), ratio };
};

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

const scoreResume = (resume) => getATSBreakdown(resume).totalScore;

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
