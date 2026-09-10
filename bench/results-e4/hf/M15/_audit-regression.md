# 🔍 Audit Report — M15 (calendar field rename מקום→כתובת)

## Findings

No findings. Field rename propagated correctly through calendar app and related metadata.

## Verified Correct

✅ **Calendar field rename**: spec-calendar.txt line 6 changed מקום→כתובת; gen_app_calendar_ent1_content.dart c12–c14 and gen_app_calendar_root_content.dart c12–c26 all correctly reflect new field name "כתובת".

✅ **Calendar screen generation**: gen_app_calendar_ent1.dart correctly indexes calendar fields using updated content constants (no orphan indices, refs match c9–c13 across save, edit, card, csv).

✅ **Dart compilation**: _police.md reports 0 analyzer errors in-app and total, gates_pass ✅, compiles ✅ — type safety holds.

✅ **Protocol enforcement**: machtzev/generator/ship.mjs and tighten-types.mjs correctly quarantined (blocker message, exit 2) — no unauthorized generator runs detected.

✅ **Cross-app metadata**: balagan_moments.dart correctly updated to reference BalaganField('כתובת', ...) in calendar module; this is expected side effect (metadata container regenerated).

✅ **No orphan files**: regen produced only expected new files (gen_app_calendar_* variants); no files with namespaces absent from spec (e.g., orphan gen_app_unknown_*.dart).

## Coverage

Checked: spec-calendar.txt change; all gen_app_calendar_* generated files (9 .dart + 8 content files); constant indices c0–c48 in root_content.dart; balagan_moments.dart calendar module metadata; gates (spec-lang signature); Dart compilation status; sechirut_ent2 field label reference chain (old c26→new c27).

Could not check (Flutter/Dart not installed): runtime test of calendar form display with new field name; actual behavior under user interaction (render, save, validation); whether constant value shifts propagate correctly through all reference sites (static analysis only — Dart analyzer passed but semantic correctness of re-indexing requires execution).

## Questions

- **sechirut_ent2 constants**: Why did gen_app_sechirut_ent2_content.dart constants renumber (c25–c30) when sechirut.txt spec is unchanged? Police report says byte_identical_others ✅ but file hashes differ (06e94ebd vs 45247663). Likely explanation: sechirut is regenerated as part of all-specs regen pipeline (regen.mjs runs calendar ⇒ full index ⇒ balagan ⇒ other metadata). Verify: check regen.mjs REGEN list and police check definition of "byte_identical_others" scope.
