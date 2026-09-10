# 43-FP — panuy: nearest-first list + real km distance (2026-09-09)
GOAL: generated «פנויים לידי עכשיו» lists people nearest-first and shows km = sqrt(מרחק בריבוע), engine-driven, zero hand-edits to new/dart-gen-bs. Decomposition (10 steps, written before code): scratchpad/research/43-FP-goal.md.

## Root cause (bytes)
- `render-ds.compileFormula` (blob a40c409…:201-209) rejected any non-field token ⇒ `מרחק בקמ = sqrt(מרחק בריבוע)` returned null ⇒ emitted as a plain input `ForgeDsField(_v[11])`; the card showed the squared value. No sort concept existed in spec-lang/entity/render-ds; lists were `appStore.records()` insertion order.
- Oracle search (machtzev/audit/search/2026-09-09-sqrt-…c848352b.json, --none): shelf `new/dart/sqrt.dart` is 5-iteration Newton — measured relErr 17% @2500, 685% @250000, NaN @0 ⇒ unfit for real km; `dart:math` (language standard, LAW atoms rule) chosen. Sort search (…-sort-…cb0a61b1.json, --none naming all 20 strong candidates): ordering a record list is wiring (THE-WAY step 4), not an atom.

## What changed (engine + data + spec — never generated output)
- `generator/spec-lang.data.json`: `sectionMarkers`+`מיון`, `markSort:[מיון]`, `sortDesc:[יורד]`, `mathFns:{sqrt:"math.sqrt"}` (grammar as data, §19-ד).
- `generator/entity.mjs`: parses `| מיון: <שדה> [יורד]` ⇒ `sort:{field,desc}` (field must exist in schema; typo ⇒ null ⇒ gate catches).
- `generator/render-ds.mjs`: compileFormula(formula, labels, computed) — math tokens marked `@fn:x@` before residue check; formula referencing an earlier computed field inlines its expression (live in form + stored `toStringAsFixed(2)`); conditional first-line `import 'dart:math' as math;`; renderEntity `sort` ⇒ list/table/CSV read a sorted COPY.
- `generator/sort-recs.mjs` (new, indexed): `sortedRecsExpr` ⇒ `(<recs>.toList()..sort(cmp))`; numeric/formula ⇒ empty last (∞/−∞), else compareTo. Never sorts the store list.
- `generator/particles.mjs`: `recsEnum` for table/rows/partition/diff/raw + report text; aggregates stay on the source. `generator/app-ds.mjs`: passes `sort` to renderEntity and particle entities.
- `specs-ds/panuy.txt`: entity line `… | מיון: מרחק בקמ`; particle `מרחק בריבוע` ⇒ `מרחק בקמ`.
- Gate (L80): `generator/spec-derived.mjs` = `specderived` (gates.tsv row, police.mjs wiring, INDEX.md rows, selftest fixture `selftest-fixtures/specderived.mjs`: 2 poison ⇒1, clean ⇒0). Lesson L107 (M4: GATE/ref/ANTIPATTERN/RULE) + `selftest-fixtures/learn/L107.txt`. pins re-signed (`pins-check --write`). Goal-cards: `audit/goals/gen_app_panuy_ent1.json`, `gen_app_panuy_px1.json` (picture = node-generated 480×320 PLACEHOLDER, labeled in the PNG and in accept).

## Proof (commands run · output)
- `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/panuy.txt --name panuy --skin` ⇒ exit 0, 12/12 particles wired.
- ent1.dart bytes: `import 'dart:math' as math;` line 2 · `math.sqrt(` ×2 (form `_calc` + saved map) · `DsField(label: …_c25` = 0 · `final all = (…toList()..sort((a, b) => (num.tryParse(a[…_c25]…` = 1 · CSV loop sorted = 1. px1.dart: 12 enumerations `..sort` by `_c0='מרחק בקמ'`, 1 count aggregate unsorted; header `מרחק בקמ ⇒ raw ⇒ [fact] ⇒ DsChip`.
- Runtime execution (JS eval of the EMITTED expressions, L89): 3 people ⇒ km {p1:11.1, p2:0, p3:18.6} exact ±1e-9; comparator order p2<p1<p3<empty ✓.
- `spec-derived.mjs --gate` ⇒ ✓ 41 entities · 1 sort · 1 math formula all in output · ℹ️ 2 other fn-formulas (hasCoords, boqLineAmount). `police-selftest` ⇒ specderived 3/3 ✅, selftest-coverage 6 ≥ floor 5.
- Regression: regenerated all 31 other specs ⇒ `git status` on tracked outputs outside panuy = 0 changes. Gates green: particles (448/32), datapurity, puredata, genratchet, compose-determinism, cover, balagan-look 35/36, balagan-one, peruk 28/28, sentence 16/16, autoskin, index-complete, pins 136/136, `interpret()` unit: sort parsed / desc / typo⇒null.
- Engine purity: 0 Hebrew words in added engine code (only regex range bounds `[֐-׿]`). No git commit/push (HEAD 578dbf2 unchanged).

## 9-lens audit
cross-role: sort wraps the RLS-scoped read (scope before sort) — sorting by a role-hidden field would still order rows (noted, panuy has no roles). money-numeric: km stored 2 decimals (10 m); sum of squares ⇒ no NaN; empty ⇒ last; Dart NaN compareTo is total ⇒ no crash. edge-crash: empty list ⇒ DsEmpty before sort; `.toList()` copies `const []` safely. state-leakage: store never mutated (`..sort` only on copies — verified); stale `_v[11]` on edit is ignored (map recomputes). navigation: ent1 list/table/CSV + px1 table/rows sorted; over1 overview (`.first`, `.take(12)`) and rec1 (single record) unchanged — not the list. performance: O(n log n) per rebuild; px1 sorts per row-particle (12×) — fine for a local store, noted. accessibility-rtl: no new strings; numbers via content consts as elsewhere. async-race: synchronous ChangeNotifier, sort inside builder. text-parity: CSV + report text use the same sorted copy; card/table/chip all read the same stored km.

## Validator split
CONFIRMED: everything under Proof (each with command+output above). NOT-PROVEN: Dart/Flutter compile + on-device render (Dart not installed; goal-card picture is a labeled placeholder); over1/rec1 goal-conformance untouched. FALSE-POSITIVE removed: my first grep "math.sqrt( = 0" — emitter spacing bug, fixed (`math.sqrt(` now literal) and re-proven.
Pre-existing, not mine: learn-check 9 violations (missing blobs in shallow clone; identical count before/after), freeref selftest exit 2 and deeppurity yellow (missing `typescript`), `hasCoords(…)` still degrades to an input (reported ℹ️ by the new gate, out of scope). tighten-types skipped as instructed. At commit time pins/LEARNINGS edits need the `Allow: pins-write` trailer per PROTOCOL.
