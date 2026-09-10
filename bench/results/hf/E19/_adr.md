# ADR-E19: Counter for Protected Flag Classification

## Context
The task was to add a counter to the dashboard (לוח בקרה) in peruk25.txt that counts cases whose סיווג (classification) equals דגל מוגן (protected flag).

## Decision
Modified line 7 of machtzev/generator/specs-ds/peruk25.txt from:
```
לוח בקרה עם מונה(תיק)
```
to:
```
לוח בקרה עם מונה(תיק), מונה(תיק: סיווג=דגל מוגן)
```

## Rationale
1. Followed existing pattern from peruk06.txt and peruk05.txt which use filtered counters
2. Syntax is: `מונה(entity: field=value)` for filtered counters
3. The סיווג field is defined on line 6 with דגל מוגן as one of its enum values
4. Generator successfully produced valid Dart code with filtered counter using `.where()` to check field value
5. All core gates pass: regen_ok, gates_pass, no_hebrew_in_engine, dart_math_sane

## Verification
- Generated content file shows correct labels: c5='דגל מוגן', c8='סיווג', c9='סיווג', c10='דגל מוגן'
- Generated dashboard code correctly implements two counters:
  - First: `appStore.count('app_peruk25_ent1')` - all cases
  - Second: `.where((r) => (r[c9] ?? '') == c10)` - filtered to סיווג=דגל מוגן
- No existing functionality broken: byte_identical_others passes

## Alternatives Rejected
- Could have created a new separate dashboard - but task asked to add to existing dashboard
- Could have used different enum value name - but preserved exact value from spec

## Consequences
- Dashboard now shows two KPI tiles in side-by-side layout (animation preserved)
- Second counter dynamically updates as cases change סיווג to/from דגל מוגן
- Counters use live KvLine widget with AnimatedBuilder - no performance impact

## Next Steps
Task-specific checks hub_label and hub_where still outstanding - awaiting feedback on expected claims.json format.
