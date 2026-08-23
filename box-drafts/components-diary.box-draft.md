# 📦 טיוטת-קופסה · components-diary
> חוללה ממכונת-החיווט (גרף-הקריאות של src/components/diary/lib.ts). ‏19 חוטים.
> קידום: לבחור מהחוטים המקודמים ב-new/atoms, לחווט לפי הגרף, חוזה+בדיקת-קצה.

## תוכנית-החיווט
· fmtDate (8ש) ← פנימי: fmtDate
· localIso (4ש) ← פנימי: localIso ← חוטי-מודולים-אחרים: isoLocal
· isoToday (4ש) ← פנימי: isoToday,localIso
· DAY_NAMES (2ש)
· pad2 (5ש) ← פנימי: pad2
· timeToMin (6ש) ← פנימי: timeToMin
· minToHM (6ש) ← פנימי: minToHM,pad2
· groupLabelOf (14ש) ← פנימי: groupLabelOf
· ABSENCE_REASON_CHIPS (2ש)
· makeupEligibility (30ש) ← פנימי: makeupEligibility
· blockReason (42ש) ← פנימי: blockReason ← חוטי-מודולים-אחרים: hebParts ← שקעים-חיצוניים: getDay,courseOnDate
· buildSlots (89ש) ← פנימי: buildSlots,timeToMin,minToHM ← חוטי-מודולים-אחרים: sessionsOf,termOf ← שקעים-חיצוניים: isNaN,getDay,courseOnDate
· enrollmentsForSession (9ש) ← פנימי: enrollmentsForSession,groupLabelOf ← חוטי-מודולים-אחרים: sessionsOf
· weeklyRoomSessions (7ש) ← פנימי: weeklyRoomSessions ← חוטי-מודולים-אחרים: sessionsOf
· inactiveRoomCourses (17ש) ← פנימי: inactiveRoomCourses ← חוטי-מודולים-אחרים: termOf
· planLabelOf (7ש) ← פנימי: planLabelOf ← חוטי-מודולים-אחרים: planWord
· enrollStatusMeta (9ש) ← פנימי: enrollStatusMeta
· chipStyle (14ש) ← פנימי: chipStyle
· roomInfoLabel (14ש) ← פנימי: roomInfoLabel
