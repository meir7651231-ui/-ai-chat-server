# Audit Coverage: Calendar Field Rename (מקום → כתובת)

## Findings
No defects found. Task completed successfully.

## Verified Coverage

### Source Changes ✅
- machtzev/generator/specs-ds/calendar.txt: Line 6 renamed מקום to כתובת
- machtzev/generator/apps/calendar.json: Line 52 label updated to 'כתובת'

### Entity List & Form Screen ✅
- gen_app_calendar_ent1_content.dart:14 = 'כתובת' (field label constant c12)
- gen_app_calendar_ent1.dart:31 = [c9, c10, c11, c12, c13] field labels in correct order
- gen_app_calendar_ent1.dart:146 = form field input uses label c12 ('כתובת')
- gen_app_calendar_ent1.dart:92 = record card display uses c12 in labels list
- BalaganField definition in gen_balagan_moments.dart includes BalaganField('כתובת', 'text', false, [])

### Particle Table ✅
- gen_app_calendar_ent1.dart:159 = table columns use c12 ('כתובת') as column 3
- Data rows correctly reference field via c12

### Hub/Root Screen ✅
- gen_app_calendar_root_content.dart:14,15,16,25,28 = 'כתובת' in all appropriate positions
- gen_app_calendar_root.dart:29 = navigation chip button correctly uses c26 field key ('כתובת')

### Report/Export ✅
- gen_app_calendar_ent1.dart:98 = CSV header export uses c12 in header list
- gen_app_calendar_ent1.dart:100 = CSV data rows use c12 for field value

### Build Status ✅
- Machine report shows: compiles ✅, no_hand_edit ✅, gates_pass ✅, dart_math_sane ✅
- Analyzer errors: 0 total, 0 in-app
- Regeneration successful (regen_ok ✅)

### No Regressions ✅
- No instances of old field name 'מקום' found in calendar entity field definitions
- Other apps remain byte-identical (byte_identical_others ✅)
- Only the spec and golden file were modified; generated outputs are fresh regenerations

All surfaces covered: entity definition, form, list, table, card display, root/hub screen, export/report, and field metadata structures.
