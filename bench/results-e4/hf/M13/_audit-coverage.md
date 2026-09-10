# 🔴 Task Audit — peruk12 Particle Defect

## Findings

**machtzev/generator/specs-ds/peruk12.txt:16 · [מספר] particle references non-existent field · P0 task-incomplete · Remove or replace particle; [מספר] requires a valid entity field name, not descriptive text**

The particle line added:
```
חלקיק תיק: אגרת העברה = [מספר] אגרת העברת בעלות משולמת לפני הרישום
```

This particle violates [מספר] syntax. Per SPEC-LANG.md line 20, [מספר] format is `[מספר] <field-name>: <description>`, where `<field-name>` must be a defined field in the entity schema. The תיק entity in peruk12 (line 7) defines only: לקוח*, טלפון, קישור מודעה, מחיר, מה המוכר אמר, האם נסעת. The text "אגרת העברת בעלות משולמת לפני הרישום" is not in this field list.

**Result:** machtzev/generator/particle-plan-peruk12.json line 168 correctly shows `"ok": false, "why": "מספר: שדה לא בסכמה: אגרת העברת בעלות משולמת לפני הרישום"` — generator rejected it as unresolvable.

**Evidence:**
- Particle-plan mark: 0 live particles instead of expected 7 (6 valid + 1 new)
- gen_app_peruk12_px1_content.dart line 71: shows "6 חלקיקים חיים · 0 לא-פתורים" (the new particle was excluded)
- Text "אגרת העברת בעלות משולמת לפני הרישום" absent from all generated files (grep confirms 0 matches in new/dart-gen-bs/ and new/dart-data-bs/auto/)
- Police report confirms: `text ❌ 0×`

## Coverage Verified

✅ **Spec file change:** peruk12.txt line 16 was edited as specified.
✅ **Code generation:** Generator ran, produced output, rejected invalid particle correctly.
✅ **Compilation:** flutter analyze passed (0 errors).
✅ **No other specs broken:** byte_identical_others check passed.
✅ **Particle plan:** Particle-plan files accurately reflect the unresolved state (`ok: false`).

❌ **Case screen generated:** Particle never wired; case display (gen_app_peruk12_root_content.dart, gen_app_peruk12_px1_content.dart) contains no "אגרת העברה" text.
❌ **Text in output:** Required text absent from all Dart output files.
❌ **Task completion:** Particle not live in any generated surface (particle table shows 6/6 valid, 1/1 failed).

## Root Cause

Task specification conflict: [מספר] particle type is designed to display a **calculated or stored numeric field value with optional description text**, not to display arbitrary descriptive text alone. The task requests descriptive-only text, which is not a valid use of [מספר]. A different particle type (e.g., `[תוכן קבוצה]` wrapping descriptive content) would be required for this purpose.
