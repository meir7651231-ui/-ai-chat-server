# 📦 טיוטת-קופסה · lib-supportChat
> חוללה ממכונת-החיווט (גרף-הקריאות של src/lib/supportChat.ts). ‏10 חוטים.
> קידום: לבחור מהחוטים המקודמים ב-new/atoms, לחווט לפי הגרף, חוזה+בדיקת-קצה.

## תוכנית-החיווט
· SUPPORT_MSG_MAX (3ש)
· sanitizeSupportText (5ש) ← פנימי: sanitizeSupportText
· isSendableSupportText (5ש) ← פנימי: isSendableSupportText,sanitizeSupportText
· sortSupportMsgs (5ש) ← פנימי: sortSupportMsgs
· supportMsgTime (10ש) ← פנימי: supportMsgTime ← חוטי-מודולים-אחרים: isoToday ← שקעים-חיצוניים: isNaN,getTime,toLocaleTimeString
· supportDayLabel (15ש) ← פנימי: supportDayLabel ← שקעים-חיצוניים: setDate,getDate,getFullYear,getMonth
· supportPreview (6ש) ← פנימי: supportPreview
· supportUnread (17ש) ← פנימי: supportUnread
· sortTeamMsgs (5ש) ← פנימי: sortTeamMsgs
· sortSupportThreads (13ש) ← פנימי: sortSupportThreads,supportUnread
