# INSP — Task H07: Add תקרה מחייבת computed field

## Coverage Audit (per protocol section g)

**task-coverage:** בטוחה entity has תיק, פיקדון, ערבות בנקאית, שטר חוב, ערב, and computed fields. Added תקרה מחייבת computed field after תקרה לפי שליש. ✅

**money-numeric:** Field formula uses max() with two numeric fields (ceiling fields multiplied by 3 and by months/3). Both return numbers. max() returns number. ✅

**edge-crash:** max(0, 0) = 0 (both ceilings are 0 when rents are 0). max(X, Y) symmetric. Formula uses num.tryParse with fallback to 0. ✅

**state-leakage:** Computed field never stored, always calculated on render. No side effects in formula. ✅

**navigation:** Field appears in בטוחה entity cards and form. User navigates to בטוחה ent screen to view it. No new routes or screens added. ✅

**text-parity:** Field label תקרה מחייבת (binding ceiling) correctly named. No new strings introduced. ✅

## Gates & Checks

- regen_ok: ✅ (spec parsed, Dart code generated)
- byte_identical_others: ✅ (only generated outputs in new/ changed)
- gates_pass: ✅ (wiring, contract, datapurity, assembly all pass)
- no_hebrew_in_engine: ✅ (no Hebrew in .mjs files)
- dart_math_sane: ✅ (max() is from dart:math, imported correctly)
- calc: ✅ (1 constant, 1 computation)
- max: ✅ (function-based, not method-based)

## Breaking Changes

None. Existing computed fields (סך בטוחות, חורג מול 3 חודשים, חורג מול שליש) unchanged.

## VERDICT: GO

All coverage areas verified. No breaking changes. Machine report confirms DONE.
