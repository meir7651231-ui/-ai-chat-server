# 🔍 Audit: State-Leakage + Regression (E08 sechirut counter task)

## Scope
- Lens: state-leakage, regression, orphan generated files
- Change: spec file `machtzev/generator/specs-ds/sechirut.txt` line 11 adds counter `מונה(תיק: מתווך=כן)`
- Generated outputs: `new/dart-gen-bs/gen_app_sechirut_*.dart`, `new/dart-data-bs/auto/gen_app_sechirut_*_content.dart`
- Police report: `_police.md` shows 8/8 checks ✅, verdict DONE

## Findings

None. No defects found.

### Verification trace

**1. Spec syntax & field validity**
- Line 11: `מונה(תיק: מתווך=כן)` inserted after first counter
- Entity `תיק` line 7: field `מתווך{כן|לא}` ✓ (enum has 'כן')
- Syntax matches existing counters (entity:field=value) ✓

**2. Generated code logic (gen_app_sechirut_scr5.dart:23)**
- Filter: `(r[gen_app_sechirut_scr5_c9] ?? '') == gen_app_sechirut_scr5_c10`
- Content constants:
  - c9 = 'מתווך' (field name) ✓
  - c10 = 'כן' (value) ✓
- Semantics: counts records where תיק.מתווך == 'כן' ✓

**3. Display string (gen_app_sechirut_scr5_content.dart)**
- c6 = 'תיק · כן' (counter label, correctly placed between c5='כן' and c7='')
- c39 changed from '6 מדדים' to '7 מדדים' (dashboard reflects +1 counter) ✓

**4. Regression to other apps**
- `git diff HEAD -- new/dart-gen-bs/` only shows `gen_app_sechirut_*.dart` files
- No gen_schoolos_*, gen_studio_*, gen_kehila_*, etc. files changed
- Police: `byte_identical_others ✅` confirmed ✓

**5. Orphan generated files**
- No `.dart` files in `new/dart-gen-bs/gen_app_*` that lack a spec or don't match sechirut
- Police: `no_orphans ✅` confirmed ✓

**6. Hand-edits to generated files**
- All changes are deterministic output from spec line 11 change
- Content file (`gen_app_sechirut_scr5_content.dart`) constants auto-reindexed (c5→c5, c6→c6 inserted, others shifted)
- Logic file (`gen_app_sechirut_scr5.dart`) correctly references new indices
- Police: `no_hand_edit ✅` confirmed ✓

**7. Compilation**
- Flutter analyze: 0 analyzer errors
- Police: `compiles ✅`, `dart_math_sane ✅` confirmed ✓

**8. Learning entry (LEARNINGS.md)**
- L2026-09-10-byte-identical-sechirut documents that spec-only counter changes do not trigger engine code paths
- References line 11 of sechirut.txt, gates: gates_pass, byte_identical_others, compiles
- Antipattern noted: don't mix dashboard counter + engine logic changes ✓

## Coverage

**Checked:**
- Spec syntax validity vs. field definitions (✓ entity, field, enum value all correct)
- Generated code logic for new counter (✓ filter expression correctly formed)
- Content string generation & constant indexing (✓ display label and field/value constants placed correctly)
- Regression to other 6 apps (✓ byte-identical confirmed by police, no file diffs for other apps)
- Orphan files (✓ no stranded gen_app_* files with missing spec)
- Compilation (✓ 0 analyzer errors, no math/null-safety issues)
- Quarantined scripts (ship.mjs, tighten-types.mjs, one.mjs replaced with error blocks — intentional safety measure; police-bench used correct pipeline instead)

**Could not check (not applicable):**
- Runtime behavior (no Flutter runtime; Dart null-safety syntax checked statically)
- Cross-app entity logic (sechirut is self-contained; no shared schemas affected)

## Conclusion

**No findings.** The change is sound:
- Counter added at the correct spec location
- All generated code correctly implements the filter
- No state leakage to other apps (byte-identical confirmed)
- No orphan files
- Compiles with 0 errors
- Learning entry appropriately documents the lesson
