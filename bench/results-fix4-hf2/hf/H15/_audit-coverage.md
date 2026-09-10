# Audit: Peruk21 Case Sorting by Deadline

## Findings

new/dart-gen-bs/gen_app_peruk21_px1.dart:35 · Cases in board/calendar view not sorted by deadline; loop iterates `appStore.records('app_peruk21_ent1')` unsorted, then displays each case's deadline via KvLine. Table on same screen (line 28) is sorted, but this board view breaks consistency · P1 · Sort records before loop: `for (final r in (appStore.records('app_peruk21_ent1').toList()..sort((a, b) { { final x = a[gen_app_peruk21_px1_c7] ?? '', y = b[gen_app_peruk21_px1_c7] ?? ''; if (x.isEmpty != y.isEmpty) return x.isEmpty ? 1 : -1; final nx = num.tryParse(x), ny = num.tryParse(y); final c = (nx != null && ny != null) ? nx.compareTo(ny) : x.compareTo(y); if (c != 0) return c; } return 0; })))`

## Coverage

**Verified correct:**
- ✅ Entity list screen (gen_app_peruk21_ent1.dart:155): All three views (list/kanban/table) use sorted records; sort applies `compareTo()` on `gen_app_peruk21_ent1_c24` ('עד מתי'); handles empty values last, numeric vs lexical comparison correctly
- ✅ Particle table screen (gen_app_peruk21_px1.dart:28): ForgeDataGrid sorts by `gen_app_peruk21_px1_c7` ('עד מתי') with same robust comparison logic (numeric-first, empty-last), ascending order (soonest first)
- ✅ Spec synchronization: Both entity definition and particle definition in specs-ds/peruk21.txt include "מיון: עד מתי עולה"
- ✅ Constants: Content files correctly map c7 and c24 to 'עד מתי' field
- ✅ Machine gates: sort_px and sort_ent both passed (though gates verified only table and entity list, not all surfaces on particle screen)

**Could not verify:**
- Compile-time behavior (no Flutter/Dart tooling available); relied on Dart language semantics (null safety, `compareTo()` behavior, `num.tryParse()` returns `num?`)
- Whether date-string values in 'עד מתי' field actually sort correctly as intended (e.g., "5.9.2026" vs "10.9.2026" as strings would sort lexically, not chronologically)
