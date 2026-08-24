# חוזה · חוט encrypt-doc
**תפקיד:** הצפנת מסמך-ישות (אובייקט) לענן מוצפן-doc-level: ‏JSON.stringify
⇒ ‏AES-GCM עם ה-DEK ו-**IV אקראי חדש (12 בייט) בכל כתיבה** (חובה ל-GCM —
שימוש-חוזר ב-IV שובר את ההצפנה) ⇒ ‏{enc, iv} שניהם base64. ה-id של המסמך
נשאר מחוץ למעטפת (מפתח-המסמך plaintext — אחריות הקופסה).
**שקעים (חוק-1 — קריאה-לשכן הוזרקה כפרמטר):**
- ‏b64(bytes) ⇒ string — קידוד בייטים ל-base64 (במקור: helper פרטי באותו
  קובץ). נקרא פעמיים: על ה-ciphertext ועל ה-IV.
- ‏crypto.getRandomValues / crypto.subtle.encrypt / TextEncoder / JSON =
  סטנדרט-פלטפורמה (כמו במקור).
**קלט:** plain (אובייקט-מסמך) · dek ‏(CryptoKey AES-GCM) · השקע b64.
**פלט:** ‏Promise<{enc:string, iv:string}>.
**דוגמאות מחייבות (שקע-אמת כהגדרת-המקור):**
1. ‏round-trip: ‏{id:'s7', ils:120, name:'שרה'} מוצפן ב-DEK ⇒ ‏{enc,iv}
   ששניהם מחרוזות; פענוח-AES-GCM ידני עם אותו DEK ⇒ שווה-עמוק למקור.
2. ה-IV באורך 12 בייט בדיוק (‏unb64(iv).length === 12).
3. טריות-IV: שתי הצפנות של אותו מסמך באותו DEK ⇒ ‏iv שונה ו-enc שונה.
4. השקע b64 נקרא בדיוק פעמיים — פעם על ה-ciphertext ופעם על בייטי-ה-IV
   ‏(אורך 12).
5. פענוח עם DEK אחר ⇒ זריקה ‏(GCM auth) — ההצפנה אמיתית, לא קידוד.
**מוצא:** maor/src/lib/cloudCrypto.ts:35-48 (‏encryptDoc — "IV אקראי לכל
כתיבה (חובה ל-GCM)"). השכן b64 הפך לשקע; encoder הוטמע כ-TextEncoder סטנדרטי.
