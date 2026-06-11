// ── Content model ───────────────────────────────────────────────
// Trail = one CFP Principal Knowledge Domain
// Module = a topic cluster inside a domain
// Question = multiple-choice or scenario (case-based) item
// Flashcards = "Learn" mode per module

export type QuestionKind = "mc" | "scenario";

export interface Question {
  id: string;
  kind: QuestionKind;
  /** Principal Knowledge Topic code, e.g. "E.2" */
  topic: string;
  /** Shared fact pattern for scenario questions */
  caseText?: string;
  stem: string;
  choices: string[];
  /** index into choices */
  answer: number;
  explanation: string;
  /** 1 = exam-level, 2 = harder than exam */
  difficulty: 1 | 2;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
}

export interface Module {
  id: string;
  title: string;
  blurb: string;
  questions: Question[];
  flashcards: Flashcard[];
}

export interface Trail {
  slug: string;
  /** CFP Board domain letter A–H */
  domain: string;
  title: string;
  /** exam weight, e.g. 14 (%) */
  weight: number;
  tagline: string;
  status: "live" | "soon";
  modules: Module[];
}

// ── Progress model (localStorage) ───────────────────────────────

export interface ModuleResult {
  bestScore: number; // points earned
  maxScore: number;
  bestPct: number; // 0–100
  attempts: number;
  completedAt?: string;
}

export interface Progress {
  points: number;
  results: Record<string, ModuleResult>; // key = moduleId
  streak: { lastDay: string; count: number };
  cardsSeen: Record<string, true>;
}

export const EMPTY_PROGRESS: Progress = {
  points: 0,
  results: {},
  streak: { lastDay: "", count: 0 },
  cardsSeen: {},
};

export const PASS_PCT = 80; // badge threshold

export function pointsFor(q: Question): number {
  const base = q.kind === "scenario" ? 20 : 10;
  return q.difficulty === 2 ? base + 5 : base;
}
