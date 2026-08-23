# 📦 טיוטת-קופסה · lib-dialer
> חוללה ממכונת-החיווט (גרף-הקריאות של src/lib/dialer.ts). ‏14 חוטים.
> קידום: לבחור מהחוטים המקודמים ב-new/atoms, לחווט לפי הגרף, חוזה+בדיקת-קצה.

## תוכנית-החיווט
· REQUEUE_OUTCOMES (2ש)
· TERMINAL_OUTCOMES (3ש)
· OUTCOME_LABELS (10ש)
· startCampaign (12ש) ← פנימי: startCampaign
· currentId (9ש) ← פנימי: currentId
· applyOutcome (34ש) ← פנימי: applyOutcome,currentId
· progress (17ש) ← פנימי: progress
· isDone (9ש) ← פנימי: isDone
· undoLast (14ש) ← פנימי: undoLast ← שקעים-חיצוניים: lastIndexOf
· CALL_LOG_CAP (6ש)
· appendCall (7ש) ← פנימי: appendCall
· popCall (15ש) ← פנימי: popCall
· callStats (11ש) ← פנימי: callStats
· campaignCsvRows (11ש) ← פנימי: campaignCsvRows ← שקעים-חיצוניים: nameOf
