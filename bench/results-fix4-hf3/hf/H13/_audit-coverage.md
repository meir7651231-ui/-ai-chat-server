# Audit Report: panuy table column order

## Findings

new/dart-data-bs/auto/gen_app_panuy_px1_content.dart:5-6 · Table columns in wrong order: spec requires שם, זמין, **מרחק בקמ**, **מחיר לשעה** but generated shows שם, זמין, **מחיר לשעה**, **מרחק בקמ** (c3 and c4 swapped) · P1 wrong-result · Swap c3 and c4 constants; regenerate px1.

## Coverage

**Verified Correct:**
- Spec file syntax: machtzev/generator/specs-ds/panuy.txt line 6 correctly declares `[טבלה] שם, זמין, מרחק בקמ, מחיר לשעה`
- Column restriction feature: SPEC-LANG.md §16 already supported `[טבלה] col1, col2, ...` syntax; builder correctly used it
- Four-column constraint: ForgeDataGrid receives exactly 4 column headers and 4 data fields per row (gen_app_panuy_px1.dart:34)
- No unintended side effects: byte_identical_others confirmed by police; only panuy files generated/modified
- Other apps unaffected: gen_app_sechirut_ent2.dart is the only other touched file (not broken by this change per police)
- Compilation: zero errors reported by police (compiles ✅)

**Cannot Verify:**
- Runtime display order in live Flutter UI (no device/emulator available); audit infers column order only from Dart source constants and ForgeDataGrid call signature
- Police report logic for "four_columns" check (source not found in machtzev/police.mjs)

**Defect Context:**
The generated content constants (c3='מחיר לשעה', c4='מרחק בקמ') do not match the spec's declared order (שם, זמין, **מרחק בקמ**, **מחיר לשעה**). This manifests in the table's column display because ForgeDataGrid(columns: [c1, c2, c3, c4], items: [[...c5...], [...c6...], [...c7...], [...c8...]]) renders columns in the order c1→c2→c3→c4, which is: שם, זמין, מחיר לשעה, מרחק בקמ—not the required order.

