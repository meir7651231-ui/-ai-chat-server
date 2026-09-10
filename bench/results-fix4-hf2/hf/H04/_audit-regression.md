# 🔍 Audit Report — Calendar Sort Task (H04)

## Findings

**new/dart-gen-bs/gen_app_sechirut_ent2.dart:26** · State-leakage: Sechirut app (שכירות/rentals) regenerated despite no spec change; constant renamed from c26→c27 in _labelsAll, affecting field references throughout file (lines 44, 59, 88, 160, 175–186) · **P1 regression** · Police claim "byte_identical_others" contradicts actual changes; either claim is wrong or police check incomplete. Verify if engine improvements to sechirut were intentional.

## Verified Correct

✅ **Calendar sort implementation (gen_app_calendar_ent1.dart:157)**: Sort correctly applied with dual-field logic — first by c16 (מועד/date), then by c17 (שעה/time), both ascending (עולה). Comparison handles empty values, numeric parsing, and lexical fallback. Sort runs before all view renderings (list/board/calendar/table). Constants confirmed correct (c16='מועד', c17='שעה' from content file). Pattern matches new learning L2026-09-10 (entity-level sort, not particle-level).

✅ **Spec syntax valid**: calendar.txt declares `ישות פגישה ... | מיון: מועד עולה, שעה עולה` — syntax matches SPEC-LANG.md, field names exist, order correct.

✅ **Calendar compilation**: gen_app_calendar_ent1.dart compiles (police confirmed analyzer errors=0); no syntax errors in sort closure, valid Dart 2.x comparator.

✅ **All calendar files present**: 10 files (root/hub/home/shell/audit/settings/flags/behavior/main/ent1) with consistent timestamps (10:37 Sep 10).

✅ **Coverage**: Read task spec, inspector output, generated Dart, police report, specs, content mappings. Could not run flutter analyze (Dart not installed), so relied on machine report verification.

---

**Summary**: Calendar task sorting works correctly. Regression: sechirut app was unintentionally regenerated (P1).
