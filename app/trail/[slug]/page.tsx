"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { trailBySlug } from "@/content";
import { useProgress } from "@/lib/useProgress";
import { HeaderBar, WeightRuler, trailMastery } from "@/components/ui";
import { PASS_PCT } from "@/lib/types";

export default function TrailPage() {
  const { slug } = useParams<{ slug: string }>();
  const trail = trailBySlug(slug);
  const { progress } = useProgress();

  if (!trail || trail.status !== "live") notFound();

  return (
    <main>
      <HeaderBar progress={progress} />
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Link href="/" className="font-mono text-xs text-slatey hover:text-ink">
          ← ALL TRAILS
        </Link>
        <p className="font-mono text-xs text-slatey mt-4">DOMAIN {trail.domain}</p>
        <h1 className="font-display font-800 text-3xl tracking-tight">{trail.title}</h1>
        <p className="text-slatey mt-1 mb-4">{trail.tagline}</p>
        <WeightRuler weight={trail.weight} masteryPct={trailMastery(trail, progress)} />

        <div className="mt-8 space-y-4">
          {trail.modules.map((m, idx) => {
            const r = progress.results[m.id];
            const badged = (r?.bestPct ?? 0) >= PASS_PCT;
            return (
              <div key={m.id} className="rounded-md border border-ink/20 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-[11px] text-slatey">
                      MODULE {idx + 1} · {m.questions.length} QUESTIONS · {m.flashcards.length} CARDS
                    </p>
                    <h2 className="font-display font-700 text-lg leading-snug mt-0.5">{m.title}</h2>
                    <p className="text-sm text-slatey mt-1">{m.blurb}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full border px-2.5 py-1 font-mono text-[11px] ${
                      badged
                        ? "border-right bg-right/10 text-right"
                        : r
                          ? "border-signal bg-signal/10"
                          : "border-line text-slatey"
                    }`}
                    title={badged ? "Badge earned (80%+)" : r ? "Attempted" : "Not started"}
                  >
                    {badged ? "★ BADGE" : r ? `BEST ${r.bestPct}%` : "NEW"}
                  </span>
                </div>
                <div className="mt-3 flex gap-2">
                  <Link
                    href={`/trail/${trail.slug}/${m.id}?mode=learn`}
                    className="rounded border border-ink px-3 py-1.5 text-sm font-semibold hover:bg-line/40 focus-visible:ring-2 focus-visible:ring-signal"
                  >
                    Learn (cards)
                  </Link>
                  <Link
                    href={`/trail/${trail.slug}/${m.id}?mode=quiz`}
                    className="rounded bg-ink px-3 py-1.5 text-sm font-semibold text-white hover:bg-inkdeep focus-visible:ring-2 focus-visible:ring-signal"
                  >
                    {r ? "Retake quiz" : "Start quiz"}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
