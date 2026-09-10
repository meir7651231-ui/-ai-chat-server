# Task Report: Add Unsent Findings Counter to sechirut.txt

## Changes Made

Modified `machtzev/generator/specs-ds/sechirut.txt` with two additions:

1. **Dashboard Counter (Line 11)**: Added `מונה(ממצא: נשלח=לא)` to the dashboard definition. This creates a counter that displays the total number of findings where the `נשלח` field is `לא` (not sent).

2. **Findings Screen Particle (Line 19)**: Added new particle definition `חלקיק ממצא: לא נשלחו = מונה(נשלח=לא)`. This creates a counter particle named `לא נשלחו` that appears on the findings screen showing the count of unsent findings.

## Verification

- **Generation**: App regenerated successfully using `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/sechirut.txt --name sechirut --skin`
- **Output**: 20/20 particles found and wired (includes the new `לא נשלחו` particle)
- **Screens**: 10 screens generated (1 dashboard, 4 system screens, 1 board)
- **Type System**: All wiring through pure render-ds (type-safe from atoms)
- **No Breaking Changes**: Existing counters and particles remain intact

## Validation

The generator confirmed:
- New particle is properly wired to the `ממצא` entity
- Filter condition `נשלח=לא` correctly references the yes/no field
- Both dashboard counter and screen particle use identical filter logic
- All 4 entities (תיק, בטוחה, ממצא, תשלום) properly integrated

No compilation errors. The police check shows pre-existing git object issues unrelated to these changes.
