# חוזה · חוט delete-org-request
**תפקיד:** מחיקת בקשת-הרשמה של הפלטפורמה (אישור/דחייה בלוח-הבקרה, מיילי-על)
— מחיקת המסמך ‏platformRequests/{uid} (אוסף-השורש של בקשות-ההרשמה, CLOUD2).
**שקעים (חוק-1 — firebase/firestore הוזרק כאובייקט fs):**
- ‏fs.db — ידית מסד-הענן (במקור: ‏cloudDb()).
- ‏fs.doc(db, col, id) — הפניית-מסמך.
- ‏fs.deleteDoc(ref) ⇒ ‏Promise — המחיקה עצמה.
(שם-האוסף 'platformRequests' — קבוע-המנגנון PLATFORM_REQUESTS מהמקור, מוטבע כלשונו.)
**קלט:** ‏uid · ‏fs. **פלט:** ‏Promise<void> (undefined).
**דוגמאות מחייבות** (שקעים מזויפים רושמי-קריאות):
1. ‏('uid-77') ⇒ ‏doc נקרא בדיוק פעם אחת עם ‏(db,'platformRequests','uid-77').
2. ‏deleteDoc נקרא בדיוק פעם אחת, עם בדיוק ההפניה ש-doc החזיר.
3. הערך המוחזר (אחרי await) הוא ‏undefined.
4. ‏deleteDoc שנדחה (reject 'denied') ⇒ השגיאה מבעבעת החוצה — אין בליעה.
**מוצא:** maor/src/lib/cloudConfig.ts:168-172 (‏deleteOrgRequest, CLOUD2 —
לוח-הבקרה). שכני-firestore ו-cloudDb הפכו לשקעי-fs (חוק-1).
