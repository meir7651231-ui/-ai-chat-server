# Task Plan: Sort ממצא (Findings) Table by Color Severity

## Goal
In the app generated from `machtzev/generator/specs-ds/sechirut.txt`, sort the findings (ממצא) particle screen by severity color in the order: אדום (red), צהוב (yellow), ירוק (green). Don't break anything.

## Decomposition (10 steps)

1. **Understand the spec structure** — Read sechirut.txt to identify how ממצא entities are defined and rendered
   - ממצא entity defined at line 9 with צבע field (אדום|צהוב|ירוק)
   - Particle defined at line 24 as a findings list screen

2. **Locate the generator** — Find the code that generates the particle screen for ממצא
   - Search for where particle screens are generated
   - Identify the rendering logic for ממצא findings

3. **Find sorting logic** — Identify where the findings are currently sorted (if at all)
   - Check if there's existing sort logic
   - Determine the data structure being sorted

4. **Design the sort key** — Create a color-to-priority mapping
   - אדום = 1 (highest priority, shown first)
   - צהוב = 2 (medium priority)
   - ירוק = 3 (lowest priority, shown last)

5. **Implement sorting in spec language** — Try to express sorting in spec-lang if possible
   - Check if spec-lang supports sort/order directives
   - If yes, add sort directive to sechirut.txt

6. **Implement sorting in engine** — If spec-lang doesn't support it, modify the generator
   - Find the engine code that renders particle screens
   - Add sort logic for ממצא specifically

7. **Verify no hand-edits in outputs** — Ensure changes don't modify generated Dart files directly
   - Only modify spec or engine, never touch new/dart-gen-bs outputs

8. **Run police checks** — Use the allowed machine report to verify changes
   - Run: `node /tmp/claude-0/.../police-bench.mjs --root . --task H14 --claims ./claims.json ...`

9. **Document findings** — Write a LEARNINGS entry if a new pattern is discovered

10. **Write final verdict** — Report DONE / NOT DONE based on machine output

## Key Constraints
- Cannot run: machtzev/one.mjs, machtzev/generator/ship.mjs, machtzev/generator/tighten-types.mjs
- Cannot edit generated outputs (new/dart-gen-bs, new/dart-data-bs, new/dart-forge-bs)
- Must use spec-lang or engine modifications only
- Final report must be verified by machine
