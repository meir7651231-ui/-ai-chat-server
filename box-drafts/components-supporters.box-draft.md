# 📦 טיוטת-קופסה · components-supporters
> חוללה ממכונת-החיווט (גרף-הקריאות של src/components/supporters/lib.ts). ‏41 חוטים.
> קידום: לבחור מהחוטים המקודמים ב-new/atoms, לחווט לפי הגרף, חוזה+בדיקת-קצה.

## תוכנית-החיווט
· fmtDate (7ש) ← פנימי: fmtDate
· isoToday (14ש) ← פנימי: isoToday ← שקעים-חיצוניים: isoTodayLocal
· supporterPurposes (19ש) ← פנימי: supporterPurposes
· supporterVisibleForDesignations (20ש) ← פנימי: supporterVisibleForDesignations
· visibleSupportersForDesignations (19ש) ← פנימי: visibleSupportersForDesignations,supporterVisibleForDesignations
· allDonationPurposes (12ש) ← פנימי: allDonationPurposes,supporterPurposes
· supIls (5ש) ← פנימי: supIls
· supUsd (7ש) ← פנימי: supUsd
· supCount (5ש) ← פנימי: supCount
· supLast (10ש) ← פנימי: supLast
· supLastInPeriod (10ש) ← פנימי: supLastInPeriod,supLast
· supTotalIls (8ש) ← פנימי: supTotalIls,supIls,supUsd
· supScore (21ש) ← פנימי: supScore,supTotalIls,supLast,supCount ← שקעים-חיצוניים: getTime
· supTier (7ש) ← פנימי: supTier
· TIER_ORDER (5ש)
· supScoreBins (7ש) ← פנימי: supScoreBins,supScore ← שקעים-חיצוניים: fill
· supAvgDon (7ש) ← פנימי: supAvgDon,supTotalIls,supCount
· sup12m (14ש) ← פנימי: sup12m,supLast ← שקעים-חיצוניים: setDate,getDate,getFullYear,getMonth
· chipStyle (18ש) ← פנימי: chipStyle
· fixPhone (5ש) ← פנימי: fixPhone ← חוטי-מודולים-אחרים: formatIsraeliPhone
· totalLabel (26ש) ← פנימי: totalLabel,supIls,supUsd
· supDonEvents (53ש) ← פנימי: supDonEvents ← חוטי-מודולים-אחרים: termOf
· personalCalEntries (12ש) ← פנימי: personalCalEntries,supDonEvents
· orgCalEntries (14ש) ← פנימי: orgCalEntries,supDonEvents
· donCalMonthLine (20ש) ← פנימי: donCalMonthLine ← חוטי-מודולים-אחרים: termOf ← שקעים-חיצוניים: inMonth
· normName (36ש) ← פנימי: normName ← חוטי-מודולים-אחרים: normSearch
· SUP_NAME_KEYS (5ש)
· excelSerialToIso (15ש) ← פנימי: excelSerialToIso ← שקעים-חיצוניים: isFinite,isNaN,getTime,getUTCMonth,getUTCDate
· parseSupporterGrid (90ש) ← פנימי: parseSupporterGrid,excelSerialToIso ← חוטי-מודולים-אחרים: parseAnyDate ← שקעים-חיצוניים: isFinite
· parseSupporterCsv (28ש) ← פנימי: parseSupporterCsv,parseSupporterGrid ← חוטי-מודולים-אחרים: parseCsv ← שקעים-חיצוניים: fillEmpty
· applyAyinNames (23ש) ← פנימי: applyAyinNames ← חוטי-מודולים-אחרים: planAddName ← שקעים-חיצוניים: emptyAyin,mkId
· mergeHist (41ש) ← פנימי: mergeHist
· planSupporterImport (39ש) ← פנימי: planSupporterImport,normName ← שקעים-חיצוניים: fillEmpty
· mergeSupporterRow (15ש) ← פנימי: mergeSupporterRow,mergeHist,fixPhone
· newSupporterFromRow (27ש) ← פנימי: newSupporterFromRow,fixPhone,mergeHist
· HOK_CAT (15ש) ← שקעים-חיצוניים: monthsAgoIso
· hokEffectivelyActive (14ש) ← פנימי: hokEffectivelyActive ← שקעים-חיצוניים: monthsAgoIso
· hokRecordedThisMonth (18ש) ← פנימי: hokRecordedThisMonth
· hokDue (8ש) ← פנימי: hokDue,hokEffectivelyActive,hokRecordedThisMonth
· hokMonthlyTotal (11ש) ← פנימי: hokMonthlyTotal,hokEffectivelyActive ← שקעים-חיצוניים: active
· hokMethodLabel (7ש) ← פנימי: hokMethodLabel
