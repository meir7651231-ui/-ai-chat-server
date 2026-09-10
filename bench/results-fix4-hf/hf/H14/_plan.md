# Goal
Sort the ממצא (findings) particle screen by severity color צבע in order: אדום (red), צהוב (yellow), ירוק (green).

# Decomposition
1. Identify where ממצא entity schema is generated (likely from `app-ds.mjs` reading the spec)
2. Find where the "partition" rendering code generates DsSections for enum values
3. Check if enum values are already in correct order in schema (they should be from spec line 9: `צבע{אדום|צהוב|ירוק}`)
4. Find the `partition` rendering logic in `particles.mjs` lines 350-364
5. Check if the issue is that bands aren't being sorted in the desired order
6. Modify either:
   - The schema creation to ensure enum order is correct, OR
   - The partition rendering to explicitly sort bands in the desired order
7. Test by running the machine verification script
8. Verify the app renders findings in correct color severity order
9. Add a gate to enforce this order
10. Write lesson to LEARNINGS.md

# Key Files
- `machtzev/generator/specs-ds/sechirut.txt` — spec (line 9 has enum order)
- `machtzev/generator/app-ds.mjs` — reads spec and builds entities
- `machtzev/generator/particles.mjs` — renders partition shapes (lines 350-364)
- `new/dart-gen-bs/gen_app_sechirut_px3.dart` — generated particle screen

# Current State
- Partition rendering (line 356-362 in particles.mjs) creates groups for each band
- Bands come from `s.bands` which is `f0.enumVals`
- The enum values in data (gen_app_sechirut_ent3_content.dart lines 12-14) are: אדום, צהוב, ירוק (correct order)
- Generated particle screen (gen_app_sechirut_px3.dart line 22) shows DsSections in order: אדום, צהוב, ירוק
- Need to verify if bands are being sorted correctly or if they're being left in original order

# Hypothesis
The partition rendering needs to sort the bands in a specific order (אדום before צהוב before ירוק) instead of relying on the enum order from schema.
