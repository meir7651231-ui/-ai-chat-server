# חוזה · חוט delete-org-join-request
**תפקיד:** המנהל מוחק בקשת-הצטרפות של עובד/ת (אחרי אישור/דחייה) — מחיקת
המסמך ‏platformOrgs/{slug}/joinRequests/{uid} (ה-subcollection של הארגון,
היררכיית ORGADMIN; Rules: create ע"י המבקש, קריאה/מחיקה = מנהל+מייל-על).
**שקעים (חוק-1 — firebase/firestore הוזרק כאובייקט fs):**
- ‏fs.db — ידית מסד-הענן (במקור: ‏cloudDb()).
- ‏fs.doc(db, ...segments) — הפניית-מסמך.
- ‏fs.deleteDoc(ref) ⇒ ‏Promise — המחיקה עצמה.
(שם-האוסף 'platformOrgs' — קבוע-המנגנון PLATFORM_ORGS מהמקור, מוטבע כלשונו.)
**קלט:** ‏slug · ‏uid · ‏fs. **פלט:** ‏Promise<void> (undefined).
**דוגמאות מחייבות** (שקעים מזויפים רושמי-קריאות):
1. ‏('kehila','uid-42') ⇒ ‏doc נקרא בדיוק פעם אחת עם
   ‏(db,'platformOrgs','kehila','joinRequests','uid-42') — 4 מקטעים, לא נתיב-מודבק.
2. ‏deleteDoc נקרא בדיוק פעם אחת, עם בדיוק ההפניה ש-doc החזיר.
3. הערך המוחזר (אחרי await) הוא ‏undefined.
4. ‏deleteDoc שנדחה (reject 'denied') ⇒ השגיאה מבעבעת החוצה — אין בליעה
   (בשונה מהמחיקות-הרכות של delete-org-completely).
**מוצא:** maor/src/lib/cloudConfig.ts:223-232 (‏deleteOrgJoinRequest, ORGADMIN).
שכני-firestore ו-cloudDb הפכו לשקעי-fs (חוק-1).
