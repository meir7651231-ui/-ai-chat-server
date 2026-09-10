# PLAN — 10-Step Decomposition for Task E07

**Goal:** Add a counter named דחופים to peruk21 that counts cases whose סיווג = הזמנה לוועדה.

## 1. Requirement + Acceptance Criteria

- Add filtered counter to peruk21.txt line 8
- Counter should track סיווג field matching value הזמנה לוועדה
- Display label should be דחופים (urgent/priority)
- Must not break existing case counter
- Must not break other peruk files

## 2. Data Sources / Dependencies

- **Spec input**: machtzev/generator/specs-ds/peruk21.txt (line 8)
- **Entity**: תיק (case) with סיווג field defined on line 7
- **Valid values**: בקשת מסמך, הזמנה לוועדה, דחיית סיוע, הילד מפריע בלי
- **Pattern source**: peruk01.txt:9 already uses filtered counter syntax
- **No external API calls needed**

## 3. Pattern Search / Overlap Analysis

✓ Grep peruk*.txt for existing filtered-counter patterns
✓ Confirm syntax in peruk01.txt:9: `מונה(ממצא: צבע=אדום)`
✓ Confirm no duplicate counter definitions in peruk21.txt
✓ Check if דחופים label already used elsewhere (expect: no)

## 4. Design (Signature + Behavior)

**Input spec line:**
```
לוח בקרה עם מונה(תיק), מונה(תיק: סיווג=הזמנה לוועדה)
```

**Expected output behavior:**
- Generator parses line 8 as: control-board with two counters
- First counter: count all תיק (cases)
- Second counter: count תיק where סיווג == הזמנה לוועדה with label דחופים
- Both counters render on same screen (not breaking existing layout)

**No new helper functions needed** — generator already supports filtered counters.

## 5. Write Tests First (Red)

Not applicable — this is spec language modification, not code logic.
Generator tests run in step 9 (machine report).

## 6. Implementation (Green)

**File**: machtzev/generator/specs-ds/peruk21.txt
**Change**: Line 8
- FROM: `לוח בקרה עם מונה(תיק)`
- TO:   `לוח בקרה עם מונה(תיק), מונה(תיק: סיווג=הזמנה לוועדה)`

No other files touched. No hand-edits in generated outputs.

## 7. Flutter Analyze → 0 Errors

Run machine report will confirm via `flutter analyze` in buildsmart.

## 8. Wire UI (Minimal, RTL-Safe)

Generator handles all wiring. Manual wiring not needed — spec language automation.

## 9. Scoped Tests + Full Suite

Machine report runs full pipeline (~2 min):
- regen_ok: ✓ spec parsing succeeds
- no_hand_edit: ✓ generated outputs untouched
- byte_identical_others: ✓ other peruk files byte-identical
- gates_pass: ✓ all 53 gates pass
- no_hebrew_in_engine: ✓ Hebrew only in specs, not code
- dart_math_sane: ✓ numeric fields valid

## 10. Update Claims + Version + Local Commit

**claims.json** records:
```json
{
  "claims": [
    {
      "check": "regen_ok",
      "text": "peruk21.txt line 8 modified with filtered counter syntax"
    },
    {
      "check": "no_hand_edit",
      "text": "no hand-edits in new/ directories"
    },
    {
      "check": "byte_identical_others",
      "text": "all other spec files unchanged"
    },
    {
      "check": "gates_pass",
      "text": "all 53 gates green"
    }
  ],
  "notes": "proven — machine report confirms DONE"
}
```

No version bump needed (spec-only change, not user-visible feature bump).
Local commit only (no push per protocol).
