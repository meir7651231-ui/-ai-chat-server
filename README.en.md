<p align="right"><a href="README.md">עברית</a> · <b>English</b></p>

<p align="center"><img src="assets/hero.svg" alt="Orbit Genesis in action: a Hebrew sentence goes in, five catalog atoms are picked and wired, a Flutter screen comes out" width="100%"></p>

<p align="center">
<img src="https://img.shields.io/badge/Node.js-22-3dff8e?style=for-the-badge&labelColor=0b1018" alt="Node.js 22">
<img src="https://img.shields.io/badge/npm%20deps-0-6aa8ff?style=for-the-badge&labelColor=0b1018" alt="zero npm dependencies">
<img src="https://img.shields.io/badge/status-feature%20freeze-ffb020?style=for-the-badge&labelColor=0b1018" alt="status: feature freeze">
</p>

<h3 align="center">Every wire has a contract. Nothing burned in. No capability lost.</h3>

<p align="center"><a href="#the-problem">The problem</a> · <a href="#how-it-works">How it works</a> · <a href="#see-it-run">Demo</a> · <a href="#the-numbers">The numbers</a> · <a href="#whats-inside">What's inside</a> · <a href="#what-it-does-not-do">What it does not do</a> · <a href="#run-it-locally">Run it</a> · <a href="#status">Status</a> · <a href="#faq">FAQ</a></p>

---

## The problem

Three live systems — **maor**, **buildsmart** and **yoman** — grew fast, and each one burned text, numbers and context into its own code.
That code works, but no part of it can move to another project unchanged, and no new feature can be assembled from it automatically.

**Orbit Genesis is the clean rebuild.** The old code was broken into tens of thousands of registered atoms; here a new tree is built only
from pure atoms and wiring boxes — on the way to **the generator**: a Hebrew sentence ⇒ a feature assembled from the catalog.

<p align="center"><img src="assets/beforeafter.svg" alt="Before: code with burned-in text and numbers, locked to one app. After: a pure atom with data injected, reusable anywhere" width="100%"></p>

## How it works

<p align="center"><img src="assets/how.svg" alt="Legacy source, quarry, atoms, boxes, board, generator; the police checks every step" width="100%"></p>

1. **Quarry** (`machtzev/`) — carves atom drafts out of the legacy source.
2. **Atom** (`new/atoms/`) — one pure capability: code + contract + test, with no data inside (see `PURPOSE.md`).
3. **Box** (`new/boxes/`) — wiring between atoms, nothing else.
4. **Board** (`new/board.*`) — the motherboard that joins the boxes into one system.
5. **Generator** (`engine/`) — a deterministic engine that turns a Hebrew sentence into a Flutter screen, with no language model.
6. **Police** (`machtzev/police.mjs`) — wiring, contract, quarry and pin gates that must be green before every commit.

