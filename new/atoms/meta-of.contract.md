# חוזה · חוט meta-of
**תפקיד:** הטלה טהורה של מצב-Db לגוף מסמך ‏meta/org בענן — **בדיוק 16 שדות**,
כל שדות-ה-Db שאינם אוספי-ישויות: ‏orgName · orgSite · orgDonate · orgGoal ·
budget · usdRate · audit · notif · reports · ui · seq · receiptSeq · donationSeq ·
shopReceiptSeq · attnDone · savedAt. אוספי-הישויות (supporters/families/…) לעולם
לא נכנסים, וגם ‏v (גרסת-הסכמה) לא — הוא נגזר במיגרציה בצד-הקורא. שדה חסר ב-Db
⇒ המפתח קיים בפלט עם ‏undefined (ההטלה מפורשת, לא מסננת).
**קלט:** db (אובייקט-Db מלא). **פלט:** ‏Record עם 16 המפתחות, בסדר הזה.
**דוגמאות מחייבות:**
1. ‏db={orgName:'מאור', seq:42, receiptSeq:7, donationSeq:3, shopReceiptSeq:1,
   usdRate:3.7, savedAt:'2026-08-24T10:00:00', supporters:[{id:'s1'}],
   families:[{id:'f1'}]} ⇒ הפלט נושא ‏orgName='מאור' · ‏seq=42 · ‏receiptSeq=7 ·
   ‏donationSeq=3 · ‏shopReceiptSeq=1 · ‏usdRate=3.7 · ‏savedAt כנ"ל, ו-**אין**
   בו ‏supporters/families.
2. סט-המפתחות של הפלט = בדיוק 16 המפתחות שברשימה (לא פחות, לא יותר) — גם כש-db
   נושא עשרות שדות-ישויות נוספים.
3. ‏db.v=6 ⇒ אין מפתח ‏v בפלט.
4. שדה-meta חסר (למשל ‏budget) ⇒ ‏'budget' in out === true ו-‏out.budget===undefined.
5. שדות-עומק עוברים בהפניה כמו-שהם: ‏db.ui={theme:'dark'} ⇒ ‏out.ui===db.ui
   (אותו אובייקט — הטלה, לא העתקה-עמוקה).
**מוצא:** maor/src/lib/cloud-diff.ts:117-146 (‏metaOf — הלב של diffDb: המסמך
המלא נכתב כשמשהו בו השתנה; ‏audit רוכב על meta כמו attnDone).
