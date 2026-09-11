# Audit: panuy table column order

## Findings

new/dart-data-bs/auto/gen_app_panuy_px1_content.dart:3-6 · column order incorrect · **P1 task not done** · swap c3/c4 to match spec order

**Defect:** Spec line 6 specifies table columns in order: `[טבלה] שם, זמין, מרחק בקמ, מחיר לשעה`  
Generated constants show: c1='שם', c2='זמין', c3='מחיר לשעה', c4='מרחק בקמ'  
Expected order: שם, זמין, **מרחק בקמ**, **מחיר לשעה**  
Actual order: שם, זמין, **מחיר לשעה**, **מרחק בקמ**  

The table will render columns 3 and 4 swapped. Task explicitly required columns "in that order."

---

## Coverage

**Checked:**
- Specification format (machtzev/generator/specs-ds/panuy.txt line 6) ✓
- Generated constants (new/dart-data-bs/auto/gen_app_panuy_px1_content.dart) ✓
- ForgeDataGrid column binding (new/dart-gen-bs/gen_app_panuy_px1.dart line 34) ✓
- LEARNINGS.md rule for `[טבלה]` syntax (states: "הרשימה מציינת עמודות וסדרן") ✓
- Machine report (shows four_columns check, but only verifies count=4, not order) ✓

**Could not verify:**
- Runtime rendering (no Flutter/Dart runtime available)
- Visual output (cannot execute Flutter build/run)
- Whether other apps were affected (only traced panuy; byte-identical check passed per _police.md)
