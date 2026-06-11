"use client";

import { useState } from "react";
import type { Flashcard } from "@/lib/types";

export function FlashcardDeck({
  cards,
  onSeen,
}: {
  cards: Flashcard[];
  onSeen: (id: string) => void;
}) {
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = cards[i];

  if (!card) return null;

  function flip() {
    if (!flipped) onSeen(card.id);
    setFlipped((f) => !f);
  }

  function go(delta: number) {
    setFlipped(false);
    setI((n) => (n + delta + cards.length) % cards.length);
  }

  return (
    <div>
      <p className="font-mono text-xs text-slatey mb-2">
        CARD {String(i + 1).padStart(2, "0")}/{String(cards.length).padStart(2, "0")} · TAP TO FLIP
      </p>
      <div className="card-flip">
        <button
          onClick={flip}
          aria-label={flipped ? "Show term" : "Show definition"}
          className="block w-full text-left focus-visible:ring-2 focus-visible:ring-signal rounded-md"
        >
          <div className={`card-inner ${flipped ? "flipped" : ""}`}>
            <div className="card-face rounded-md border border-ink/20 bg-white p-6 min-h-44 flex items-center">
              <p className="font-display font-700 text-xl leading-snug">{card.front}</p>
            </div>
            <div className="card-face card-back absolute inset-0 rounded-md border border-signal bg-signal/10 p-6 min-h-44 flex items-center overflow-y-auto">
              <p className="text-sm leading-relaxed">{card.back}</p>
            </div>
          </div>
        </button>
      </div>
      <div className="mt-4 flex justify-between">
        <button onClick={() => go(-1)} className="rounded border border-ink px-4 py-2 text-sm font-semibold hover:bg-line/40 focus-visible:ring-2 focus-visible:ring-signal">
          ← Previous
        </button>
        <button onClick={() => go(1)} className="rounded bg-ink px-4 py-2 text-white text-sm font-semibold hover:bg-inkdeep focus-visible:ring-2 focus-visible:ring-signal">
          Next →
        </button>
      </div>
    </div>
  );
}
