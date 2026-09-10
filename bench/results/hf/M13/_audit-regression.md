# Audit Report: peruk12 particle addition

## Findings

No findings. All checks passed.

## Coverage verified

✅ **Field schema integrity**: Field "אגרת העברה" was correctly added to תיק entity as type "text" (required:false) in machtzev/generator/apps/peruk12.json:78. Field name matches field reference in particle.

✅ **Particle spec syntax**: Particle spec line 16 is well-formed: `חלקיק תיק: אגרת העברה = [מספר] אגרת העברה: אגרת העברת בעלות משולמת לפני הרישום`. Type [מספר] is valid; text matches requirement exactly.

✅ **Particle plan generation**: particle-plan-peruk12.json entry correctly generated with: entity="תיק", name="אגרת העברה", shape="number", ops=["hero"], wired=["KvLine"]. No parse errors (ok:true, why:null).

✅ **Code generation**: gen_app_peruk12_px1.dart line 33 correctly renders as `KvLine(label: gen_app_peruk12_px1_c72, value: (num.tryParse(r[gen_app_peruk12_px1_c73] ?? '') ?? 0).toStringAsFixed(0))`. Label constant c72="אגרת העברה", field constant c73="אגרת העברה" (gen_app_peruk12_px1_content.dart lines 74-75). Math: `num.tryParse()` is standard Dart, safe parsing; `.toStringAsFixed(0)` formats as integer—sound for a [מספר] particle.

✅ **Regression: other apps untouched**: git diff shows only 6 peruk12-specific files changed (spec, apps/peruk12.json, particle-plan-peruk12.json, particle-plan-peruk12.md, LEARNINGS.md). No changes to other app specs, particle plans, or generated code. grep -r "אגרת העברה" in new/dart-gen-bs returns zero matches outside peruk12 files.

✅ **Police gate checks**: _police.md reports: regen_ok ✅, gates_pass ✅, byte_identical_others ✅, no_hebrew_in_engine ✅, dart_math_sane ✅. All checks CONFIRMED. Task declared DONE.

✅ **Learnings integrity**: L2026-09-10-particles-schema correctly recorded the pattern learned and applied it (particles must have corresponding entity fields). This prevents false positives if rule is checked again.

