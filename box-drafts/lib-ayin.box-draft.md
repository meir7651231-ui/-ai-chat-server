# 📦 טיוטת-קופסה · lib-ayin
> חוללה ממכונת-החיווט (גרף-הקריאות של src/lib/ayin.ts). ‏30 חוטים.
> קידום: לבחור מהחוטים המקודמים ב-new/atoms, לחווט לפי הגרף, חוזה+בדיקת-קצה.

## תוכנית-החיווט
· AYIN_STAGES (12ש)
· stageLabel (5ש) ← פנימי: stageLabel ← חוטי-מודולים-אחרים: termOf
· featLabel (5ש) ← פנימי: featLabel ← חוטי-מודולים-אחרים: termOf
· itemLabel (5ש) ← פנימי: itemLabel ← חוטי-מודולים-אחרים: termOf
· unitLabel (5ש) ← פנימי: unitLabel ← חוטי-מודולים-אחרים: termOf
· stageIndex (6ש) ← פנימי: stageIndex
· nextStage (6ש) ← פנימי: nextStage,stageIndex
· revertPatch (7ש) ← פנימי: revertPatch,stageIndex
· normName (5ש) ← פנימי: normName ← חוטי-מודולים-אחרים: normSearch
· ayinActive (12ש) ← פנימי: ayinActive
· eyesTotal (8ש) ← פנימי: eyesTotal
· boqLineAmount (5ש) ← פנימי: boqLineAmount
· boqTotal (5ש) ← פנימי: boqTotal,boqLineAmount
· timeHoursTotal (5ש) ← פנימי: timeHoursTotal
· timeCostTotal (5ש) ← פנימי: timeCostTotal
· matCostTotal (5ש) ← פנימי: matCostTotal
· namesToTemplateLines (7ש) ← פנימי: namesToTemplateLines
· templateLinesToNames (19ש) ← פנימי: templateLinesToNames ← שקעים-חיצוניים: nextId
· ayinActionVisible (9ש) ← פנימי: ayinActionVisible
· ayinAdvanceLabel (21ש) ← פנימי: ayinAdvanceLabel,stageLabel
· planAyinAdvance (51ש) ← פנימי: planAyinAdvance,ayinActionVisible,featLabel,itemLabel,unitLabel,stageLabel,eyesTotal
· planAddName (23ש) ← פנימי: planAddName,normName ← חוטי-מודולים-אחרים: isoToday
· ayinDailyRows (47ש) ← פנימי: ayinDailyRows,unitLabel,itemLabel,eyesTotal,stageLabel ← שקעים-חיצוניים: emptyAyin,fmtD
· ayinAllRows (39ש) ← פנימי: ayinAllRows,unitLabel,stageLabel ← שקעים-חיצוניים: emptyAyin
· ayinBoardItems (23ש) ← פנימי: ayinBoardItems ← שקעים-חיצוניים: emptyAyin
· filterAyinBoard (22ש) ← פנימי: filterAyinBoard ← חוטי-מודולים-אחרים: normSearch
· AYIN_SHEET_HEADER (16ש)
· ayinSheetRows (47ש) ← פנימי: ayinSheetRows
· parseAyinSheet (59ש) ← פנימי: parseAyinSheet,normName ← שקעים-חיצוניים: clean,hIdx
· applyAyinSheet (45ש) ← פנימי: applyAyinSheet
