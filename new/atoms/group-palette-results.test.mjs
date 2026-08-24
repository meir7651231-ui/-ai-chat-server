import { groupPaletteResults } from './group-palette-results.mjs';
// השקעים החוזיים (מראה של paletteGroups.ts:23-45, בלי termOf — config לא מוגדר)
const BUCKETS = [['nav-', 'ניווט ופעולות'], ['act-', 'ניווט ופעולות'], ['fam-', 'משפחות']];
const buckets = () => BUCKETS;
const bucketOf = (key) => {
  const i = BUCKETS.findIndex(([p]) => key.startsWith(p));
  return i < 0 ? BUCKETS.length : i;
};
const C = [
  [[{ key: 'fam-1' }, { key: 'nav-a' }],
   [{ key: 'nav-a', section: 'ניווט ופעולות' }, { key: 'fam-1', section: 'משפחות' }],
   'מיון-לדליים + כותרת על ראשון-בדלי'],
  [[{ key: 'nav-a' }, { key: 'act-b' }],
   [{ key: 'nav-a', section: 'ניווט ופעולות' }, { key: 'act-b', section: undefined }],
   "כותרת משותפת nav-/act- לא מוכפלת"],
  [[{ key: 'fam-b' }, { key: 'fam-a' }],
   [{ key: 'fam-b', section: 'משפחות' }, { key: 'fam-a', section: undefined }],
   'יציבות: סדר-הרלוונטיות נשמר בתוך הדלי'],
  [[{ key: 'zzz' }, { key: 'nav-a' }],
   [{ key: 'nav-a', section: 'ניווט ופעולות' }, { key: 'zzz', section: undefined }],
   'לא-מזוהה ⇒ אחרון, בלי כותרת'],
  [[], [], 'ריק ⇒ []'],
];
let f = 0;
for (const [items, want, msg] of C) {
  const got = groupPaletteResults(items, undefined, buckets, bucketOf);
  const same =
    got.length === want.length &&
    got.every((g, i) => g.key === want[i].key && g.section === want[i].section && 'section' in g === true);
  if (!same) {
    console.error(`✗ ${msg} ⇒ ${JSON.stringify(got)} ≠ ${JSON.stringify(want)}`);
    f = 1;
  }
}
if (f) process.exit(1);
console.log('✓ group-palette-results: 5 דוגמאות-חוזה — ירוק');
