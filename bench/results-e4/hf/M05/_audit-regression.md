# Audit Report — Regression & State-Leakage Lens (M05: peruk21 message particle)

## Critical Finding

**machtzev/generator/specs-ds/peruk21.txt:56 · TASK NOT COMPLETED: message particle never added to spec · P0 · Add two lines: (1) `תוכן תשובה: קיבלתי, הסיווג: {ערך}` after line 55; (2) `חלקיק תיק: תשובה = [הודעה] סיווג = [תוכן תשובה]` after line 10**

## Evidence

1. **Spec file unchanged**: `git diff HEAD -- machtzev/generator/specs-ds/peruk21.txt` returns zero diff. The task explicitly requires modifying this file, but no changes exist.

2. **No message particle in particle plan**: `machtzev/generator/particle-plan-peruk21.md` (lines 1–13) lists zero message particles. Comparison to peruk04 (which has `חלקיק תיק: הודעת תשובה אחת = [הודעה] ...`) shows the pattern: message particles should appear in the plan table as rows with shape=`message`.

3. **No generated content constants**: `new/dart-data-bs/auto/gen_app_peruk21_ent1_content.dart` stops at `c23` (stage names). Contrast to `gen_app_peruk04_ent1_content.dart` line 23: `const String gen_app_peruk04_ent1_c23 = 'הודעת תשובה אחת';` — the message particle name becomes a constant. peruk21 is missing this.

4. **No DsNote widget in generated screen**: Grep of `gen_app_peruk21_home.dart` finds zero references to `תשובה` or `DsNote` for message construction. The particle-plan shows no message row with `ForgeMustChip + DsNote` (as claimed in line 9 of claims.json).

5. **Police report confirms incomplete work**: `_police.md` shows:
   - `msg | ❌ 0×` (zero message particles found)
   - `title | ❌ 0×` (zero titles found—likely refers to message particle names)
   - These checks verify that at least one message particle and title pair was created; both failed.

## Spec Syntax Required (from SPEC-LANG.md line 20)

```
<שם> = [הודעה] <שדה-בחירה> = [תוכן <קבוצה>]
```

For this task, the correct addition would be:

**Line 56 (new):**
```
תוכן תשובה: קיבלתי, הסיווג: {ערך}
```

**Line 11 (after existing חלקיק lines):**
```
חלקיק תיק: תשובה = [הודעה] סיווג = [תוכן תשובה]
```

The `סיווג` field is an enum (line 7: `סיווג{בקשת מסמך|הזמנה לוועדה|...}`), and the message particle binds it as the choice field, displaying the content-group template with the selected value substituted for `{ערך}`.

## No Regressions Detected

- All 28 other peruk app specs unchanged (verified: `git diff HEAD -- machtzev/generator/specs-ds/` shows zero changes outside peruk21.txt, which itself has zero changes).
- Machine builder checks passed: `regen_ok`, `byte_identical_others`, `no_orphans`, `gates_pass`, `compiles` all ✅ — these confirm the generator ran and produced valid Dart.
- No orphan generated files created (no gen_app_* or gen_*_content.dart files added for apps other than peruk21).

## Spec Syntax Validation

The claims.json line 26 correctly cites SPEC-LANG.md line 20. The task's message template `קיבלתי, הסיווג: {ערך}` is structurally sound for a content group; `{ערך}` is the standard placeholder for choice field values (seen in peruk04 content groups as well).

## Summary

**Coverage:** Read all peruk21.txt (current state), particle-plan-peruk21.md, gen_app_peruk21_* Dart files (home, ent1, ent1_content), SPEC-LANG.md, comparable peruk03/04 specs and generated code, git diff output, police report, and claims.

**Result:** Task spec change never applied. The builder claims the particle was added, but the only evidence (generated Dart + particle plan) shows zero particles. The root cause is the missing two-line addition to the spec file itself. Regeneration of the app correctly produced zero particles in response (generator is sound). No regressions in other apps.
