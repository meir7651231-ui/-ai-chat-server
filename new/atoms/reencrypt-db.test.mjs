import { reencryptDb } from './reencrypt-db.mjs';
// מימוש-שקע לבדיקה — כמוגדר בחוזה: מתעד את ה-DEK ומפענח את הבייטים חזרה לטקסט.
const aesEnc = async (dek, bytes) => ({ tag: 'ENC', key: dek, text: new TextDecoder().decode(bytes) });
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };

const env = { $enc: 2, saltPass: 'SP', wrapPass: 'WP', saltRec: 'SR', wrapRec: 'WR', iter: 600000, data: 'OLD' };
const out = await reencryptDb(env, 'DEK1', '{"a":1}', aesEnc);
// 1 — ה-data החדש הוא הצפנת ה-JSON בדיוק, עם ה-DEK שהוזרק:
ok(out.data.tag === 'ENC' && out.data.key === 'DEK1' && out.data.text === '{"a":1}', 'data: ' + JSON.stringify(out.data));
// 2 — שאר שדות-המעטפת ביט-זהים:
ok(out.$enc === 2 && out.saltPass === 'SP' && out.wrapPass === 'WP' && out.saltRec === 'SR' && out.wrapRec === 'WR' && out.iter === 600000, 'שדות-מעטפת השתנו');
// 3 — אפס-מוטציה של הקלט + עותק חדש:
ok(env.data === 'OLD', 'env.data שונה במקור');
ok(out !== env, 'out === env — לא עותק');
// 4 — קידוד-UTF-8 עגול לעברית:
const heb = await reencryptDb(env, 'DEK1', 'שָׁלוֹם', aesEnc);
ok(heb.data.text === 'שָׁלוֹם', 'עברית: ' + heb.data.text);

if (f) process.exit(1);
console.log('✓ reencrypt-db: 5 דוגמאות-חוזה — ירוק');
