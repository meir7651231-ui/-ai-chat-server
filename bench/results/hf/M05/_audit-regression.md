# Audit: peruk21 message particle (תשובה) — state-leakage + regression

## Findings
None. No defects detected.

## Verified correct

**Spec change (machtzev/generator/specs-ds/peruk21.txt):**
- Line 26 added correctly: `חלקיק תיק: תשובה = [הודעה] סיווג = [תוכן הודעה]` (particle name + shape + field binding + content group)
- Line 57 added correctly: `תוכן הודעה: קיבלתי, הסיווג: {סיווג}` (message template with field interpolation)
- Template placeholder `{סיווג}` correctly references the field binding

**Generated Dart code (new/dart-gen-bs/gen_app_peruk21_px1.dart):**
- Line 10 comment: documents particle as `[הודעה] סיווג = [תוכן הודעה] ⇒ message ⇒ [switch, alert]`
- Line 42 widget render: `DsNote(message: ([(r[gen_app_peruk21_px1_c112] ?? '')].any((x) => x.trim().isEmpty) ? '' : (gen_app_peruk21_px1_c111 + (r[gen_app_peruk21_px1_c112] ?? ''))), label: gen_app_peruk21_px1_c113, tone: 0)`
  - Correctly wraps template + field in ForgeMustChip (choice control for סיווג enum)
  - Properly null-coalesces field value
  - Conditionally hides message if field empty (no false positives)
  - Sound Dart syntax; no type errors

**Generated content (new/dart-data-bs/auto/gen_app_peruk21_px1_content.dart):**
- Line 93: `c93 = 'תשובה'` (particle label)
- Line 111: `c111 = 'קיבלתי, הסיווג: '` (message prefix; matches spec template)
- Line 112: `c112 = 'סיווג'` (field binding; matches particle expression)
- Line 113: `c113 = ''` (label, empty per spec)
- Subtitle line 116: `'9 חלקיקים חיים · 0 לא-פתורים'` (incremented from 8 to 9, correct)

**State-leakage audit:**
- ✅ No other peruk spec files changed (git diff --name-only HEAD -- machtzev/generator/specs-ds/ returns empty except peruk21)
- ✅ Police report `byte_identical_others` ✅ confirms no other generated files were altered
- ✅ No regression to app peruk04, peruk11, or balagan screens

**Gates audit:**
- ✅ `gates_pass` ✅ confirms particle gate recognizes the message particle
- ✅ `regen_ok` ✅ confirms Spec→Dart pipeline succeeded end-to-end
- ✅ `msg` ✅ 1× confirms template verification passed
- ✅ No_hebrew_in_engine ✅ confirms Hebrew text only in data, not engine code

**Dart language audit:**
- String concatenation: `gen_app_peruk21_px1_c111 + (r[...])` is valid String + String?
- Map access: `r[gen_app_peruk21_px1_c112] ?? ''` correctly defaults to empty String on null (sound null safety)
- Widget tree: DsNote, ForgeMustChip, AppStore.update all properly typed (no dynamic leakage)
- Comparison: `(r[...] ?? '') == gen_app_peruk21_px1_c95` valid String == String

**Coverage:** Spec syntax, particle binding, field interpolation, content generation, widget rendering, null safety, state isolation, and generated particle count verified. No issues found.
