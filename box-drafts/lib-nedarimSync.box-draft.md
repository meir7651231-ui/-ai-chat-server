# 📦 טיוטת-קופסה · lib-nedarimSync
> חוללה ממכונת-החיווט (גרף-הקריאות של src/lib/nedarimSync.ts). ‏15 חוטים.
> קידום: לבחור מהחוטים המקודמים ב-new/atoms, לחווט לפי הגרף, חוזה+בדיקת-קצה.

## תוכנית-החיווט
· CLEARING_PROVIDERS (6ש)
· providerClearer (5ש) ← פנימי: providerClearer
· chargeToHist (22ש) ← פנימי: chargeToHist,providerClearer ← שקעים-חיצוניים: curOf
· chargeDedupKey (26ש) ← פנימי: chargeDedupKey ← שקעים-חיצוניים: histDedupKey,hokDayFromDate,isFinite
· withNedarimHok (64ש) ← פנימי: withNedarimHok ← שקעים-חיצוניים: curOf,hokDayFromDate,monthsAgo,modeOf,modeStr
· detectRecurringHok (43ש) ← פנימי: detectRecurringHok ← שקעים-חיצוניים: modeStr,modeOf,monthsAgo
· candidateSupportersForCharge (24ש) ← פנימי: candidateSupportersForCharge ← חוטי-מודולים-אחרים: nameSortKey ← שקעים-חיצוניים: keysOf
· fillCardFromCharge (19ש) ← פנימי: fillCardFromCharge ← חוטי-מודולים-אחרים: normPhone,normId
· attachChargeTo (22ש) ← פנימי: attachChargeTo,chargeDedupKey,withNedarimHok,fillCardFromCharge,chargeToHist ← שקעים-חיצוניים: histDedupKey
· relabelHistByTxn (23ש) ← פנימי: relabelHistByTxn
· repairCardsFromRows (38ש) ← פנימי: repairCardsFromRows,fillCardFromCharge
· strongMatchForCharge (22ש) ← פנימי: strongMatchForCharge ← שקעים-חיצוניים: keysOf
· autoMatchCharges (22ש) ← פנימי: autoMatchCharges ← שקעים-חיצוניים: keysOf
· attachChargesBulk (92ש) ← פנימי: attachChargesBulk,chargeDedupKey,withNedarimHok,fillCardFromCharge,chargeToHist ← חוטי-מודולים-אחרים: normId,nameSortKey ← שקעים-חיצוניים: histDedupKey,supFromDonor,supFromCharge
· planNedarimSync (154ש) ← פנימי: planNedarimSync ← חוטי-מודולים-אחרים: nameSortKey,normId ← שקעים-חיצוניים: nkey,keysOf,registerName,register,findIdx
