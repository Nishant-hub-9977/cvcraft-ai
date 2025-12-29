/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * ARCHITECTURE LOCK — resumeSchema.js
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * STATUS: FROZEN SCHEMA (v1.0)
 * LAST AUDIT: 2024-12-29
 * 
 * This is the SINGLE SOURCE OF TRUTH for resume data structure.
 * All components read from and write to this schema shape.
 * 
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ SCHEMA SHAPE CONTRACT (DO NOT MODIFY WITHOUT MIGRATION PLAN)               │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │   basics: {                                                                │
 * │     fullName: string,                                                      │
 * │     headline: string,                                                      │
 * │     email: string,                                                         │
 * │     phone: string,                                                         │
 * │     location: string,                                                      │
 * │     linkedin: string (optional),                                           │
 * │     github: string (optional),                                             │
 * │   }                                                                        │
 * │                                                                            │
 * │   summary: string                                                          │
 * │                                                                            │
 * │   experience: Array<{                                                      │
 * │     id: string (unique),                                                   │
 * │     company: string,                                                       │
 * │     role: string,                                                          │
 * │     startDate: string (YYYY-MM),                                           │
 * │     endDate: string (YYYY-MM or empty for present),                        │
 * │     bullets: string[],                                                     │
 * │   }>                                                                       │
 * │                                                                            │
 * │   education: Array<{                                                       │
 * │     id: string (unique),                                                   │
 * │     institution: string,                                                   │
 * │     degree: string,                                                        │
 * │     startYear: string,                                                     │
 * │     endYear: string,                                                       │
 * │     gpa: string (optional),                                                │
 * │     highlights: string[] (optional),                                       │
 * │   }>                                                                       │
 * │                                                                            │
 * │   skills: string[]                                                         │
 * │                                                                            │
 * │   projects: Array<{                                                        │
 * │     id: string (unique),                                                   │
 * │     name: string,                                                          │
 * │     description: string,                                                   │
 * │     bullets: string[],                                                     │
 * │   }>                                                                       │
 * │                                                                            │
 * │   metadata: {                                                              │
 * │     lastUpdated: ISO 8601 string,                                          │
 * │     templateId: string,                                                    │
 * │   }                                                                        │
 * └─────────────────────────────────────────────────────────────────────────────┘
 * 
 * INVARIANTS:
 *   1. All array items with object shape MUST have unique `id` field
 *   2. Date fields use YYYY-MM format for experiences, YYYY for education
 *   3. Empty string ("") indicates "present" for endDate fields
 *   4. metadata.lastUpdated is managed automatically by ResumeContext
 * 
 * GUARD: Adding new top-level fields requires updating:
 *        - ResumeContext.jsx (reducer cases)
 *        - atsEngine.js (if field affects scoring)
 *        - All consuming components
 * 
 * GUARD: Changing field types is a BREAKING CHANGE requiring migration.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/**
 * DEFAULT RESUME SCHEMA
 * 
 * This object serves dual purposes:
 *   1. Initial state for new users (sample data)
 *   2. Shape reference for all resume data
 * 
 * Guard: Sample data should be realistic to demonstrate ATS scoring.
 */
