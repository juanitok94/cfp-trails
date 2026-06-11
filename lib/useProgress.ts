"use client";

import { useCallback, useEffect, useState } from "react";
import { EMPTY_PROGRESS, type Progress, type ModuleResult } from "./types";
import { touchStreak } from "./ranks";

const KEY = "cfp-trails-progress-v1";

function load(): Progress {
  if (typeof window === "undefined") return EMPTY_PROGRESS;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? { ...EMPTY_PROGRESS, ...JSON.parse(raw) } : EMPTY_PROGRESS;
  } catch {
    return EMPTY_PROGRESS;
  }
}

function save(p: Progress) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* storage unavailable — progress lives in memory only */
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(EMPTY_PROGRESS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setProgress(load());
    setReady(true);
  }, []);

  const recordResult = useCallback(
    (moduleId: string, score: number, maxScore: number) => {
      setProgress((prev) => {
        const old = prev.results[moduleId];
        const pct = Math.round((score / maxScore) * 100);
        const improved = !old || score > old.bestScore;
        const result: ModuleResult = {
          bestScore: improved ? score : old.bestScore,
          maxScore,
          bestPct: improved ? pct : old.bestPct,
          attempts: (old?.attempts ?? 0) + 1,
          completedAt: old?.completedAt ?? new Date().toISOString(),
        };
        // Points: you bank only the improvement over your previous best
        const gained = improved ? score - (old?.bestScore ?? 0) : 0;
        const next = touchStreak({
          ...prev,
          points: prev.points + gained,
          results: { ...prev.results, [moduleId]: result },
        });
        save(next);
        return next;
      });
    },
    []
  );

  const markCardSeen = useCallback((cardId: string) => {
    setProgress((prev) => {
      if (prev.cardsSeen[cardId]) return prev;
      const next = touchStreak({
        ...prev,
        cardsSeen: { ...prev.cardsSeen, [cardId]: true },
      });
      save(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    save(EMPTY_PROGRESS);
    setProgress(EMPTY_PROGRESS);
  }, []);

  return { progress, ready, recordResult, markCardSeen, reset };
}
