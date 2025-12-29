/**
 * Canonical Resume Schema
 * 
 * This is the SINGLE SOURCE OF TRUTH for resume data across the entire CVCraft AI application.
 * All components read from and write to this schema structure.
 * 
 * Structure:
 * - basics: Contact information and professional identity
 * - summary: Professional summary/objective
 * - experience: Array of work experiences with bullets
 * - education: Array of educational qualifications
 * - skills: Array of skill strings
 * - projects: Array of projects with descriptions and bullets
 * - metadata: App-specific data (template selection, timestamps)
 */

const defaultResumeSchema = {
  // Basic contact and identity information
  basics: {
    fullName: 'Sarah Johnson',
    headline: 'Senior Software Engineer',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/sarahjohnson',
    github: 'github.com/sarahjohnson',
  },

  // Professional summary - 2-3 sentences highlighting key qualifications
  summary:
    'Results-driven Senior Software Engineer with 8+ years of experience building scalable web applications and leading cross-functional teams. Passionate about clean code, system architecture, and mentoring junior developers. Proven track record of delivering high-impact projects that improve user engagement by 40%+.',

  // Work experience - array of positions with bullet accomplishments
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

  // Education - array of degrees/certifications
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

  // Skills - flat array of skill strings for flexibility
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

  // Projects - array of notable projects with descriptions
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

  // Metadata - app-specific tracking data
  metadata: {
    lastUpdated: new Date().toISOString(),
    templateId: 'professional-classic',
  },
};

export default defaultResumeSchema;

/**
 * Helper: Generate unique ID for new array items
 */
export const generateId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

/**
 * Helper: Create empty experience entry
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
 * Helper: Create empty education entry
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
 * Helper: Create empty project entry
 */
export const createEmptyProject = () => ({
  id: generateId('proj'),
  name: '',
  description: '',
  bullets: [''],
});
