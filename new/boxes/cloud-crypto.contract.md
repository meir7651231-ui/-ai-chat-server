# חוזה · קופסת-חיבורים "הצפנת-ענן doc-level" (cloud-crypto)

**תפקיד:** הקופסה שמחווטת את מנוע הצפנת-הענן הדורמנטית של מאור — הצפנה/פענוח
ברמת-המסמך (‏{enc,iv}) + יצירה/פתיחה של envelope-מפתח-הענן. מה שהיה מולחם ב-
`src/lib/cloudCrypto.ts` (עם קודק-base64 פרטי + import מ-`./crypto`) מחווט כאן
במקום אחד: חמשת החוטים (is-enc-doc · encrypt-doc · decrypt-doc · create-cloud-key ·
open-cloud-key) + הקודק b64/unb64 (מילון-הקופסה, verbatim מהמקור) + re-export של
is-encrypted.

**מוצא (עוגני-שורה):** `maor/src/lib/cloudCrypto.ts` —
b64/unb64 שורות 16-22 · isEncDoc 30-32 · encryptDoc 35-43 · decryptDoc 49-57 ·
createCloudKey 64-69 · openCloudKey 72-74 · `export { isEncrypted }` שורה 76.

**חשיפה:**
- `isEncDoc(d)` ⇒ boolean — האם ‏d הוא ‏{enc:string, iv:string} (בדיקה מבנית).
- `encryptDoc(plain, dek)` ⇒ Promise<{enc, iv}> — הצפנת אובייקט ל-base64 עם IV
  טרי (‏getRandomValues) בכל קריאה; ‏enc=base64(ciphertext), iv=base64(iv).
- `decryptDoc(d, dek)` ⇒ Promise<object> — מסמך ‏{enc,iv} מפוענח; **plaintext ישן**
  (שאינו ‏{enc,iv}) מוחזר **כאותה רפרנס** (תאימות-לאחור למיגרציה מעורבת).
- `createCloudKey(password, recoveryKey, { encryptDb, openDek })` ⇒ Promise<{env, dek}>.
- `openCloudKey(env, secret, via, { openDek })` ⇒ Promise<dek|null> — האצלה שקופה.
- `isEncrypted(raw)` ⇒ boolean — האם ‏raw מעטפת-הצפנה (‏$enc===2).

**שקעי-חוץ (מתועדים — לא ממומשים בקופסה):**
- `encryptDb(json, password, recoveryKey)` · `openDek(env, secret, via)` = **חוטי-
  מודול-אחר** (במקור: `import ... from './crypto'`). מוזרקים כ-`deps` לקריאות
  create/open — כך מדיניות-הענן מנותקת מפותח-המכשיר המקומי.
- `crypto.subtle` / `crypto.getRandomValues` / `TextEncoder` / `TextDecoder` /
  `btoa` / `atob` = סטנדרט-פלטפורמה (כמו במקור; זמינים ב-Node ובדפדפן).

**הכרעות-החיווט (חיות בקופסה — נשמרות במגן-הכרעה):**
1. **קודק-base64 verbatim:** ‏b64 מטפל ב-`ArrayBuffer`‏ *וגם* ב-`Uint8Array`
   (`buf instanceof Uint8Array ? buf : new Uint8Array(buf)`) — כי encrypt-doc
   מזין ‏ct (ArrayBuffer) ו-iv (Uint8Array) לאותו קודק. ‏unb64 =
   `Uint8Array.from(atob(s), (c) => c.charCodeAt(0))`.
2. **חיווט encrypt-doc:** ‏encryptDoc(plain, dek, **b64**) — הקודק המקומי מוזרק.
3. **חיווט decrypt-doc:** ‏decryptDoc(d, dek, **isEncDoc, unb64**) — שכן-הזיהוי
   והקודק מוזרקים; plaintext-passthrough חי באטום.

**דוגמאות מחייבות (מאומתות דרך הקופסה בלבד):**
1. `isEncDoc({enc:'a', iv:'b'})===true` · `isEncDoc({enc:7, iv:'b'})===false` ·
   `isEncDoc(null)===false` · `isEncDoc({id:'f1'})===false`.
2. round-trip: DEK אמיתי (‏AES-GCM 256) · `encryptDoc({id:'s7', ils:120, name:'שרה'})`
   ⇒ `{enc,iv}` שניהם מחרוזות-base64 · `decryptDoc(אותו, DEK)` ⇒ שווה-עמוק למקור
   (`id==='s7' · ils===120 · name==='שרה'`).
3. IV-טרי: שתי הצפנות של אותו קלט ⇒ `iv`-ים שונים (getRandomValues).
4. plaintext-passthrough: `decryptDoc({id:'f1', name:'משה'}, DEK)` ⇒ **אותה רפרנס**
   (`=== d`, בלי פענוח).
5. DEK-שגוי: `{enc,iv}` שהוצפן עם DEK-א', מפוענח עם DEK-ב' ⇒ ההבטחה **נדחית**
   (GCM-auth נכשל — לא נבלע).
6. createCloudKey · שקעים דטרמיניסטיים: `encryptDb=async(j,p,r)=>({v:2,p,r,j})` ·
   `openDek=async(env,s)=>'DEK:'+s` · `('סוד7','REC-42')` ⇒
   `{env:{v:2,p:'סוד7',r:'REC-42',j:''}, dek:'DEK:סוד7'}`; ‏encryptDb נקרא פעם-אחת
   עם arg-ראשון `''`; ‏openDek נקרא עם ‏(env, 'סוד7', 'pass') — לא עם מפתח-השחזור.
7. createCloudKey · `openDek⇒null` ⇒ זריקת `Error('יצירת מפתח-הצפנה נכשלה')`.
8. openCloudKey · שקע-מרגל שמחזיר זקיף S ⇒ `openCloudKey({iter:1000},'סוד','pass',{openDek:spy})===S`
   (אותה Promise), המרגל נקרא **פעם-אחת** עם `({iter:1000},'סוד','pass')` · `via='rec'`
   מועבר verbatim · שקע שמחזיר `Promise.resolve(null)` ⇒ הפלט (אחרי await) `===null`.
9. `isEncrypted({$enc:2})===true` · `isEncrypted({$enc:1})===false` · `isEncrypted(null)===false`.

**DoD:** `node new/boxes/cloud-crypto.test.mjs` ⇒ exit 0 ·
`node maor-system/machtzev/parity/cloud-crypto.parity.mjs` ⇒ exit 0 (ישן≡חדש).
