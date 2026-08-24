import { unitLabel } from './unit-label.mjs';
let f = 0;
const eq = (a, b, msg) => { if (a !== b) { console.error(`✗ ${msg} ⇒ ${JSON.stringify(a)}`); f = 1; } };

// 1) מונח-ארגון גובר
eq(unitLabel({}, () => 'שעות'), 'שעות', 'מונח-הארגון לא גבר');

// 2) נפילה לברירת-המחדל
const termOf = (c, k, fb) => c.terms?.[k] ?? fb;
eq(unitLabel({}, termOf), 'כמות', 'ברירת-המחדל שגויה');

// 3) השקע נקרא פעם אחת עם (cfg, 'entity.ayinUnit', 'כמות')
const cfg = { tag: 'cfg' };
let calls = 0, got = null;
unitLabel(cfg, (...args) => { calls++; got = args; return 'x'; });
if (calls !== 1 || got[0] !== cfg || got[1] !== 'entity.ayinUnit' || got[2] !== 'כמות') {
  console.error(`✗ קריאת-השקע שגויה ⇒ ${JSON.stringify(got)}`); f = 1;
}

if (f) process.exit(1);
console.log('✓ unit-label: 3 דוגמאות-חוזה — ירוק');
