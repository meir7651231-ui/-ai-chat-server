# חוזה · חוט match-incoming-to-planned
**תפקיד:** מוצא את החיוב-המתוכנן היחיד שמתאים לתשלום-נכנס. קריטריון-שיוך:
סכום-זהה (השוואת-אגורות `round(amount*100)`), שם-דומה (דרך שקע), ותאריך בטווח
`±DATE_WINDOW_DAYS` (=3 ימים). **אמביגואי** (‏≠ מועמד-אחד בדיוק) ⇒ `null` (לא-מנחש).
מועמד-יחיד ⇒ מוחזר עם `incomingId` ו-`confidence = max(60, 100 − dd·10)` (‏dd=מרחק-ימים).
**שקעים (חוק-1 — קריאות-לשכן הוזרקו כפרמטרים):**
- ‏nameMatches(refName, incName) ⇒ בוליאני — דמיון-שם. הבדיקה מזריקה `a===b`.
- ‏dayDiff(isoA, isoB) ⇒ מספר — מרחק-ימים מוחלט. הבדיקה מזריקה מימוש-אמת של maor.
**קלט:** ‏inc `{id, amount, at, name}` · ‏allOpen `[{entityType,entityId,plan:{id,amount,date},name}]`
· השקעים. **פלט:** `{...ref, incomingId, confidence}` או `null`.
**דוגמאות מחייבות (סכום 100 = 10000 אגורות; dayDiff אמיתי):**
- התאמה-יחידה תאריך-זהה → `confidence 100`, `plan.id="p1"`
- סכום שונה (200 מול 100) → `null`
- שם שונה (nameMatches=false) → `null`
- תאריך 6 ימים (‏>3) → `null` (מחוץ-לחלון)
- שני מועמדים תואמים → `null` (אמביגואי)
- מרחק 2 ימים → `confidence 80` · מרחק 3 ימים (קצה-החלון) → `confidence 70`, עדיין-מוחזר
**מוצא:** maor/src/lib/plannedMatch.ts:107-129 (‏matchIncomingToPlanned). השכנים
‏nameMatches ו-dayDiff היו שכני-מודול — הפכו לשקעים (חוק-1). `DATE_WINDOW_DAYS`=3
נשאר ערך-הסף של האטום.
