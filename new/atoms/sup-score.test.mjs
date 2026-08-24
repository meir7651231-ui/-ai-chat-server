import { supScore } from './sup-score.mjs';
// שקעי-הבדיקה כמוגדר בחוזה
const totIls = (sp, r) => (sp.ils || 0) + (sp.usd || 0) * r;
const last = (sp) => sp.last || '';
const cnt = (sp) => sp.count || 0;
// "עכשיו" קבוע — חצות-יום 2026-08-24 (אותה בניית-תאריך כמו באטום ⇒ דטרמיניסטי)
const NOW = new Date('2026-08-24T12:00:00').getTime();
const sc = (sp, rate) => supScore(sp, rate, NOW, totIls, last, cnt);
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
// 1) המקסימום
ok(sc({ ils: 6000, count: 12, last: '2026-08-24' }) === 1000, 'דוגמה 1: ≠ 1000');
// 2) המינימום — תורם ריק
ok(sc({}) === 130, 'דוגמה 2: ≠ 130');
// 3) 54 ימים · 3 תרומות · 800 ₪
ok(sc({ ils: 800, count: 3, last: '2026-07-01' }) === 580, 'דוגמה 3: ≠ 580');
// 4) מעל שנה · 2 תרומות · 150 ₪
ok(sc({ ils: 150, count: 2, last: '2025-01-01' }) === 220, 'דוגמה 4: ≠ 220');
// 5) גבול-הטריות — בדיוק 30 ימים ⇒ עדיין 350
ok(sc({ ils: 100, count: 1, last: '2026-07-25' }) === 480, 'דוגמה 5: ≠ 480');
// 6) השער זורם לשקע: rate=4 ⇒ 540; ברירת-מחדל 3.7 ⇒ 480
ok(sc({ usd: 135, count: 1, last: '2026-08-24' }, 4) === 540, 'דוגמה 6א: ≠ 540');
ok(sc({ usd: 135, count: 1, last: '2026-08-24' }) === 480, 'דוגמה 6ב: ≠ 480');
if (f) process.exit(1);
console.log('✓ sup-score: 6 דוגמאות-חוזה — ירוק');
