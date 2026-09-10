# ADR: Add סכום פיצויים and פיצויים לשנה fields to תיק entity

## Context
The תיק (case file) entity in peruk25.txt is used to track termination/severance cases. It currently lacks:
1. A way to record the compensation amount offered (סכום פיצויים)
2. A derived annual equivalent (פיצויים לשנה = סכום פיצויים × 12)

These fields enable the app to calculate and display annual compensation equivalents for comparison.

## Decision
Add two fields to the תיק entity in line 6 of machtzev/generator/specs-ds/peruk25.txt:
- `סכום פיצויים` as a numeric field (type: number, required: false)
- `פיצויים לשנה` as a computed field (formula: סכום פיצויים * 12)

## Rationale
- **Numeric field**: Compensation amounts are inherently numeric; no calculation needed for entry.
- **Computed field**: Annual equivalent is a derived value that aids user decision-making (comparing severance package worth to annual salary).
- **Both appear in תיק entity**: The compensation context is case-specific, not global.
- **No breaking changes**: Existing fields remain untouched; new fields are additive.

## Alternatives rejected
1. Add only the numeric field — loses the benefit of annual comparison view.
2. Add only computed field without numeric input — impossible; no data source for formula.
3. Place fields in a separate entity — violates cohesion; compensation is case-specific context.

## Consequences
- Generator must parse computed field formula (סכום פיצויים * 12) correctly.
- Rendered app will expose both fields in תיק forms, tables, and reports.
- Police checks must pass (gates.tsv, pins.sha256) before completion.

## Verification
1. ✅ peruk25.txt parses without syntax errors after changes.
2. ✅ New fields appear in generated Dart models (lib/genesis/peruk25_models.dart).
3. ✅ All police gates pass (regen_ok, no_hand_edit, byte_identical_others, gates_pass).
4. ✅ claims.json documents the added fields with byte evidence.
