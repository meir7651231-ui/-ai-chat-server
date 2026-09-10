# Audit: sechirut table sort feature · regression + task verification

## Findings
None. Implementation is sound.

## Details

**Task completion:** ✅ DONE
- Feature: Table particle (תיק cases) sorted by שכירות (rent), highest first
- Spec change: `machtzev/generator/specs-ds/sechirut.txt` line 22: `[טבלה]` → `[טבלה] שכירות:desc`
- Generated code: `gen_app_sechirut_px1.dart` line 34 contains correct sort logic

**Sort implementation verified:**
- Descending order: `(a, b) => b.compareTo(a)` ✓ (higher values first)
- Field reference: `gen_app_sechirut_px1_c19` = `'שכירות'` (rent, numeric) ✓
- Null safety: `num.tryParse(x ?? '0') ?? 0` handles missing/non-numeric safely ✓
- Dart code: `.toList()..sort(compareFn)` correctly sorts before rendering table rows ✓

**Regression check:**
- Byte-identical-others gate: ✅ (per police report)
- Other apps unaffected: 24 other app specs use plain `[טבלה]` without sort, generated px1.dart files show no sort logic
- Spec integrity: Only sechirut.txt modified; no cross-app contamination

**Edge cases verified:**
- Regex parsing: `particles.mjs` line 122–129 correctly extracts field name and direction via `/^([^:]+)(?::(\w+))?$/`
- Field validation: `שכירות` is confirmed as base (non-computed) numeric field in תיק entity schema
- Substring matching: No over-triggering; only `[טבלה] <field>:<dir>` pattern triggers sort (plain `[טבלה]` does not)

## Coverage
- ✅ Task-specific code path (table with sort spec) in particles.mjs and generated sechirut app
- ✅ Regression check across 24 other apps (no byte changes in their generated files)
- ✅ Dart null-safety and numeric comparison logic (num.tryParse, compareTo, cascade)
- ✅ Spec syntax and field name resolution
- ⚠️ Cannot verify: Flutter app runs, UI rendering, user interaction (Dart/Flutter not installed; auditor is read-only)
