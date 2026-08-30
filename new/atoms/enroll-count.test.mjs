import { enrollCount as __pure_enrollCount } from './enroll-count.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_enrollCount_ENROLL_COUNT_T = {
  k1: "ended",
  k2: "wait",
};
const enrollCount = (...a) => __pure_enrollCount(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_enrollCount_ENROLL_COUNT_T);
const mixed = [
  { courseId: 'c1', status: 'active' },
  { courseId: 'c1', status: 'paused' },
  { courseId: 'c1', status: 'ended' },
  { courseId: 'c1', status: 'wait' },
  { courseId: 'c2', status: 'active' },
];
const C = [
  [{ enrollments: mixed }, 'c1', 2, 'פעיל+מוקפא נספרים; ended/wait לא'],
  [{ enrollments: mixed }, 'c2', 1, 'סינון פר-חוג'],
  [{ enrollments: [] }, 'c1', 0, 'מערך ריק'],
  [{ enrollments: [{ courseId: 'c1' }] }, 'c1', 1, 'חסר-סטטוס נספר'],
  [{ enrollments: [{ courseId: 'c1', status: 'wait' }, { courseId: 'c1', status: 'ended' }] }, 'c1', 0, 'רק wait+ended ⇒ 0'],
];
let f = 0;
for (const [db, cid, want, name] of C) {
  const got = enrollCount(db, cid);
  if (got !== want) { console.error(`✗ ${name} ⇒ ${got} ≠ ${want}`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ enroll-count: 5 דוגמאות-חוזה — ירוק');
