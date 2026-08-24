import { groupRemapOnRemoval } from './group-remap-on-removal.mjs';
// השקע החוזי (מראה של courses/lib.ts groupLabelOf — במחסן: group-label-of)
const groupLabelOf = (s, i) => s.label || 'קבוצה ' + (i + 1);
const C = [
  [[{}, {}, {}], 0, 'קבוצה 1', [['קבוצה 2', 'קבוצה 1'], ['קבוצה 3', 'קבוצה 2']],
   'הסרת הראשון ⇒ כל הבאים זזים'],
  [[{}, {}, {}], 2, 'קבוצה 3', [], 'הסרת האחרון ⇒ remap ריק'],
  [[{}, { label: 'בוגרים' }, {}], 0, 'קבוצה 1', [['קבוצה 3', 'קבוצה 2']],
   'label מפורש לא זז ולא נכנס ל-remap'],
  [[{}], 0, 'קבוצה 1', [], 'מפגש-יחיד'],
  [[{ label: 'בוגרים' }, {}], 0, 'בוגרים', [['קבוצה 2', 'קבוצה 1']],
   'הסרת מפגש-מתויג ⇒ removed=התווית המפורשת'],
];
let f = 0;
for (const [sessions, idx, wantRemoved, wantPairs, msg] of C) {
  const got = groupRemapOnRemoval(sessions, idx, groupLabelOf);
  const gotPairs = [...got.remap.entries()];
  if (got.removed !== wantRemoved || JSON.stringify(gotPairs) !== JSON.stringify(wantPairs)) {
    console.error(`✗ ${msg} ⇒ removed=${got.removed}, remap=${JSON.stringify(gotPairs)} ≠ ${wantRemoved}, ${JSON.stringify(wantPairs)}`);
    f = 1;
  }
}
if (f) process.exit(1);
console.log('✓ group-remap-on-removal: 5 דוגמאות-חוזה — ירוק (מזהי-קבוצה יציבים, #8/#9)');
