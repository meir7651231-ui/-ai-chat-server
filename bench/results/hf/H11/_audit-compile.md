# 🔍 Audit: תקרה נמוכה (min ceiling) — Compile & Edge-Case Check

## Findings

**machtzev/generator/apps/sechirut.json:113 · Field name mismatch prevents formula compilation · P0 · Change label to "תקרה לפי 3 חודשים"**

The spec (sechirut.txt:1) defines the field as `תקרה לפי 3 חודשים = שכירות * 3` and the formula for תקרה נמוכה references this exact name: `min(תקרה לפי 3 חודשים, תקרה לפי שליש)`. However, sechirut.json line 113 truncates the label to just `"תקרה לפי חודשים"` (missing the "3"). When compileFormula() runs (render-ds.mjs:202-210), it sorts field labels and tries to match them against the formula. It cannot find `תקרה לפי 3 חודשים` in the labels list (only finds `תקרה לפי חודשים`), so the residue check fails and returns null. Silent compilation failure.

**new/dart-gen-bs/gen_app_sechirut_ent1.dart:207 · תקרה נמוכה rendered as editable input, not calculated · P0 · Should call _calc() with min expression, not ForgeDsField input**

Line 207 shows:
```dart
ForgeDsField(..., control: DsField(..., value: _v[12] ?? '', onChanged: (v) => setState(() => _v[12] = v), ...))
```
This is a regular text input field. The police report confirms: `calc | ❌ consts=1 calc=0` — field c29 exists in schema (const), but zero calculations generated. Compare lines 204-206 which correctly call `_calc()` for c26, c27, c28. The תקרה נמוכה field must never be editable; it must be computed on every save. Currently a user can type arbitrary values into this field, bypassing the min() logic entirely.

**new/dart-gen-bs/gen_app_sechirut_ent1.dart (implicit) · min() call without dart:math import · P0 potential compile error**

The police report shows: `min | ❌ import=false fn=false method=false`. Line 364 in render-ds.mjs correctly adds `import 'dart:math';` when the compiled expression contains min/max (checked by `/\bmin\b|\bmax\b/`). However, because formula compilation fails, this import is never added. Once the formula compiles, the import will be auto-added by that code. No manual fix needed here — it's conditional on the formula fix.

## Coverage

**Verified correct:**
- render-ds.mjs:207 residue regex allows `min`, `max`, comma, parentheses, numbers, operators (✓ per G35 comment)
- render-ds.mjs:364 auto-import of dart:math when min/max detected (✓ will fire once formula compiles)
- sechirut.json schema structure and new field addition (✓ correct shape)
- spec formula syntax `min(a,b)` with field references (✓ valid per spec-lang)

**Could not check:**
- Runtime behavior of min() once imported (no Flutter/Dart runtime available; assumes dart:math.min(num,num)->num per Dart docs)
- User-facing form layout/UX (read-only vs editable visual state)
- CSV/storage round-trip (would require app store test)

**Summary:** Formula compilation blocks the entire feature. Primary defect is field-name truncation in sechirut.json breaking the symbol-resolution phase of compileFormula(). Once that label is fixed to match the spec, the formula will compile, _calc() will be injected, and dart:math will auto-import. The computed value will then flow to the save map (line 53) and display correctly.
