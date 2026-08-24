import { visibleEventsForDesignations } from './visible-events-for-designations.mjs';

// שקע-בדיקה: מימוש-מקומי של ראוּת-תורם, זהה להתנהגות supporterVisibleForDesignations.
const isSupVisible = (sp, a) => {
  if (!a || !a.length) return true;
  const fw = (sp.forWho ?? '').trim();
  if (!fw) return false;
  return a.map((s) => s.trim()).includes(fw);
};

const S = [{ id: 's1', forWho: 'יתומים' }, { id: 's2', forWho: '' }, { id: 's3', forWho: 'חולים' }];
const E = [{ id: 'e1' }, { id: 'e2', spId: 's1' }, { id: 'e3', spId: 's2' }, { id: 'e4', spId: 's3' }, { id: 'e5', spId: 'sX' }];
const ids = (arr) => arr.map((e) => e.id).join(',');

const CASES = [
  [visibleEventsForDesignations(E, S, null, isSupVisible), 'e1,e2,e3,e4,e5', 'דוגמה 1 · allowed=null'],
  [visibleEventsForDesignations(E, S, [], isSupVisible), 'e1,e2,e3,e4,e5', 'דוגמה 2 · allowed=[]'],
  [visibleEventsForDesignations(E, S, ['יתומים'], isSupVisible), 'e1,e2', 'דוגמה 3 · יתומים'],
  [visibleEventsForDesignations(E, S, ['יתומים', 'חולים'], isSupVisible), 'e1,e2,e4', 'דוגמה 4 · שני-ייעודים'],
  [visibleEventsForDesignations([{ id: 'e2', spId: 's1' }], S, ['חולים'], isSupVisible), '', 'דוגמה 5 · תורם-לא-בייעוד'],
  [visibleEventsForDesignations([{ id: 'e1' }], S, ['יתומים'], isSupVisible), 'e1', 'דוגמה 6 · לא-מקושר-נשמר'],
  [visibleEventsForDesignations([{ id: 'e5', spId: 'sX' }], S, ['יתומים'], isSupVisible), '', 'דוגמה 7 · spId-ללא-תורם'],
];

let f = 0;
for (const [got, want, label] of CASES) {
  const g = ids(got);
  if (g !== want) { console.error('✗ ' + label + ' ⇒ [' + g + '] ≠ [' + want + ']'); f = 1; }
}
if (f) process.exit(1);
console.log('✓ visible-events-for-designations: ' + CASES.length + ' דוגמאות-חוזה — ירוק');
