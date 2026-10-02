---
title: "Prediction Market Fraud Lab"
date: 2026-10-02T12:00:00+05:30
draft: false
tags: ["simulation", "fraud", "markets", "javascript"]
summary: "A fully simulated prediction market that demonstrates how fraud and manipulation work, and how surveillance tries to catch it."
---

**Live:** [Sandbox](https://nishithada.github.io/predmarket-fraud-lab/) · [Story mode](https://nishithada.github.io/predmarket-fraud-lab/story.html) · **Code:** [github.com/NishitHada/predmarket-fraud-lab](https://github.com/NishitHada/predmarket-fraud-lab)

A Kalshi/Polymarket-style binary market with a real order book, built to show the manipulation vectors that threaten real markets. Everything is fake: money, accounts, bots. It's pure client-side HTML, CSS, and JS.

## Story mode: "Can you beat the house?"

A guided three-round game. You bet on markets that look completely normal, and you lose all three. Then each round reveals how:

1. **Pump & dump + wash trading:** the momentum and volume were faked by one whale and its sock puppets, who dumped on you the moment you bought.
2. **Oracle capture:** the crowd was right, but the operator controls settlement and ruled the other way, with an insider on the other side of your bet.
3. **Exit scam:** fees were quietly cranked about 20x, and withdrawals froze while the operator dumped its own bag.

The rig targets *you*, not a fixed outcome. Whichever side you pick, the house takes the other. Fading the crowd is just a different way to lose. Each reveal has an animated replay with a marker showing where you entered.

## Free sandbox

You're a trader here. Your orders hit the book and move the price, and the panel shows your profit or loss in dollars under both outcomes. Launch an attack yourself and watch the surveillance desk try to catch it. Every attack narrates itself: what's happening, who's doing it, and why.

The lesson in both modes: manipulation is invisible from the inside.
