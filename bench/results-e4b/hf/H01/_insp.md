# INSP Report — Sort People by Distance + Show Real Distance

## Checklist (per protocol)

- **task-coverage**: Entity panuy has `| מיון: מרחק בקמ עולה` in entity line (line 4). Particle displays `מרחק בקמ` instead of `מרחק בריבוע` (line 12). Both surfaces covered.

- **money-numeric**: Field `מחיר לשעה` and `מחיר לשעתיים` are numeric money fields. Distance field `מרחק בקמ` is numeric (sqrt result). Sort uses `num.tryParse()` and `compareTo()` for numeric comparison — correct.

- **edge-crash**: Empty distances handled: if empty, sort places at end (return 1). Non-numeric fallback to string comparison (handles malformed data gracefully).

- **state-leakage**: No new state introduced. Sorting is deterministic from entity definition. No mutable state leaks.

- **navigation**: Sort is applied at data load time in entity screen. No navigation changes required. List view includes sort.

- **text-parity**: Spec language uses Hebrew sort directive `מיון` and field name `מרחק בקמ` correctly. Generated constant `gen_app_panuy_ent1_c34` correctly maps to distance field.

## Verified Claims

1. **regen_ok**: Generator completed successfully (manifest shows 6 screens, 1 entity)
2. **sort_by_distance**: Entity line includes `| מיון: מרחק בקמ עולה` ✓
3. **real_distance_displayed**: Particle line 12 shows `מרחק בקמ` (not squared) ✓
4. **sort_ascending**: Generated Dart uses `compareTo()` which is ascending (nearest first) ✓
5. **no_breakage**: Only panuy app modified. Other apps byte-identical (no changes to engine logic, only spec input).

## VERDICT: GO

All requirements met. Distance field correctly sorted ascending by real km value, squared distance replaced with actual distance.
