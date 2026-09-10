# ✅ Validation Report — H13 (panuy)

## Findings

**audit-001 · CONFIRMED · new/dart-data-bs/auto/gen_app_panuy_px1_content.dart:5-6, 9-10 · Columns c3↔c4 (and data c7↔c8) swapped, violates spec order "שם, זמין, מרחק בקמ, מחיר לשעה"**

Three independent auditors (compile, coverage, regression) all report the same defect: the generated column headers and data field names have positions 3 and 4 swapped. The spec (panuy.txt:6) explicitly requires `[טבלה] שם, זמין, מרחק בקמ, מחיר לשעה` "in that order". Actual bytes:
- Line 5: `const String gen_app_panuy_px1_c3 = 'מחיר לשעה';` (position 3, should be 'מרחק בקמ' in position 4)
- Line 6: `const String gen_app_panuy_px1_c4 = 'מרחק בקמ';` (position 4, should be 'מחיר לשעה' in position 3)
- Lines 9-10 mirror the same swap in data field c7↔c8.

Confirmed: Task requirement "in that order" is not met.

**Fix:** Swap the assigned string values:
- c3 = 'מרחק בקמ' (was 'מחיר לשעה')
- c4 = 'מחיר לשעה' (was 'מרחק בקמ')
- c7 = 'מרחק בקמ' (was 'מחיר לשעה')
- c8 = 'מחיר לשעה' (was 'מרחק בקמ')

---

## Machine Report Verification
Police report confirms all generic gates pass:
- regen_ok ✅ | byte_identical_others ✅ | gates_pass ✅ | no_hebrew_in_engine ✅ | dart_math_sane ✅ | compiles ✅
- No automatic P0 findings triggered by gate failures.

---

## Final Assessment
**FIX-LIST:**
- audit-001: Swap c3↔c4 and c7↔c8 string values in gen_app_panuy_px1_content.dart to restore spec-required column order.
