# חוזה · חוט decrypt-doc
**תפקיד:** פענוח מסמך-ישות שנקרא מענן מוצפן-doc-level. **תאימות-לאחור:**
מסמך שאינו ‏{enc,iv} (plaintext ישן) מוחזר כמו-שהוא — אותה רפרנס — כך
ארגון מכיל מסמכים מעורבים בזמן-מיגרציה. מסמך מוצפן: ‏AES-GCM עם iv
מהמסמך ⇒ ‏JSON.parse של הבייטים. מפתח-שגוי/נתונים-שונו ⇒ ההבטחה נדחית.
**שקעים (חוק-1 — קריאה-לשכן הוזרקה כפרמטר):**
- ‏isEncDoc(d) ⇒ boolean — האם המסמך {enc,iv} (במקור: שכן באותו קובץ
  שבודק ‏typeof d.enc==='string' && typeof d.iv==='string').
- ‏unb64(s) ⇒ ‏Uint8Array — פענוח base64 לבייטים (במקור: helper פרטי).
  נקרא פעמיים: על ‏d.iv ועל ‏d.enc.
- ‏crypto.subtle / TextDecoder / JSON = סטנדרט-פלטפורמה (כמו במקור).
**קלט:** d (אובייקט-מסמך) · dek ‏(CryptoKey) · השקעים isEncDoc·unb64.
**פלט:** ‏Promise<אובייקט> — המסמך הגלוי.
**דוגמאות מחייבות (שקעי-אמת כהגדרות-המקור):**
1. ‏plaintext ‏d={id:'f1', name:'משה'} ⇒ מוחזר ‏=== ‏d (אותה רפרנס, בלי פענוח).
2. ‏round-trip: ‏{id:'s7', ils:120, name:'שרה'} שהוצפן ‏AES-GCM ל-{enc,iv}
   ⇒ ‏decryptDoc מחזיר אובייקט שווה-עמוק למקור (id==='s7', ‏ils===120).
3. מסמך עם ‏enc שאינו מחרוזת ‏(enc:7) ⇒ ‏isEncDoc=false ⇒ מוחזר כמו-שהוא.
4. אותו ‏{enc,iv} עם DEK אחר ⇒ ההבטחה נדחית (GCM auth נכשל — לא נבלע).
**מוצא:** maor/src/lib/cloudCrypto.ts:49-63 (‏decryptDoc — "פענוח מסמך שנקרא
מהחוט; plaintext ישן מוחזר כמו-שהוא"). השכנים isEncDoc·unb64 הפכו לשקעים;
decoder הוטמע כ-TextDecoder סטנדרטי.
