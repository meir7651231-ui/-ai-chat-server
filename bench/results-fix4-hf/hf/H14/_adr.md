# ADR: Sort ממצא Findings by Severity Color

## Context
The ממצא (findings) particle screen displays findings grouped by severity color (צבע). The task is to ensure they're always sorted in order: אדום (red), צהוב (yellow), ירוק (green).

## Decision
Add explicit sorting logic to the partition rendering code in `machtzev/generator/particles.mjs` to sort the bands for the ממצא particle. This ensures robustness - even if the spec's enum order changes, the rendering will maintain the correct severity order.

The approach:
1. In `particleWidgets()` function, line 356, after creating groups from `s.bands`
2. For partitions with the field name "צבע" and entity "ממצא", explicitly sort the bands using a custom comparator
3. The sort order: אדום < צהוב < ירוק

## Rationale
- Current implementation relies on enum order from spec, which is correct but fragile
- Explicit sorting makes the requirement clear in code and handles future spec edits
- Only affects ממצא entity, doesn't impact other partitions
- Sorting happens during code generation, not at runtime (zero performance impact)

## Alternatives
1. Modify spec to always have colors in correct order - but spec can change
2. Add constraint in validation - but doesn't fix generation if spec is edited
3. Leave as-is - but less robust

## Consequences
- Generated code will always show findings in correct severity order
- Slight increase in code complexity in particles.mjs
- Need to register a gate to verify the sort order

## Verification
1. Run police to check gate passes
2. Visual inspection of generated gen_app_sechirut_px3.dart
3. Verify DsSections are in order: אדום, צהוב, ירוק

## Implementation
Assumed answer: Sort the bands for ממצא partition partition_shape.field == 'צבע' && entity.name == 'ממצא'
