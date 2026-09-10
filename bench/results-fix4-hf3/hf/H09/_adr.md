# ADR: Add סכום מעוגל Computed Field to tasks.txt

## Context
Task H09 requires adding a computed field `סכום מעוגל` (rounded amount) to the tasks entity in machtzev/generator/specs-ds/tasks.txt. This field should round the existing `סכום` (amount) field to the nearest whole number.

## Decision
Add a computed field line to the משימה entity using the spec-lang syntax for computed fields:
```
סכום מעוגל = round(סכום)
```

The modified entity line will be:
```
ישות משימה עם מה*, מועד, סכום, סכום מעוגל = round(סכום), הערה | שלבים: פתוח, נעשה
```

## Rationale
1. **Spec Language Support**: SPEC-LANG.md line 12 explicitly lists `round(…)` as a supported function for computed fields
2. **Existing Pattern**: panuy.txt demonstrates the same syntax pattern with `מרחק בקמ = sqrt(מרחק בריבוע)`, confirming this is the standard way to declare computed fields
3. **Type Inference**: Field name `סכום מעוגל` contains "סכום", which triggers the number type in spec-lang (line 11), appropriate for the rounded numeric result
4. **No Engine Changes**: This task can be solved entirely within the spec-lang syntax — no engine changes needed

## Alternatives Rejected
1. **Modify engine code directly** — rejected because the spec language already supports computed fields with the `round()` function
2. **Add to Dart manually** — rejected because the spec generator should handle all field definitions
3. **Use a different rounding method** — `round()` is the standard and available function

## Consequences
- The tasks app will have an additional computed field rendered in the generated Dart
- The field will be available for display/export through the app's particle system
- Generated Dart must pass `flutter analyze` (must use correct Dart math functions: `num.round()` method)

## Verification (post-implementation)
- [ ] Run `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/tasks.txt --name tasks --skin` to regenerate
- [ ] Check generated Dart code contains proper `round()` call on סכום value
- [ ] Verify other apps remain byte-identical via police-bench
- [ ] Run full police-bench to confirm all gates pass
