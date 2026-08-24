import { groupOptionsOf } from './group-options-of.mjs';
const DAY_NAMES = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי'];
const sessionsOf = (c) => (c.sessions && c.sessions.length ? c.sessions : [{ day: c.weekday, time: c.time, label: '' }]);
const groupLabelOf = (s, i) => s.label || 'קבוצה ' + (i + 1);
const C = [
  [{ sessions: [{ day: 0, time: '16:00' }, { day: 2, time: '17:30' }] },
   [{ v: 'קבוצה 1', t: 'קבוצה 1 · יום ראשון 16:00' }, { v: 'קבוצה 2', t: 'קבוצה 2 · יום שלישי 17:30' }],
   'שני מפגשים בלי תוויות'],
  [{ sessions: [{ day: 1, time: '10:00', label: 'בוגרים' }, { day: 4, time: '' }] },
   [{ v: 'בוגרים', t: 'בוגרים · יום שני 10:00' }, { v: 'קבוצה 2', t: 'קבוצה 2 · יום חמישי' }],
   'תווית מפורשת + בלי שעה (נגזם)'],
  [{ sessions: [{ day: 3, time: '12:00' }] }, [], 'מפגש יחיד ⇒ []'],
  [{ weekday: 5, time: '09:00' }, [], 'לגאסי בלי sessions ⇒ מפגש-יחיד ⇒ []'],
];
let f = 0;
for (const [c, want, msg] of C) {
  const got = groupOptionsOf(c, sessionsOf, groupLabelOf, DAY_NAMES);
  if (JSON.stringify(got) !== JSON.stringify(want)) {
    console.error(`✗ ${msg} ⇒ ${JSON.stringify(got)} ≠ ${JSON.stringify(want)}`); f = 1;
  }
}
if (f) process.exit(1);
console.log('✓ group-options-of: 4 דוגמאות-חוזה — ירוק');
