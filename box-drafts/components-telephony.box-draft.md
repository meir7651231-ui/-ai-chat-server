# 📦 טיוטת-קופסה · components-telephony
> חוללה ממכונת-החיווט (גרף-הקריאות של src/components/telephony/lib.ts). ‏6 חוטים.
> קידום: לבחור מהחוטים המקודמים ב-new/atoms, לחווט לפי הגרף, חוזה+בדיקת-קצה.

## תוכנית-החיווט
· emptyTelephonyConfig (20ש) ← פנימי: emptyTelephonyConfig
· toTenantId (14ש) ← פנימי: toTenantId
· telephonyToTenant (65ש) ← פנימי: telephonyToTenant ← שקעים-חיצוניים: anchorToday,getFullYear,getMonth,getDate
· previewTelephony (53ש) ← פנימי: previewTelephony,telephonyToTenant ← חוטי-מודולים-אחרים: validateTenant,buildTenant,explainCall,trustReport ← שקעים-חיצוניים: anchorToday
· nextClosure (13ש) ← פנימי: nextClosure ← חוטי-מודולים-אחרים: hebrewClosedWindows
· explainOne (8ש) ← פנימי: explainOne,telephonyToTenant ← חוטי-מודולים-אחרים: validateTenant,explainCall ← שקעים-חיצוניים: anchorToday
