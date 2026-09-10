# Task: Add מרחק אבסולוטי computed field

**Goal:** Add a computed field "מרחק אבסולוטי" (absolute distance) to the panuy.txt spec equal to abs(הפרש רוחב), computed by the app without breaking anything.

**10-step decomposition:**

1. Understand current panuy.txt structure: entity אדם with computed fields (הפרש רוחב, הפרש אורך, מרחק בריבוע, מרחק בקמ)
2. Search for similar abs() usage patterns in existing specs using search-record.mjs
3. Identify correct syntax for abs() function in spec-lang
4. Add the field to line 4 (entity definition): מרחק אבסולוטי = abs(הפרש רוחב)
5. Optionally add particle display for the new field (lines 6+) if needed
6. Byte-verify the panuy.txt file hasn't been corrupted
7. Verify no other files in new/ were hand-edited
8. Write claims.json with specific check claims
9. Run police-bench to verify all checks pass
10. Audit work through lenses (task-coverage, money-numeric, edge-crash, state-leakage, navigation, text-parity)

**Notes:**
- The field should be in the entity definition (line 4) as a computed field
- May also need to add as particle display (optional, check if particles list needs updating)
- Must use abs() function or similar Math function available in the DSL
