"use client";

import { TRAILS, liveTrails } from "@/content";
import { useProgress } from "@/lib/useProgress";
import { HeaderBar, TrailCard, trailMastery, badgeCount } from "@/components/ui";
import { rankFor, nextRank } from "@/lib/ranks";

export default function Dashboard() {
  const { progress, ready, reset } = useProgress();
  const rank = rankFor(progress.points);
  const next = nextRank(progress.points);

  // Blueprint coverage: how much of the weighted exam your mastery currently covers
  const coverage = TRAILS.reduce(
    (sum, t) => sum + (t.status === "live" ? (t.weight * trailMastery(t, progress)) / 100 : 0),
    0
  );

  return (
    <main>
      <HeaderBar progress={progress} />
      <div className="mx-auto max-w-5xl px-4 py-8">
        <p className="font-mono text-xs text-slatey">THE EXAM BLUEPRINT · 8 DOMAINS · 170 QUESTIONS</p>
        <h1 className="font-display font-800 text-3xl sm:text-4xl tracking-tight mt-1">
          Study the exam the way it&apos;s built.
        </h1>
        <p className="mt-2 max-w-2xl text-slatey">
          Every CFP® exam question maps to a Principal Knowledge Domain with a published weight.
          Each trail below is one domain; the amber ruler is its share of your exam, and the green
          fill is how much of it you&apos;ve mastered.
        </p>

        {ready && (
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Stat label="BLUEPRINT COVERED" value={`${coverage.toFixed(1)}%`} hint="weighted by exam share" />
            <Stat label="RANK" value={rank.name} hint={next ? `${next.min - progress.points} pts to ${next.name}` : "top of the ladder"} />
            <Stat label="BADGES" value={String(badgeCount(progress))} hint="modules at 80%+" />
            <Stat label="STREAK" value={`${progress.streak.count} day${progress.streak.count === 1 ? "" : "s"}`} hint="study daily to keep it" />
          </div>
        )}

        <h2 className="font-display font-700 text-xl mt-10 mb-4">Trails</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {TRAILS.map((t) => (
            <TrailCard key={t.slug} trail={t} progress={progress} />
          ))}
        </div>

        <div className="mt-12 border-t border-line pt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slatey">
          <p>
            {liveTrails.length} of 8 domains live. Open source — add a domain by writing one TypeScript file.
            Not affiliated with CFP Board; CFP® is a certification mark of the CFP Board.
          </p>
          <button onClick={reset} className="font-mono underline hover:text-wrong">
            RESET PROGRESS
          </button>
        </div>
      </div>
    </main>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-md border border-line bg-white p-3">
      <p className="font-mono text-[11px] text-slatey">{label}</p>
      <p className="font-display font-800 text-2xl leading-tight">{value}</p>
      <p className="text-[11px] text-slatey mt-0.5">{hint}</p>
    </div>
  );
}
