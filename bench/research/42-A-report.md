# 42-A — panuy: list sorted by distance, distance shown in real km

Repo `scratchpad/repos/exp-A2` · spec `machtzev/generator/specs-ds/panuy.txt` · no commits, no remotes.

## What was wrong
1. The spec already declared `מרחק בקמ = sqrt(מרחק בריבוע)`, but `compileFormula` (render-ds.mjs)
   accepted only field names, numbers and `+ - * / ( )`. `sqrt(...)` fell through, so "km" was emitted
   as a **plain free-text input** — the app never computed a km distance at all.
2. Even had it compiled, a formula referencing another **computed** field read `_v[idx]`, and a computed
   field's `_v` slot is never written (it is displayed, not typed) — the result would be a constant `0`.
3. Nothing ordered the records anywhere: every list rendered in insertion order.

## Changes (generator only — no generated Dart hand-edited)
* `render-ds.mjs` · `compileFormula`: closed allow-list of pure math functions
  (`MATH_FN = { sqrt: 'math.sqrt' }`) plus **formula-over-formula inlining** — a referenced computed
  field is substituted by its own compiled expression (cycle-guarded; a non-arithmetic dependency keeps
  the old `_v` read ⇒ bit-identical). `dart:math` imported only when a formula needs it. Also emits the
  sort for the entity screen's list, table view and CSV.
* `particles.mjs` — shared emitters `sortTail`/`sortTailOf` (a leaf of the import graph, so render-ds ·
  app-shell · particles emit one comparator, not three copies); also sorts the `[טבלה]` particle. The
  comparator sorts a **copy** (`.toList()` first — `appStore.records()` hands back the store's own list).
* `app-shell.mjs` — sorts the shell's list tab `_RootTab`, answering `שאלה רשימה: מי פנוי עכשיו?`.
* `app-ds.mjs` — parses the new directive and threads it to the three renderers. The new vocabulary lives
  in the data atoms (`spec-lang.data.json`: `sortWord`/`sortDirs`; `chrome.data.json`:
  `sortLog`/`sortNoField`), keeping the engines dictionary-free (§19).
* `specs-ds/panuy.txt` — added `מיון אדם: מרחק בקמ עולה`, and switched the distance particle from
  `מרחק בריבוע` to `מרחק בקמ` so the highlighted figure is real km.
* `machtzev/pins.sha256` — re-signed (render-ds/particles are signature-locked; `pins-check --write`).

New grammar: `מיון <ישות>: <שדה> [עולה|יורד]`. Numeric fields compare numerically, otherwise
lexicographically; empty values always land last, in both directions. Sorting is skipped — with a `⚪`
log — when the field is unknown, nested, or derived-but-not-stored: no fake sort.

## How I know it works (Dart/Flutter are not installed)
* **Numeric proof against the real output** — `scratchpad/proof.mjs` extracts the *emitted* Dart
  expressions and comparator straight out of `new/dart-gen-bs/gen_app_panuy_ent1.dart`, translates them
  mechanically to JS and runs them on sample people. 8/8 green: 0.1° lat ⇒ 11.10 km, same point ⇒
  0.00 km, 0.2° lng ⇒ 18.60 km, km == sqrt(squared) on every row, km != squared, ascending in km,
  nearest first, missing-coordinates row last.
* **Sort emitted on all three list surfaces**: `gen_app_panuy_ent1.dart` (records list, table view, CSV),
  `gen_app_panuy_shell.dart` (`_RootTab` — the "מי פנוי עכשיו?" screen), `gen_app_panuy_px1.dart`
  (particle table) — each keyed on the `מרחק בקמ` constant.
* **Directive edge cases exercised** by temporarily editing the spec and regenerating: `יורד` flips the
  comparator to `return -c`, an unknown field logs `⚪ מיון-הגשה (G34): … ⇒ מדולג` and emits **zero**
  sort calls. Spec restored; output byte-identical afterwards.
* **Blast radius = zero.** Ran the whole `regen.mjs` pipeline (16 engines, all 32 `specs-ds` specs,
  balagan), skipping the known-broken `tighten-types`, and md5-compared 6,987 files before/after: only
  panuy's files changed. Re-running the pipeline changes nothing (fixed point).
* **Police**: full runs before and after give identical results — `43 ran · 0 skipped · 5 yellow ·
  5 failed`, same gate names (`goldenharness`/`genverify`/`appgen`/`selftest` = no Dart binary;
  `learn` = shallow clone). `genratchet`/`truth` went red mid-work and are green again: the Hebrew
  warning string moved into `chrome.data.json` (the engine Hebrew-debt ratchet sits at its cap, 39 ≤ 39),
  and the TRUTH.md drift was an artifact of running police twice without Dart.
  Logs: `scratchpad/police-full-base.txt`, `scratchpad/police-final.txt`.

## Notes / follow-ups
* Police in this Dart-less environment rewrites `gen-verify-report.json` and `golden-harness-report.json`
  with zeros; I restored both to HEAD — they are not part of this change.
* `יש נקודה = hasCoords(...)` is still an inert text field: no shelf engine named `hasCoords` exists.
  Out of scope — left alone and reported rather than faked.
* CLAUDE.md / DECISIONS.md are owner-signed constitution documents, so I did not add the customary
  "G34" entry there; the directive is documented in code comments and here, awaiting owner approval.
