# ✅ Validator Report — E16 (peruk08 stage addition)

## Findings

**1.** CONFIRMED · P1 · `new/dart-gen-bs/gen_app_peruk08_home.dart:66` · `appStore.advance('app_peruk08_ent1', rid, 6);` — Stage index out of bounds (max 5 for 6 stages c22–c27). When user marks task done, record advances to invalid stage 6. **Fix:** Change `6` to `5`.

**2.** CONFIRMED · P1 · `new/dart-gen-bs/gen_app_peruk08_ent1.dart:90` · `onAdvance: () => appStore.advance('app_peruk08_ent1', rid, 6)` — Same out-of-bounds issue in card advance callback. Array `[gen_app_peruk08_ent1_c22...c27]` has 6 elements (indices 0–5); advance to 6 exceeds bounds. **Fix:** Change `6` to `5`.

## Evidence

**Bytewise:**
- `new/dart-data-bs/auto/gen_app_peruk08_ent1_content.dart:22–29` defines 6 stages: c22='התקבל'..c27='סגור' (indices 0–5)
- `new/dart-gen-bs/gen_app_peruk08_ent1.dart:90` stages array: `const [c22, c23, c24, c25, c26, c27]` (6 elements)
- `new/dart-gen-bs/gen_app_peruk08_ent1.dart:90` boundary check: `stageDone: appStore.stageOf(...) >= 5` confirms stage 5 is final
- `new/dart-gen-bs/gen_app_peruk08_home.dart:48` filter: `< 5` marks stages 0–4 open; stage 5 closed
- Git diff: `onAdvance: () => appStore.advance(..., 5)` → `6` (generator incremented past final stage)

**Semantic:**
With 6 stages indexed 0–5, advancing to stage 6 is out-of-bounds. Record will clamp on display (line 90: array access) but store corrupt state. Boundary checks (< 5, >= 5) expect final stage = 5.

## Auditor alignment

Both findings from `_audit-regression.md` verified. Compile audit found none (Flutter analyzer does not catch semantic out-of-bounds in generated code). Police report all-green (syntactic checks only).

---

**FIX-LIST:**
1. `new/dart-gen-bs/gen_app_peruk08_home.dart:66` change `advance(..., 6)` to `advance(..., 5)`
2. `new/dart-gen-bs/gen_app_peruk08_ent1.dart:90` change `advance(..., 6)` to `advance(..., 5)`
