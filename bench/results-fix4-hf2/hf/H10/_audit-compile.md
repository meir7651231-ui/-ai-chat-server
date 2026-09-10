# 🔍 Auditor Report — Calendar App Sort Task (H10)

## Findings

new/dart-gen-bs/gen_app_calendar_ent1.dart:157 · Time sort compares raw strings without format normalization; "9:30" > "09:30" lexicographically, causing wrong sort order with mixed HH:MM/H:MM formats · P1 wrong-result · Apply `int.tryParse` on HH:MM parts before comparison, or normalize input to zero-padded HH:MM via `.split(':')` and reconstruct as `'${h.padLeft(2, '0')}:$m'` before comparing.

## Coverage

**Verified correct:**
- Spec change correctly applied: `| מיון: שעה עולה` added to calendar.txt line 6 ✓
- Sort applied to entity list screen: line 157 sorts by field `gen_app_calendar_ent1_c16` ('שעה') ✓
- Sort reused in all four views (list/kanban/calendar/grid): lines 158–160 all use pre-sorted `rs` list ✓
- Null-safety and empty value handling: values null-coalesced with `?? ''`, empty values sorted to end via `x.isEmpty ? 1 : -1` ✓
- Police report confirms: regen_ok ✅, byte_identical_others ✅, gates_pass ✅, sort_list ✅ ent1, no particles defined in spec (sort_second_surface N/A) ✓
- Code compiles: analyzer errors = 0 ✓

**Could not check:**
- Runtime behavior with actual mixed-format time data (only static code analysis performed; playtest would confirm the format-normalization issue surfaces in practice)
- Whether DsField or form validation enforces HH:MM format upstream (checked form code, no regex validation visible on שעה field input)
