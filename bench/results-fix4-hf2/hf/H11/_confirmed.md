# 🔍 Validator Report: sechirut min() Field (H11)

## Summary
**2 CONFIRMED P1 findings** — identical semantic bug in save and display paths.
**0 false-positives**, **0 adjustments needed**.

All machine generic checks passed (regen_ok, byte_identical_others, gates_pass, no_hebrew_in_engine, dart_math_sane, compiles). However, these structural checks do not catch semantic/logic errors. The auditors correctly identified a real bug that breaks the core create-new-record flow.

---

## Findings

**P1-001** · CONFIRMED · `new/dart-gen-bs/gen_app_sechirut_ent1.dart:54` — Save path uses wrong field indices
- **Evidence:** Line 54 saves c29 as `min( (num.tryParse(_v[10] ?? '') ?? 0) , (num.tryParse(_v[11] ?? '') ?? 0) )`. Indices _v[10] and _v[11] reference stored DB values loaded only on edit (line 66). When creating a new record, these are never populated → both parse to 0 → result is always `0.00`.
- **Correct formula:** `min( ((num.tryParse(_v[3] ?? '') ?? 0) * 3) , ((num.tryParse(_v[3] ?? '') ?? 0) * (num.tryParse(_v[4] ?? '') ?? 0) / 3) )` — calculates directly from source fields _v[3] (שכירות) and _v[4] (חודשים), matching the pattern used for c27/c28 on lines 206-207.

**P1-002** · CONFIRMED · `new/dart-gen-bs/gen_app_sechirut_ent1.dart:208` — Display path uses wrong field indices
- **Evidence:** Line 208 displays c29 via `_calc(..., min( (num.tryParse(_v[10] ?? '') ?? 0) , (num.tryParse(_v[11] ?? '') ?? 0) ))`. Same bug: on new record, _v[10] and _v[11] are empty, so min(0,0)=0 is shown to user instead of live calculation.
- **Correct formula:** Same as P1-001 — direct calculation from _v[3] and _v[4].

---

## Verification

✅ **Checked:**
- Field mapping: Line 66 _edit() confirms _v indices. Only indices 0–8 map user inputs; 9–12 map DB-loaded computed fields.
- Form input fields: Lines 198–199 populate _v[3] and _v[4] from user. Lines 205–207 calculate c26/c27/c28 from these; pattern is unambiguous.
- dart:math import: Line 11 ✅. min() is top-level function, syntax is correct.
- Other apps: _police.md confirms byte_identical_others ✅ (sechirut-specific bug, no regression elsewhere).
- Compilation: Code compiles (Dart analyzer accepts the logic even though it's wrong semantically).

❌ **Could not check:**
- Runtime behavior (no Dart/Flutter runtime; reasoning from language/framework semantics only).
- Existing test coverage that should catch this (no test files visible).

---

## Why Machine Checks Passed

All generic checks (`_police.md`) verify **structural validity**, not **semantic correctness**:
- `regen_ok`: Generator produces output ✅ (doesn't validate logic)
- `compiles`: Analyzer accepts syntax ✅ (doesn't trace data flow)
- `dart_math_sane`: min() imported and called correctly ✅ (doesn't verify arguments are right)

This is expected behavior for machine checks. The auditors' manual review caught what static structural checks cannot.

---

## Severity Justification

**P1 (wrong result):** New record creation (the core create flow) always saves `תקרה נמוכה = 0.00` regardless of שכירות/חודשים input. Task requirement is broken. Display also shows incorrect hardcoded values instead of live calculations.

---

## FIX-LIST:

1. **P1-001:** `new/dart-gen-bs/gen_app_sechirut_ent1.dart:54` — Replace `min( (num.tryParse(_v[10] ?? '') ?? 0) , (num.tryParse(_v[11] ?? '') ?? 0) )` with `min( ((num.tryParse(_v[3] ?? '') ?? 0) * 3) , ((num.tryParse(_v[3] ?? '') ?? 0) * (num.tryParse(_v[4] ?? '') ?? 0) / 3) )`

2. **P1-002:** `new/dart-gen-bs/gen_app_sechirut_ent1.dart:208` — Replace `min( (num.tryParse(_v[10] ?? '') ?? 0) , (num.tryParse(_v[11] ?? '') ?? 0) )` with `min( ((num.tryParse(_v[3] ?? '') ?? 0) * 3) , ((num.tryParse(_v[3] ?? '') ?? 0) * (num.tryParse(_v[4] ?? '') ?? 0) / 3) )`
