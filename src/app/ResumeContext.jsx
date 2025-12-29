import { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import defaultResumeSchema from './resumeSchema';
import { getATSBreakdown, getResumeReadiness, isResumeReadyForExport } from './atsEngine';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * ARCHITECTURE LOCK — ResumeContext.jsx
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * STATUS: FROZEN API (v1.0)
 * LAST AUDIT: 2024-12-29
 * 
 * This file is the SINGLE SOURCE OF TRUTH for resume state management.
 * All components read from and write to this context exclusively.
 * 
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ PUBLIC API CONTRACT (DO NOT MODIFY WITHOUT REVIEW)                         │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │ STATE (read-only derived values):                                          │
 * │   • resume           → Full resume object (shape: resumeSchema.js)         │
 * │   • atsScore         → Derived integer 0-100 (from atsEngine)              │
 * │   • atsBreakdown     → Derived breakdown object (from atsEngine)           │
 * │   • resumeReadiness  → Derived readiness object (from atsEngine)           │
 * │   • resumeReadyForExport → Derived boolean (from atsEngine)                │
 * │   • getSectionTips() → Derived tips array per section                      │
 * │                                                                            │
 * │ ACTIONS (mutators):                                                        │
 * │   • updateSection(sectionKey, payload)  → Replace entire section           │
 * │   • updateField(path, value)            → Update nested field via dot path │
 * │   • resetResume()                       → Reset to defaultResumeSchema     │
 * │   • setResume(resumeData)               → Replace entire resume            │
 * │   • addArrayItem(sectionKey, item)      → Push to array section            │
 * │   • removeArrayItem(sectionKey, id/idx) → Remove from array section        │
 * │   • updateArrayItem(sectionKey, id, updates) → Patch array item            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 * 
 * INVARIANTS:
 *   1. All state updates go through dispatch → reducer (no direct mutation)
 *   2. All derived values (ATS, readiness) are computed via useMemo (pure)
 *   3. metadata.lastUpdated is set automatically on every state change
 *   4. Resume shape always conforms to resumeSchema.js structure
 * 
 * GUARD: Adding new actions requires updating this contract header.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/**
 * INTERNAL: Action type constants
 * Guard: These are internal implementation details. Do not expose externally.
 */
const ACTIONS = {
  UPDATE_SECTION: 'UPDATE_SECTION',
  UPDATE_FIELD: 'UPDATE_FIELD',
  RESET_RESUME: 'RESET_RESUME',
  ADD_ARRAY_ITEM: 'ADD_ARRAY_ITEM',
  REMOVE_ARRAY_ITEM: 'REMOVE_ARRAY_ITEM',
  UPDATE_ARRAY_ITEM: 'UPDATE_ARRAY_ITEM',
  SET_RESUME: 'SET_RESUME',
};

/**
 * INTERNAL HELPER: Get nested value from object using dot notation path
 * @param {Object} obj - Source object
 * @param {string} path - Dot notation path (e.g., 'basics.fullName')
 * @returns {*} Value at path or undefined
 * Guard: Pure function, no side effects.
 */
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

/**
 * INTERNAL HELPER: Set nested value in object using dot notation path (immutably)
 * @param {Object} obj - Source object  
 * @param {string} path - Dot notation path (e.g., 'basics.fullName')
 * @param {*} value - New value to set
 * @returns {Object} New object with updated value (original unchanged)
 * Guard: Pure function, creates new object via deep clone. No mutation.
 */
const setNestedValue = (obj, path, value) => {
  const keys = path.split('.');
  const lastKey = keys.pop();
  
  // Deep clone the object to avoid mutation
  const result = JSON.parse(JSON.stringify(obj));
  
  // Navigate to the parent of the target
  let current = result;
  for (const key of keys) {
    if (current[key] === undefined) {
      current[key] = {};
    }
    current = current[key];
  }
  
  // Set the value
  current[lastKey] = value;
  
  return result;
};

/**
 * INTERNAL: Resume Reducer — handles all state transitions
 * 
 * INVARIANT: All updates are immutable — no direct mutation of state.
 * INVARIANT: Every action sets metadata.lastUpdated automatically.
 * 
 * Guard: This reducer is the ONLY place state changes occur.
 *        Direct state mutation anywhere else is a bug.
 */
const resumeReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.UPDATE_SECTION: {
      // Replace entire section (e.g., basics, experience)
      const { sectionKey, payload } = action;
      return {
        ...state,
        [sectionKey]: payload,
        metadata: {
          ...state.metadata,
          lastUpdated: new Date().toISOString(),
        },
      };
    }

    case ACTIONS.UPDATE_FIELD: {
      // Update specific field using dot notation path
      const { path, value } = action;
      const updatedState = setNestedValue(state, path, value);
      return {
        ...updatedState,
        metadata: {
          ...updatedState.metadata,
          lastUpdated: new Date().toISOString(),
        },
      };
    }

    case ACTIONS.ADD_ARRAY_ITEM: {
      // Add item to array section (experience, education, skills, projects)
      const { sectionKey, item } = action;
      const currentArray = state[sectionKey];
      if (!Array.isArray(currentArray)) {
        return state;
      }
      return {
        ...state,
        [sectionKey]: [...currentArray, item],
        metadata: {
          ...state.metadata,
          lastUpdated: new Date().toISOString(),
        },
      };
    }

    case ACTIONS.REMOVE_ARRAY_ITEM: {
      // Remove item from array by ID (for objects) or index (for primitives)
      const { sectionKey, itemId, index } = action;
      const currentArray = state[sectionKey];
      if (!Array.isArray(currentArray)) {
        return state;
      }
      
      let newArray;
      if (itemId !== undefined) {
        // Remove by ID for object arrays
        newArray = currentArray.filter((item) => item.id !== itemId);
      } else if (index !== undefined) {
        // Remove by index for primitive arrays (like skills)
        newArray = currentArray.filter((_, i) => i !== index);
      } else {
        return state;
      }
      
      return {
        ...state,
        [sectionKey]: newArray,
        metadata: {
          ...state.metadata,
          lastUpdated: new Date().toISOString(),
        },
      };
    }

    case ACTIONS.UPDATE_ARRAY_ITEM: {
      // Update specific item in array by ID
      const { sectionKey, itemId, updates } = action;
      const currentArray = state[sectionKey];
      if (!Array.isArray(currentArray)) {
        return state;
      }
      
      return {
        ...state,
        [sectionKey]: currentArray.map((item) =>
          item.id === itemId ? { ...item, ...updates } : item
        ),
        metadata: {
          ...state.metadata,
          lastUpdated: new Date().toISOString(),
        },
      };
    }

    case ACTIONS.SET_RESUME: {
      // Set entire resume (e.g., from file upload)
      return {
        ...action.payload,
        metadata: {
          ...action.payload.metadata,
          lastUpdated: new Date().toISOString(),
        },
      };
    }

    case ACTIONS.RESET_RESUME: {
      // Reset to default schema
      return {
        ...defaultResumeSchema,
        metadata: {
          ...defaultResumeSchema.metadata,
          lastUpdated: new Date().toISOString(),
        },
      };
    }

    default:
      return state;
  }
};

