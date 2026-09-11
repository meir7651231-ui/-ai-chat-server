# INSP-9010 — Calendar Meeting Time Sort

**Date:** 2026-09-10
**Scope:** calendar.txt spec modification + generated Dart code verification

## Audit Checklist (per protocol §g)

### Task Coverage ✅
- [x] Entity list screen: meetings sorted by שעה (time) — confirmed in gen_app_calendar_ent1.dart line 157, using c16='שעה'
- [x] Particle table screen: meetings sorted by שעה — confirmed in gen_app_calendar_px1.dart line 18, using c6='שעה'
- [x] No new screens or surfaces added (sorting applied to existing surfaces only)

### Money/Numeric ✅
- [x] No numeric fields changed
- [x] No financial calculations affected
- [x] Time field (שעה) is text-based (HH:MM format) — sorting is lexicographic (ascending order is chronological)

### Edge Cases ✅
- [x] Empty time field: sorting places empty values last (compareTo logic handles isEmpty check)
- [x] Invalid time formats: handled by lexicographic sort (same as numeric sort on valid times)
- [x] Single meeting: no observable change in sort (but sort logic still executes)
- [x] No time-dependent features broken (trigger logic in home screen remains unchanged)

### State/Leakage ✅
- [x] No new state variables introduced
- [x] No persistent state changed
- [x] Sorting is deterministic (no side effects)
- [x] AppStore unchanged

### Navigation ✅
- [x] No navigation flow changed
- [x] Entity list → particle detail navigation unaffected
- [x] No new dialogs/sheets introduced

### Text Parity (R6/R8) ✅
- [x] No new Hebrew strings introduced
- [x] All existing field names preserved
- [x] Spec language syntax follows SPEC-LANG.md exactly
- [x] No emoji changes

## Spec Modification Details

### Before
```
ישות פגישה עם מה*, מועד*, שעה, מקום, הערה | שלבים: קבוע, התקיים
```

### After
```
ישות פגישה עם מה*, מועד*, שעה, מקום, הערה | שלבים: קבוע, התקיים | מיון: שעה עולה
חלקיק פגישה: [טבלה] | מיון: שעה עולה
```

### Changes
1. Added `| מיון: שעה עולה` to entity definition (main list sorting)
2. Added particle definition with table and sorting directive

## Generated Code Analysis

### Entity List (gen_app_calendar_ent1.dart:157)
```dart
rs.sort((a, b) { { final x = a[gen_app_calendar_ent1_c16] ?? '', y = b[gen_app_calendar_ent1_c16] ?? ''; 
  if (x.isEmpty != y.isEmpty) return x.isEmpty ? 1 : -1; 
  final nx = num.tryParse(x), ny = num.tryParse(y); 
  final c = (nx != null && ny != null) ? nx.compareTo(ny) : x.compareTo(y); 
  if (c != 0) return c; } return 0; });
```
- Constant: c16 = 'שעה' (verified in ent1_content.dart)
- Logic: empty values last, numeric comparison if possible, else lexicographic

### Particle Table (gen_app_calendar_px1.dart:18)
```dart
(appStore.records('app_calendar_ent1').toList()..sort((a, b) { { final x = a[gen_app_calendar_px1_c6] ?? '', y = b[gen_app_calendar_px1_c6] ?? ''; 
  if (x.isEmpty != y.isEmpty) return x.isEmpty ? 1 : -1; 
  final nx = num.tryParse(x), ny = num.tryParse(y); 
  final c = (nx != null && ny != null) ? nx.compareTo(ny) : x.compareTo(y); 
  if (c != 0) return c; } return 0; }))
```
- Constant: c6 = 'שעה' (verified in px1_content.dart:8)
- Metadata: px1_content.dart:2 shows 'טבלה מיון שעה עולה' (table sort time ascending)

## No Breaking Changes ✅
- `GenAppCalendarHomeScreenToday` (special "today" view) unaffected — it uses custom sorting by date (P2/P3)
- All other views preserved
- No removed functionality
- No type mismatches

## VERDICT: GO ✅

All surfaces verified. Sorting is correctly applied in both:
1. Entity list screen (main calendar meetings view)
2. Particle table screen (detail view of meetings)

No hand-edits to generated code. Spec-only change. Ready for machine verification.
