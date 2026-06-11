"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { notFound, useParams, useSearchParams } from "next/navigation";
import { trailBySlug } from "@/content";
import { useProgress } from "@/lib/useProgress";
import { HeaderBar } from "@/components/ui";
import { QuizPlayer } from "@/components/QuizPlayer";
import { FlashcardDeck } from "@/components/FlashcardDeck";

export default function ModulePage() {
  return (
    <Suspense>
      <ModuleInner />
    </Suspense>
  );
}

function ModuleInner() {
  const { slug, moduleId } = useParams<{ slug: string; moduleId: string }>();
  const search = useSearchParams();
  const trail = trailBySlug(slug);
  const mod = trail?.modules.find((m) => m.id === moduleId);
  const { progress, recordResult, markCardSeen } = useProgress();
  const [mode, setMode] = useState<"learn" | "quiz">(
    search.get("mode") === "quiz" ? "quiz" : "learn"
  );

  if (!trail || !mod) notFound();

  return (
    <main>
      <HeaderBar progress={progress} />
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Link href={`/trail/${trail.slug}`} className="font-mono text-xs text-slatey hover:text-ink">
          ← {trail.title.toUpperCase()}
        </Link>
        <h1 className="font-display font-800 text-2xl tracking-tight mt-3">{mod.title}</h1>

        <div className="mt-4 mb-5 inline-flex rounded border border-line bg-white p-1 font-mono text-xs">
          <Tab active={mode === "learn"} onClick={() => setMode("learn")}>
            LEARN · {mod.flashcards.length}
          </Tab>
          <Tab active={mode === "quiz"} onClick={() => setMode("quiz")}>
            QUIZ · {mod.questions.length}
          </Tab>
        </div>

        {mode === "learn" ? (
          <FlashcardDeck cards={mod.flashcards} onSeen={markCardSeen} />
        ) : (
          <QuizPlayer
            trailSlug={trail.slug}
            module={mod}
            onComplete={(score, max) => recordResult(mod.id, score, max)}
          />
        )}
      </div>
    </main>
  );
}

function Tab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded px-3 py-1.5 focus-visible:ring-2 focus-visible:ring-signal ${
        active ? "bg-ink text-white" : "text-slatey hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}
