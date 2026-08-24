# חוזה · חוט delete-org-completely
**תפקיד:** מחיקת-לקוח מלאה מהענן — ב-Firestore מחיקת מסמך **לא** מוחקת
תתי-אוספים, לכן מוחקים מסודר: כל אוספי-הנתונים של הארגון (entityCols +
'donations' + 'auditlog' + 'incomingPayments' + 'smsOutbox' + 'mailOutbox'
תחת ‏orgs/{slug}/) ← מסמכי-השורש ‏orgSecrets/{slug} · ‏orgSecretsMeta/{slug} ·
‏icsFeeds/{slug} (כשל-מחיקה נבלע — מדולגים בשקט אם אינם) ← צ'אט-הצוות
(‏teamChats/{slug}/messages ואז מסמך-האב, האב **לא נספר**) ← מסמכי-היחיד
‏orgs/{slug}/meta/org · ‏orgs/{slug}/_enc/envelope ← בקשות-ההצטרפות
‏platformOrgs/{slug}/joinRequests ← ולבסוף מסמך-הארגון מוחלף ב**מצבת**:
‏setDoc על ‏platformOrgs/{slug} עם ‏{deleted:true, deletedAt:<ISO עכשיו>}.
מחזיר את מספר-המסמכים שנמחקו (לחיווי-בעלים); מסמכי-שורש/יחיד נספרים
**גם כשאינם קיימים** (deleted++ בלתי-מותנה), והמצבת נספרת ‎+1.
**שקעים (חוק-1 — firebase/firestore הוזרק כאובייקט fs):**
- ‏fs.db — ידית מסד-הענן (במקור: ‏cloudDb()).
- ‏fs.doc(db, ...segments) — הפניית-מסמך (גם נתיב-יחיד 'a/b' וגם מקטעים).
- ‏fs.collection(db, path) — הפניית-אוסף.
- ‏fs.getDocs(colRef) ⇒ ‏Promise<{docs:[{ref}]}>.
- ‏fs.deleteDoc(ref) ⇒ ‏Promise — על מסמכי-שורש/אב עטוף ‎.catch(()=>{}).
- ‏fs.setDoc(ref, data) ⇒ ‏Promise — כתיבת-המצבת.
(שמות-האוספים 'teamChats'/'platformOrgs' — קבועי-המנגנון TEAM_CHATS/
PLATFORM_ORGS מהמקור, מוטבעים כלשונם; אינם זהות/סוד.)
**קלט:** ‏slug · ‏entityCols (מערך שמות-אוספים) · ‏fs. **פלט:** ‏Promise<number>.
**דוגמאות מחייבות** (פיירסטור-מזויף בזיכרון):
1. ריק לגמרי: ‏entityCols=[] ובלי שום מסמך ⇒ מחזיר **6**
   (3 מסמכי-שורש + 2 מסמכי-יחיד + מצבת — כולם נספרים גם כשאינם).
2. ‏slug='s1' · ‏entityCols=['families'] · באוספים: ‏orgs/s1/families=2 מסמכים,
   ‏orgs/s1/donations=1, ‏teamChats/s1/messages=1, ‏platformOrgs/s1/joinRequests=2
   ⇒ מחזיר **12** = 6 נמחקים-בפועל (‏2+1+1+2) + 6 הקבועים של דוגמה 1.
3. בדוגמה 2 נסרקים בדיוק אוספי: ‏orgs/s1/families · ‏orgs/s1/donations ·
   ‏orgs/s1/auditlog · ‏orgs/s1/incomingPayments · ‏orgs/s1/smsOutbox ·
   ‏orgs/s1/mailOutbox · ‏teamChats/s1/messages · ‏platformOrgs/s1/joinRequests
   — בסדר הזה.
4. בדוגמה 2 נקראת מחיקת-מסמך ישירה (deleteDoc על doc) עבור:
   ‏orgSecrets/s1 · ‏orgSecretsMeta/s1 · ‏icsFeeds/s1 ·
   ‏teamChats/s1 (האב) · ‏orgs/s1/meta/org · ‏orgs/s1/_enc/envelope — 6 קריאות.
5. המצבת: ‏setDoc יחיד על ('platformOrgs','s1') עם ‏deleted===true
   ו-deletedAt תואם ‏/^\d{4}-\d{2}-\d{2}T.*Z$/‏ (ISO של רגע-הריצה).
6. ‏deleteDoc שנכשל (reject) על ‏orgSecrets/{slug} — נבלע: הפונקציה מסיימת
   בהצלחה והמונה אינו קטן (דוגמה 1 עם הכשל עדיין מחזירה 6).
**מוצא:** maor/src/lib/cloudConfig.ts:272-321 (‏deleteOrgCompletely — מחיקת-לקוח
מלאה 5.8.2026 + תיקוני 21.8: donations/auditlog/כספת-הסודות/צ'אט/מצבת).
שכני-firestore ו-cloudDb הפכו לשקעי-fs (חוק-1).
