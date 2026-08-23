# 📦 טיוטת-קופסה · components-tzedaka
> חוללה ממכונת-החיווט (גרף-הקריאות של src/components/tzedaka/lib.ts). ‏19 חוטים.
> קידום: לבחור מהחוטים המקודמים ב-new/atoms, לחווט לפי הגרף, חוזה+בדיקת-קצה.

## תוכנית-החיווט
· TZ_SCORE_RULES (3ש)
· lastCollectionIso (7ש) ← פנימי: lastCollectionIso
· collectionScoreDelta (19ש) ← פנימי: collectionScoreDelta,lastCollectionIso ← שקעים-חיצוניים: getTime
· boxTotal (4ש) ← פנימי: boxTotal ← שקעים-חיצוניים: isFinite
· coordinatorBoxes (4ש) ← פנימי: coordinatorBoxes
· coordinatorTotal (4ש) ← פנימי: coordinatorTotal,coordinatorBoxes,boxTotal
· grandTotal (4ש) ← פנימי: grandTotal,boxTotal
· campaignTotal (9ש) ← פנימי: campaignTotal ← שקעים-חיצוניים: isFinite
· TZ_STALE_DAYS (3ש)
· staleBoxes (21ש) ← פנימי: staleBoxes,lastCollectionIso ← חוטי-מודולים-אחרים: termOf ← שקעים-חיצוניים: setDate,getDate,isoOf
· needsCare (41ש) ← פנימי: needsCare,staleBoxes,lastCollectionIso,coordinatorBoxes ← חוטי-מודולים-אחרים: termOf ← שקעים-חיצוניים: setDate,getDate,isoOf
· leaderboard (7ש) ← פנימי: leaderboard,coordinatorTotal,coordinatorBoxes
· campaignProgress (25ש) ← פנימי: campaignProgress,campaignTotal,coordinatorBoxes,lastCollectionIso ← שקעים-חיצוניים: coordinatorLastCollection
· filterCoordinators (29ש) ← פנימי: filterCoordinators,coordinatorTotal ← חוטי-מודולים-אחרים: smartFilter ← שקעים-חיצוניים: coordinatorLastCollection
· boxesOverview (30ש) ← פנימי: boxesOverview,lastCollectionIso,boxTotal ← חוטי-מודולים-אחרים: smartFilter ← שקעים-חיצוניים: parseInt
· filterCollections (17ש) ← פנימי: filterCollections ← חוטי-מודולים-אחרים: dateInRange
· coordinatorPrintLines (31ש) ← פנימי: coordinatorPrintLines,coordinatorBoxes,lastCollectionIso ← חוטי-מודולים-אחרים: termOf ← שקעים-חיצוניים: repeat
· collectionsCsvRows (21ש) ← פנימי: collectionsCsvRows ← חוטי-מודולים-אחרים: termOf
· buildTzGrid (6ש) ← פנימי: buildTzGrid ← חוטי-מודולים-אחרים: buildMonthGrid
