# חוזה · חוט apply-meta-partial
**תפקיד:** מיזוג מסמך-meta מרוחק לתוך ה-DB — שדות שאינם ישויות. שני דינים:
(א) **שדות "הענן-מנצח"** (orgName·orgSite·orgDonate·orgGoal·budget·usdRate·
audit·notif·reports·ui·attnDone) — ערך שהוגדר (לא-undefined) ושונה מהמקומי
נכתב; ‏undefined מדולג. (ב) **מונים רק-עולים** (seq·receiptSeq·donationSeq·
shopReceiptSeq) — נכתבים רק כשהערך המרוחק מספר סופי **גדול** מהמקומי
(מונע התנגשות מזהים/מספרי-קבלה בין מכשירים). אפס שינויים ⇒ מוחזר אותו db.
**שקעים:** אין — האטום עצמאי לחלוטין (JSON/Number סטנדרטיים בלבד).
**קלט:** ‏db (אובייקט) · ‏meta (אובייקט שדות מרוחקים). **פלט:** ‏db חדש,
או אותו ‏db (===) כשלא השתנה דבר. ה-db הנכנס לעולם לא משוכתב (immutable).
**דוגמאות מחייבות:**
1. ‏db={orgName:'א', seq:5} · meta={orgName:'ב'} ⇒ ‏{orgName:'ב', seq:5} —
   והפלט ‏!==db (אובייקט חדש); ‏db.orgName נשאר 'א'.
2. ‏meta={orgName:undefined, usdRate:3.7} על ‏db={orgName:'א', usdRate:3.5, seq:0}
   ⇒ ‏orgName נשאר 'א', ‏usdRate הופך 3.7 (undefined מדולג).
3. מונה יורד: ‏db={seq:10} · meta={seq:7} ⇒ הפלט ‏===db (המונה לא ירד).
4. מונה עולה: ‏db={seq:10, receiptSeq:3} · meta={seq:12, receiptSeq:2} ⇒
   ‏seq=12 אבל ‏receiptSeq נשאר 3 (כל מונה נשפט לעצמו).
5. מונה לא-מספרי/אינסופי: ‏db={donationSeq:4} · meta={donationSeq:'99'} וגם
   ‏meta={donationSeq:Infinity} ⇒ הפלט ‏===db (רק מספר סופי מטפס).
6. שוויון-עמוק: ‏db={ui:{a:1}, seq:0} · meta={ui:{a:1}} ⇒ הפלט ‏===db
   (השוואת JSON — ערך שווה-ערך אינו "שינוי").
7. ‏meta={} ⇒ הפלט ‏===db (אפס שינויים — אותה רפרנס).
**מוצא:** maor/src/lib/cloud-merge.ts:106-141 (‏applyMetaPartial — "מיזוג מסמך
meta/org מרוחק; seq תמיד המקסימום"). ללא שכנים — קודם כאטום עצמאי.