The full rules (in Hebrew): [`LAW.md`](LAW.md) (the seven electrician's laws) · [`PURPOSE.md`](PURPOSE.md) (the purity goal).

## See it run

A recording of a real run (6 Nov 2026, Node 22, no `npm install`): wiring check → contract check → board test → the generator reads a sentence and writes a Dart screen.

<p align="center"><img src="assets/demo.gif" alt="Terminal recording: wiring-check, contract-check, board test, then generate.mjs turns engine/specs/example.txt into gen_example.dart" width="100%"></p>

## The numbers

<p align="center"><img src="assets/numbers.svg" alt="Measured 6 Nov 2026: 6,514 files with zero wiring violations; 1,239 atoms each with a contract and a green test; 39 board assertions passing; 0 npm dependencies" width="100%"></p>

Every number here was measured by a run, not estimated. The commands are under [Run it locally](#run-it-locally).

## What's inside

| Folder / file | What it holds |
|---|---|
| `new/` | The new tree: atoms, boxes, board and Dart layers |
| `machtzev/` | Quarry and police: extraction, checks, lessons (`LEARNINGS.md`), decisions (`DECISIONS.md`) |
| `engine/` | The generator — sentence ⇒ screen ([README](engine/README.md)) |
| `runtime/` | Dart runtime for the atoms |
| `box-drafts/` | Box plans and the readiness meter (`READINESS.md`) |
| `dart-from-maor/` · `dart-quarry/` | Dart drafts converted from the source |
| `screens-seed/` | Screen seeds for assembly |
| `design/` | Orbit design and brand pages |
| `knowledge/` | Plans, summaries and close-out notes |
| `docs/handoff/` | Hand-off notes nothing else links to |
| `meron/` | Topic-by-topic planning file for managing the Meron event (HTML, one topic per file) |
| `WIRING.md` | The live wiring map (generated — do not edit by hand) |
| `HANDOFF-MASTER.md` · `HANDOFF-DART-CONVERSION.md` | Hand-off notes other documents link to (they stay at the root) |

## What it does not do

- **It is not a server or a running app.** There is no service to deploy; this is a code tree, tools and checks.
- **The generator uses no language model** and does not "understand" free Hebrew — each line starts with a shape word (`כפתור` button, `כרטיס` card…) that a lexicon (`lexicon.json`) maps to a catalog atom. A shape word not in the lexicon is not mapped.
- **It does not replace the live systems.** maor, buildsmart and yoman keep running from their own repos; the cutover is planned to be reversible (law 7).
- **It does not promise that a generated screen passes `flutter analyze` here** — the compile test runs inside buildsmart, not in this repo.
- **It holds no secrets, identities or connections** — those are injected at deploy time (law 6).
- **There is no CI yet** — checks are run by hand or in a session.

## Run it locally

<p align="center"><img src="assets/install.svg" alt="Three steps: clone, check with Node 22, run the generator. No npm install" width="100%"></p>

Node.js 22 only. There is no `npm install` — the tools use Node's built-in modules only.

```bash
git clone <repo-url> && cd <repo-folder>

node machtzev/wiring-check.mjs ./new     # wiring laws on the new tree
node machtzev/contract-check.mjs ./new   # every atom: contract + green test
node --test new/board.test.mjs           # board test
node machtzev/police.mjs --fast          # the fast police (before every commit)
(cd engine && node generate.mjs)         # run the generator on its specs
```

All of these were run on 6 Nov 2026 with Node 22.23.

## Status

- 🧊 **Feature freeze** (owner decision D5, November 2026) — fixes, order and docs only.
- ✅ Wiring: 6,514 files, zero violations · ✅ Contracts: 1,239 atoms · ✅ Board: 39 assertions pass.
- 🔴 `police.mjs --fast` is currently red at the synthesis gate (JS↔Dart equivalence). The fix waits in draft PRs #2–#4.
- Main working branch: `claude/mah-kora-0by8kw`. The repo has no automated CI yet.
- History: [`CHANGELOG.md`](CHANGELOG.md) · Security: [`SECURITY.md`](SECURITY.md).

## FAQ

<details><summary><b>Why is there no legacy code here?</b></summary>

The repo was born empty on 24 Aug 2026. Every file came in through the quarry, with a contract and a test. The old code stays in the original repos.
</details>

<details><summary><b>What is a "pure atom"?</b></summary>

A unit of code that does one thing and holds no burned-in data — no text, no fixed number, no name. Data is injected from the data layer, so the same atom serves any purpose unchanged.
</details>

<details><summary><b>Does the generator use a language model?</b></summary>

No. The engine in `engine/` is deterministic: the same sentence gives the same output, offline, at no cost per run.
</details>

<details><summary><b>How is the police here different from agent-police?</b></summary>

`machtzev/police.mjs` is this repo's own build police: wiring, contract, quarry and pin gates. It is not a separate product or plugin.
</details>

<details><summary><b>Why is the police red if wiring and contracts are green?</b></summary>

The synthesis gate compares JS output with Dart output, and there is a gap in how lists print (`[א, ח, ת]` vs `א,ח,ת`). That is the checker, not an atom — the fix waits for approval in PRs #2–#4.
</details>

<details><summary><b>Why doesn't the repo name match the content?</b></summary>

The name is left over from an early setup. Renaming is a repo setting and waits for the owner's decision.
</details>

<details><summary><b>Where do I start reading?</b></summary>

`LAW.md` → `machtzev/LEARNINGS.md` → `machtzev/AGENT-CODE.md` → `machtzev/DECISIONS.md`. The full order is in `CLAUDE.md`.
</details>
