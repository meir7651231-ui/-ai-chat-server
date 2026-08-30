import { ayinAdvanceLabel as __pure_ayinAdvanceLabel } from './ayin-advance-label.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_ayinAdvanceLabel_AYIN_ADVANCE_LABEL_T = {
  k1: "new",
  k2: "lead",
  k3: "✓ אישור — ",
  k4: "eyes",
  k5: "answer",
  k6: "done",
  k7: "📞 דחיפה ללוח",
};
const ayinAdvanceLabel = (...a) => __pure_ayinAdvanceLabel(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_ayinAdvanceLabel_AYIN_ADVANCE_LABEL_T);
// מימוש-שקע לבדיקה — ברירות-המחדל של ayin.ts (STAGE_FALLBACK):
const FALLBACK = { new: 'חדש', lead: 'בהכנה', eyes: 'רישום', answer: 'מסירה', done: 'הושלם' };
const stageLabel = (cfg, st) => FALLBACK[st];
const cfg = {};
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
ok(ayinAdvanceLabel(cfg, { stage: 'new' }, stageLabel) === 'בהכנה ←', 'new');
ok(ayinAdvanceLabel(cfg, { stage: 'lead' }, stageLabel) === '✓ אישור — בהכנה', 'lead');
ok(ayinAdvanceLabel(cfg, { stage: 'eyes' }, stageLabel) === 'מסירה ←', 'eyes');
ok(ayinAdvanceLabel(cfg, { stage: 'answer', answerPushed: true }, stageLabel) === '✓ הושלם', 'answer+pushed');
ok(ayinAdvanceLabel(cfg, { stage: 'answer', answerPushed: false }, stageLabel) === '📞 דחיפה ללוח', 'answer-pushed');
ok(ayinAdvanceLabel(cfg, { stage: 'done' }, stageLabel) === '', 'done ⇒ ריק');
if (f) process.exit(1);
console.log('✓ ayin-advance-label: 6 דוגמאות-חוזה — ירוק');
