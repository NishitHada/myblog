---
title: "Purchasing Power History"
date: 2026-10-02T12:00:00+05:30
draft: false
tags: ["economics", "data", "javascript"]
summary: "How a currency's real buying power has moved over a century, built on published government price data."
---

**Live:** [nishithada.github.io/purchasing-power-history](https://nishithada.github.io/purchasing-power-history/) · **Code:** [github.com/NishitHada/purchasing-power-history](https://github.com/NishitHada/purchasing-power-history)

How has money's buying power changed for things that matter: new cars, TVs, groceries, rent, electricity, gasoline? This tool answers using published price index data, not personal spending or opinion.

## Views

- **Historical trend:** a BLS CPI category from as far back as it exists.
- **Real vs. headline inflation:** a category divided by all-items CPI, showing whether it got cheaper or pricier relative to money itself.
- **Cross-country comparison:** headline CPI for several countries, rebased to a common year.
- **Nishit's Unit of Value (NUV):** a constant-purchasing-power ruler. 1 NUV is the buying power of $1 in the US at each currency's own PPP reference year, which puts every currency on one scale across time. It was checked against hand calculations to 6 significant figures.
- **Calculator:** convert an amount between years, or between currencies and years.

## Architecture

The live site is fully static. The BLS API caps requests at a 10-year window and 25 calls a day, so history is fetched once into a JSON cache by a resumable seed script. The Express backend only ever reads that cache, so the same math was ported to client-side JS and the site deploys to GitHub Pages with no server.

## Honest limits

BLS indexes are quality-adjusted, not sticker prices. TVs only exist as a category from December 1997, and new vehicles from 1947. International data is shallow on purpose, because no free API has car-level prices by country.
