# Auditor · Column order regression (panuy table)

new/dart-data-bs/auto/gen_app_panuy_px1_content.dart:3–6 · Table columns displayed in wrong order: spec requires שם, זמין, **מרחק בקמ**, **מחיר לשעה** but generated code has שם, זמין, **מחיר לשעה**, **מרחק בקמ** (c3 and c4 swapped) · P1 (task not done / wrong result) · Swap c3='מרחק בקמ' and c4='מחיר לשעה' (currently reversed); data extraction at lines 9–10 must also swap to extract fields in correct order

## Coverage
**Checked:**
- Spec requirement (machtzev/generator/specs-ds/panuy.txt:6): `חלקיק אדם: [טבלה] שם, זמין, מרחק בקמ, מחיר לשעה` ✓
- Generated column headers (gen_app_panuy_px1_content.dart c1–c4): column order is wrong ✓
- Generated column data extraction (gen_app_panuy_px1.dart line 34): ForgeDataGrid has c1,c2,c3,c4 in order c5,c6,c7,c8 which map to wrong fields ✓
- State leakage: police report confirms byte_identical_others ✅ (other apps unaffected) ✓
- Orphan files: police report confirms no_orphans ✅ ✓
- Comment vs code mismatch (gen_app_panuy_px1.dart line 2): comment correctly states spec order שם, זמין, מרחק בקמ, מחיר לשעה but code does not implement it ✓

**Not checked:** Flutter/Dart compilation (Dart runtime not available; police.mjs reports compiles ✅ but did not verify column order logic independently)
