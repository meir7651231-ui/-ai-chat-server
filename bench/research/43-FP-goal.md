# 43-FP · goal + decomposition (written BEFORE code · 2026-09-09)
GOAL: the generated «פנויים לידי עכשיו» app lists people nearest-first and shows a real km distance = sqrt(מרחק בריבוע) — driven by the spec, produced by the engine, zero hand-edits to new/dart-gen-bs.

Decomposition (≤10):
1. search-record for sqrt/distance and for sort/order (choose or --none naming strong candidates).
2. render-ds.compileFormula: (a) unary math fn `sqrt(...)` ⇒ `math.sqrt(...)` + conditional `import 'dart:math' as math;` (L41) ; (b) formula-referencing-formula ⇒ inline the referenced computed expression (so `sqrt(מרחק בריבוע)` is live in the form and stored on save).
3. spec grammar: section marker `| מיון: <field> [יורד]` (spec-lang.data.json + entity.mjs ⇒ {field, desc}).
4. render-ds.renderEntity: when sort given ⇒ list+table rows are a sorted COPY (never sort the store's list); numeric compare for num/formula fields, empty ⇒ last; else string compare.
5. particles.particleWidgets: same sorted copy for `[טבלה]` and per-record rows when entity.sort is set (app-ds passes sort in pents).
6. spec panuy.txt: entity line gets `| מיון: מרחק בקמ`; particle `מרחק בריבוע` ⇒ `מרחק בקמ`.
7. regen panuy only (app-ds -f … --name panuy --skin); run particles --gate; byte-verify output (grep math.sqrt · ..sort( · no DsField for מרחק בקמ).
8. gate `specderived` (new threshold, L80): for every specs-ds spec, declared sort/sqrt must be present in the generated entity screen; unknown formula fns reported; register in gates.tsv + police.mjs + selftest fixture pair (poison⇒1, clean⇒0).
9. runtime proof: JS evaluation of the emitted Dart expressions on sample records (sqrt value, ascending order); Dart not installed ⇒ Dart-runtime labeled NOT-PROVEN.
10. LEARNINGS M4 entry · goal-card (placeholder PNG, labeled) · 9-lens audit · validator pass · report.
