# 📦 טיוטת-קופסה · lib-icsFeed
> חוללה ממכונת-החיווט (גרף-הקריאות של src/lib/icsFeed.ts). ‏4 חוטים.
> קידום: לבחור מהחוטים המקודמים ב-new/atoms, לחווט לפי הגרף, חוזה+בדיקת-קצה.

## תוכנית-החיווט
· mintFeedToken (7ש) ← פנימי: mintFeedToken ← שקעים-חיצוניים: getRandomValues,toString
· readIcsFeedToken (10ש) ← פנימי: readIcsFeedToken ← חוטי-מודולים-אחרים: cloudDb ← שקעים-חיצוניים: getDoc,exists,data
· publishIcsFeed (10ש) ← פנימי: publishIcsFeed,readIcsFeedToken,mintFeedToken ← חוטי-מודולים-אחרים: cloudDb ← שקעים-חיצוניים: encode,setDoc,toISOString
· icsFeedUrl (4ש) ← פנימי: icsFeedUrl ← שקעים-חיצוניים: encodeURIComponent
