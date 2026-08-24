# חוזה · חוט pull-audit-ring
**תפקיד:** משיכת **כל** טבעות-הלוג מאוסף `auditlog` הסקופי ומיזוגן — מנהל/מייל-על
בלבד (משטח "מנהל מסונכרן": כל משתמש כותב רק את מסמכו; המנהל קורא את כולם).
‏canRead=false (עובד/ת) ⇒ **null** מיד, אפס קריאות-ענן. המיזוג: כל
‏doc.entries (רק כשהוא מערך) נשפך לרשימה אחת, ממוין עולה לפי `at` (השוואת-
מחרוזות ISO), ונגזם ל-**500 האחרונות** (AUDIT_CAP=500). מוצפן ⇒ פענוח פר-מסמך.
**שקעים (חוק-1 — קריאות-החוץ ומצב-המודול הוזרקו כפרמטרים):**
- ‏auditReadable — הרשאת-הקריאה (במקור: מצב-מודול מ-setAuditContext, canRead).
- ‏db — מסד-הענן (במקור: ‏requireDb()).
- ‏scopedCol(name) — שם-אוסף ⇒ נתיב סקופי-לארגון.
- ‏fs — ערכת-Firestore: ‏{ getDocs, collection }.
- ‏decryptDoc(data, dek) ⇒ ‏Promise<plain> — פענוח-מסמך (נקרא רק כש-dek קיים).
**קלט:** ‏dek (CryptoKey|null) · השקעים. **פלט:** ‏Promise<AuditEntry[]|null>.
**דוגמאות מחייבות** (בכולן ‏fs מזויף שמתעד קריאות):
1. ‏auditReadable=false ⇒ ‏null; ‏getDocs/collection/decryptDoc לא נקראים כלל.
2. מיזוג+מיון: מסמך-א ‏entries=[{at:'2026-08-03',op:'ג'},{at:'2026-08-01',op:'א'}],
   מסמך-ב ‏entries=[{at:'2026-08-02',op:'ב'}] ⇒ ‏[א,ב,ג] (עולה לפי at, חוצה-מסמכים);
   ‏collection נקרא עם ‏(db, scopedCol('auditlog')) — עם ‏scopedCol=(c)=>'orgs/demo/'+c
   ⇒ הנתיב 'orgs/demo/auditlog'.
3. מסמך בלי ‏entries-מערך (‏{entries:'זבל'} או ‏{}) ⇒ מדולג בשקט; השאר ממוזגים.
4. אוסף-ריק ⇒ ‏[] (הצלחה — מנהל בלי לוגים, לא null).
5. ‏dek='DEK' ⇒ ‏decryptDoc נקרא פר-מסמך עם ‏(d.data(),'DEK'); ה-entries נאספים
   מהפלט-המפוענח.
6. תקרה: 501 רשומות ממוזגות ⇒ 500 האחרונות (לפי המיון) — הוותיקה-ביותר נדחקת.
7. ‏getDocs דוחה (Error 'net-down') ⇒ הפונקציה **זורקת** (לא בולעת).
**מוצא:** maor/src/lib/cloud.ts:158-174 (‏pullAuditRing). ‏auditReadable/requireDb/
scopedCol/getDocs/collection/decryptDoc הפכו לשקעים (חוק-1); AUDIT_CAP=500 הוטמע.
