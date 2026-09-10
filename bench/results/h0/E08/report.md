# Task Report: Add Dashboard Counter for מתווך=כן

## What was done
Added a new dashboard counter to `machtzev/generator/specs-ds/sechirut.txt` that counts cases (תיק) where מתווך is כן.

### Change made
**File:** `machtzev/generator/specs-ds/sechirut.txt` (line 11)

**Before:**
```
לוח בקרה עם מונה(תיק), מונה(ממצא: צבע=אדום), מונה(ממצא: צבע=צהוב), מונה(בטוחה: חורג מול 3 חודשים=חורג), מונה(תשלום: שולם=לא), סכום(תשלום.סכום)
```

**After:**
```
לוח בקרה עם מונה(תיק), מונה(תיק: מתווך=כן), מונה(ממצא: צבע=אדום), מונה(ממצא: צבע=צהוב), מונה(בטוחה: חורג מול 3 חודשים=חורג), מונה(תשלום: שולם=לא), סכום(תשלום.סכום)
```

Added counter: `מונה(תיק: מתווך=כן)` positioned after the total case counter for logical grouping.

## How it works
- The counter uses the dashboard's standard counter syntax: `מונה(ישות: שדה=ערך)`
- It filters the תיק entity by the condition `מתווך=כן`
- The field מתווך is already defined in the תיק entity (line 7) as an enum with values {כן|לא}

## Verification
✅ App regenerated successfully without errors:
- Generated 10 screens
- 4 entities
- 1 dashboard (with the new counter)
- Parser confirms all 19/19 particles wired correctly
- No compilation or syntax errors

✅ No existing functionality broken:
- All other counters and dashboard components intact
- Schema validation passed
- System outputs normal status
