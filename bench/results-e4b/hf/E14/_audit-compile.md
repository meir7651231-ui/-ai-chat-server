# Audit: calendar.txt enum field addition (E14)

## Findings

new/dart-gen-bs/gen_app_calendar_ent1.dart:149 · ForgeDsEnumField references const [gen_app_calendar_ent1_c15, gen_app_calendar_ent1_c16, gen_app_calendar_ent1_c17] — verified all three constants defined in gen_app_calendar_ent1_content.dart:17-19 with correct Hebrew values עבודה/אישי/רפואי · P0 compile-break status: PASSED (code is Dart-sound, null-safe, uses proper coalescing _v[5] ?? '')

new/dart-data-bs/auto/gen_app_audit_content.dart · Format changed from "תוכן-DS" to "דאטה · תוכן-המחולל", string constants reorganized — Audit app is NOT part of calendar spec (specs-ds/calendar.txt contains only פגישה entity) — implies builder ran full regeneration instead of --name calendar only · P2 task-break (violates "don't break anything") · delete or revert to HEAD version

new/dart-data-bs/auto/gen_app_ent1_content.dart · Format changed from "תוכן-DS" to new format, constants reorganized — NOT part of calendar spec · P2 task-break · revert to HEAD

new/dart-data-bs/auto/gen_app_ent10_content.dart (untracked, 20+ similar files ent10–ent29) · Orphan files with no corresponding spec · Police report flags as "no spec — delete them" · P2 cleanup (not a compile error but violates repo cleanliness)

## Verified Correct

**Calendar spec syntax valid:** machtzev/generator/specs-ds/calendar.txt line 6 `סוג{עבודה|אישי|רפואי}` matches expected enum field syntax.

**Generated enum field wiring sound:** Field mapped to _v[5], ForgeDsEnumField(label: gen_app_calendar_ent1_c14, options: const [...c15, c16, c17], value: _v[5] ?? '', ...) — all string constants defined, null-safe, proper state binding via setState.

**Dart compilation passes:** Police report confirms `compiles: ✅`, zero analyzer errors in gen_app_calendar_ent1.dart.

**Field count correct:** Content file shows "6 שדות · 2 שלבים"; _labelsAll contains 6 items including new field at index 5; map building includes all 6 fields; CSV export includes field.

**Enum values exact match:** Hebrew values עבודה (c15), אישי (c16), רפואי (c17) match spec exactly.

## Coverage

✓ Dart null-safety on enum field (no `.sqrt()` or invalid methods)
✓ String comparisons (using const strings, not numbers)  
✓ Enum field wiring (_v map indexing, state binding, options array)
✓ Content constants all defined and referenced correctly
✗ Cannot verify: Why non-calendar files were modified (builder's command line unknown)
✗ Cannot verify: Whether untracked orphan files are spurious or intentional side-effect

## Summary

**Task COMPLETE on calendar:** Enum field סוג{עבודה|אישי|רפואי} added to פגישה entity, Dart code sound, compiles.

**VIOLATIONS:** Task required "don't break anything" — but gen_app_audit_content.dart, gen_app_ent1–6_content.dart modified, and orphans ent10–29 created. Police report flags `byte_identical_others: ❌` and `no_orphans: ❌`. 

**Severity:** P2 (not a compile error, but breaks idempotency/cleanliness). Suggest revert to HEAD and regenerate calendar-only with `--name calendar` flag.
