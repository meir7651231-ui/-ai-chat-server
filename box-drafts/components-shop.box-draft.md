# 📦 טיוטת-קופסה · components-shop
> חוללה ממכונת-החיווט (גרף-הקריאות של src/components/shop/lib.ts). ‏31 חוטים.
> קידום: לבחור מהחוטים המקודמים ב-new/atoms, לחווט לפי הגרף, חוזה+בדיקת-קצה.

## תוכנית-החיווט
· liveRedemptions (24ש) ← פנימי: liveRedemptions
· itemOf (30ש) ← פנימי: itemOf
· holidayAllowed (8ש) ← פנימי: holidayAllowed
· itemRemaining (22ש) ← פנימי: itemRemaining,liveRedemptions
· effectivePrice (7ש) ← פנימי: effectivePrice,maxDiscountPct ← שקעים-חיצוניים: isFinite
· maxDiscountPct (15ש) ← פנימי: maxDiscountPct ← שקעים-חיצוניים: isFinite
· upcomingHolidays (22ש) ← פנימי: upcomingHolidays ← חוטי-מודולים-אחרים: holidayOf ← שקעים-חיצוניים: getFullYear,getMonth,getDate,isoOf
· holidayNames (27ש) ← פנימי: holidayNames ← חוטי-מודולים-אחרים: holidayOf,hebParts ← שקעים-חיצוניים: getFullYear,getMonth,getDate,hebYearOf
· assignmentRedeemed (20ש) ← פנימי: assignmentRedeemed,liveRedemptions ← שקעים-חיצוניים: hebYearOf
· componentRemaining (21ש) ← פנימי: componentRemaining,liveRedemptions
· couponExpiry (18ש) ← פנימי: couponExpiry ← שקעים-חיצוניים: setDate,getDate,isoOf
· SHOP_HOLIDAY_DUE_DAYS (10ש)
· needsCare (126ש) ← פנימי: needsCare,upcomingHolidays,itemRemaining,componentRemaining,beneficiaryLabel,itemOf,holidayAllowed,assignmentRedeemed,couponExpiry,expiringIntakes ← חוטי-מודולים-אחרים: featureOn
· SHOP_EXPIRY_WARN_DAYS (3ש)
· expiringIntakes (28ש) ← פנימי: expiringIntakes ← שקעים-חיצוניים: setDate,getDate,isoOf
· upcomingMeetings (27ש) ← פנימי: upcomingMeetings,beneficiaryLabel ← שקעים-חיצוניים: setDate,getDate,isoOf
· givenValue (7ש) ← פנימי: givenValue,liveRedemptions ← שקעים-חיצוניים: isFinite
· collectedPaid (7ש) ← פנימי: collectedPaid,liveRedemptions ← שקעים-חיצוניים: isFinite
· subsidyTotal (5ש) ← פנימי: subsidyTotal,givenValue,collectedPaid
· productAssignments (14ש) ← פנימי: productAssignments
· componentRedeemedNow (38ש) ← פנימי: componentRedeemedNow,itemOf,holidayAllowed,assignmentRedeemed ← שקעים-חיצוניים: pendingCount,progressOf
· filterAssignments (34ש) ← פנימי: filterAssignments,upcomingHolidays ← חוטי-מודולים-אחרים: smartFilter ← שקעים-חיצוניים: pendingCount,famName,progressOf
· filterProducts (13ש) ← פנימי: filterProducts ← חוטי-מודולים-אחרים: smartFilter
· filterItems (14ש) ← פנימי: filterItems,itemRemaining ← חוטי-מודולים-אחרים: smartFilter
· filterRedemptions (23ש) ← פנימי: filterRedemptions ← חוטי-מודולים-אחרים: dateInRange
· intakeLog (22ש) ← פנימי: intakeLog
· eligibleFamilies (17ש) ← פנימי: eligibleFamilies ← שקעים-חיצוניים: flatMap
· distributionListLines (29ש) ← פנימי: distributionListLines,itemOf,beneficiaryLabel ← שקעים-חיצוניים: repeat
· redemptionsCsvRows (25ש) ← פנימי: redemptionsCsvRows,beneficiaryLabel,itemOf
· beneficiaryLabel (10ש) ← פנימי: beneficiaryLabel ← חוטי-מודולים-אחרים: termOf
· componentCounts (6ש) ← פנימי: componentCounts
