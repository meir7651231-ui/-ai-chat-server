# ✅ Validator Report — H11 sechirut

## Machine Report Alignment
All generic checks in `_police.md` **passed** (regen_ok · byte_identical_others · gates_pass · compiles · no_hebrew_in_engine · dart_math_sane). No automatic P0 findings from failed machine gates.

---

## Auditor Findings Verdict

| Finding | Auditor | Verdict | Evidence | Fix |
|---------|---------|---------|----------|-----|
| coverage-01 | _audit-coverage.md | **CONFIRMED P1** | `new/dart-gen-bs/gen_app_sechirut_ent1.dart:54,208` — תקרה נמוכה = min(_v[10], _v[11]) but _v[10] and _v[11] remain empty when creating new record; only populated on load via _edit(). User enters שכירות+חודשים, form displays תקרה נמוכה as 0, save stores 0 instead of actual min. | Calculate c29 directly from inputs: `(min((num.tryParse(_v[3] ?? '') ?? 0) * 3, (num.tryParse(_v[3] ?? '') ?? 0) * (num.tryParse(_v[4] ?? '') ?? 0) / 3)).toStringAsFixed(2)` — matching pattern of lines 205-207 which derive from inputs, not from unpopulated _v slots. |
| compile-01 | _audit-compile.md | **CONFIRMED P1** | `new/dart-gen-bs/gen_app_sechirut_ent1.dart:54,208` — same logic error; two sites where c29 references stale indices instead of deriving from source fields c12/c13. | Same as above. Apply to both _save() line 54 and _calc() line 208. |
| regression-01 | _audit-regression.md:VERIFIED | **FALSE-POSITIVE** | Report claims "None" findings and "task completed correctly"; verifies indices 10,11 used correctly and type-safe. However, misses that _v[10]/_v[11] are only populated via _edit() path (loading existing record); unpopulated for new-record path (form input → _save()). Static analysis of syntax is correct; runtime behavior when branch is taken (new record) is wrong. | _audit-regression did not test new-record creation flow, only verified index mapping exists and compiles. The bug is real. |

---

## Finding Summary

**Total auditor findings: 3**
- CONFIRMED: 2 (coverage-01, compile-01 same root cause)
- FALSE-POSITIVE: 1 (regression-01 — misses the bug by not testing new-record path)

**Machine report: clean** (but cannot test app behavior, only syntax/structure)

---

## FIX-LIST:
1. coverage-01 · CONFIRMED P1 · `new/dart-gen-bs/gen_app_sechirut_ent1.dart:54` calculated field c29 `(min( (num.tryParse(_v[10] ?? '') ?? 0) ,  (num.tryParse(_v[11] ?? '') ?? 0) ))` uses empty computed-field slots; must compute from inputs: `(min((num.tryParse(_v[3] ?? '') ?? 0) * 3, (num.tryParse(_v[3] ?? '') ?? 0) * (num.tryParse(_v[4] ?? '') ?? 0) / 3))` · extract inline in map like c26/c27/c28 above it
2. compile-01 · CONFIRMED P1 · `new/dart-gen-bs/gen_app_sechirut_ent1.dart:208` _calc display `min((num.tryParse(_v[10] ?? '') ?? 0), ...)` same error; fix identically
