# 📦 טיוטת-קופסה · lib-customExport
> חוללה ממכונת-החיווט (גרף-הקריאות של src/lib/customExport.ts). ‏3 חוטים.
> קידום: לבחור מהחוטים המקודמים ב-new/atoms, לחווט לפי הגרף, חוזה+בדיקת-קצה.

## תוכנית-החיווט
· expFieldDefs (91ש) ← פנימי: expFieldDefs ← חוטי-מודולים-אחרים: featureOn,termOf,featLabel,itemLabel,unitLabel
· overrideColumn (32ש) ← פנימי: overrideColumn ← שקעים-חיצוניים: isoOf,getFullYear,getMonth,getDate,fmtD
· buildCustomExport (165ש) ← פנימי: buildCustomExport,expFieldDefs ← חוטי-מודולים-אחרים: sessionsOf,enrollCount,hebParts,hebAnnualEq,hebDateFull ← שקעים-חיצוניים: pick,getTime,setDate,getDate,isoOf
