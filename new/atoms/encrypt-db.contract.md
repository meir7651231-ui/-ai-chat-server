# חוזה · חוט encrypt-db
**תפקיד:** יצירת מעטפת-מוצפנת חדשה (הצפנה-במנוחה, envelope v2): DEK אקראי
של 32 בייט, עטוף **פעמיים** — פעם בסיסמה ופעם במפתח-השחזור (כל עטיפה עם
מלח-16-בייט משלה, PBKDF2-SHA256 עם ‏PBKDF2_ITER=600000 — קבוע-המקור,
המלצת-OWASP; ה-envelope שומר את ה-iter שלו ⇒ העלאת ברירת-המחדל לא שוברת
מעטפות ישנות). הנתונים עצמם מוצפנים ב-DEK. יתרון-הכפל: שינוי-סיסמה = עטיפת
ה-DEK מחדש בלבד, ומפתח-השחזור תמיד פותח.
**שקעים (חוק-1 — קריאה-לשכן הוזרקה כפרמטר; כולם helpers באותו קובץ במקור):**
- ‏rand(n) ⇒ ‏Uint8Array — n בייטים אקראיים. נקרא 3 פעמים: 32 (DEK) · 16
  ‏(saltPass) · 16 (saltRec) — בסדר הזה.
- ‏deriveWrapKey(secret, salt, iter) ⇒ ‏Promise<CryptoKey> — גזירת מפתח-עטיפה
  ‏PBKDF2. נקרא פעמיים: ‏(password, saltPass, 600000) ואז ‏(recoveryKey, saltRec, 600000).
- ‏aesEnc(key, plain) ⇒ ‏Promise<string "iv:ct"> — נקרא 3 פעמים: ‏(kPass, dekRaw) ·
  ‏(kRec, dekRaw) · ‏(dek, בייטי-ה-JSON).
- ‏b64(bytes) ⇒ string — קידוד המלחים. ‏crypto.subtle.importKey / TextEncoder = סטנדרט.
**קלט:** json (מחרוזת) · password · recoveryKey · השקעים rand·deriveWrapKey·aesEnc·b64.
**פלט:** ‏Promise<envelope> — ‏{$enc:2, iter, saltPass, saltRec, wrapPass, wrapRec, data}.
**דוגמאות מחייבות:**
1. עם שקעי-בדיקה ⇒ הפלט נושא ‏$enc===2 ו-‏iter===600000 בדיוק.
2. ‏rand נקרא בדיוק ‏[32,16,16]; ‏deriveWrapKey פעמיים —
   ‏('סוד','salt32',600000) ואז ‏('מפתח','salt16a',600000) (מלח-הסיסמה ≠ מלח-השחזור).
3. ‏aesEnc נקרא 3 פעמים; הראשון והשני מקבלים את **אותו** dekRaw (32 בייט),
   והשלישי את בייטי-ה-JSON ‏(TextEncoder על הקלט).
4. מסלול-אמת ‏(WebCrypto, שקעים כהגדרות-המקור): ‏json='{"שלום":1}' ⇒ שחרור
   ה-DEK מ-wrapPass עם מפתח שנגזר מ-‏(password, unb64(saltPass), iter) ופענוח
   data בו ⇒ ה-JSON חוזר ביט-זהה.
5. באותו מסלול-אמת: גם ‏wrapRec משחרר את **אותו** DEK עם ‏(recoveryKey, saltRec) —
   שני המנעולים פותחים את אותה דלת.
**מוצא:** maor/src/lib/crypto.ts:79-100 (‏encryptDb — "יצירת מעטפת מוצפנת
חדשה"). השכנים rand·deriveWrapKey·aesEnc·b64 הפכו לשקעים; enc הוטמע
כ-TextEncoder סטנדרטי; ‏PBKDF2_ITER=600000 נשאר קבוע-מקור בתוך החוט.
