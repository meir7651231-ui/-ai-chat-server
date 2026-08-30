import { revertPatch as __pure_revertPatch } from './revert-patch.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_revertPatch_REVERT_PATCH_T = {
  k1: "answer",
};
const revertPatch = (...a) => __pure_revertPatch(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_revertPatch_REVERT_PATCH_T);
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
// שקע-stageIndex אמיתי כמתועד בחוזה (מקומי לבדיקה — הבדיקה מייבאת רק את האטום שלה)
const AYIN_STAGES = ['new', 'lead', 'eyes', 'answer', 'done'];
const stageIndex = (stage) => { const i = AYIN_STAGES.indexOf(stage); return i < 0 ? 0 : i; };

// 1-3 — חזרה אל לפני 'answer' ⇒ מבטלת את דגל-הדחיפה
for (const s of ['new', 'lead', 'eyes']) {
  const p = revertPatch(s, stageIndex);
  ok(p.stage === s && p.answerPushed === false && Object.keys(p).length === 2,
    `דוגמה ${s}: ` + JSON.stringify(p));
}
// 4-5 — 'answer'/'done' ⇒ רק {stage}, בלי מפתח answerPushed כלל
for (const s of ['answer', 'done']) {
  const p = revertPatch(s, stageIndex);
  ok(p.stage === s && !('answerPushed' in p) && Object.keys(p).length === 1,
    `דוגמה ${s}: ` + JSON.stringify(p));
}

if (f) process.exit(1);
console.log('✓ revert-patch: 5 דוגמאות-חוזה — ירוק');
