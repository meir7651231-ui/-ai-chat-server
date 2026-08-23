# 📦 טיוטת-קופסה · lib-hebrew
> חוללה ממכונת-החיווט (גרף-הקריאות של src/lib/hebrew.ts). ‏9 חוטים.
> קידום: לבחור מהחוטים המקודמים ב-new/atoms, לחווט לפי הגרף, חוזה+בדיקת-קצה.

## תוכנית-החיווט
· gem (14ש) ← שקעים-חיצוניים: isFinite
· gemYear (16ש) ← פנימי: gemYear
· adarNorm (50ש) ← פנימי: adarNorm,hebParts ← שקעים-חיצוניים: isAdar,scanHebYear
· hebAnnualEq (29ש) ← פנימי: hebAnnualEq ← שקעים-חיצוניים: scanHebYear,isAdar
· hebParts (15ש) ← פנימי: hebParts ← שקעים-חיצוניים: isNaN,getTime,formatToParts
· hebPartsOfIso (17ש) ← פנימי: hebPartsOfIso,hebParts ← שקעים-חיצוניים: clear
· hebDateFull (8ש) ← פנימי: hebDateFull,hebParts,gemYear ← שקעים-חיצוניים: isNaN,getTime,format
· HOLIDAYS (41ש)
· holidayOf (26ש) ← פנימי: holidayOf,hebParts ← שקעים-חיצוניים: scanHebYear,getDay
