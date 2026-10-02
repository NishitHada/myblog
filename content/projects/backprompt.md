---
title: "Backprompt"
date: 2026-10-02T12:00:00+05:30
draft: false
tags: ["ai", "developer-tools", "python", "react"]
summary: "LeetCode for spec-driven development: write the spec, models build it blind, builds are graded by execution."
---

**Live:** [backprompt.vercel.app](https://backprompt.vercel.app)

LeetCode for spec-driven development. Most coding platforms test whether you can write code. Backprompt tests whether you can write the *spec* that gets code written.

## How it works

1. You read a piece of real code.
2. You write the [spec-kit](https://github.com/github/spec-kit) documents that would make an implementer rebuild it: constitution, spec, plan, and tasks.
3. Several models (Claude, GPT, Gemini, local models, anything configured in `models.yaml`) build from **only your documents**.
4. Every build runs against hidden tests and random traces compared with the reference implementation.

## The feedback loop

The result shows which requirements your spec pins down, which ones only some models get right, and which ones it misses entirely. A spec only earns a high score if the *weakest* model can build from it, so ambiguity gets punished.

## Under the hood

- **Backend:** Python (managed with `uv`): API, CLI, harness, and scoring.
- **Frontend:** React + Vite workbench.
- **Sandboxing:** model-written code runs in Docker sandboxes.
- **Model-agnostic:** providers (Anthropic, OpenAI, Gemini, OpenRouter) and local runtimes (Ollama, vLLM) are just config.

The repo is private.
