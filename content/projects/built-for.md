---
title: "Built For"
date: 2026-10-02T12:00:00+05:30
draft: false
tags: ["sports", "data", "javascript"]
summary: "Enter your body measurements to see which sports and positions your build naturally suits."
---

**Live:** [nishithada.github.io/built-for](https://nishithada.github.io/built-for/) · **Code:** [github.com/NishitHada/built-for](https://github.com/NishitHada/built-for)

Enter your measurements and find out which of 35 sports your build naturally suits.

## Features

- **Ranked sports:** top 3 plus a full list, filterable by region, team, or individual.
- **Positions:** team sports (football, basketball, volleyball, rugby, cricket, kabaddi and more) are scored per position.
- **Check a sport:** shows your match for one sport and ranks the limiting factors. Each is marked as fixed (bone length) or changeable (weight, BMI), with the points it costs.
- **Local flavor:** detects your region from the time zone and shows how you rank in sports popular there.
- **Measure from a photo:** estimates arm span, leg length, and shoulder width from one full-body photo using MediaPipe Pose in the browser. The photo is never uploaded.
- **Next steps:** how to get started, gear, and where to play.

## How scoring works

Sports are ranked by **advantage**: how much more common your build is among a sport's elite athletes than in the general population, for example "13x more common among Olympic badminton players than among men worldwide". Height and BMI targets for 27 sports are fitted on Olympic athlete data (1992 to 2016). Other proportions use approximations from sports-science literature. Body shape is one factor among many, and the methodology page says so.

**Stack:** a single static file with no build step. Share previews are rendered by the app itself and captured with headless Chrome.
