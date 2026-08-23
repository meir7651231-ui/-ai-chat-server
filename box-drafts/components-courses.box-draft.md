# 📦 טיוטת-קופסה · components-courses
> חוללה ממכונת-החיווט (גרף-הקריאות של src/components/courses/lib.ts). ‏57 חוטים.
> קידום: לבחור מהחוטים המקודמים ב-new/atoms, לחווט לפי הגרף, חוזה+בדיקת-קצה.

## תוכנית-החיווט
· fmtDate (7ש) ← פנימי: fmtDate
· isoToday (12ש) ← פנימי: isoToday ← שקעים-חיצוניים: isoTodayLocal
· defaultCourseDates (15ש) ← פנימי: defaultCourseDates ← שקעים-חיצוניים: isoTodayLocal,isNaN,getTime,getFullYear,getMonth
· presentsInMonth (10ש) ← פנימי: presentsInMonth
· courseDateError (9ש) ← פנימי: courseDateError ← חוטי-מודולים-אחרים: termOf
· ageOf (14ש) ← פנימי: ageOf ← שקעים-חיצוניים: isNaN,getTime,getFullYear,getMonth,getDate
· DAY_NAMES (1ש)
· DAY_LETTERS (3ש)
· sessionsOf (8ש) ← פנימי: sessionsOf
· groupsHintFromAudience (11ש) ← פנימי: groupsHintFromAudience ← שקעים-חיצוניים: parseInt
· coursesOfTeacher (17ש) ← פנימי: coursesOfTeacher
· roomsNow (28ש) ← פנימי: roomsNow,sessionsOf ← שקעים-חיצוניים: getDay,getHours,getMinutes,toMin
· groupLabelOf (11ש) ← פנימי: groupLabelOf
· groupRemapOnRemoval (15ש) ← פנימי: groupRemapOnRemoval,groupLabelOf
· groupOptionsOf (10ש) ← פנימי: groupOptionsOf,sessionsOf,groupLabelOf
· planWord (11ש) ← פנימי: planWord
· priceSuffix (5ש) ← פנימי: priceSuffix
· modelMeta (13ש) ← פנימי: modelMeta
· WEEKS_PER_MONTH (3ש)
· PRICING_TERMS (11ש)
· termLabel (9ש) ← פנימי: termLabel
· lessonsInTerm (26ש) ← פנימי: lessonsInTerm ← שקעים-חיצוניים: isFinite
· lessonPriceForTier (8ש) ← פנימי: lessonPriceForTier
· lessonTierOptions (18ש) ← פנימי: lessonTierOptions
· weightedQuote (10ש) ← פנימי: weightedQuote,lessonPriceForTier,lessonsInTerm
· enrollmentQuote (6ש) ← פנימי: enrollmentQuote,weightedQuote
· paidOf (5ש) ← פנימי: paidOf ← שקעים-חיצוניים: isFinite
· payBal (12ש) ← פנימי: payBal,paidOf
· enrollmentPaidStatus (12ש) ← פנימי: enrollmentPaidStatus,payBal,paidOf
· enrollCount (7ש) ← פנימי: enrollCount
· duplicateCourse (14ש) ← פנימי: duplicateCourse
· pendingMakeups (14ש) ← פנימי: pendingMakeups
· waitlistFor (8ש) ← פנימי: waitlistFor
· nextSessionDate (15ש) ← פנימי: nextSessionDate,sessionsOf ← שקעים-חיצוניים: getFullYear,getMonth,getDate,getDay,setDate
· sheetRoster (5ש) ← פנימי: sheetRoster
· sheetSummary (5ש) ← פנימי: sheetSummary
· OTHER (1ש)
· OTHER_LABEL (1ש)
· ADD_TEACHER (1ש)
· CAT_OPTIONS (1ש)
· SEMESTER_OPTIONS (1ש)
· PAY_METHODS (3ש)
· TINTS (3ש)
· enrollStatusMeta (9ש) ← פנימי: enrollStatusMeta
· planLabelOf (11ש) ← פנימי: planLabelOf,planWord,payBal
· chipStyle (21ש) ← פנימי: chipStyle
· GRADE_ORDER (3ש)
· gradeIndex (10ש) ← פנימי: gradeIndex
· gradeFits (11ש) ← פנימי: gradeFits,gradeIndex
· courseFitsMember (20ש) ← פנימי: courseFitsMember,gradeFits
· scheduleClashText (26ש) ← פנימי: scheduleClashText,sessionsOf
· ENROLL_NEW_FAMILY (8ש) ← חוטי-מודולים-אחרים: normSearch ← שקעים-חיצוניים: normNameLocal
· offerNewFamily (9ש) ← פנימי: offerNewFamily ← שקעים-חיצוניים: normNameLocal
· resolveEnrollFamily (20ש) ← שקעים-חיצוניים: normNameLocal
· PUNCH_CONFIRM_MS (12ש)
· punchConfirmStep (20ש) ← פנימי: punchConfirmStep
· wheelIndexUnderPointer (7ש) ← פנימי: wheelIndexUnderPointer
