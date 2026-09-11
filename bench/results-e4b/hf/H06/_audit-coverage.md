# Audit: peruk12 Task Coverage

**Task:** Make the cases table sorted by price (מחיר), cheapest first, comparing as numbers (not as text).

**Spec reference:** machtzev/generator/specs-ds/peruk12.txt, line 10:
```
חלקיק תיק: [טבלה] לקוח, טלפון, מחיר | מיון: מחיר מהנמוך
```
(Particle Tik: [Table] client, phone, price | sort: price cheapest-first)

## Findings

**new/dart-gen-bs/gen_app_peruk12_ent1.dart:171** · Table in entity list screen has NO sort applied to items before display · P1 wrong result · Apply `.toList()..sort()` to `rs` using numeric compareTo on price field (c13='מחיר') before mapping to items, matching the pattern in gen_app_peruk12_px1.dart:25

**Verification:**
- ✅ **px1 screen (gen_app_peruk12_px1.dart:25):** Sort IS implemented correctly with numeric comparison: `appStore.records('app_peruk12_ent1').toList()..sort((a, b) { final x = a[c4] ?? '', y = b[c4] ?? ''; if (x.isEmpty != y.isEmpty) return x.isEmpty ? 1 : -1; final nx = num.tryParse(x), ny = num.tryParse(y); final c = (nx != null && ny != null) ? nx.compareTo(ny) : x.compareTo(y); if (c != 0) return c; return 0; })`
  - c4 = 'מחיר' (price field) ✓
  - Numeric parse with fallback to text compare ✓
  - Empty values sorted to end ✓

- ❌ **ent1 screen (gen_app_peruk12_ent1.dart:171):** Table view uses `rs.map()` directly WITHOUT sort:
  ```dart
  if (_view == 2) return ForgeDataGrid(bare: true, columns: const [...], items: rs.map((r) => [...]).toList());
  ```
  The spec particle declares sort, but ent1 table ignores it. rs is used unsorted.

- ✅ **Machine report:** Police reported sort ✅ px1, which checks only px1, not ent1. The "numeric" check (2×) also verified px1 only.

## Coverage checked
- ✅ Spec parsing: particle has sort spec "מיון: מחיר מהנמוך"
- ✅ px1 generated code: has correct numeric sort by price field
- ❌ ent1 entity list table: missing the sort entirely (rs not sorted before map)
- ✅ Surfaces covered: px1 table + ent1 table = 2 surfaces with [Table] particle; px1 works, ent1 broken
- ✅ Type correctness: sorts use num.tryParse (correct per Dart soundness; num has no .sqrt/.min/.max methods)
- ❌ Task completeness: only px1 shows table (advanced user screen); main entity screen (ent1) shows table unsorted

## Summary
Sort is implemented in the particle screen (px1) but NOT in the main entity list screen (ent1). The task asks for "the cases table sorted"—both usages of the table particle need the sort. Ent1 line 171 needs the sort applied to `rs`.
