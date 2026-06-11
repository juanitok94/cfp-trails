import type { Progress } from "./types";

export interface Rank {
  name: string;
  min: number;
}

// Neutral, finance-flavored ladder (no firm branding)
export const RANKS: Rank[] = [
  { name: "Intern", min: 0 },
  { name: "Analyst", min: 150 },
  { name: "Paraplanner", min: 400 },
  { name: "Associate Planner", min: 800 },
  { name: "Lead Planner", min: 1400 },
  { name: "Board Ready", min: 2200 },
];

export function rankFor(points: number): Rank {
  let r = RANKS[0];
  for (const rank of RANKS) if (points >= rank.min) r = rank;
  return r;
}

export function nextRank(points: number): Rank | null {
  return RANKS.find((r) => r.min > points) ?? null;
}

export function touchStreak(p: Progress): Progress {
  const today = new Date().toISOString().slice(0, 10);
  if (p.streak.lastDay === today) return p;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const count = p.streak.lastDay === yesterday ? p.streak.count + 1 : 1;
  return { ...p, streak: { lastDay: today, count } };
}
