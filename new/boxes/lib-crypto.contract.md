# חוזה · קופסת-חיבורים "lib-crypto"
**תפקיד:** ספריית ההצפנה-במנוחה (opt-in) של מאור — AES-GCM 256 עם DEK
אקראי שעטוף פעמיים (סיסמה⊗מפתח-שחזור). הקופסה מחווטת את 7 חוטי-ההצפנה
(gen-recovery-key · encrypt-db · is-encrypted · open-dek · decrypt-db ·
reencrypt-db · rewrap-password) ומספקת להם את שקעי-ה-WebCrypto המשותפים.

**מוצא-המקור (L4):** `maor/src/lib/crypto.ts`.
עוגני-שורה של השקעים שהקופסה מחווטת verbatim מהמקור:
- `b64` ← crypto.ts:29-34 · `unb64` ← crypto.ts:35 · `rand` ← crypto.ts:36
- `deriveWrapKey` ← crypto.ts:38-48 · `aesEnc` ← crypto.ts:50-55 · `aesDec` ← crypto.ts:57-66
עוגני-החוטים (אטומים): genRecoveryKey ← :69-76 · encryptDb ← :79-98 ·
isEncrypted ← :101-103 · openDek ← :106-120 · decryptDb ← :123-125 ·
reencryptDb ← :128-130 · rewrapPassword ← :133-138.

**הכרעות-הקופסה (חיות כאן, לא באטומים):**
- כל שקע-WebCrypto ממומש פעם-אחת ומשותף לכל החוטים (המקור: helpers מודולריים).
- סדר-ההזרקה לכל חוט ≡ סדר-המקור: encryptDb⇐(rand, deriveWrapKey, aesEnc, b64) ·
  openDek⇐(unb64, deriveWrapKey, aesDec) · decryptDb⇐(aesDec) ·
  reencryptDb⇐(aesEnc) · rewrapPassword⇐(rand, deriveWrapKey, aesEnc, b64).
- קבועי-הפרימיטיב verbatim: PBKDF2-SHA256 · AES-GCM length 256 · iv=rand(12) ·
  base64 דרך btoa/atob · אנטרופיה דרך `crypto.getRandomValues` (סטנדרט-פלטפורמה,
  כמו crypto.subtle שכבר בשימוש-ישיר באטומים — חוק-1 מתיר שפה/סטנדרט).
- `PBKDF2_ITER=600000` חי בתוך האטום encrypt-db (קבוע-מקור), לא בקופסה.

**חשיפה (חתימות זהות-מקור):**
- `genRecoveryKey()` ⇒ מחרוזת 'XXXX-XXXX-XXXX-XXXX-XXXX-XXXX' (אורך 29, base32 בלי I/O/0/1).
- `encryptDb(json, password, recoveryKey)` ⇒ `Promise<env>` — `{$enc:2, iter:600000, saltPass, saltRec, wrapPass, wrapRec, data}`.
- `isEncrypted(raw)` ⇒ boolean (‏raw.$enc===2).
- `openDek(env, secret, via)` ⇒ `Promise<CryptoKey|null>` (via='pass'|'rec'; כל כשל ⇒ null, לא זורק).
- `decryptDb(env, dek)` ⇒ `Promise<string>` (זורק על מפתח/נתונים שגויים — לא בולע).
- `reencryptDb(env, dek, json)` ⇒ `Promise<env חדש>` — אותה מעטפת, רק `data` מתחלף (אפס-מוטציה).
- `rewrapPassword(env, dek, newPassword)` ⇒ `Promise<env חדש>` — רק `saltPass`/`wrapPass` מתחלפים (אפס-מוטציה).

**שקע-IO של לוח-האם (מחוץ-לקופסה):** האנטרופיה עצמה (מקור-האקראיות) היא
תלות-סביבה; הקופסה נשענת על ה-WebCrypto הגלובלי — הזרקת-מקור-אקראיות
דטרמיניסטי לצורך בדיקה/רתמת-זהב נעשית ברמת-הגלובל, לא בחתימת-הקופסה.

**דוגמאות מחייבות (מסלול-אמת WebCrypto):**
1. `genRecoveryKey()` ⇒ תואם `/^[A-HJ-NP-Z2-9]{4}(-[A-HJ-NP-Z2-9]{4}){5}$/`, אורך 29, אפס I/O/0/1.
2. Round-trip סיסמה: `env=await encryptDb('{"a":1}','pw','ABCD-EFGH')`;
   `isEncrypted(env)===true`; `dek=await openDek(env,'pw','pass')`;
   `await decryptDb(env,dek)==='{"a":1}'`.
3. Round-trip מפתח-שחזור: `dek2=await openDek(env,'ABCD-EFGH','rec')` פותח את **אותו** DEK ⇒ הפענוח זהה.
4. סוד-שגוי: `await openDek(env,'wrong','pass')===null`; `isEncrypted({})===false`.
5. `reencryptDb`: `env2=await reencryptDb(env,dek,'{"b":2}')`;
   `await decryptDb(env2,dek)==='{"b":2}'`; `env2.saltPass===env.saltPass` (העטיפות לא זזו); `env.data` לא-מוטציה.
6. `rewrapPassword`: `env3=await rewrapPassword(env,dek,'new-pw')`;
   `await openDek(env3,'new-pw','pass')` פותח; `await openDek(env3,'pw','pass')===null`;
   מפתח-השחזור עדיין פותח (`saltRec`/`wrapRec` לא זזו); `env.saltPass` לא-מוטציה.
7. יוניקוד: `json='{"שָׁלוֹם":"עולם 😀"}'` ⇒ round-trip ביט-זהה (UTF-8 מולטי-בייט).
