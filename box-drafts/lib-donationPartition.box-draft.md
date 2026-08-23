# 📦 טיוטת-קופסה · lib-donationPartition
> חוללה ממכונת-החיווט (גרף-הקריאות של src/lib/donationPartition.ts). ‏6 חוטים.
> קידום: לבחור מהחוטים המקודמים ב-new/atoms, לחווט לפי הגרף, חוזה+בדיקת-קצה.

## תוכנית-החיווט
· SHARED_PURPOSE_KEY (3ש)
· purposeKeyOf (10ש) ← פנימי: purposeKeyOf ← שקעים-חיצוניים: where
· donAllowedKeys (22ש) ← פנימי: donAllowedKeys
· explodeSupporter (25ש) ← פנימי: explodeSupporter,purposeKeyOf ← שקעים-חיצוניים: byDateThenRid
· reassembleDonations (22ש) ← פנימי: reassembleDonations
· donationPartitionDiff (18ש) ← פנימי: donationPartitionDiff,explodeSupporter ← שקעים-חיצוניים: index
