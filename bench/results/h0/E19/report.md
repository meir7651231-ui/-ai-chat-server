# Report: Adding Protected Flag Counter to Peruk25 Dashboard

## Task
Add to the dashboard (לוח בקרה) in peruk25 a counter of cases whose סיווג (classification) is דגל מוגן (protected flag).

## Changes Made

### 1. Modified Generator Logic
**File**: `machtzev/generator/peruk.mjs` (line 168)

Updated the dashboard generation template to add a counter for cases with `סיווג=דגל מוגן`:
- Checks if the document has classification (סיווג) options
- If "דגל מוגן" is one of the classification options, adds a counter: `מונה(תיק: סיווג=דגל מוגן)`
- The counter is added alongside the existing case counter: `מונה(תיק)`

### 2. Regenerated Spec
**File**: `machtzev/generator/specs-ds/peruk25.txt` (line 7)

Regenerated peruk25 spec file from source markdown using `node machtzev/generator/peruk.mjs --all`

Result: Dashboard now includes both counters:
```
לוח בקרה עם מונה(תיק), מונה(תיק: סיווג=דגל מוגן)
```

## Verification

✓ **Police check (--fast)** — peruk gate passed
- All 28 peruks regenerated successfully
- peruk-25 shows: "3 שדות · 5 חלקים · 34 תוכן · סיווג 4 · שרשרת 0"

✓ **App regeneration** — peruk25 app compiles successfully
- Dashboard (דשבורדים) renders with 1 board entity
- Particles and wiring are intact: 7/7 particles found
- No errors in compilation

✓ **No breaking changes**
- Other peruks unaffected
- Generator logic only adds counter when "דגל מוגן" classification exists
- Syntax validated by existing parser

## Implementation Details

The solution leverages the existing classification field detection:
1. When perukToSpec processes a document with a `סיווג` enum field
2. It extracts classification options into the `classes` array
3. If "דגל מוגן" is present in classes, the dashboard template adds a filtered counter
4. The counter uses the standard syntax: `מונה(entity: field=value)`

This matches the pattern used in peruk01 for severity-based counters on findings.
