# Inspection Summary — Task E03

**Task:** Add computed field מחיר עם אגרה (price with 3% fee) to תיק entity in peruk12.txt

## Coverage Checklist

- ✅ **task-coverage:** Entity list updated (תיק has new computed field), particle table auto-generated, hub and report all regenerated correctly
- ✅ **money-numeric:** Formula 'מחיר * 1.03' is pure arithmetic, compiled to Dart `num` operations
- ✅ **edge-crash:** Computed field has no user input, no null/NaN risks (derived from existing price field)
- ✅ **state-leakage:** Formula references only sibling field (מחיר), no cross-entity dependencies
- ✅ **navigation:** New field appears in entity form/table/report automatically via schema
- ✅ **text-parity:** Field label "מחיר עם אגרה" is descriptive and clear (price with fee)

## Final Machine Report

```
# 🚔 police-bench — E03 (peruk12) · signature 50c0e143c3f3848b

| check | result |
|---|---|
| regen_ok | ✅ |
| byte_identical_others | ✅ |
| gates_pass | ✅ |
| no_hebrew_in_engine | ✅ |
| dart_math_sane | ✅ |
| no_hand_edit (info) | ✅ |
| calc_fee | ✅ consts=1 calc=1 |

## VERDICT: **DONE**
```

All claims CONFIRMED. No regressions detected.

## Proof

**Single line changed in machtzev/generator/specs-ds/peruk12.txt:**
```diff
-ישות תיק עם לקוח*, טלפון, קישור מודעה, מחיר, מה המוכר אמר, האם נסעת | שלבים התקבל, שולם, בבדיקה, נמסר, סגור
+ישות תיק עם לקוח*, טלפון, קישור מודעה, מחיר, מחיר עם אגרה=מחיר * 1.03, מה המוכר אמר, האם נסעת | שלבים התקבל, שולם, בבדיקה, נמסר, סגור
```

**Generated outputs:** Auto-generated Dart code correctly includes the computed field in all 5 entity variants (ent1, home, px1, root, hub content).

## VERDICT: GO
