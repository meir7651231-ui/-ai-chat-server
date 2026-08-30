import { itemLabel as __pure_itemLabel } from './item-label.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_itemLabel_ITEM_LABEL_T = {
  k1: "entity.ayinItem",
  k2: "שם לטיפול",
};
const itemLabel = (...a) => __pure_itemLabel(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_itemLabel_ITEM_LABEL_T);
let f = 0;
const eq = (a, b, msg) => { if (a !== b) { console.error(`✗ ${msg} ⇒ ${JSON.stringify(a)}`); f = 1; } };

// 1) מונח-ארגון גובר
eq(itemLabel({}, () => 'פרויקט'), 'פרויקט', 'מונח-הארגון לא גבר');

// 2) נפילה לברירת-המחדל
const termOf = (c, k, fb) => c.terms?.[k] ?? fb;
eq(itemLabel({}, termOf), 'שם לטיפול', 'ברירת-המחדל שגויה');

// 3) השקע נקרא פעם אחת עם (cfg, 'entity.ayinItem', 'שם לטיפול')
const cfg = { tag: 'cfg' };
let calls = 0, got = null;
itemLabel(cfg, (...args) => { calls++; got = args; return 'x'; });
if (calls !== 1 || got[0] !== cfg || got[1] !== 'entity.ayinItem' || got[2] !== 'שם לטיפול') {
  console.error(`✗ קריאת-השקע שגויה ⇒ ${JSON.stringify(got)}`); f = 1;
}

if (f) process.exit(1);
console.log('✓ item-label: 3 דוגמאות-חוזה — ירוק');
