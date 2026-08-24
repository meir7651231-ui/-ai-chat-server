import { minToHM } from './min-to-hm.mjs';
let f = 0;
const chk = (name, cond) => { if (!cond) { console.error('✗ ' + name); f = 1; } };

// שקע-בדיקה: ריפוד דו-ספרתי כמו האטום pad2
const pad2 = (n) => String(n).padStart(2, '0');

// 1-5) דוגמאות-החוזה
chk("1 חצות 0⇒'00:00'", minToHM(0, pad2) === '00:00');
chk("2 75⇒'01:15'", minToHM(75, pad2) === '01:15');
chk("3 600⇒'10:00'", minToHM(600, pad2) === '10:00');
chk("4 59⇒'00:59'", minToHM(59, pad2) === '00:59');
chk("5 1439⇒'23:59'", minToHM(1439, pad2) === '23:59');

// 6) השקע נקרא פעמיים: שעות ואז שארית
{
  const calls = [];
  const spy = (n) => { calls.push(n); return pad2(n); };
  minToHM(75, spy);
  chk('6 השקע נקרא פעמיים (1 ואז 15)',
    calls.length === 2 && calls[0] === 1 && calls[1] === 15);
}

if (f) process.exit(1);
console.log('✓ min-to-hm: 6 דוגמאות-חוזה — ירוק');
