"use client";

import Link from "next/link";
import type { Trail } from "@/lib/types";
import type { Progress } from "@/lib/types";
import { PASS_PCT } from "@/lib/types";
import { rankFor, nextRank } from "@/lib/ranks";
import { totalQuestions } from "@/content";

/** Signature element: exam-weight ruler. Amber = exam weight; green overlay = your mastery of it. */
export function WeightRuler({
  weight,
  masteryPct,
}: {
  weight: number;
  masteryPct?: number;
}) {
  const scale = 20; // max domain weight ~18%, scale to 20 for headroom
  const w = Math.min(100, (weight / scale) * 100);
  const m = masteryPct ? (w * masteryPct) / 100 : 0;
  return (
    <div aria-label={`Exam weight ${weight}%`}>
      <div className="ruler">
        <div className="ruler-fill" style={{ width: `${w}%` }} />
        {m > 0 && <div className="ruler-mastery" style={{ width: `${m}%` }} />}
      </div>
      <div className="mt-1 flex justify-between font-mono text-[11px] text-slatey">
        <span>{weight}% OF EXAM</span>
        {masteryPct !== undefined && masteryPct > 0 && (
          <span className="text-right">{masteryPct}% MASTERED</span>
        )}
      </div>
    </div>
  );
}

export function trailMastery(trail: Trail, progress: Progress): number {
  if (trail.modules.length === 0) return 0;
  const pcts = trail.modules.map((m) => progress.results[m.id]?.bestPct ?? 0);
  return Math.round(pcts.reduce((a, b) => a + b, 0) / trail.modules.length);
}

export function badgeCount(progress: Progress): number {
  return Object.values(progress.results).filter((r) => r.bestPct >= PASS_PCT).length;
}

export function HeaderBar({ progress }: { progress: Progress }) {
  const rank = rankFor(progress.points);
  const next = nextRank(progress.points);
  return (
    <header className="border-b border-line bg-paper/90 backdrop-blur sticky top-0 z-10">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between gap-3">
        <Link href="/" className="font-display font-800 tracking-tight text-lg leading-none">
          CFP<span className="text-signal">/</span>TRAILS
        </Link>
        <div className="flex items-center gap-4 font-mono text-xs">
          <span title="Current rank" className="rounded border border-ink px-2 py-1 font-semibold">
            {rank.name.toUpperCase()}
          </span>
          <span title={next ? `${next.min - progress.points} pts to ${next.name}` : "Top rank"}>
            {progress.points} PTS
          </span>
          <span title="Daily study streak" className={progress.streak.count > 0 ? "text-signal" : "text-slatey"}>
            ◆ {progress.streak.count}d
          </span>
        </div>
      </div>
    </header>
  );
}

export function TrailCard({ trail, progress }: { trail: Trail; progress: Progress }) {
  const mastery = trailMastery(trail, progress);
  const live = trail.status === "live";
  const inner = (
    <div
      className={`h-full rounded-md border bg-white p-4 transition-shadow ${
        live ? "border-ink/20 hover:shadow-md" : "border-line opacity-60"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="font-mono text-xs text-slatey">DOMAIN {trail.domain}</span>
        {live ? (
          <span className="font-mono text-[11px] text-slatey">
            {totalQuestions(trail)} Q · {trail.modules.length} MODULES
          </span>
        ) : (
          <span className="font-mono text-[11px] text-slatey">IN DEVELOPMENT</span>
        )}
      </div>
      <h3 className="font-display font-700 text-lg leading-snug mt-1">{trail.title}</h3>
      <p className="text-sm text-slatey mt-1 mb-4">{trail.tagline}</p>
      <WeightRuler weight={trail.weight} masteryPct={live ? mastery : undefined} />
    </div>
  );
  return live ? (
    <Link href={`/trail/${trail.slug}`} className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-signal rounded-md">
      {inner}
    </Link>
  ) : (
    inner
  );
}
