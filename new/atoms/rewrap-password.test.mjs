import { rewrapPassword } from './rewrap-password.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };

// DEK אמיתי מ-16 בייטים ידועים [1..16] — exportKey חייב להחזיר בדיוק אותם
const RAW = new Uint8Array(Array.from({ length: 16 }, (_, i) => i + 1));
const dek = await crypto.subtle.importKey('raw', RAW, 'AES-GCM', true, ['encrypt', 'decrypt']);

// שקעי-בדיקה מתעדים, כמוגדר בחוזה
const log = { rand: [], derive: [], aes: [] };
const SALT = new Uint8Array(16).fill(9);
const rand = (n) => { log.rand.push(n); return SALT; };
const deriveWrapKey = async (secret, salt, iter) => { log.derive.push([secret, salt, iter]); return { wrap: secret, salt, iter }; };
const aesEnc = async (key, plain) => { log.aes.push([key, plain]); return { tag: 'ENC', key, bytes: Array.from(plain) }; };
const b64 = (bytes) => 'B64:' + bytes.length;

const env = { $enc: 2, saltPass: 'SP', wrapPass: 'WP', saltRec: 'SR', wrapRec: 'WR', iter: 600000, data: 'DATA' };
const out = await rewrapPassword(env, dek, 'סוד-חדש', rand, deriveWrapKey, aesEnc, b64);

// 1 — rand פעם-אחת עם 16; saltPass = b64(תוצאת-rand)
ok(log.rand.length === 1 && log.rand[0] === 16, 'דוגמה 1 — rand: ' + JSON.stringify(log.rand));
ok(out.saltPass === 'B64:16', 'דוגמה 1 — saltPass: ' + out.saltPass);
// 2 — deriveWrapKey('סוד-חדש', תוצאת-rand, env.iter)
ok(log.derive.length === 1 && log.derive[0][0] === 'סוד-חדש' && log.derive[0][1] === SALT && log.derive[0][2] === 600000,
  'דוגמה 2 — deriveWrapKey: ' + JSON.stringify([log.derive[0]?.[0], log.derive[0]?.[2]]));
// 3 — wrapPass = aesEnc(kPass, ייצוא-raw אמיתי של ה-DEK)
ok(out.wrapPass.tag === 'ENC' && out.wrapPass.key.wrap === 'סוד-חדש',
  'דוגמה 3 — המפתח שהוזן ל-aesEnc אינו תוצאת-deriveWrapKey');
ok(JSON.stringify(out.wrapPass.bytes) === JSON.stringify(Array.from(RAW)),
  'דוגמה 3 — בייטי-ה-DEK: ' + JSON.stringify(out.wrapPass.bytes));
// 4 — שאר השדות ביט-זהים
ok(out.$enc === 2 && out.saltRec === 'SR' && out.wrapRec === 'WR' && out.iter === 600000 && out.data === 'DATA',
  'דוגמה 4 — שדות-מעטפת השתנו');
// 5 — אפס-מוטציה + עותק חדש
ok(env.saltPass === 'SP' && env.wrapPass === 'WP', 'דוגמה 5 — env שונה במקור');
ok(out !== env, 'דוגמה 5 — out === env — לא עותק');

if (f) process.exit(1);
console.log('✓ rewrap-password: 5 דוגמאות-חוזה — ירוק');
