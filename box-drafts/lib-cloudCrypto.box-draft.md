# 📦 טיוטת-קופסה · lib-cloudCrypto
> חוללה ממכונת-החיווט (גרף-הקריאות של src/lib/cloudCrypto.ts). ‏5 חוטים.
> קידום: לבחור מהחוטים המקודמים ב-new/atoms, לחווט לפי הגרף, חוזה+בדיקת-קצה.

## תוכנית-החיווט
· isEncDoc (5ש) ← פנימי: isEncDoc
· encryptDoc (14ש) ← פנימי: encryptDoc ← שקעים-חיצוניים: getRandomValues,encrypt,encode
· decryptDoc (15ש) ← פנימי: decryptDoc,isEncDoc ← שקעים-חיצוניים: decrypt,unb64,decode
· createCloudKey (8ש) ← פנימי: createCloudKey ← חוטי-מודולים-אחרים: encryptDb,openDek
· openCloudKey (6ש) ← פנימי: openCloudKey ← חוטי-מודולים-אחרים: openDek
