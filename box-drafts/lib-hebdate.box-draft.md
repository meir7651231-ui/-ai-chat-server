# 📦 טיוטת-קופסה · lib-hebdate
> חוללה ממכונת-החיווט (גרף-הקריאות של src/lib/hebdate.ts). ‏8 חוטים.
> קידום: לבחור מהחוטים המקודמים ב-new/atoms, לחווט לפי הגרף, חוזה+בדיקת-קצה.

## תוכנית-החיווט
· monthHeOf (5ש) ← פנימי: monthHeOf
· monthEnOf (5ש) ← פנימי: monthEnOf
· hebYearNow (27ש) ← פנימי: hebYearNow ← חוטי-מודולים-אחרים: hebParts,pad2 ← שקעים-חיצוניים: isoOf,getFullYear,getMonth,getDate,hebToIsoEn
· isHebLeapYear (12ש) ← פנימי: isHebLeapYear ← שקעים-חיצוניים: hebToIsoEn
· hebMonthsOf (9ש) ← פנימי: hebMonthsOf,isHebLeapYear
· hebToIso (7ש) ← פנימי: hebToIso,monthEnOf ← שקעים-חיצוניים: hebToIsoEn
· isoToHebParts (18ש) ← פנימי: isoToHebParts,monthHeOf ← חוטי-מודולים-אחרים: hebParts ← שקעים-חיצוניים: isNaN,getTime
· validateHebMonthNames (20ש) ← פנימי: validateHebMonthNames,hebYearNow ← חוטי-מודולים-אחרים: hebParts ← שקעים-חיצוניים: warn
