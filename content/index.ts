import type { Trail } from "@/lib/types";
import { taxPlanning } from "./trails/tax-planning";
import { retirement } from "./trails/retirement";

const stub = (
  slug: string,
  domain: string,
  title: string,
  weight: number,
  tagline: string
): Trail => ({ slug, domain, title, weight, tagline, status: "soon", modules: [] });

/**
 * The 8 CFP Board Principal Knowledge Domains with published exam weights.
 * Adding a new trail = write a file in /content/trails and swap the stub here.
 */
export const TRAILS: Trail[] = [
  stub("conduct", "A", "Professional Conduct & Regulation", 8, "Code & Standards, fiduciary duty, and the regulators."),
  stub("general-principles", "B", "General Principles of Financial Planning", 15, "The planning process, TVM, cash flow, and education funding."),
  stub("insurance", "C", "Risk Management & Insurance", 11, "Life, disability, LTC, property, and policy mechanics."),
  stub("investments", "D", "Investment Planning", 17, "Markets, portfolio theory, and security analysis."),
  taxPlanning,
  retirement,
  stub("estate", "G", "Estate Planning", 10, "Transfers, trusts, and the gift & estate tax system."),
  stub("psychology", "H", "Psychology of Financial Planning", 7, "Biases, money scripts, and client communication."),
];

export const liveTrails = TRAILS.filter((t) => t.status === "live");

export function trailBySlug(slug: string): Trail | undefined {
  return TRAILS.find((t) => t.slug === slug);
}

export function totalQuestions(t: Trail): number {
  return t.modules.reduce((n, m) => n + m.questions.length, 0);
}