const defaultResumeSchema = {
  // ═══════════════════════════════════════════════════════════════════════════
  // BASICS — Contact information and professional identity
  // Guard: These fields are required for ATS parsing and recruiter contact.
  // ═══════════════════════════════════════════════════════════════════════════
  basics: {
    fullName: 'Sarah Johnson',
    headline: 'Senior Software Engineer',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/sarahjohnson',
    github: 'github.com/sarahjohnson',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SUMMARY — Professional summary/objective (2-3 sentences)
  // Guard: Summary length affects ATS formatting score (80-600 chars optimal).
  // ═══════════════════════════════════════════════════════════════════════════
  summary:
    'Results-driven Senior Software Engineer with 8+ years of experience building scalable web applications and leading cross-functional teams. Passionate about clean code, system architecture, and mentoring junior developers. Proven track record of delivering high-impact projects that improve user engagement by 40%+.',

  // ═══════════════════════════════════════════════════════════════════════════
  // EXPERIENCE — Array of work positions with accomplishment bullets
  // Guard: Each entry MUST have unique `id`. Bullets drive ATS experience score.
  // ═══════════════════════════════════════════════════════════════════════════
  experience: [
    {
      id: 'exp-1',
      company: 'TechCorp Inc.',
      role: 'Senior Software Engineer',
      startDate: '2021-01',
      endDate: '', // Empty string = Present
      bullets: [
        'Led development of microservices architecture serving 10M+ users',
        'Mentored team of 5 junior engineers, improving code quality by 35%',
        'Reduced API response time by 60% through optimization',
      ],
    },
    {
      id: 'exp-2',
      company: 'StartupXYZ',
      role: 'Software Engineer',
      startDate: '2018-06',
      endDate: '2021-01',
      bullets: [
        'Built React-based dashboard used by 50K+ customers',
        'Implemented CI/CD pipeline reducing deployment time by 80%',
        'Collaborated with design team to improve UX, increasing user retention by 25%',
      ],
    },
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // EDUCATION — Array of degrees/certifications
  // Guard: Each entry MUST have unique `id`. Years use YYYY format.
  // ═══════════════════════════════════════════════════════════════════════════
  education: [
    {
      id: 'edu-1',
      institution: 'Stanford University',
      degree: 'B.S. Computer Science',
      startYear: '2014',
      endYear: '2018',
      gpa: '3.8/4.0',
      highlights: ['Magna Cum Laude', 'Dean\'s List'],
    },
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // SKILLS — Flat array of skill strings
  // Guard: Skills should appear in experience bullets for ATS keyword coverage.
  // ═══════════════════════════════════════════════════════════════════════════
  skills: [
    'JavaScript',
    'TypeScript',
    'React',
    'Node.js',
    'Python',
    'AWS',
    'Docker',
    'PostgreSQL',
    'GraphQL',
    'Git',
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // PROJECTS — Array of notable projects with descriptions
  // Guard: Each entry MUST have unique `id`. Projects supplement experience.
  // ═══════════════════════════════════════════════════════════════════════════
  projects: [
    {
      id: 'proj-1',
      name: 'E-Commerce Platform',
      description: 'Full-stack e-commerce solution with real-time inventory management',
      bullets: [
        'Built with React, Node.js, and PostgreSQL',
        'Handles 10K+ concurrent users with 99.9% uptime',
        'Integrated Stripe payment processing',
      ],
    },
    {
      id: 'proj-2',
      name: 'AI Code Review Bot',
      description: 'GitHub bot that provides automated code review suggestions using GPT-4',
      bullets: [
        'Reduced code review time by 40%',
        'Deployed on AWS Lambda for serverless scaling',
      ],
    },
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // METADATA — App-specific tracking data
  // Guard: lastUpdated is auto-managed by ResumeContext. Do not set manually.
  // ═══════════════════════════════════════════════════════════════════════════
  metadata: {
    lastUpdated: new Date().toISOString(),
    templateId: 'professional-classic',
  },
};

export default defaultResumeSchema;

// ═══════════════════════════════════════════════════════════════════════════════
// FACTORY HELPERS — Create empty entries with proper structure
// Guard: These ensure new entries have correct shape and unique IDs.
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Generate unique ID for new array items
 * Format: {prefix}-{timestamp}-{random}
 * Guard: IDs must be unique within their array. Collisions cause bugs.
 */
export const generateId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

/**
 * Create empty experience entry with required shape
 * Guard: All fields must be present. Empty strings are valid placeholders.
 */
export const createEmptyExperience = () => ({
  id: generateId('exp'),
  company: '',
  role: '',
  startDate: '',
  endDate: '',
  bullets: [''],
});

/**
 * Create empty education entry with required shape
 * Guard: All fields must be present. Empty strings are valid placeholders.
 */
export const createEmptyEducation = () => ({
  id: generateId('edu'),
  institution: '',
  degree: '',
  startYear: '',
  endYear: '',
  gpa: '',
  highlights: [],
});

/**
 * Create empty project entry with required shape
 * Guard: All fields must be present. Empty strings are valid placeholders.
 */
export const createEmptyProject = () => ({
  id: generateId('proj'),
  name: '',
  description: '',
  bullets: [''],
});
