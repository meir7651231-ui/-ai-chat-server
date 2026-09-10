# Task Audit: Peruk12 — אגרת העברה Particle

**Task**: In machtzev/generator/specs-ds/peruk12.txt add to the case screen a 'your number' particle ([מספר]) named אגרת העברה whose text reads: אגרת העברת בעלות משולמת לפני הרישום. Don't break anything.

## Findings
No findings.

## Coverage Report

**Verified Correct:**

1. **Spec file** — machtzev/generator/specs-ds/peruk12.txt:7,16 ✓
   - Entity schema updated: added field `אגרת העברה` to ישות תיק 
   - Particle definition correct: `חלקיק תיק: אגרת העברה = [מספר] אגרת העברה: אגרת העברת בעלות משולמת לפני הרישום`

2. **Generated entity form** (gen_app_peruk12_ent1.dart, gen_app_peruk12_ent1_content.dart) ✓
   - Field included as 7th field (c16) in _labelsAll list
   - Label: `const String gen_app_peruk12_ent1_c16 = 'אגרת העברה'`
   - Form correctly saves/loads field in map serialization (line 48)

3. **Generated particle screen** (gen_app_peruk12_px1.dart, gen_app_peruk12_px1_content.dart) ✓
   - Particle rendered at line 33 as KvLine widget with:
     - Label: `gen_app_peruk12_px1_c72` = 'אגרת העברה'
     - Field: `gen_app_peruk12_px1_c73` = 'אגרת העברה'
     - Description: `gen_app_peruk12_px1_c75` = 'אגרת העברת בעלות משולמת לפני הרישום' (exact match to spec)
   - Value parsing: `num.tryParse(r[...] ?? '') ?? 0).toStringAsFixed(0)` — correct Dart numeric handling
   - Subtitle: '7 חלקיקים חיים · 0 לא-פתורים' confirms all 7 particles present and no unresolved

4. **Entity schema update** (gen_app_peruk12_ent1.dart:29) ✓
   - All 7 fields in order: לקוח, טלפון, קישור מודעה, מחיר, מה המוכר אמר, האם נסעת, אגרת העברה

5. **Particle plan** (machtzev/generator/particle-plan-peruk12.md:11) ✓
   - Particle mapped correctly: `אגרת העברה | תיק | number | hero⇒KpiTile (KpiTile/ProgressRing) | KvLine`

6. **App configuration** (machtzev/generator/apps/peruk12.json) ✓
   - Field added with type 'text', not required

7. **Police report** (_police.md) ✓
   - All gates pass: regen_ok, gates_pass, byte_identical_others, no_hebrew_in_engine, dart_math_sane
   - Machine verdict: DONE

8. **No regressions** ✓
   - Only peruk12-related files modified (spec, apps/json, generated Dart, docs)
   - All other files byte-identical
   - One learning entry added documenting the field-particle correspondence requirement

---

**Task coverage:** All surfaces covered. Particle displays on case screen (px1) with correct label, field reference, and description text. Entity form (ent1) includes editable field. No breaking changes. Machine report confirms all gates pass.
