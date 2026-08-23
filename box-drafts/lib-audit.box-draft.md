# 📦 טיוטת-קופסה · lib-audit
> חוללה ממכונת-החיווט (גרף-הקריאות של src/lib/audit.ts). ‏5 חוטים.
> קידום: לבחור מהחוטים המקודמים ב-new/atoms, לחווט לפי הגרף, חוזה+בדיקת-קצה.

## תוכנית-החיווט
· AUDIT_CAT_COLORS (11ש)
· AUDIT_CATEGORIES (15ש)
· phoneIssue (18ש) ← פנימי: phoneIssue ← שקעים-חיצוניים: digits
· runAudit (144ש) ← פנימי: runAudit,phoneIssue ← חוטי-מודולים-אחרים: termOf,normName,validIsraeliId,ageOf,supporterAggregates ← שקעים-חיצוניים: digits,members
· auditReportLines (6ש) ← פנימי: auditReportLines
