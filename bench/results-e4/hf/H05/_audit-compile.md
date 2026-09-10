# 🔍 Audit Report: peruk02 Sort Implementation

## Findings

`new/dart-gen-bs/gen_app_peruk02_ent1.dart:179` · Table rows unsorted despite spec directive · **P1 task-incomplete** · Add `rs.sort((a, b) => (a[gen_app_peruk02_ent1_c13] ?? '').compareTo((b[gen_app_peruk02_ent1_c13] ?? '')));` after line 176, before table items are rendered.

## Coverage

✅ **Checked:**
- Spec file `machtzev/generator/specs-ds/peruk02.txt` line 10: sorting directive present: `[טבלה] | מיון: תאריך מסירת מפתח עולה` 
- Particle plan `machtzev/generator/particle-plan-peruk02.json`: sort metadata captured: `"expr": "[טבלה] | מיון: תאריך מסירת מפתח עולה"`
- Generated Dart file `gen_app_peruk02_ent1.dart` line 179: table view (\_view == 3) uses `ForgeDataGrid(bare: true, columns: const [...], items: rs.map(...).toList())`
- Content constants: `gen_app_peruk02_ent1_c13 = 'תאריך מסירת מפתח'` (key-handover date field)
- No `.sort()` calls found in gen_app_peruk02_ent1.dart (grep confirmed)
- Police report "sort ✅ px1" passed, but claim "sorting_applied" marked "UNVERIFIED"

❌ **Cannot verify (Flutter not installed):**
- Runtime behavior: whether DsTable or ForgeDataGrid has built-in sorting that compensates
- Null-safety of compareTo on empty strings (`.compareTo()` is safe on String; `??` ensures non-null)

## Root Cause

The spec directive is parsed and stored in particle-plan-peruk02.json, but the entity rendering (`renderEntity` in render-ds.mjs) receives `sort: r.sort || []` from the entity interpreter. The entity parser (`entity.mjs` via `entInterpret`) does not extract sort directives from particle specifications. Particles and entities are rendered separately; particle sort is NOT propagated to entity table rendering.

## Fix Specifics

Line 176 defines `rs` (filtered records):
```dart
final rs = q.isEmpty ? all : all.where((r) => r.entries.any((e) => !e.key.startsWith('__') && e.value.toLowerCase().contains(q))).toList();
```

Insert sort BEFORE table items are mapped (line 179):
```dart
rs.sort((a, b) => (a[gen_app_peruk02_ent1_c13] ?? '').compareTo((b[gen_app_peruk02_ent1_c13] ?? '')));
```

This is a string `.compareTo()` (lexical order), which is correct for ISO date strings (YYYY-MM-DD sorts correctly lexically). Earliest-first = natural ascending order.
