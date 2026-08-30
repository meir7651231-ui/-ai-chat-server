import { stageLabel as __pure_stageLabel } from './stage-label.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_stageLabel_STAGE_LABEL_T = {
  k1: "חדש",
  k2: "בהכנה",
  k3: "רישום",
  k4: "מסירה",
  k5: "הושלם",
  k6: "ayin.stage.",
};
const stageLabel = (...a) => __pure_stageLabel(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_stageLabel_STAGE_LABEL_T);
let f = 0;
const eq = (a, b, msg) => { if (a !== b) { console.error(`✗ ${msg} ⇒ ${JSON.stringify(a)}`); f = 1; } };

// 1) מונח-ארגון גובר
eq(stageLabel({}, 'eyes', () => 'ביצוע'), 'ביצוע', 'מונח-הארגון לא גבר');

// 2) נפילה לברירת-המחדל
const termOf = (c, k, fb) => c.terms?.[k] ?? fb;
eq(stageLabel({}, 'answer', termOf), 'מסירה', 'ברירת-המחדל של answer שגויה');

// 3) חמשת השלבים בנפילה
eq(stageLabel({}, 'new', termOf), 'חדש', 'new שגוי');
eq(stageLabel({}, 'lead', termOf), 'בהכנה', 'lead שגוי');
eq(stageLabel({}, 'eyes', termOf), 'רישום', 'eyes שגוי');
eq(stageLabel({}, 'done', termOf), 'הושלם', 'done שגוי');

// 4) השקע נקרא פעם אחת עם (cfg, 'ayin.stage.done', 'הושלם')
const cfg = { tag: 'cfg' };
let calls = 0, got = null;
stageLabel(cfg, 'done', (...args) => { calls++; got = args; return 'x'; });
if (calls !== 1 || got[0] !== cfg || got[1] !== 'ayin.stage.done' || got[2] !== 'הושלם') {
  console.error(`✗ קריאת-השקע שגויה ⇒ ${JSON.stringify(got)}`); f = 1;
}

if (f) process.exit(1);
console.log('✓ stage-label: 4 דוגמאות-חוזה — ירוק');
