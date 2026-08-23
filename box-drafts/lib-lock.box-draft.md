# 📦 טיוטת-קופסה · lib-lock
> חוללה ממכונת-החיווט (גרף-הקריאות של src/lib/lock.ts). ‏8 חוטים.
> קידום: לבחור מהחוטים המקודמים ב-new/atoms, לחווט לפי הגרף, חוזה+בדיקת-קצה.

## תוכנית-החיווט
· LOCK_ZONES (8ש)
· DEFAULT_LOCK_ZONES (19ש ⚠️לא-טהור)
· lockKey (4ש) ← פנימי: lockKey ← שקעים-חיצוניים: nsLsKey
· readLock (13ש ⚠️לא-טהור) ← פנימי: readLock,lockKey ← שקעים-חיצוניים: getItem
· writeLock (11ש ⚠️לא-טהור) ← פנימי: writeLock,lockKey ← שקעים-חיצוניים: removeItem,setItem
· isValidPin (5ש) ← פנימי: isValidPin
· hashPin (9ש) ← פנימי: hashPin ← שקעים-חיצוניים: encode,digest,toString
· verifyPin (5ש) ← פנימי: verifyPin,hashPin
