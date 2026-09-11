# Audit Report — peruk25 task coverage

## Task verified
Add to תיק entity: numeric field סכום פיצויים + computed field פיצויים לשנה = סכום פיצויים * 12.

## Findings
None.

## Coverage verified

**Field definitions:**
- gen_app_peruk25_ent1_content.dart: c19='סכום פיצויים' (const line 21), c20='פיצויים לשנה' (const line 22) ✓
- machtzev/generator/apps/peruk25.json: סכום פיצויים type="num" (line 80), פיצויים לשנה type="text" (line 86) ✓
- machtzev/generator/specs-ds/peruk25.txt line 6: `סכום פיצויים, פיצויים לשנה = סכום פיצויים * 12` ✓

**Formula implementation (gen_app_peruk25_ent1.dart):**
- _save() line 49: `gen_app_peruk25_ent1_c20: ((num.tryParse(_v[6] ?? '') ?? 0) * 12).toStringAsFixed(2)` ✓
- UI display line 162: `_calc(gen_app_peruk25_ent1_c20, (num.tryParse(_v[6] ?? '') ?? 0) * 12)` ✓
- Formula recalculates from _v[6] (סכום פיצויים, index 6 in _labelsAll) each time ✓
- Output formatted to 2 decimal places ✓
- Computed field not editable (read-only _calc widget) ✓

**UI surfaces:**
- Input form: DsNumberField for סכום פיצויים (line 161, editable) + _calc display for פיצויים לשנה (line 162, read-only) ✓
- Record card: both fields in _card() labels array (line 90) ✓
- Data grid: both fields in columns and items map (line 173) ✓
- CSV export: both fields in header and value lists (lines 96, 98) ✓
- Kanban board: no changes needed (title from first field) ✓

**Machine checks (from _police.md):**
- regen_ok ✅, byte_identical_others ✅ (28 other peruks unchanged)
- compiles ✅ (0 analyzer errors), no_hebrew_in_engine ✅
- field ✅ 1× detected, calc ✅ consts=1 calc=1
- All machine claims verified CONFIRMED in police report ✓

**Edge cases confirmed:**
- Empty input: defaults to 0 via `num.tryParse(...) ?? 0` ✓
- Invalid input: same null-safe default ✓
- Edit path: loads سכום פיצויים from _v[6], recalculates formula on display ✓

**No breaking changes:** All other 27 peruk apps remain byte-identical per police report.

**Conclusion:** Task fully implemented. All 8 surfaces (spec, entity, form, card, grid, CSV, data, display) contain the two fields with correct formula. Formula is consistent across save and display. Read-only computed field properly implemented. Compilation clean.
