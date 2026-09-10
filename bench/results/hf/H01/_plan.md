# Plan — H01: Sort by distance, show km (10 steps)

## Goal
Make the generated app's list sorted by distance from the user (nearest first), with distance displayed in real km using the square root of the squared-distance field.

## 10-Step Decomposition

1. **Read the spec engine docs** — Understand how `app-ds.mjs` works for sorting/ordering lists in generated apps.

2. **Examine panuy.txt structure** — Identify the current particle definition, fields, and display order. Find where the sort should be declared.

3. **Find similar sorting examples** — Search the specs-ds/ directory for any existing specs that sort a list by a numeric field.

4. **Understand distance field** — Verify that `מרחק בקמ` is correctly computed as `sqrt(מרחק בריבוע)` and that it's displayed in particles.

5. **Modify panuy.txt spec** — Add an explicit sort clause to the particle definition (or to the entity/list definition) to sort by distance ascending.

6. **Run the generator** — Execute the generator to create Dart code from the modified spec.

7. **Verify generated Dart** — Check that the `_people` list is sorted by distance and that distance is shown in km (not squared).

8. **Test the machine report** — Run the task's checks to verify no hand-edits outside new/, no byte inconsistencies, gates pass.

9. **Audit own work** — Check task-coverage, numeric values, edge cases, state leakage, navigation, text parity in _insp.md.

10. **Declare done or blocked** — If all checks pass, write VERDICT: GO. If stuck, document the loop and stop.

---

## Expected Changes
- **File:** `machtzev/generator/specs-ds/panuy.txt`
- **Modification:** Add sort clause or re-order particle to sort by `מרחק בקמ` ascending
- **Verification:** Machine report confirms regen_ok + no_hand_edit + byte_identical_others + gates_pass
