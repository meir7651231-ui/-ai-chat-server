# Audit: M08 (peruk08) · State-Leakage & Regression

## Findings

*No defects found.*

## Verified Correct

✅ **Enum field conversion**: "האם כבר פנו למוכר" successfully changed from free-text to closed choice with three values (כן, לא, לא יודע). Verified:
  - machtzev/generator/apps/peruk08.json: enumVals array populated with three values
  - new/dart-data-bs/auto/gen_app_peruk08_ent1_content.dart: constants c15='כן', c16='לא', c17='לא יודע'
  - new/dart-gen-bs/gen_app_peruk08_ent1.dart:145: DsEnumField correctly renders with all three options

✅ **Counter particle "לא פנו"**: Properly wired to count cases where field equals 'לא'. Verified:
  - machtzev/generator/particle-plan-peruk08.json: particle defined with expr="מונה(האם כבר פנו למוכר=לא)" and shape="count"
  - new/dart-data-bs/auto/gen_app_peruk08_px1_content.dart: c121='לא פנו', c123='האם כבר פנו למוכר', c124='לא'
  - new/dart-gen-bs/gen_app_peruk08_px1.dart:35: KvLine renders counter with correct where-clause: `(r['האם כבר פנו למוכר'] ?? '') == 'לא'`

✅ **State isolation**: Only peruk08 spec/assets modified; no leakage to other applications. Verified:
  - git diff --name-only -- machtzev/generator/apps/: only peruk08.json changed
  - Police report: byte_identical_others ✅

✅ **Spec syntax valid**: Line 6 correctly uses `{כן|לא|לא יודע}` enum syntax; Line 16 correctly defines particle with `מונה(…=לא)`. Police report: gates_pass ✅

✅ **Generated Dart compiles**: All generated files pass flutter analyze. Police report: compiles ✅, in-app errors=0

✅ **No orphan files**: No stray gen_app_peruk08_* files outside expected locations. Police report: no_orphans ✅

✅ **Learning recorded**: machtzev/LEARNINGS.md updated with L2026-09-10-enum-counter documenting the enum+counter pattern and noting spec-lang sufficiency for this transformation.

✅ **Quarantine guards intentional**: ship.mjs, tighten-types.mjs, one.mjs replaced with protocol-blocking stubs per safety protocol (not regressions).

## Coverage

Checked: spec syntax (peruk08.txt), enum field definition (apps/peruk08.json), generated Dart field rendering (DsEnumField atom), counter particle wiring (where-clause logic, value calculation, KvLine display), state isolation (no cross-app modifications), compilation output, police gate verdicts, constants mapping (c15/c16/c17/c121/c123/c124 values), content file references.

Could not check: runtime behavior on a real device (Flutter/Dart not installed), actual counter rendering in browser (would require running app), user-facing display of label/value strings (verified constants only).
