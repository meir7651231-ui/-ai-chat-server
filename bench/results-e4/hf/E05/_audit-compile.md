# Audit Report: Calendar App (E05)

## Findings

new/dart-gen-bs/gen_app_calendar_px1.dart:14 · EmptyState displays wrong label constant · P1 wrong-result · Use gen_app_calendar_px1_c1 instead of gen_app_calendar_px1_c0 for the label parameter

**Justification:** The spec declares `חלקיק פגישה: [ריק] אין פגישות השבוע`. The generated content file defines:
- `gen_app_calendar_px1_c0 = 'ריק אין פגישות השבוע'` (particle identifier with shape indicator)
- `gen_app_calendar_px1_c1 = 'אין פגישות השבוע'` (the actual display text)

Line 14 of px1.dart renders: `EmptyState(label: gen_app_calendar_px1_c0)` — this shows the internal particle name "ריק אין פגישות השבוע" to users instead of the requested text "אין פגישות השבוע". The task explicitly asks for empty-state text "אין פגישות השבוע", which is the value of c1, not c0.

**Trigger:** When meetings list is empty, widget displays wrong empty-state message.

## Coverage

✓ Checked: 
- Participants field properly added to פגישה entity (6 fields, including משתתפים at index 4, properly typed as text, non-required) in gen_app_calendar_ent1.dart
- Field labels and indices correct (c9-c14 map to מה, מועד, שעה, מקום, משתתפים, הערה respectively) in content files
- Empty-state particle created and rendered in px1.dart with correct null-safety checks
- Null safety: all tryParse() calls have proper null checks or null coalescing (`?? defaultValue`)
- No dart:math method calls on num types (no `.sqrt()`, `.min()`, `.max()` on numbers)
- `.clamp()` used only on int types (correct)
- Generator pipeline completed successfully (police-bench confirms regen_ok, compiles, field count, empty_text checks)

✗ Not checked (not in audit scope):
- Runtime behavior of the app (requires device/emulator)
- Database persistence of participants field
- UI layout responsiveness
- Integration with other modules

## Verdict

**1 P1 issue found.** The empty-state particle text constant is wired incorrectly—it passes the particle name (c0) instead of the display text (c1) to EmptyState. Participants field itself is correctly implemented.