// Create Context
const ResumeContext = createContext(null);

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * PUBLIC: ResumeProvider Component
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Wrap your app with this to enable resume state access everywhere.
 * 
 * DERIVED STATE (computed on every resume change, never stored separately):
 *   • atsInsights     — Full ATS breakdown from atsEngine (pure computation)
 *   • resumeReadiness — Readiness checklist from atsEngine (pure computation)
 *   • sectionTips     — Per-section improvement suggestions (pure computation)
 * 
 * INVARIANT: Derived values are ALWAYS recomputed from resume state.
 *            Never cache or store derived values separately.
 * ═══════════════════════════════════════════════════════════════════════════════
 */
export function ResumeProvider({ children }) {
  const [resume, dispatch] = useReducer(resumeReducer, defaultResumeSchema);

  /**
   * DERIVED: ATS insights computed from resume state on every change
   * Guard: This is a PURE DERIVATION — do not add side effects here.
   */
  const atsInsights = useMemo(() => getATSBreakdown(resume), [resume]);

  /**
   * DERIVED: Resume readiness checklist (pure computation, no state mutation)
   * Guard: These values gate export functionality — do not modify thresholds here.
   *        Threshold logic lives in ExportPage for monetization control.
   */
  const resumeReadiness = useMemo(() => getResumeReadiness(resume), [resume]);
  const resumeReadyForExport = useMemo(() => isResumeReadyForExport(resume), [resume]);

  /**
   * DERIVED: Section-specific guidance from ATS signals (purely computed)
   * Guard: Tips are for UX guidance only — not used for gating decisions.
   */
  const sectionTips = useMemo(() => {
    const tips = {
      summary: [],
      experience: [],
      education: [],
      skills: [],
      projects: [],
    };

    if ((resume.summary || '').length < 80) {
      tips.summary.push('Write 2-3 sentences (80-200 chars) with role, scope, and impact.');
    }
    if (atsInsights.keywordCoverage.missingKeywords.length) {
      tips.summary.push(`Work in impact keywords like ${atsInsights.keywordCoverage.missingKeywords.slice(0, 3).join(', ')}.`);
    }

    tips.experience.push(...atsInsights.experienceQuality.issues);
    if ((resume.experience || []).length === 0) {
      tips.experience.push('Add at least one role with dates and 3+ bullets.');
    }

    if ((resume.education || []).length === 0) {
      tips.education.push('Add your latest degree or certification.');
    }

    if ((resume.skills || []).length < 5) {
      tips.skills.push('List 5-10 relevant skills on separate lines.');
    }
    if (atsInsights.keywordCoverage.missingSkills.length) {
      tips.skills.push(`Mention skills in your bullets: ${atsInsights.keywordCoverage.missingSkills.slice(0, 3).join(', ')}.`);
    }

    if ((resume.projects || []).length === 0) {
      tips.projects.push('Add 1-2 projects with outcomes and tech stack.');
    }

    return tips;
  }, [atsInsights, resume.education, resume.experience, resume.projects, resume.skills, resume.summary]);

  // ═══════════════════════════════════════════════════════════════════════════
  // PUBLIC ACTIONS — These are the ONLY ways to modify resume state
  // ═══════════════════════════════════════════════════════════════════════════

  /** PUBLIC: Update entire section (e.g., 'basics', 'experience') */
  const updateSection = useCallback((sectionKey, payload) => {
    dispatch({ type: ACTIONS.UPDATE_SECTION, sectionKey, payload });
  }, []);

  /** PUBLIC: Update specific field using dot notation (e.g., 'basics.fullName') */
  const updateField = useCallback((path, value) => {
    dispatch({ type: ACTIONS.UPDATE_FIELD, path, value });
  }, []);

  /** PUBLIC: Reset resume to default schema */
  const resetResume = useCallback(() => {
    dispatch({ type: ACTIONS.RESET_RESUME });
  }, []);

  /** PUBLIC: Set entire resume (useful for file upload/import) */
  const setResume = useCallback((resumeData) => {
    dispatch({ type: ACTIONS.SET_RESUME, payload: resumeData });
  }, []);

  /** PUBLIC: Add item to array section */
  const addArrayItem = useCallback((sectionKey, item) => {
    dispatch({ type: ACTIONS.ADD_ARRAY_ITEM, sectionKey, item });
  }, []);

  /** PUBLIC: Remove item from array section by ID or index */
  const removeArrayItem = useCallback((sectionKey, itemId, index) => {
    dispatch({ type: ACTIONS.REMOVE_ARRAY_ITEM, sectionKey, itemId, index });
  }, []);

  /** PUBLIC: Update specific array item by ID */
  const updateArrayItem = useCallback((sectionKey, itemId, updates) => {
    dispatch({ type: ACTIONS.UPDATE_ARRAY_ITEM, sectionKey, itemId, updates });
  }, []);

  /**
   * CONTEXT VALUE — Public API surface
   * 
   * Guard: Any additions here must be documented in the header contract.
   *        Removing or renaming properties is a BREAKING CHANGE.
   */
  const contextValue = {
    // State
    resume,
    atsScore: atsInsights.totalScore,
    atsBreakdown: atsInsights,
    resumeReadiness,
    resumeReadyForExport,
    getSectionTips: (sectionKey) => sectionTips[sectionKey] || [],
    isResumeReadyForExport: () => resumeReadyForExport,
    
    // Actions
    updateSection,
    updateField,
    resetResume,
    setResume,
    addArrayItem,
    removeArrayItem,
    updateArrayItem,
  };

  return (
    <ResumeContext.Provider value={contextValue}>
      {children}
    </ResumeContext.Provider>
  );
}

/**
 * PUBLIC: Custom hook to access resume context
 * Must be used within a ResumeProvider
 * 
 * Guard: This is the ONLY way components should access resume state.
 *        Direct context access is discouraged.
 */
export function useResume() {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
}

export default ResumeContext;
