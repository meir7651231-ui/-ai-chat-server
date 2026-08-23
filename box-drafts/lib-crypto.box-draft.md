# 📦 טיוטת-קופסה · lib-crypto
> חוללה ממכונת-החיווט (גרף-הקריאות של src/lib/crypto.ts). ‏7 חוטים.
> קידום: לבחור מהחוטים המקודמים ב-new/atoms, לחווט לפי הגרף, חוזה+בדיקת-קצה.

## תוכנית-החיווט
· genRecoveryKey (10ש) ← פנימי: genRecoveryKey ← שקעים-חיצוניים: rand
· encryptDb (22ש) ← פנימי: encryptDb ← שקעים-חיצוניים: rand,importKey,deriveWrapKey,aesEnc,encode
· isEncrypted (5ש) ← פנימי: isEncrypted
· openDek (17ש) ← פנימי: openDek ← שקעים-חיצוניים: unb64,deriveWrapKey,aesDec,importKey
· decryptDb (5ש) ← פנימי: decryptDb ← שקעים-חיצוניים: decode,aesDec
· reencryptDb (5ש) ← פנימי: reencryptDb ← שקעים-חיצוניים: aesEnc,encode
· rewrapPassword (7ש) ← פנימי: rewrapPassword ← שקעים-חיצוניים: exportKey,rand,deriveWrapKey,aesEnc
