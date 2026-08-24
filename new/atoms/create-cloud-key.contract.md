# חוזה · חוט create-cloud-key
**תפקיד:** יצירת envelope-מפתח להצפנת-ענן: DEK אקראי עטוף בסיסמה + מפתח-שחזור,
ומחזיר גם את ה-DEK החי (לשימוש מיידי). מנצל את מסלול-ה-envelope הקיים עם json
ריק ('') — רק העטיפות נחוצות, ה-data נזרק. כשל בפתיחת ה-DEK מיד אחרי היצירה
(openDek⇒null) ⇒ זריקת שגיאה — לא מחזירים envelope שאי-אפשר לפתוח.
**שקעים (חוק-1 — קריאות-שכן הוזרקו כפרמטרים; במקור מ-lib/crypto):**
- ‏encryptDb(json, password, recoveryKey) ⇒ Promise<env> — בונה envelope.
- ‏openDek(env, secret, via) ⇒ Promise<dek|null> — פותח DEK; null=סוד שגוי.
**קלט:** ‏password · ‏recoveryKey + שני השקעים. **פלט:** ‏Promise<{env, dek}>.
**דוגמאות מחייבות** (שקעים מזויפים דטרמיניסטיים):
1. ‏encryptDb=async(j,p,r)=>({v:2,p,r,j}) · ‏openDek=async(env,s)=>'DEK:'+s ·
   ‏('סוד7','REC-42') ⇒ ‏{env:{v:2,p:'סוד7',r:'REC-42',j:''}, dek:'DEK:סוד7'}.
2. ‏encryptDb נקרא בדיוק פעם אחת, והארגומנט הראשון הוא '' (json ריק).
3. ‏openDek נקרא עם ה-env שחזר מ-encryptDb, הסיסמה, ו-via='pass' —
   לא עם מפתח-השחזור.
4. ‏openDek⇒null ⇒ החוט זורק Error עם ההודעה 'יצירת מפתח-הצפנה נכשלה'.
5. שגיאה שנזרקת מ-encryptDb עצמו מבעבעת החוצה (reject) — אין בליעה.
**מוצא:** maor/src/lib/cloudCrypto.ts:64-71 (‏createCloudKey — הצפנת-ענן
דורמנטית). השכנים encryptDb/openDek הפכו לשקעים (חוק-1).
