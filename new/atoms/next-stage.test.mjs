import { nextStage } from './next-stage.mjs';
// שקעים מקומיים לבדיקה — סדר-השלבים ו-stageIndex כבמקור (הבדיקה מייבאת רק את האטום שלה).
const AYIN_STAGES = ['new', 'lead', 'eyes', 'answer', 'done'];
const stageIndex = (s) => { const i = AYIN_STAGES.indexOf(s); return i < 0 ? 0 : i; };
const C = [
  ['new', 'lead'],
  ['lead', 'eyes'],
  ['eyes', 'answer'],
  ['answer', 'done'],
  ['done', null],
  ['שטויות', 'lead'],
];
let f = 0;
for (const [a, w] of C) {
  const g = nextStage(a, stageIndex, AYIN_STAGES);
  if (g !== w) { console.error(`✗ ${a} ⇒ ${g} ≠ ${w}`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ next-stage: 6 דוגמאות-חוזה — ירוק');
