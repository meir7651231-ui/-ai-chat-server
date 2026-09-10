# Validation Report — E13 (peruk12) Task

## Findings

**A1** · CONFIRMED · machtzev/generator/apps/peruk12.json:66 · `"type": "text"` should be `"type": "num"` for קילומטראז field to support numeric division in formula · Change line 66 from `"type": "text"` to `"type": "num"`

**A2** · CONFIRMED · new/dart-gen-bs/gen_app_peruk12_ent1.dart:162 · computed field מחיר לקמ rendered as editable ForgeDsField with onChanged callback instead of read-only display-only value · Remove from ForgeDsField and add as display-only or implement _calc() wrapper

**A3** · CONFIRMED · new/dart-gen-bs/gen_app_peruk12_ent1.dart:48 · save() stores `gen_app_peruk12_ent1_c17: _v[7] ?? ''` as user input instead of computing מחיר/קילומטראז formula · Replace `gen_app_peruk12_ent1_c17: _v[7] ?? ''` with computed value `gen_app_peruk12_ent1_c17: (num.tryParse(_v[3]??'0')??0) > 0 ? (num.tryParse(_v[3]??'0')??0)/(num.tryParse(_v[4]??'0')??0) : ''`

**A4** · CONFIRMED · git diff HEAD shows 30+ files changed outside peruk12 namespace (gen_app_ent1.dart rewritten with 4 fields instead of 6, gen_app_ent2/3/4 deleted, etc.) · Indicates systemic generator failure; entire build compromised and must be reverted

**B1** · FALSE-POSITIVE · Auditor questioned "8 שדות · 5 שלבים" label treating computed field incorrectly; verified: content file c1 is accurate — 8 fields (including computed), 5 stages (התקבל,שולם,בבדיקה,נמסר,סגור) · No fix needed

## Severity Ranking (CONFIRMED only)

1. **A4 — P0 CRITICAL REGRESSION** — 30+ files changed outside peruk12 scope; gen_app_ent1.dart/ent2/ent3 completely rewritten with different schemas; unrelated apps broken
2. **A1 — P1 WRONG RESULT** — קילומטראז type mismatch prevents numeric division; formula will fail at runtime
3. **A3 — P1 MISSING LOGIC** — Computed field saved as string instead of calculated; user sees blank or old value
4. **A2 — P1 DESIGN FAILURE** — Computed field editable instead of read-only; user input will overwrite calculation

## Summary

Task is **NOT DONE**. Three correctness failures in peruk12 generation (type, calc, display) plus critical state-leakage affecting the entire app registry. The build must be reverted; the generator has a systemic namespace-isolation bug.

FIX-LIST: A4, A1, A3, A2
