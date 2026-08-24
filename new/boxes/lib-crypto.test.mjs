/** בדיקת-קצה · קופסת lib-crypto — דרך הקופסה בלבד, מסלול-אמת WebCrypto.
 *  DoD (לפני הקוד): `node new/boxes/lib-crypto.test.mjs` ⇒ exit 0 +
 *  "✓ קופסת lib-crypto" — 7 דוגמאות-החוזה ירוקות + מגן-הכרעה.
 *  מייבאת אך-ורק את הקופסה-שלה (מותר לבדיקת-קופסה). */
import { readFileSync } from 'node:fs';
import {
  genRecoveryKey, encryptDb, isEncrypted, openDek, decryptDb, reencryptDb, rewrapPassword,
} from './lib-crypto.mjs';

let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };

// 1) genRecoveryKey — צורה, אורך, אלפבית בלי I/O/0/1
{
  const k = genRecoveryKey();
  ok(/^[A-HJ-NP-Z2-9]{4}(-[A-HJ-NP-Z2-9]{4}){5}$/.test(k), `צורת-מפתח ⇒ ${k}`);
  ok(k.length === 29, `אורך ⇒ ${k.length}`);
  ok(!/[IO01]/.test(k), 'תו-מבלבל I/O/0/1');
  ok(genRecoveryKey() !== k, 'שני מפתחות זהים — אין אקראיות');
}

// 2+3) round-trip: הסיסמה ומפתח-השחזור פותחים את אותו DEK
const REC = 'ABCD-EFGH';
const env = await encryptDb('{"a":1}', 'pw', REC);
ok(isEncrypted(env) === true, 'isEncrypted(env)');
ok(env.$enc === 2 && env.iter === 600000, `$enc/iter ⇒ ${env.$enc}/${env.iter}`);
{
  const dek = await openDek(env, 'pw', 'pass');
  ok(dek !== null, 'openDek(pass) ⇒ null');
  ok((await decryptDb(env, dek)) === '{"a":1}', 'פענוח-סיסמה');
  const dek2 = await openDek(env, REC, 'rec');
  ok(dek2 !== null && (await decryptDb(env, dek2)) === '{"a":1}', 'פענוח-מפתח-שחזור (אותו DEK)');
}

// 4) סוד-שגוי ⇒ null · isEncrypted על לא-מעטפת ⇒ false
ok((await openDek(env, 'wrong', 'pass')) === null, 'סוד-שגוי ⇒ null');
ok((await openDek(env, 'wrong', 'rec')) === null, 'מפתח-שחזור-שגוי ⇒ null');
ok(isEncrypted({}) === false && isEncrypted(null) === false && isEncrypted('x') === false, 'isEncrypted שלילי');

// 5) reencryptDb — data מתחלף, העטיפות/המלחים נשמרים, אפס-מוטציה
{
  const dek = await openDek(env, 'pw', 'pass');
  const dataBefore = env.data;
  const env2 = await reencryptDb(env, dek, '{"b":2}');
  ok((await decryptDb(env2, dek)) === '{"b":2}', 'reencrypt: הפענוח החדש');
  ok(env2.saltPass === env.saltPass && env2.wrapPass === env.wrapPass
    && env2.saltRec === env.saltRec && env2.wrapRec === env.wrapRec
    && env2.iter === env.iter && env2.$enc === 2, 'reencrypt: העטיפות/המלחים לא זזו');
  ok(env.data === dataBefore && env2 !== env, 'reencrypt: אפס-מוטציה + עותק חדש');
  // הסיסמה עדיין פותחת את env2 (אותו DEK) ⇒ הנתונים החדשים
  const dekR = await openDek(env2, 'pw', 'pass');
  ok((await decryptDb(env2, dekR)) === '{"b":2}', 'reencrypt: הסיסמה פותחת את המעטפת החדשה');
}

