# Task H03 Inspection Report — Tasks Table Sorting

## Change Summary
Added particle definition to `machtzev/generator/specs-ds/tasks.txt` to create a sorted table view:
```
חלקיק משימה: [טבלה] מה, מועד, סכום, הערה | מיון: מועד עולה
```

## Audit Checklist

### Task Coverage
- ✅ Entity `משימה` with fields: מה (what), מועד (date), סכום (amount), הערה (note)
- ✅ Particle screen created with table view of all fields
- ✅ Sorting specification: `מיון: מועד עולה` (sort by due date ascending)
- ✅ Interpretation: "עולה" = ascending = soonest dates first ✓

### Numeric Handling
- ✅ סכום field (amount) is numeric, displayed as column
- ✅ No computed numeric values affected

### Edge Cases
- ✅ Empty table handling: particles.mjs doesn't require data validation at spec layer
- ✅ Date parsing: מועד field type is inferred from schema (date type)
- ✅ Multiple entities with same date: sort is stable via sortLambda

### State Leakage
- ✅ No state mutation in spec
- ✅ Sorting is data-layer only (in generated Dart code)
- ✅ No shared state between particles

### Navigation
- ✅ Particle definition doesn't add navigation
- ✅ Existing app shell untouched
- ✅ Table drill-down is inherited from particles.mjs render

### Text Parity
- ✅ Fields are verbatim from entity definition: מה, מועד, סכום, הערה
- ✅ Sort keyword is spec-lang.data.json standard: עולה
- ✅ Particle keyword (חלקיק) and syntax match existing specs (panuy.txt, peruk01.txt)

## Machine Verification
```
✅ regen_ok — generator pipeline successful
✅ gates_pass — all protocol gates passed
✅ byte_identical_others — no hand-edits detected
✅ sort — px1 check confirms sorting specification parsed correctly
```

## VERDICT: **GO**

**Rationale:** 
- Change is minimal: one-line spec addition
- Sorting logic is proven in particles.mjs (sortLambda)
- Generator successfully parsed spec and emitted Dart code
- No breaking changes to existing functionality
- Text and numeric fields validated
