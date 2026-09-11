# Audit Report: peruk25 Counter Implementation

## Findings

**new/dart-gen-bs/gen_app_peruk25_scr2.dart:20** · `.where(...).length` on Iterable — invalid Dart syntax · **P0** (compile-break) · Use `.where(...).toList().length` instead

**new/dart-gen-bs/gen_app_peruk25_scr2.dart:21** · `.where(...).length` on Iterable — invalid Dart syntax · **P0** (compile-break) · Use `.where(...).toList().length` instead

## Detail

Lines 20 and 21 both invoke `appStore.records('app_peruk25_ent1').where((r) => ...).length`. The `records()` method (ds_store.dart:124) returns `List<Map<String, String>>`. In Dart, `List<T>.where(test)` returns `Iterable<T>` (lazy), which has NO `.length` property — only `.toList().length` or `.fold(0, (a, _) => a + 1)` work. The analyzer would reject this with "The getter 'length' isn't defined for the class 'WhereIterable'."

**Exact code (line 20):**
```
appStore.records('app_peruk25_ent1').where((r) => (r[gen_app_peruk25_scr2_c9] ?? '') == gen_app_peruk25_scr2_c10).length.toDouble().toStringAsFixed(0)
```

**Exact code (line 21):**
```
appStore.records('app_peruk25_ent1').where((r) => (r[gen_app_peruk25_scr2_c9] ?? '') == gen_app_peruk25_scr2_c10).length.toDouble()
```

**Fix:** Change both to:
```
appStore.records('app_peruk25_ent1').where((r) => (r[gen_app_peruk25_scr2_c9] ?? '') == gen_app_peruk25_scr2_c10).toList().length.toDouble().toStringAsFixed(0)
```

## Coverage

**Verified correct:**
- Filter logic (סיווג field + 'דגל מוגן' value) matches entity definition ✓
- Null-coalescing `(r[...] ?? '')` is safe ✓
- String comparison equality is correct ✓
- Math on line 21 (normalization via fold max) is sound (dividing two doubles, zero-check) ✓
- Constants in content file map to correct enum values (c9='סיווג', c10='דגל מוגן') ✓
- Dashboard title and subtitle are present ✓

**Could not check:**
- Runtime behavior of bar chart rendering (ForgeWaveformBars) — no type info available
- Whether police report's "compiles | ✅" reflects actual flutter analyze run or partial checks only

