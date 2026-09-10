# ADR — Opening Question (H01)

## Context
The `panuy.txt` spec describes a list of available people (מי פנוי) sorted by distance. The spec has:
- Squared distance field: `מרחק בריבוע = (lat_diff)² × 12321 + (lng_diff)² × 8649`
- Distance in km field: `מרחק בקמ = sqrt(מרחק בריבוע)`
- Particle (table) that displays people

## Opening Question
**"Where should the sorting happen — in the engine/data layer or in the widget/rendering layer?"**

### Assumed Answer
The spec language uses `app-ds.mjs` which means the sort should happen at the **data layer** (in the Dart `_people` list computation), not in the widget. This keeps the sorted state as a derived value (like all computed fields in the spec). The app will read the spec, the engine will wire the sort, and the widget will display presorted data.

## Decision
Fix the spec to explicitly declare the sort order at the data layer level. The generator will wire a sort-comparator on the distance field into the list provider.

## Verification
After implementation:
1. Check that `_people` is sorted by `מרחק בקמ` ascending (nearest first)
2. Check that distance display shows km (not squared distance)
3. Run the machine report to verify no regressions
