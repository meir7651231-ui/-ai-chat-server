# Changelog · יומן שינויים

All notable changes to this repo are listed here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
The repo has no versioned releases, so each entry is a dated milestone. Full detail: `git log`.

כל שינוי משמעותי נרשם כאן, בפורמט Keep a Changelog. אין גרסאות משוחררות — כל רשומה היא אבן-דרך מתוארכת.

## [Unreleased]

### Added
- Bilingual README (`README.md` Hebrew · `README.en.md` English): try-now command, real terminal recording (`assets/demo.gif`), the problem, how it works, the numbers, what's inside, what it does not do, timed quick start, status, FAQ.
- `assets/`: `hero`, `how`, `beforeafter`, `numbers`, `install` — each as a dark `.svg` and a `-light.svg`, switched by `<picture>`.
- `docs/ARCHITECTURE.md` (sentence → atoms → screen, checked only) · `docs/GENERATOR.md` (short guide).
- `CONTRIBUTING.md`, `ROADMAP.md`, `SECURITY.md`, `.github/pull_request_template.md`, `.github/ISSUE_TEMPLATE/` (bug · docs). No workflows.
- `.gitignore`: `.env*`, `node_modules/`, `.dart_tool/`, OS files.

### Changed
- `HANDOFF-FORGE.md` moved to `docs/handoff/` (`git mv`; nothing links to it). The other hand-off files stay at the root — other files link to them.
- No code changed.

## [2026-09-24] — Meron file · תיק מירון
### Added
- `meron/`: topics 01–136 for managing the Meron event — a simulation and a full log per topic, web research and consistency passes.

## [2026-09-05] — ds-forge engine and pixel audit
### Added
- ds-forge: 353/353 atoms rendered, Hebrew font fallback, a fixed quality baseline.
- `one.mjs`: the full pixel-audit pipeline inside the one-engine.
- `docs/handoff/HANDOFF-FORGE.md`: usage guide and catalog of the 353 atoms.

## [2026-08-30] — The full shelf is green
### Added
- All 1,672 shelf files pass `flutter analyze` with zero errors, plus a full web build inside buildsmart.
### Known issues
- 41 conversion-debt atoms are quarantined, waiting for a fix in the conversion engine.

## [2026-08-29] — The compile test
### Added
- 265 atoms · 80 assembled screens · 79 boards — from 1,804 errors to zero in 8 engine-fix rounds.

## [2026-08-24] — Birth · לידה
### Added
- The repo opened empty. Every file comes in through the quarry, with a contract and a test, under `LAW.md`.
