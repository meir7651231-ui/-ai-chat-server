# ADR: Add דחופים counter to peruk21

## Opening Question
Should the דחופים counter be added to the existing control panel (לוח בקרה) on line 8, or should it be a separate particle display?

## Assumed Answer
Add it to the existing control panel as a second counter, displaying alongside the total case count. This follows the current pattern where multiple metrics can be shown in one dashboard.

## Implementation Decision
Modify line 8 of machtzev/generator/specs-ds/peruk21.txt to add a second counter using the conditional count syntax: `count(<ישות>: <שדה>=<ערך>)` to count תיק records where סיווג equals "הזמנה לוועדה".

The new line will be:
```
לוח בקרה עם מונה(תיק), דחופים = מונה(תיק: סיווג=הזמנה לוועדה)
```

This adds a new metric named דחופים to the dashboard without breaking the existing total count.
