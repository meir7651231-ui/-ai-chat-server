# ✅ VALIDATOR FINDINGS — Peruk25 Counter (E19)

## CONFIRMED Findings (ranked by severity)

**compile-1** · CONFIRMED (P0 compile-break) · gen_app_peruk25_scr2.dart:20 `.records(...).where((r) => (r[gen_app_peruk25_scr2_c9] ?? '') == gen_app_peruk25_scr2_c10).length` · Add `.toList()` after `.where()` — Iterable lacks `.length` property in standard Dart

**compile-2** · CONFIRMED (P0 compile-break) · gen_app_peruk25_scr2.dart:21 `.records(...).where((r) => (r[gen_app_peruk25_scr2_c9] ?? '') == gen_app_peruk25_scr2_c10).length` · Add `.toList()` after `.where()` — same issue in ForgeWaveformBars values array

## FALSE-POSITIVE Findings

**hub_label** · FALSE-POSITIVE · Police report claims 0× matches, but manual inspection confirms 2 KvLine widgets exist on line 20 with labels c2 ('תיק') and c5 ('דגל מוגן') — pattern matcher may not resolve variable references; code is correct

**hub_where** · FALSE-POSITIVE · Police report claims 0× matches, but manual inspection confirms `.where()` filter exists on lines 20–21 with correct field (c9='סיווג') and value (c10='דגל מוגן') — pattern matcher issue, not code defect (though lines have the `.length` compile error)

## Analysis

**Spec compliance**: ✅ Line 7 of peruk25.txt correctly modified to `מונה(תיק), מונה(תיק: סיווג=דגל מוגן)`

**Content constants**: ✅ All correct: c2='תיק', c5='דגל מוגן', c9='סיווג', c10='דגל מוגן'

**Dashboard layout**: ✅ Two KvLine widgets in side-by-side Row with SizedBox separator as required

**Filter semantics**: ✅ Safe null-coalescing and string equality, no invalid Dart.math operations

**Dart compilation**: ❌ BROKEN — `.where()` returns `Iterable<T>`, which lacks `.length` without `.toList()`. Pattern in ds_store.dart line 25 shows correct form: `.where(...).toList()`. The codebase has no custom extension on Iterable.

**Police report discrepancy**: regen_ok ✅ and gates_pass ✅ claimed, but standard Dart will reject `.length` on Iterable. Either gates don't validate compilation rigorously (as noted in audit-compile.md), or environment has non-standard extensions.

---

FIX-LIST: compile-1, compile-2
