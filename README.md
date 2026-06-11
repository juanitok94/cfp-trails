# CFP/Trails

A gamified, Trailhead-style study app for the CFP® exam. Open source, zero backend, deploys free on Vercel.

**How it's organized:** the CFP Board publishes the exam blueprint — 8 Principal Knowledge Domains, 70 topics, with exam weights. Each domain is a **Trail**, each topic cluster is a **Module** with flashcards (Learn) and a hard quiz, and your dashboard shows **weighted blueprint coverage**: how much of the actual exam your mastery currently spans.

## Gamification

- **Points** — 10 pts per MC question, 20 per scenario question, +5 for hard items. Only improvements over your best score bank points (grind-proof).
- **Badges** — score 80%+ on a module.
- **Ranks** — Intern → Analyst → Paraplanner → Associate Planner → Lead Planner → Board Ready.
- **Streak** — study on consecutive days.
- **Weight rulers** — every trail shows its real exam weight; mastery fills it in green.

Progress lives in `localStorage` (no accounts, no database). The `Progress` type in `lib/types.ts` is designed to swap to Supabase/auth later without rewriting the UI.

## Run locally

```bash
npm install
npm run dev
```

## Deploy (GitHub → Vercel)

```bash
git init && git add -A && git commit -m "init: cfp-trails mvp"
gh repo create cfp-trails --public --source=. --push   # or push manually
```

Then in Vercel: **Add New Project → import the repo → Deploy**. No env vars needed.

## Add content

1. Create `content/trails/<domain>.ts` exporting a `Trail` (copy `tax-planning.ts` as a template).
2. Replace the matching stub in `content/index.ts`.
3. Open a PR. Adding a question is a code review, which keeps the bank auditable.

Question conventions: state assumed dollar figures **in the stem** (the real exam provides tax tables), tag every item with its Principal Knowledge Topic code (e.g. `E.2`), and write an explanation that teaches the trap, not just the answer.

## Roadmap

- [ ] Investment Planning (D, 17%) deep trail
- [ ] Remaining 5 domains
- [ ] Exam simulator mode (170 questions, weighted draw, timed)
- [ ] Supabase auth + team leaderboard
- [ ] Spaced-repetition scheduling for flashcards

## Disclaimer

Study aid only. Not affiliated with, endorsed by, or sponsored by CFP Board. CFP® and CERTIFIED FINANCIAL PLANNER® are certification marks owned by the Certified Financial Planner Board of Standards, Inc. Questions are original works written against the publicly available exam blueprint; verify current-year figures against official CFP Board materials.
