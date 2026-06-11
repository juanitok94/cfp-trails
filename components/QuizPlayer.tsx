"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Module, Question } from "@/lib/types";
import { pointsFor, PASS_PCT } from "@/lib/types";

interface Props {
  trailSlug: string;
  module: Module;
  onComplete: (score: number, maxScore: number) => void;
}

type Answers = Record<string, number>;

export function QuizPlayer({ trailSlug, module, onComplete }: Props) {
  const questions = module.questions;
  const maxScore = useMemo(() => questions.reduce((n, q) => n + pointsFor(q), 0), [questions]);
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [picked, setPicked] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [done, setDone] = useState(false);

  const q = questions[i];
  const prevCase = i > 0 ? questions[i - 1].caseText : undefined;
  const showCase = q.kind === "scenario" && q.caseText && q.caseText !== prevCase;

  function check() {
    if (picked === null) return;
    setChecked(true);
    setAnswers((a) => ({ ...a, [q.id]: picked }));
  }

  function next() {
    if (i + 1 < questions.length) {
      setI(i + 1);
      setPicked(null);
      setChecked(false);
    } else {
      const score = questions.reduce(
        (n, qq) => n + ((answers[qq.id] ?? picked) !== undefined && answers[qq.id] === qq.answer ? pointsFor(qq) : 0),
        0
      );
      onComplete(score, maxScore);
      setDone(true);
    }
  }

  if (done) {
    const correct = questions.filter((qq) => answers[qq.id] === qq.answer);
    const score = correct.reduce((n, qq) => n + pointsFor(qq), 0);
    const pct = Math.round((score / maxScore) * 100);
    const passed = pct >= PASS_PCT;
    return (
      <div className="rounded-md border border-ink/20 bg-white p-6">
        <p className="font-mono text-xs text-slatey">MODULE COMPLETE</p>
        <h2 className="font-display font-800 text-3xl mt-1">
          {pct}% <span className="text-base font-mono font-normal text-slatey">({score}/{maxScore} pts)</span>
        </h2>
        <p className={`mt-2 font-semibold ${passed ? "text-right" : "text-wrong"}`}>
          {passed
            ? `Badge earned — ${PASS_PCT}%+ on ${module.title}.`
            : `Badge needs ${PASS_PCT}%. Review the misses below and retake — only your best score banks points.`}
        </p>
        <div className="mt-5 space-y-3">
          {questions.map((qq, n) => {
            const ok = answers[qq.id] === qq.answer;
            return (
              <div key={qq.id} className={`rounded border p-3 text-sm ${ok ? "border-right/40" : "border-wrong/40 bg-wrong/5"}`}>
                <p className="font-mono text-[11px] text-slatey">
                  Q{String(n + 1).padStart(2, "0")} · {qq.topic} · {ok ? "CORRECT" : "MISSED"}
                </p>
                <p className="mt-1 font-medium">{qq.stem}</p>
                {!ok && (
                  <p className="mt-1">
                    <span className="font-semibold">Answer:</span> {qq.choices[qq.answer]}
                  </p>
                )}
                <p className="mt-1 text-slatey">{qq.explanation}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => {
              setI(0); setAnswers({}); setPicked(null); setChecked(false); setDone(false);
            }}
            className="rounded bg-ink px-4 py-2 text-white text-sm font-semibold hover:bg-inkdeep focus-visible:ring-2 focus-visible:ring-signal"
          >
            Retake quiz
          </button>
          <Link href={`/trail/${trailSlug}`} className="rounded border border-ink px-4 py-2 text-sm font-semibold hover:bg-line/40">
            Back to trail
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-ink/20 bg-white p-6">
      <div className="flex items-center justify-between font-mono text-xs text-slatey">
        <span>
          Q {String(i + 1).padStart(2, "0")}/{String(questions.length).padStart(2, "0")} · TOPIC {q.topic}
        </span>
        <span>
          {q.kind === "scenario" ? "CASE" : "MC"} · {pointsFor(q)} PTS{q.difficulty === 2 ? " · HARD" : ""}
        </span>
      </div>
      <div className="ruler mt-2" aria-hidden>
        <div className="ruler-fill" style={{ width: `${(i / questions.length) * 100}%` }} />
      </div>

      {showCase && (
        <div className="mt-4 rounded border-l-4 border-signal bg-signal/10 p-3 text-sm">
          <p className="font-mono text-[11px] text-slatey mb-1">CASE FACTS</p>
          {q.caseText}
        </div>
      )}

      <h2 className="font-display font-700 text-lg mt-4 leading-snug">{q.stem}</h2>

      <div className="mt-4 space-y-2" role="radiogroup" aria-label="Answer choices">
        {q.choices.map((c, idx) => {
          const isPicked = picked === idx;
          const isAnswer = idx === q.answer;
          let cls = "border-line hover:border-ink/50";
          if (checked && isAnswer) cls = "border-right bg-right/10";
          else if (checked && isPicked && !isAnswer) cls = "border-wrong bg-wrong/10";
          else if (isPicked) cls = "border-ink bg-line/30";
          return (
            <button
              key={idx}
              role="radio"
              aria-checked={isPicked}
              disabled={checked}
              onClick={() => setPicked(idx)}
              className={`w-full rounded border p-3 text-left text-sm transition-colors focus-visible:ring-2 focus-visible:ring-signal ${cls}`}
            >
              <span className="font-mono text-xs text-slatey mr-2">{String.fromCharCode(65 + idx)}.</span>
              {c}
            </button>
          );
        })}
      </div>

      {checked && (
        <div className={`mt-4 rounded border p-3 text-sm ${picked === q.answer ? "border-right/40 bg-right/5" : "border-wrong/40 bg-wrong/5"}`}>
          <p className="font-semibold">{picked === q.answer ? "Correct." : "Not quite."}</p>
          <p className="mt-1 text-slatey">{q.explanation}</p>
        </div>
      )}

      <div className="mt-5 flex justify-end">
        {!checked ? (
          <button
            onClick={check}
            disabled={picked === null}
            className="rounded bg-ink px-5 py-2 text-white text-sm font-semibold disabled:opacity-40 hover:bg-inkdeep focus-visible:ring-2 focus-visible:ring-signal"
          >
            Check answer
          </button>
        ) : (
          <button
            onClick={next}
            className="rounded bg-ink px-5 py-2 text-white text-sm font-semibold hover:bg-inkdeep focus-visible:ring-2 focus-visible:ring-signal"
          >
            {i + 1 < questions.length ? "Next question" : "Finish & score"}
          </button>
        )}
      </div>
    </div>
  );
}
