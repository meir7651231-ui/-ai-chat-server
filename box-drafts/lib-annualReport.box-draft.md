# 📦 טיוטת-קופסה · lib-annualReport
> חוללה ממכונת-החיווט (גרף-הקריאות של src/lib/annualReport.ts). ‏5 חוטים.
> קידום: לבחור מהחוטים המקודמים ב-new/atoms, לחווט לפי הגרף, חוזה+בדיקת-קצה.

## תוכנית-החיווט
· donationYears (5ש) ← פנימי: donationYears ← שקעים-חיצוניים: reverse
· donationsOfYear (9ש) ← פנימי: donationsOfYear ← שקעים-חיצוניים: money
· annualReportLines (41ש) ← פנימי: annualReportLines,donationsOfYear ← שקעים-חיצוניים: isFinite,repeat,money
· annualAllLines (22ש) ← פנימי: annualAllLines,donationsOfYear,annualReportLines
· downloadAnnualReport (9ש ⚠️לא-טהור) ← פנימי: downloadAnnualReport ← חוטי-מודולים-אחרים: guardExport ← שקעים-חיצוניים: createElement,createObjectURL,click,setTimeout,revokeObjectURL
