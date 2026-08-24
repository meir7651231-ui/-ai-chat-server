import { docSkey } from './doc-skey.mjs';
// שקעים: supKeyOf האמיתי (forWho מחוטא) + המפתח-המשותף.
const SHARED = '_shared_';
const supKeyOf = (sp) => ((sp.forWho ?? '').trim() || SHARED);
const map = new Map([['s1', 'כולל ערב']]);
const C = [
  ['supporters', { forWho: 'ישיבת אור' }, 'ישיבת אור'],
  ['supporters', { forWho: '  ' }, SHARED],
  ['events', { spId: 's1' }, 'כולל ערב'],
  ['events', { spId: 's9' }, SHARED],
  ['events', {}, SHARED],
  ['events', { spId: 42 }, SHARED],
  ['families', { forWho: 'ישיבת אור' }, ''],
];
let f = 0;
for (const [col, data, want] of C) {
  const got = docSkey(col, data, map, supKeyOf, SHARED);
  if (got !== want) { console.error(`✗ (${col}, ${JSON.stringify(data)}) ⇒ ${JSON.stringify(got)} ≠ ${JSON.stringify(want)}`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ doc-skey: 7 דוגמאות-חוזה — ירוק');
