# 🔍 Audit Coverage Report — E05 (calendar)

## Findings

new/dart-gen-bs/gen_app_calendar_shell.dart:46 · wrong empty state label in root tab — using gen_app_calendar_shell_c6='פגישה' instead of the expected 'אין פגישות השבוע' · P1 wrong result · use EmptyState(label: 'אין פגישות השבוע') or create appropriate content constant with the full message

new/dart-gen-bs/gen_balagan_moments.dart:17 · unintended side effect — file changed outside calendar scope, breaking byte_identical_others gate · P0 compile-break (task not done) · regenerate with --only flag limited to calendar app only, do not modify balagan_moments or other apps' generated files

## Verification Passed

**Participants field in entity:** ✅ Confirmed
- gen_app_calendar_ent1.dart displays all 6 fields correctly including participants
- gen_app_calendar_ent1_content.dart maps c13='משתתפים'
- gen_app_calendar_ent1_content.dart shows c0-c6: all entity labels present (מה, מועד, שעה, מקום, משתתפים, הערה)
- gen_app_calendar_root_content.dart includes participants at c16-c18 and c28 (read/edit/display usage)
- Field mapping in _labelsAll array has 6 elements in correct order

**Empty state particle generated:** ✅ Confirmed
- machtzev/generator/particle-plan-calendar.json shows particle successfully planned: "ריק אין פגישות השבוע" with shape="empty" 
- gen_app_calendar_px1_content.dart has c0='ריק אין פגישות השבוע' and c1='אין פגישות השבוע'
- gen_app_calendar_px1.dart correctly wires EmptyState when appStore.records('app_calendar_ent1').isEmpty

**Machine reports:** ✅ Field and empty_text gates passed
- regen_ok: ✅
- gates_pass: ✅ (field ✅ 1×, empty_text ✅ 2×)

**Spec compliance:** ✅
- machtzev/generator/specs-ds/calendar.txt line 6 shows all 6 fields and participant addition
- machtzev/generator/apps/calendar.json has participants field added (type: text, required: false)
- machtzev/LEARNINGS.md documents the learning: optional list fields mapped to List<T>?

## Coverage Notes

✅ **Checked:** entity schema in generated Dart · all 6 field mappings in content files · empty state particle in px1 screen · participants in all display contexts · spec alignment  
❌ **Cannot verify in sandbox:** runtime behavior of empty state on device · balagan_moments.dart necessity (may be correct regeneration side effect if flag was not narrowed)  
⚠️ **Critical blocker:** byte_identical_others gate failed due to balagan_moments.dart change — this gates the PR from passing, task marked NOT DONE by machine
