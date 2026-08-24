# חוזה · חוט open-dek
**תפקיד:** חילוץ מפתח-הנתונים (DEK) ממעטפת-הצפנה בעזרת סיסמה או מפתח-שחזור.
בוחר לפי via את זוג המלח/עטיפה (‏'pass' ⇒ ‏saltPass/wrapPass · ‏'rec' ⇒
‏saltRec/wrapRec), גוזר מפתח-עטיפה מהסוד עם **מספר-האיטרציות של המעטפת**
(‏env.iter — מעטפת ישנה נפתחת באיטרציות שלה), מפענח את ה-DEK ומייבא אותו
כ-CryptoKey ‏AES-GCM ‏extractable ‏encrypt+decrypt. **כל כשל** (סוד שגוי,
base64 פגום, עטיפה משובשת) ⇒ null — לעולם לא זורק.
**שקעים (חוק-1 — קריאות-לשכנים הוזרקו כפרמטרים):**
- ‏unb64(s) — ‏base64 ⇒ ‏Uint8Array (זורק על קלט פגום).
- ‏deriveWrapKey(secret, salt, iter) — ‏Promise‏<CryptoKey> עטיפה מ-PBKDF2-SHA256.
- ‏aesDec(key, blob) — פענוח ‏"iv:ct" (base64) ⇒ ‏Promise‏<Uint8Array>; זורק על מפתח שגוי.
מותר-סטנדרט: ‏crypto.subtle.importKey (WebCrypto גלובלי).
**קלט:** env ‏{iter,saltPass,saltRec,wrapPass,wrapRec,…}, secret, via ‏'pass'|'rec',
ושלושת השקעים. **פלט:** ‏Promise‏<CryptoKey|null>.
**דוגמאות מחייבות (מעטפת-בדיקה: DEK=בייטים 0..31, iter=1000, סיסמה 'sod-123',
מפתח-שחזור 'MFTQ-1234'):**
1. ‏via='pass' + 'sod-123' ⇒ CryptoKey שה-raw שלו ≡ בייטים 0..31 (32 בייט),
   ‏type='secret', ‏algorithm.name='AES-GCM', ‏extractable=true.
2. ‏via='rec' + 'MFTQ-1234' ⇒ אותו DEK (0..31) — הוכחה שנבחרו saltRec/wrapRec.
3. ‏via='pass' + 'sod-999' (סוד שגוי) ⇒ null (aesDec זורק ⇒ נבלע).
4. ‏saltPass='!!!' (base64 פגום) ⇒ null (unb64 זורק ⇒ נבלע).
5. הגזירה מקבלת בדיוק את ‏env.iter (1000 — לא ברירת-מחדל 600K): נאכף בכך
   שהמעטפת נבנתה ב-1000 איטרציות ונפתחת בהצלחה.
**מוצא:** maor/src/lib/crypto.ts:106-122 (‏openDek); השכנים
unb64/deriveWrapKey/aesDec הפכו לשקעים (חוק-1). אין סוד בקובץ (חוק-6 —
סודות-הבדיקה הם קבועי-דוגמה מומצאים).
