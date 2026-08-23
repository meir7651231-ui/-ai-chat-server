# 📦 טיוטת-קופסה · components-courses-reenroll-lib
> חוללה ממכונת-החיווט (גרף-הקריאות של src/components/courses/reenroll-lib.ts). ‏14 חוטים.
> קידום: לבחור מהחוטים המקודמים ב-new/atoms, לחווט לפי הגרף, חוזה+בדיקת-קצה.

## תוכנית-החיווט
· academicYearLabel (9ש) ← פנימי: academicYearLabel ← שקעים-חיצוניים: atNoon,getFullYear,getMonth
· nextYearDates (12ש) ← פנימי: nextYearDates ← שקעים-חיצוניים: atNoon,setFullYear,getFullYear,toIso,shift
· renewOf (5ש) ← פנימי: renewOf
· isRenewed (29ש) ← פנימי: isRenewed
· enrollSummary (53ש) ← פנימי: enrollSummary ← חוטי-מודולים-אחרים: payBal,paidOf ← שקעים-חיצוניים: findMember
· buildReenrollRows (50ש) ← פנימי: buildReenrollRows,isRenewed,renewOf,enrollSummary ← שקעים-חיצוניים: findMember
· reenrollCounts (14ש) ← פנימי: reenrollCounts
· renewTargets (9ש) ← פנימי: renewTargets
· freshNextYearEnrollment (36ש) ← פנימי: freshNextYearEnrollment
· nextYearCourseDraft (36ש) ← פנימי: nextYearCourseDraft,nextYearDates,academicYearLabel
· studentHistory (27ש) ← פנימי: studentHistory,academicYearLabel,enrollSummary
· studentHistoryText (13ש) ← פנימי: studentHistoryText
· reenrollCsvRows (19ש) ← פנימי: reenrollCsvRows ← שקעים-חיצוניים: decWord
· reenrollListText (7ש) ← פנימי: reenrollListText ← שקעים-חיצוניים: decWord