// 6) rewrapPassword — סיסמה-חדשה פותחת, ישנה נכשלת, מפתח-שחזור שורד, אפס-מוטציה
{
  const dek = await openDek(env, 'pw', 'pass');
  const saltBefore = env.saltPass;
  const env3 = await rewrapPassword(env, dek, 'new-pw');
  const dekNew = await openDek(env3, 'new-pw', 'pass');
  ok(dekNew !== null && (await decryptDb(env3, dekNew)) === '{"a":1}', 'rewrap: הסיסמה-החדשה פותחת');
  ok((await openDek(env3, 'pw', 'pass')) === null, 'rewrap: הסיסמה-הישנה כבר לא פותחת');
  const dekRec = await openDek(env3, REC, 'rec');
  ok(dekRec !== null && (await decryptDb(env3, dekRec)) === '{"a":1}', 'rewrap: מפתח-השחזור שורד');
  ok(env3.saltRec === env.saltRec && env3.wrapRec === env.wrapRec, 'rewrap: עטיפת-השחזור לא זזה');
  ok(env.saltPass === saltBefore && env3 !== env, 'rewrap: אפס-מוטציה של הקלט');
}

// 7) יוניקוד מולטי-בייט round-trip
{
  const json = '{"שָׁלוֹם":"עולם 😀"}';
  const e = await encryptDb(json, 'ס', 'WXYZ-2345');
  const dek = await openDek(e, 'ס', 'pass');
  ok((await decryptDb(e, dek)) === json, 'round-trip יוניקוד');
}

/* 🛡 מגן-הכרעה: הקופסה מייבאת רק אטומים, ומחווטת את שקעי-ה-WebCrypto verbatim
   בסדר-המקור. קריאת-מקור-הקופסה עם fs מאשרת את ההכרעות תו-בתו. */
const src = readFileSync(new URL('./lib-crypto.mjs', import.meta.url), 'utf8');
// (א) אפס ייבוא-קופסה (חוק-2) — כל import הוא מ-../atoms/
for (const m of src.matchAll(/^import .*? from '(.+?)';/gm)) {
  if (!m[1].startsWith('../atoms/')) { console.error('✗ מגן: ייבוא לא-אטומי ' + m[1]); f = 1; }
}
// (ב) שקעי-הפרימיטיב verbatim מהמקור
for (const needle of [
  "crypto.getRandomValues(new Uint8Array(n))",   // rand ← crypto.ts:36
  "'PBKDF2', false, ['deriveKey']",              // deriveWrapKey ← :40
  "{ name: 'AES-GCM', length: 256 }",            // ← :44
  "hash: 'SHA-256'",                             // ← :42
  "const iv = rand(12);",                        // aesEnc iv ← :52
  "return b64(iv) + ':' + b64(ct);",             // ← :54
]) if (!src.includes(needle)) { console.error('✗ מגן: פרימיטיב-מקור שונה — ' + needle); f = 1; }
// (ג) סדר-הזרקת-השקעים ≡ סדר-המקור לכל חוט
for (const wiring of [
  "_encryptDb(json, password, recoveryKey, rand, deriveWrapKey, aesEnc, b64)",
  "_openDek(env, secret, via, unb64, deriveWrapKey, aesDec)",
  "_decryptDb(env, dek, aesDec)",
  "_reencryptDb(env, dek, json, aesEnc)",
  "_rewrapPassword(env, dek, newPassword, rand, deriveWrapKey, aesEnc, b64)",
  "_genRecoveryKey(rand)",
]) if (!src.includes(wiring)) { console.error('✗ מגן: סדר-חיווט שונה — ' + wiring); f = 1; }
// (ד) הקבוע 600000 אינו יושב בקופסה — חי באטום encrypt-db
if (src.includes('600000') || src.includes('600_000')) { console.error('✗ מגן: PBKDF2_ITER דלף לקופסה (מקומו באטום)'); f = 1; }

if (f) process.exit(1);
console.log('✓ קופסת lib-crypto: 7 דוגמאות-חוזה (round-trip WebCrypto: סיסמה⊗שחזור, rewrap, reencrypt, יוניקוד) + מגן-הכרעה — ירוק');
