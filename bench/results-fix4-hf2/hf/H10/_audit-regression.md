# Audit: Calendar Sort by شعה

## Findings

**new/dart-gen-bs/gen_app_calendar_shell.dart:42-47** · meetings list in shell navigation tabs uses unsorted appStore.records() · P1 wrong result · sort the list before iteration: `final rs = appStore.records('app_calendar_ent1'); rs.sort((a, b) { final x = a['שעה'] ?? '', y = b['שעה'] ?? ''; if (x.isEmpty != y.isEmpty) return x.isEmpty ? 1 : -1; final nx = num.tryParse(x), ny = num.tryParse(y); final c = (nx != null && ny != null) ? nx.compareTo(ny) : x.compareTo(y); if (c != 0) return c; return 0; });`

**new/dart-gen-bs/gen_app_calendar_shell.dart:29-30** · palette widget lists meetings without sorting · P1 wrong result · extract and sort `appStore.records('app_calendar_ent1')` before building palette items

## Coverage Verified

✓ Entity list screen (ent1) sorts by שעה correctly on line 157 of gen_app_calendar_ent1.dart
✓ All table/list/card views within ent1 use the pre-sorted list (rs)
✓ Spec change (adding `| מיון: שעה עולה`) was applied correctly to calendar.txt
✓ Generator correctly produced sorting code for the ent1 screen
✓ No other apps were modified (byte_identical check passed)

✗ Shell navigation sidebar (gen_app_calendar_shell.dart) displays meetings without sorting by שעה
✗ Palette quick-access menu (gen_app_calendar_shell.dart:29-30) displays meetings without sorting by שעה

Task completion: Partial. Sorting applied to entity list screen only; missing from shell navigation screens (the "second surface" test failure is valid—meetings appear unsorted in two other surfaces).
