# 🔴 VALIDATOR FINDINGS — E14 (calendar field addition)

## AUTOMATIC P0 FINDINGS (machine report violations)

**P0-MACHINE-1** · CONFIRMED · `_police.md:6 byte_identical_others: ❌` + detail line 17: "changed outside calendar: dart-data-bs/auto/gen_app_audit_content.dart, dart-data-bs/auto/gen_app_ent10_content.dart, dart-data-bs/auto/gen_app_ent11_content.dart, dart-data-bs/auto/gen_app_ent12_content.dart, dart-data-bs/auto/gen_app_ent13_content.dart, dart-data-bs/auto/gen_app_ent14_content.dart, dart-data-bs/auto/gen_app_ent15_content.dart, dart-data-bs/auto/gen_app_ent16_content.dart" · Task scope violation: full generator run instead of `--name calendar` only; must revert non-calendar files to HEAD

**P0-MACHINE-2** · CONFIRMED · `_police.md:7 no_orphans: ❌` + detail line 19: "orphan generated files (no spec — delete them): new/dart-data-bs/auto/gen_app_ent10_content.dart new/dart-data-bs/auto/gen_app_ent11_content.dart new/dart-data-bs/auto/gen_app_ent12_content.dart new/dart-data-bs/auto/gen_app_ent13_content.dart new/dart-data-bs/auto/gen_app_ent14_content.dart new/dart-data-bs/auto/gen_app_ent15_content.dart …" · No corresponding specs in machtzev/generator/specs-ds/ for ent10-29; delete orphan files

## AUDITOR FINDINGS — VERIFIED AGAINST BYTES

**E14-AUDIT-1** · CONFIRMED · `new/dart-data-bs/auto/gen_app_audit_content.dart`: bytes changed (format "תוכן-DS" → "דאטה · תוכן-המחולל"); audit app NOT part of calendar spec (calendar.txt contains only פגישה entity); git diff HEAD shows this file modified when only calendar.txt in scope · Revert to HEAD (audit is unrelated to task)

**E14-AUDIT-2** · CONFIRMED · `new/dart-data-bs/auto/gen_app_ent1_content.dart` through `gen_app_ent6_content.dart`: bytes changed (63+ lines); none are part of calendar spec; ent1-6 are distinct entities from peruk01-28 · Revert to HEAD (full generator was run instead of calendar-only)

**E14-AUDIT-3** · CONFIRMED · `machtzev/generator/specs/entity.txt`: 28 lines changed (rewritten); task scope = only calendar.txt; entity.txt change violates "don't break anything" constraint · Revert to HEAD (out of scope)

**E14-AUDIT-4** · CONFIRMED · `machtzev/generator/specs/entry.txt`: 69+ lines changed (navigations for app_ent10–29 added); task scope = only calendar.txt; entry.txt change violates scope · Revert to HEAD (out of scope)

**E14-AUDIT-5** · CONFIRMED · `machtzev/generator/ship.mjs`: 139 lines deleted; build script is infrastructure, not part of task (add field to calendar.txt) · Revert to HEAD (build script should not be modified)

## VERIFIED CORRECT

**E14-CALENDAR-FIELD** · FALSE-POSITIVE (on "calendar.txt line 6 is correct"): Spec syntax IS correct. Bytes: `ישות פגישה עם מה*, מועד*, שעה, מקום, הערה, סוג{עבודה|אישי|רפואי} | שלבים: קבוע, התקיים` matches requirement exactly. Field enum values עבודה|אישי|רפואי are present and match.

**E14-DART-SOUNDNESS** · FALSE-POSITIVE (on "calendar Dart code has errors"): gen_app_calendar_ent1.dart is Dart-sound and null-safe. Verified: (1) all _v[5] uses properly coalesce to `?? ''`; (2) enum constants c15/c16/c17 defined in content file with correct Hebrew values; (3) ForgeDsEnumField wiring at line 149 is valid; (4) field included in save, edit, display, and CSV export paths; (5) no invalid math methods (.sqrt()/.pow() on num). Calendar code compiles without errors per police report `compiles: ✅`.

---

## SUMMARY

**Task core: COMPLETE** — calendar.txt line 6 field addition is syntactically correct and generates working Dart code.

**REGRESSIONS: CRITICAL** — Full generator run instead of scoped rebuild. 5 infrastructure files modified (audit, ent1-6 content, entity.txt, entry.txt, ship.mjs), 20+ orphan generated files created (ent10-29) with no backing specs. All violations of "don't break anything" and task scope.

**VERDICT: NOT READY TO MERGE**

Per police report: `byte_identical_others: ❌`, `no_orphans: ❌` (both are automatic P0).

---

## FIX-LIST

P0-MACHINE-1 · Revert all non-calendar files to HEAD: dart-data-bs/auto/gen_app_audit_content.dart, gen_app_ent1–6_content.dart, and all other generated data files for non-calendar apps
P0-MACHINE-2 · Delete orphan files: new/dart-data-bs/auto/gen_app_ent10_content.dart through gen_app_ent28_content.dart (no corresponding specs exist)
E14-AUDIT-1 · Revert new/dart-data-bs/auto/gen_app_audit_content.dart to HEAD
E14-AUDIT-2 · Revert new/dart-data-bs/auto/gen_app_ent1–6_content.dart to HEAD
E14-AUDIT-3 · Revert machtzev/generator/specs/entity.txt to HEAD
E14-AUDIT-4 · Revert machtzev/generator/specs/entry.txt to HEAD
E14-AUDIT-5 · Revert machtzev/generator/ship.mjs to HEAD
(Then: Re-run `node machtzev/generator/app-ds.mjs --name calendar` to regenerate calendar-only, leaving all other apps untouched.)
