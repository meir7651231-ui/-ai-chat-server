# 📦 טיוטת-קופסה · lib-ics
> חוללה ממכונת-החיווט (גרף-הקריאות של src/lib/ics.ts). ‏4 חוטים.
> קידום: לבחור מהחוטים המקודמים ב-new/atoms, לחווט לפי הגרף, חוזה+בדיקת-קצה.

## תוכנית-החיווט
· icsEscape (14ש) ← פנימי: icsEscape
· foldIcsLine (56ש) ← פנימי: foldIcsLine ← שקעים-חיצוניים: encode,basicDate,basicLocal,getFullYear,getMonth
· buildIcs (37ש) ← פנימי: buildIcs,icsEscape ← שקעים-חיצוניים: stampUtc,isNaN,getTime,basicLocal,basicDate
· downloadIcs (9ש ⚠️לא-טהור) ← פנימי: downloadIcs ← חוטי-מודולים-אחרים: guardExport ← שקעים-חיצוניים: createElement,createObjectURL,click,setTimeout,revokeObjectURL
