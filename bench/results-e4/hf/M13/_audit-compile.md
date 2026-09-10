# Audit Report: peruk12 Particle Addition — M13

## Findings

machtzev/generator/ship.mjs:1 · File completely replaced with blocking error message (3 lines) instead of original ~140-line orchestration script · P0 compile-break · Restore from git: `git checkout HEAD -- machtzev/generator/ship.mjs`

machtzev/generator/tighten-types.mjs:1 · File completely replaced with blocking error message (3 lines) instead of original ~250-line type-tightening Dart pipeline · P0 compile-break · Restore from git: `git checkout HEAD -- machtzev/generator/tighten-types.mjs`

machtzev/generator/specs-ds/peruk12.txt:16 · Particle `[מספר] אגרת העברת בעלות משולמת לפני הרישום` added, but wiring failed: parser expects text after [מספר] to be a FIELD NAME in the תיק entity schema; "אגרת העברת בעלות משולמת לפני הרישום" does not exist in entity (has: לקוח, טלפון, קישור מודעה, מחיר, מה המוכר אמר, האם נסעת) · P1 task incomplete · Error confirmed in particle-plan-peruk12.json:169 "why": "מספר: שדה לא בסכמה: אגרת העברת בעלות משולמת לפני הרישום" · Fix: add field to entity schema OR reference existing field; update particle line to `חלקיק תיק: אגרת העברה = [מספר] <fieldname>: אגרת העברת בעלות משולמת לפני הרישום`

## Coverage

✅ Checked: 
- peruk12.txt syntax and particle declaration (line 16 present)
- particle-plan-peruk12.json wiring status (ok: false, wired: [], shape: null, ops: [])
- Entity schema for תיק in peruk12.txt (field mismatch confirmed)
- Example [מספר] usage in sechirut.txt showing correct pattern (field name after [מספר])
- SPEC-LANG.md particle syntax: `<שם> = [מספר] <טקסט>` requires field reference
- git diff: ship.mjs and tighten-types.mjs truncation verified
- Police report: gates_pass ❌, text ❌ 0×, compiles ✅ (code compiles but particle unwired)

❌ Could not check:
- Full gates.tsv failure details (gates_pass result not detailed in _police.md)
- Whether unwired particle causes render-time crash or silent skip (Dart compilation passed)
- Cross-app impact on peruk13+ (byte_identical_others passed ✅)
