# ADR: Add Dashboard Counter for Intermediary Cases (מתווך=כן)

## ג.1 Opening Question

**מה:** Add a counter to the sechirut.txt dashboard that shows cases where מתווך (intermediary/broker) = כן

**מקור:** Task requirement — sechirut.txt is the app spec for בדיקת חוזה שכירות (lease contract review)

**תרגום ל-display:** Dashboard counter (numeric display on a dashboard, no new screen/dialog)
- Part of the existing לוח בקרה (dashboard control panel)
- Shows: count of תיק (cases) where מתווך = כן

**helper נדרש:** None — this is a spec-level aggregation that the generator handles

**מחרוזות:** "מתווך" (existing field from line 7 of spec)

**חסום:** No backend dependencies — this is computed from existing data

---

## Context

Line 11 of sechirut.txt has:
```
לוח בקרה עם מונה(תיק), מונה(ממצא: צבע=אדום), מונה(ממצא: צבע=צהוב), מונה(בטוחה: חורג מול 3 חודשים=חורג), מונה(תשלום: שולם=לא), סכום(תשלום.סכום)
```

Need to add to this dashboard:
```
מונה(תיק: מתווך=כן)
```

This matches the existing pattern in spec-lang.md line 6: `מונה / count(<ישות>: <שדה>=<ערך>)`

---

## Decision

Add the counter as a new item in the לוח בקרה line. This is a spec-level change that requires:
1. Verify spec syntax is correct
2. Regenerate the app using `node machtzev/generator/app-ds.mjs`
3. Verify no hand edits in generated files
4. Run gate checks
5. Verify machine report is DONE

---

## Assumed Answer

The counter should appear on the dashboard UI showing the numeric count of תיק entries where מתווך=כן. The change is spec-only, no engine modifications needed.
