# 🔍 VALIDATOR report — panuy table columns

## Findings

### P0 · CONFIRMED · Column order swapped

**Finding ID:** COL-ORDER-SWAP

**Verdict:** CONFIRMED

**Evidence:**
- Spec: `machtzev/generator/specs-ds/panuy.txt:6` — `[טבלה] שם, זמין, מרחק בקמ, מחיר לשעה`
- Rendered table (`new/dart-gen-bs/gen_app_panuy_px1.dart:34`): columns= `[gen_app_panuy_px1_c1, gen_app_panuy_px1_c2, gen_app_panuy_px1_c3, gen_app_panuy_px1_c4]`
- Column headers (`new/dart-data-bs/auto/gen_app_panuy_px1_content.dart:3-6`):
  - c1 = 'שם' ✓
  - c2 = 'זמין' ✓
  - c3 = 'מחיר לשעה' ✗ (should be 'מרחק בקמ')
  - c4 = 'מרחק בקמ' ✗ (should be 'מחיר לשעה')
- Data fields (`new/dart-data-bs/auto/gen_app_panuy_px1_content.dart:7-8`):
  - c7 = 'מחיר לשעה' (column 3 data, wrong field)
  - c8 = 'מרחק בקמ' (column 4 data, wrong field)

**Issue:** The render-ds generation placed 'מחיר לשעה' before 'מרחק בקמ' instead of the spec order. The header row and data columns both reflect this error.

**Fix:** Reorder particle definition output: swap c3↔c4 and c7↔c8 in content file, or fix the generator to preserve spec order when rendering DS content.

---

## Machine checks vs. findings

- `four_columns` passed (verified count=4), but did NOT verify order
- `compiles` passed (Dart syntax is valid even with wrong column order)
- `regen_ok` passed (generator completed without errors)

The police report `four_columns` check passed because it only counted columns, not validated their sequence. The builder's task required columns "in that order" — this is violated.

---

## VERDICT SUMMARY

**FIX-LIST:**
1. P0 · CONFIRMED · Column order swapped in table · new/dart-data-bs/auto/gen_app_panuy_px1_content.dart:3-6 and c7-c8 — swap c3↔c4 (headers) and c7↔c8 (data fields) to match spec order שם, זמין, מרחק בקמ, מחיר לשעה
