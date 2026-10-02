---
title: "Tax & Wealth Sim"
date: 2026-10-02T12:00:00+05:30
draft: false
tags: ["simulation", "economics", "javascript"]
summary: "How tax regimes and whole economic systems reshape wealth across a cast of economic personas over time."
---

**Live:** [nishithada.github.io/tax-wealth-sim](https://nishithada.github.io/tax-wealth-sim/) · **Code:** [github.com/NishitHada/tax-wealth-sim](https://github.com/NishitHada/tax-wealth-sim)

A single-file simulation with no build step and no dependencies. It runs entirely in your browser and draws its charts as inline SVG.

## What it models

- Progressive or flat income tax, short- vs long-term capital gains, property, wealth, and sales tax
- **Buy-borrow-die:** funding a lifestyle by borrowing against appreciating assets instead of selling
- **The poverty premium:** low-net-worth households borrow at far higher rates
- Rent inflation and the renter's squeeze
- FIRE and retirement, with per-persona income growth
- **The social wage:** taxes that fund housing, healthcare, and schooling, lifting earning power over time
- **Monetary dilution:** passive top-end wealth debasing money and eroding everyone's real purchasing power

The headline metric is the **true effective rate**: all taxes divided by economic income *including unrealized gains*. That's the figure that shows billionaires paying a fraction of what wage earners do.

## Personas and systems

Twelve personas, from a farmer to a controlling-stake founder, all editable. A comparison matrix runs them under five worlds: **Capitalism, Socialism, Communism, Post-war boom, Recession**. Cells are heat-shaded from each persona's best system to their worst, and clicking a column loads that economy into the detailed charts.

It's a stylized teaching model, not tax advice or a forecast. Fork it and change the assumptions.
