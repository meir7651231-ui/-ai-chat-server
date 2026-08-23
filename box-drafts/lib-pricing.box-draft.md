# 📦 טיוטת-קופסה · lib-pricing
> חוללה ממכונת-החיווט (גרף-הקריאות של src/lib/pricing.ts). ‏7 חוטים.
> קידום: לבחור מהחוטים המקודמים ב-new/atoms, לחווט לפי הגרף, חוזה+בדיקת-קצה.

## תוכנית-החיווט
· DEFAULT_PRICES (19ש)
· SIZE_LABELS (46ש ⚠️לא-טהור)
· normalizePrices (30ש) ← פנימי: normalizePrices ← שקעים-חיצוניים: isFinite
· computeQuote (36ש) ← פנימי: computeQuote ← שקעים-חיצוניים: nameOf
· shekel (7ש) ← פנימי: shekel
· readPrices (10ש ⚠️לא-טהור) ← פנימי: readPrices,normalizePrices ← שקעים-חיצוניים: getItem
· writePrices (8ש ⚠️לא-טהור) ← פנימי: writePrices ← שקעים-חיצוניים: setItem
