---
title: "Quality of Life Indicator"
date: 2026-10-02T12:00:00+05:30
draft: false
tags: ["maps", "data", "fastapi", "react"]
summary: "Drop a pin on a map and get a composite quality-of-life score with a factor-by-factor breakdown."
---

**Live:** [qol-indicator.vercel.app](https://qol-indicator.vercel.app) · **Code:** [github.com/NishitHada/qol-indicator](https://github.com/NishitHada/qol-indicator)

Drop a pin (or search an address) on a Google Map and get a composite "quality of life" score for that spot, plus a breakdown of every factor behind it.

## Features

- **Score** any location, with the weights used and which factors couldn't be verified.
- **Compare** 2 to 4 locations side by side, with a winner per factor.
- **Personalization:** a profile adjusts the weights, so a retiree and a young commuter get different answers.
- **Share** a comparison as a short link.

## Factors

Greenery, water, healthcare, social hubs, religious sites, connectivity (metro, rail, bus), daily essentials, pollution sources, noise, crowding, temperature, wind and ventilation, and air quality.

## An interesting engineering bit

The data comes from OpenStreetMap, Microsoft building footprints, and Open-Meteo. The first version called these APIs live, and in production it resolved only 2 of 8 factors. The public Overpass cluster and Open-Meteo's archive both refuse or throttle cloud-provider IPs. They worked fine from a laptop and failed from the host.

The fix was to bundle the static data. Parks, lakes, and last year's weather don't change between requests, so they never belonged behind a live API call. Only air quality and live flight noise stay live.

## Extending it

Everything is declarative: adding a factor is a registry entry plus a `compute(lat, lng)` function. Tags, radii, and scoring curves, personalization rules, and fallback providers each live in a single file.

**Stack:** React + Vite + Google Maps on the front, FastAPI on the back.
