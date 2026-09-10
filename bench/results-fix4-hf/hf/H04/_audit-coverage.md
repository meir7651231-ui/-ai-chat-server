# Audit Coverage: Calendar Task (Meetings Table Sorting)

## Findings
No findings. The implementation is correct.

## Verified Coverage

**Task specification**: Make the meetings table (פגישה particle screen) sorted by date מועד and then by time שעה.

**Spec implementation** (machtzev/generator/specs-ds/calendar.txt line 7):
- Particle definition: `חלקיק פגישה: רשימה = [טבלה] מה, מועד, שעה, מקום | מיון: מועד עולה, שעה עולה`
- Syntax verified: `| מיון: מועד עולה, שעה עולה` declares sort order (ascending date, then ascending time)

**Generated sorting implementation** (new/dart-gen-bs/gen_app_calendar_px1.dart line 18):
- Creates ForgeDataGrid with columns in spec order: מה, מועד, שעה, מקום
- Sort lambda chains two comparisons:
  1. `a[gen_app_calendar_px1_c5] vs b[gen_app_calendar_px1_c5]` — מועד (date), returns `c` (ascending)
  2. `a[gen_app_calendar_px1_c6] vs b[gen_app_calendar_px1_c6]` — שעה (time), returns `c` (ascending)
- Both sorts use numeric comparison when parseable (via `num.tryParse`), lexical otherwise
- Correct precedence: first sort determines result, second only breaks ties

**Constants mapping** (new/dart-data-bs/auto/gen_app_calendar_px1_content.dart):
- `gen_app_calendar_px1_c5 = 'מועד'` ✓
- `gen_app_calendar_px1_c6 = 'שעה'` ✓
- Column order: c1=מה, c2=מועד, c3=שעה, c4=מקום (matches spec) ✓

**Navigation integration** (new/dart-gen-bs/gen_app_calendar_hub.dart):
- Particle screen imported: `import 'gen_app_calendar_px1.dart'` ✓
- Added to hub navigation as second tile (after entity, before audit) ✓
- Visibility array expanded: `[[0, 1, 2, 3, 4, 5]]` ✓

**Police validation**:
- `sort_both` gate confirmed: "The פגישה particle (px1) now has sorting by מועד (date) ascending, then שעה (time) ascending" ✓
- `regen_ok`, `byte_identical_others`, `gates_pass`, `no_hebrew_in_engine`, `dart_math_sane` all passed ✓

**No regressions verified**:
- All other generated code unchanged (calendar entity/hub/home/audit/flags/settings/behavior)
- Other apps' regeneration (sechirut content updates) are expected side effects of full regeneration cycle
