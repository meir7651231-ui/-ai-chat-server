# 🔍 Audit Report — Regression & State-Leakage Lens

## Findings

### new/dart-data-bs/auto/gen_app_peruk02_ent1_content.dart · BalaganField definition · P2 (minor) · Change field type to num
The particle "ממוצע פיקדון" is defined as type 'text' (line: `BalaganField('ממוצע פיקדון', 'text', false, [])`), but it represents an average of numeric values. Should be `BalaganField('ממוצע פיקדון', 'num', false, [])` for semantic correctness.

### new/dart-gen-bs/gen_app_peruk02_ent1.dart · Line 168 · P1 (wrong result) · Particle should be read-only/computed, not editable
The field is rendered as an editable `DsField` in the form (line 168: `ForgeDsField(...control: DsField(label: gen_app_peruk02_ent1_c21, hint: '', value: _v[12] ?? '', onChanged: (v) => setState(() => _v[12] = v), bare: true))`), but the task specifies it should "show the average" — a computed/read-only value. Users can currently edit it freely, which defeats the purpose.

## Verified Correct

✅ **Board metric**: The average computation on the board screen (gen_app_peruk02_scr3.dart line 22) correctly uses `appStore.avg('app_peruk02_ent1', gen_app_peruk02_scr3_c14)` with field reference 'סכום הפיקדון' (type: num). Formula scope and calculation are sound.

✅ **No state-leakage**: Only `machtzev/generator/specs-ds/peruk02.txt` changed; no modifications to other app specs or shared infrastructure.

✅ **Compilation**: All generated Dart files compile without errors (per police report: regen_ok ✅, gates_pass ✅, dart_math_sane ✅).

✅ **Field availability**: 'סכום הפיקדון' is correctly type 'num' and available for aggregation.

✅ **Particle label**: "ממוצע פיקדון" label appears consistently across all generated forms and content files (ent1, px1, root, balagan moments).
