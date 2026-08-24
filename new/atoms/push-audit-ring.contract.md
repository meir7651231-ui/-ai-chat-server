# חוזה · חוט push-audit-ring
**תפקיד:** דחיפת טבעת-הלוג של המשתמש המחובר למסמכו-שלו בענן — `auditlog/{uid}`
(כתיבת-מסמך-עצמו בלבד; מנגנון "מנהל מסונכרן"). הטבעת נגזמת ל-**500 הרשומות
האחרונות** (AUDIT_CAP=500, ‏maor/src/types/domain.ts:1072 — הוותיקות נדחקות).
מוצפן אם הוזרק dek. ‏uid ריק ⇒ לא-מחובר ⇒ יציאה שקטה, אפס קריאות-ענן.
**שקעים (חוק-1 — קריאות-החוץ ומצב-המודול הוזרקו כפרמטרים):**
- ‏auditUid — מזהה-המשתמש הכותב (במקור: מצב-מודול שנקבע ב-setAuditContext).
- ‏db — מסד-הענן (במקור: ‏requireDb()).
- ‏scopedCol(name) — שם-אוסף ⇒ נתיב סקופי-לארגון.
- ‏fs — ערכת-Firestore: ‏{ setDoc, doc }.
- ‏encryptDoc(body, dek) ⇒ ‏Promise<מעטפה> — הצפנת-המסמך (נקרא רק כש-dek קיים).
**קלט:** ‏entries (AuditEntry[]) · ‏dek (CryptoKey|null) · השקעים. **פלט:** ‏Promise<void>.
**דוגמאות מחייבות** (בכולן ‏fs מזויף שמתעד קריאות):
1. ‏auditUid='' ⇒ חוזר מיד; ‏setDoc/doc/encryptDoc לא נקראים כלל.
2. ‏entries=[{at:'2026-08-01',op:'א'},{at:'2026-08-02',op:'ב'}], ‏dek=null,
   ‏auditUid='u1', ‏scopedCol=(c)=>'orgs/demo/'+c ⇒ ‏doc נקרא עם
   ‏(db,'orgs/demo/auditlog','u1') ו-setDoc כותב ‏{entries:[שתי-הרשומות כסדרן]}.
3. תקרת-הטבעת: 502 רשומות ⇒ הגוף מכיל בדיוק 500 — האחרונות (הראשונה בגוף =
   רשומה #3 מהקלט; שתי הוותיקות נדחקו).
4. ‏dek='DEK' ⇒ ‏encryptDoc נקרא עם ‏({entries:הטבעת-הגזומה},'DEK') והערך-המוחזר
   ממנו (המעטפה) הוא בדיוק מה ש-setDoc כותב.
5. ‏setDoc דוחה (Error 'permission-denied') ⇒ הפונקציה **זורקת** (לא בולעת).
**מוצא:** maor/src/lib/cloud.ts:149-157 (‏pushAuditRing, משטח "מנהל מסונכרן").
‏auditUid/requireDb/scopedCol/setDoc/doc/encryptDoc הפכו לשקעים (חוק-1);
‏AUDIT_CAP=500 הוטמע כערך מתועד (ייבוא-domain אסור לאטום).
