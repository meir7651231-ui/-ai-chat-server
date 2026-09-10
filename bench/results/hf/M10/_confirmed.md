# VALIDATOR Report — M10 (calendar field addition)

## Findings Summary

F1 · CONFIRMED · `machtzev/generator/apps/calendar.json:65` `"type": "text"` should be `"type": "num"` · Add `"דקות"` to `spec-lang.data.json` typeNum list (lines 13–27)

F2 · CONFIRMED · `new/dart-gen-bs/gen_app_calendar_ent1.dart:162` widget uses `DsField` (text input) instead of numeric input · Same root cause as F1; fix depends on F1 being resolved

F3 · CONFIRMED · `spec-lang.data.json` typeNum list missing `"דקות"` prevents type inference for `משך בדקות` field · Add `"דקות"` to typeNum array (exact location: lines 13–27, add as new line in array)

## Detailed Analysis

**Root Cause**: The spec-lang type inference engine (entity.mjs lines 27–33) matches field names against keyword lists to infer types. Field `משך בדקות` contains "דקות" (minutes), but this word is absent from `spec-lang.data.json` typeNum list (which includes "שעות"/hours, "מחיר"/price, "סכום"/sum, etc.). Therefore:
- Parser defaults to `type: "text"` (entity.mjs line 32)
- Generated schema: `"type": "text"` (calendar.json:65)
- Generated Dart widget: `DsField` text input (gen_app_calendar_ent1.dart:162)
- Runtime workaround: `(num.tryParse(_v[5] ?? '') ?? 0)` masks the type error but violates task requirement

Computed field `משך בשעות` correctly infers `type: "num"` because "שעות" IS in typeNum list (spec-lang.data.json:21).

**Verification Details**:
- ✅ Spec file correctly updated (calendar.txt line 6: both fields added with correct formula)
- ✅ Formula syntax valid and correctly compiled to Dart (gen_app_calendar_ent1.dart:51, 163)
- ✅ Null safety correct: `num.tryParse(...) ?? 0` handles string-to-num conversion safely
- ✅ Police report confirmed: `calc | ✅ consts=1 calc=1` (field detection and formula parsing)
- ❌ Schema type violated: task requires "numeric field" but type="text" delivered
- ❌ UI widget violated: accepts arbitrary text input instead of numeric validation
- ❌ No other specs use "דקות" — adding to typeNum list is safe, no side-effects

**Task Requirement vs Implementation**:
- Task: "add to the meeting entity a **numeric field** משך בדקות"
- Delivered: text field with runtime string-to-number coercion (technical debt)
- Correct fix: make the parser recognize "דקות" as numeric keyword

## Severity Ranking

1. **P1 (High)** — F1: Schema type mismatch breaks task contract; all downstream UI and validation depend on correct type annotation
2. **P1 (High)** — F2: Widget type (DsField vs numeric input) is a symptom of F1; resolving F1 will auto-fix F2 in regeneration  
3. **P1 (High)** — F3: Root cause; single-line fix in spec-lang.data.json

---

## FIX-LIST:

F1 · F2 · F3 (all same fix): Add `"דקות"` to `spec-lang.data.json` typeNum array, then regenerate with `node machtzev/one.mjs --genmax` to update calendar.json schema and gen_app_calendar_ent1.dart widget
