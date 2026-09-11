# ✅ Validation Report — M06 (panuy) computed field קרוב

## Summary
All police checks pass (syntactic correctness), but three independent auditors identified the same real logic bug: the generated display code reads from form input state (`_v[14]`) and returns empty/user-typed values instead of the required constant strings ('קרוב'/'רחוק'). The field fails semantically despite syntactic validity.

---

## Findings

**A1** · CONFIRMED · new/dart-gen-bs/gen_app_panuy_ent1.dart:50 `gen_app_panuy_ent1_c32: ''` · Field saved as empty string instead of being computed; remove from save map or compute the value

**A2** · CONFIRMED · new/dart-gen-bs/gen_app_panuy_ent1.dart:91 `(_v[14] ?? '')` in _card() · Display returns form input slot instead of constant; change `(((num.tryParse(_v[10] ?? '') ?? 0) < 100) ? (_v[14] ?? '') : gen_app_panuy_ent1_c33)` to `(((num.tryParse(r[gen_app_panuy_ent1_c24] ?? '') ?? 0) < 100) ? gen_app_panuy_ent1_c32 : gen_app_panuy_ent1_c33)`

**A3** · CONFIRMED · new/dart-gen-bs/gen_app_panuy_ent1.dart:99 `(_v[10] ?? '')` in _csv() · CSV export uses form state for all records; change same ternary to read record values: `(((num.tryParse(r[gen_app_panuy_ent1_c24] ?? '') ?? 0) < 100) ? gen_app_panuy_ent1_c32 : gen_app_panuy_ent1_c33)`

**A4** · CONFIRMED · new/dart-gen-bs/gen_app_panuy_ent1.dart:178 `(_v[14] ?? '')` in _live() · Form display returns empty; change `(((num.tryParse(_v[10] ?? '') ?? 0) < 100) ? (_v[14] ?? '') : gen_app_panuy_ent1_c33)` to `(((num.tryParse(_v[10] ?? '') ?? 0) < 100) ? gen_app_panuy_ent1_c32 : gen_app_panuy_ent1_c33)`

**A5** · CONFIRMED · new/dart-gen-bs/gen_app_panuy_ent1.dart:188 `(_v[10] ?? '')` in ForgeDataGrid · Table view evaluates condition once per form state, not per record; change ternary to `(((num.tryParse(r[gen_app_panuy_ent1_c24] ?? '') ?? 0) < 100) ? gen_app_panuy_ent1_c32 : gen_app_panuy_ent1_c33)`

---

## Machine Checks vs. Auditor Reality

The police report shows all checks passing:
- `compiles ✅` — Dart syntax is valid (but logic is wrong)
- `gates_pass ✅` — Spec syntax is valid
- `dart_math_sane ✅` — `<` operator and `sqrt()` are correct
- `calc ✅` — Field structure counted correctly

**Root cause**: Machine validates SYNTAX, not SEMANTICS. The code parses and compiles but reads from wrong variables (form state vs. record values) and returns wrong values (form slots vs. constants).

---

## Byte Evidence

**Line 50 — Save as empty:**
```dart
gen_app_panuy_ent1_c32: ''
```
Should either be removed (computed fields don't save) or computed: `(((num.tryParse(_v[10] ?? '') ?? 0) < 100) ? gen_app_panuy_ent1_c32 : gen_app_panuy_ent1_c33)`

**Line 91 — Card display:**
```dart
(((num.tryParse(_v[10] ?? '') ?? 0) < 100) ? (_v[14] ?? '') : gen_app_panuy_ent1_c33)
```
Uses `_v[10]` (form edit state) inside method that receives record `r`. Should use `r[gen_app_panuy_ent1_c24]`. Uses `_v[14]` (empty form field) instead of constant `gen_app_panuy_ent1_c32`.

**Line 99 — CSV export:**
```dart
for (final r in appStore.records('app_panuy_ent1')) {
  ...
  (((num.tryParse(_v[10] ?? '') ?? 0) < 100) ? (_v[14] ?? '') : gen_app_panuy_ent1_c33)
  ...
}
```
Uses `_v[10]` and `_v[14]` inside loop over `r`; evaluates form state for every record instead of each record's values.

**Line 178 — Form display:**
```dart
_live(gen_app_panuy_ent1_c32, (((num.tryParse(_v[10] ?? '') ?? 0) < 100) ? (_v[14] ?? '') : gen_app_panuy_ent1_c33))
```
Returns `_v[14]` (empty) instead of constant `gen_app_panuy_ent1_c32`.

**Line 188 — Table view:**
```dart
rs.map((r) => [..., (((num.tryParse(_v[10] ?? '') ?? 0) < 100) ? (_v[14] ?? '') : gen_app_panuy_ent1_c33)])
```
Same pattern: `_v[10]`/`_v[14]` inside loop; should be `r[gen_app_panuy_ent1_c24]` and `gen_app_panuy_ent1_c32`.

---

FIX-LIST: A1, A2, A3, A4, A5
