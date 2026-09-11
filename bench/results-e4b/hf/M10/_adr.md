# ADR: Add numeric and computed duration fields to calendar meeting entity

## Context
Task M10 requires adding two fields to the meeting (פגישה) entity in calendar.txt:
1. A numeric field משך בדקות (duration in minutes)
2. A computed field משך בשעות = משך בדקות / 60 (duration in hours)

## Decision
1. Added "דקות" to typeNum array in spec-lang.data.json to enable numeric type inference for field names containing "דקות"
2. Updated calendar.txt meeting entity line to include both fields:
   - `משך בדקות` — recognized as numeric type (contains "דקות")
   - `משך בשעות = משך בדקות / 60` — computed field using division

## Rationale
- The spec language supports computed fields with arithmetic operators (line 12 of SPEC-LANG.md confirms / operator support)
- Type inference from field name keywords is the established pattern (no explicit type syntax in spec language)
- Adding "דקות" to typeNum is minimal and follows the language's design (keywords in field names)
- The computed field formula matches Dart's division operator requirements

## Alternatives rejected
- Using a different field name pattern: Would violate task specification (task requires exact name משך בדקות)
- Not marking משך בדקות as numeric: Would fail type validation in generated Dart (numbers required for division)
- Explicit type annotation syntax: Not supported in current spec language

## Consequences
- spec-lang.data.json changed: "דקות" added to typeNum array
- calendar.txt changed: Two new fields added to פגישה entity
- Generated Dart: 
  - Field c14 (משך בדקות) renders as DsNumberField 
  - Field c15 (משך בשעות) computes as `(num.tryParse(_v[5]) / 60).toStringAsFixed(2)`
- Potential impact: Other specs using "דקות" (e.g., peruk23.txt "סדר דקות") will now be recognized as numeric type

## Verification
- Spec language supports division: ✓ (SPEC-LANG.md line 12)
- Computed field syntax verified in generated code: ✓ (gen_app_calendar_ent1.dart line 51)
- Field string constants correct: ✓ (gen_app_calendar_ent1_content.dart)
- Next: Run byte-identical-others check to verify no breaking changes in other apps
