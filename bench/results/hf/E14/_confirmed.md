# 🔍 Validator Report — E14 calendar סוג field

## Findings

**1** · FALSE-POSITIVE · `_audit-regression.md:5` + `_prompt-builder.md:4` · "quarantine P0 compile-break" vs documented: "machtzev/one.mjs, machtzev/generator/ship.mjs, machtzev/generator/tighten-types.mjs are quarantined: running them exits 2. Do not try to restore or work around them." — Quarantine is intentional protocol enforcement, not a builder regression.

---

## Verification Summary

**Core task verified CORRECT:**
- Spec change: `calendar.txt` line 6 adds `סוג{עבודה|אישי|רפואי}` to פגישה entity ✓
- Generated app metadata: `calendar.json` includes field at index 2 (after מועד, before שעה) with type=text, required=false, enumVals=[עבודה, אישי, רפואי] ✓
- Generated entity screen: `gen_app_calendar_ent1.dart` line 146 wires ForgeDsEnumField with options [c12, c13, c14] to _v[2] ?? '' with proper null safety ✓
- Content constants: `gen_app_calendar_ent1_content.dart` defines c11='סוג', c12='עבודה', c13='אישי', c14='רפואי' ✓
- Balagan integration: `gen_balagan_moments.dart` includes BalaganField('סוג', 'text', false, ['עבודה', 'אישי', 'רפואי']) at correct position ✓
- Field count: Entity displays "6 שדות · 2 שלבים" (מה, מועד, סוג, שעה, מקום, הערה) ✓
- Police gates: All pass (regen_ok, byte_identical_others, gates_pass, no_hebrew_in_engine, dart_math_sane) ✓
- No side-effects: Only calendar app files changed; no cross-app state leakage ✓

**Byte evidence (git diff HEAD):**
- `machtzev/generator/specs-ds/calendar.txt`: `-ישות פגישה עם מה*, מועד*, שעה, מקום, הערה` → `+ישות פגישה עם מה*, מועד*, סוג{עבודה|אישי|רפואי}, שעה, מקום, הערה` ✓

---

FIX-LIST: none
