# 📦 טיוטת-קופסה · lib-ai
> חוללה ממכונת-החיווט (גרף-הקריאות של src/lib/ai.ts). ‏4 חוטים.
> קידום: לבחור מהחוטים המקודמים ב-new/atoms, לחווט לפי הגרף, חוזה+בדיקת-קצה.

## תוכנית-החיווט
· readAiKey (8ש ⚠️לא-טהור) ← פנימי: readAiKey ← שקעים-חיצוניים: getItem,nsLsKey
· writeAiKey (23ש ⚠️לא-טהור) ← פנימי: writeAiKey ← שקעים-חיצוניים: setItem,nsLsKey,removeItem
· thanksPrompt (15ש) ← פנימי: thanksPrompt
· askClaude (27ש) ← פנימי: askClaude ← שקעים-חיצוניים: doFetch,json
