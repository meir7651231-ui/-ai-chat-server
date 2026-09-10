# Audit: peruk02 average-deposit particle

## Findings

**new/dart-gen-bs/gen_app_peruk02_scr3.dart:22** · board metric label "סכום הפיקדון" used for average-of-סכום metric (confusing but not compile-break) · P2 label-inconsistency · should be "ממוצע סכום הפיקדון" or reuse gen_app_peruk02_scr3_c12="ממוצע · תיק"

**machtzev/generator/apps/peruk02.json** · new field "ממוצע פיקדון" declared as type "text" not "num"; semantically should be numeric since it represents an average · P1 type-mismatch · change "type": "text" to "type": "num" or add computed: true flag

## Coverage

✓ Null-safety: appStore.avg(entity, field) returns double (never null; returns 0 for empty set). Line 22 chains .toStringAsFixed(1) safely.
✓ Dart methods: no calls to non-existent num methods (.sqrt, .min, .max). All calls valid (avg, count, toDouble, toStringAsFixed, clamp, fold).
✓ Nested parens/syntax: balanced on lines 22–23; field references (gen_app_peruk02_scr3_c14) are constants mapping to 'סכום הפיקדון' (entity field exists on ent1).
✓ Empty data: avg(entity, field) returns 0.0 when count==0; board displays "0.0" (safe).
✓ Compile gates: police report passes dart_math_sane, byte_identical_others, gates_pass.

✗ **Task completeness risk**: Field added to entity as editable text field, not as display-only computed metric. Spec says "ממוצע פיקדון = ממוצע(סכום הפיקדון)" (formula syntax suggests computed); generated code shows user-editable field instead. If intent was read-only particle showing all-cases average on each case, that is NOT implemented.

