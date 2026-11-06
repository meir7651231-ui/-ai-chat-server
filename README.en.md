<p align="right"><a href="README.md">עברית</a> · <b>English</b></p>

<p align="center"><img src="assets/hero.svg" alt="Orbit Genesis: old code broken into atoms, wired into boxes, rebuilt clean" width="100%"></p>

<p align="center">
<img src="https://img.shields.io/badge/Node.js-22-3dff8e?style=for-the-badge&labelColor=0b1018" alt="Node.js 22">
<img src="https://img.shields.io/badge/npm%20deps-0-6aa8ff?style=for-the-badge&labelColor=0b1018" alt="zero npm dependencies">
<img src="https://img.shields.io/badge/status-feature%20freeze-ffb020?style=for-the-badge&labelColor=0b1018" alt="status: feature freeze">
</p>

<h3 align="center">Every wire has a contract. Nothing burned in. No capability lost.</h3>

<p align="center"><a href="#the-problem">The problem</a> · <a href="#how-it-works">How it works</a> · <a href="#whats-inside">What's inside</a> · <a href="#run-it-locally">Run it locally</a> · <a href="#status">Status</a> · <a href="#faq">FAQ</a></p>

---

## The problem

Three live systems — **maor**, **buildsmart** and **yoman** — grew fast, and each one burned text, numbers and context into its own code.
That code works, but no part of it can move to another project unchanged, and no new feature can be assembled from it automatically.

**Orbit Genesis is the clean rebuild.** The old code was broken into tens of thousands of registered atoms; here a new tree is built only
from pure atoms and wiring boxes — on the way to **the generator**: a Hebrew sentence ⇒ a feature assembled from the catalog.

## How it works

<p align="center"><img src="assets/how.svg" alt="Legacy source, quarry, atoms, boxes, board, generator; the police checks every step" width="100%"></p>

1. **Quarry** (`machtzev/`) — carves atom drafts out of the legacy source.
2. **Atom** (`new/atoms/`) — one pure capability: code + contract + test, with no data inside (see `PURPOSE.md`).
3. **Box** (`new/boxes/`) — wiring between atoms, nothing else.
4. **Board** (`new/board.*`) — the motherboard that joins the boxes into one system.
5. **Generator** (`engine/`) — a deterministic engine that turns a Hebrew sentence into a Flutter screen, with no language model.
6. **Police** (`machtzev/police.mjs`) — wiring, contract, quarry and pin gates that must be green before every commit.

The full rules (in Hebrew): [`LAW.md`](LAW.md) (the seven electrician's laws) · [`PURPOSE.md`](PURPOSE.md) (the purity goal).

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
| `meron/` | Topic-by-topic planning file for managing the Meron event (HTML, one topic per file) |
| `WIRING.md` | The live wiring map (generated — do not edit by hand) |
| `HANDOFF-*.md` | Session hand-off notes |

## Run it locally

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
- ✅ Wiring: 6,514 files in the new tree, zero violations · ✅ Contracts: 1,239 atoms, each with a contract and a green test · ✅ Board: tests pass.
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

<details><summary><b>Why doesn't the repo name match the content?</b></summary>

The name is left over from an early setup. Renaming is a repo setting and waits for the owner's decision.
</details>

<details><summary><b>Where do I start reading?</b></summary>

`LAW.md` → `machtzev/LEARNINGS.md` → `machtzev/AGENT-CODE.md` → `machtzev/DECISIONS.md`. The full order is in `CLAUDE.md`.
</details>
