---
title: "NEET PG Counselor"
date: 2026-10-02T12:00:00+05:30
draft: false
tags: ["education", "data-pipeline", "python"]
summary: "A free, offline guide to NEET PG counseling, with a rank predictor built on 262,760 real allotments."
---

**Live:** [nishithada.github.io/neet-pg-counselor](https://nishithada.github.io/neet-pg-counselor/) · **Code:** [github.com/NishitHada/neet-pg-counselor](https://github.com/NishitHada/neet-pg-counselor)

A free, static website for making sense of NEET PG counseling. There's no server, no login, and nothing to pay for.

## What's in it

- **Guide & Timeline:** AIQ vs State Quota, counseling rounds, choice locking, reporting and joining, and the document checklist.
- **Rank Predictor:** enter your rank, category, quota, and preferences, and see every seat that went to someone ranked at or worse than you, with the closing rank in every round.
- **Cutoff Explorer:** the full closing-rank table, filterable and exportable as CSV. Each row links to the MCC PDF it came from.
- **Reservation & Eligibility Calculator:** AIQ reservation percentages, EWS income check, PwD and In-Service notes. State quota rules vary, so they're intentionally not modeled with made-up numbers.
- **Ask the Counselor:** an offline, rule-based FAQ bot. No AI model is involved.

## The data pipeline

The hard part is the data. MCC publishes each round as a PDF, and the layouts aren't uniform: at least seven table formats between 2021 and 2025. Cells wrap mid-word, and one institute can appear under up to 18 spellings.

1. **fetch:** download the 22 PDFs.
2. **extract:** header-driven table extraction that takes the seat held *after* each round.
3. **normalize:** canonicalize quotas, categories, 391 course spellings, and 12,363 institute spellings (clustered down to about 1,980 institutes).

A report accounts for every raw row: kept, dropped, merged, or unresolved. Sanity checks found no repeated ranks within a round, and 60 of 60 sampled rows matched their cited PDF page.

**Stack:** Python pipeline into SQLite, with a plain HTML/JS front end and no build step.
