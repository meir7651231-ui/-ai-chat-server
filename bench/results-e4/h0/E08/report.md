# Dashboard Counter Addition: מתווך Cases

## Change Made
Added a new dashboard counter to `machtzev/generator/specs-ds/sechirut.txt` (line 11) to track cases where the mediator field (מתווך) is yes (כן).

### Modification
**Before:**
```
לוח בקרה עם מונה(תיק), מונה(ממצא: צבע=אדום), מונה(ממצא: צבע=צהוב), מונה(בטוחה: חורג מול 3 חודשים=חורג), מונה(תשלום: שולם=לא), סכום(תשלום.סכום)
```

**After:**
```
לוח בקרה עם מונה(תיק), מונה(תיק: מתווך=כן), מונה(ממצא: צבע=אדום), מונה(ממצא: צבע=צהוב), מונה(בטוחה: חורג מול 3 חודשים=חורג), מונה(תשלום: שולם=לא), סכום(תשלום.סכום)
```

**Addition:** `מונה(תיק: מתווך=כן)` — counts cases where מתווך (mediator) field equals כן (yes)

## Verification
1. ✅ Spec file updated successfully with new counter
2. ✅ App regenerated without errors: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/sechirut.txt --name sechirut --skin`
3. ✅ Generator output: "✨ אפליקציה חוללה — 10 מסכים, 4 ישויות · 1 דשבורדים"
4. ✅ Pre-tool fixtures: 105/105 passed (no new failures introduced)

## Implementation Details
- Counter follows existing pattern: `מונה(ישות: שדה=ערך)`
- Positioned after the total case counter for logical grouping
- Uses existing field from תיק entity (line 7): `מתווך{כן|לא}`
- Maintains schema consistency with other dashboard counters

## No Breaking Changes
- All existing counters retained
- No entity definitions modified
- Spec syntax valid and parseable
- Dashboard maintains expected functionality (1 דשבורדים confirmed)
