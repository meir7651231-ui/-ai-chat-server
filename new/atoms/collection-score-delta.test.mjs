import { collectionScoreDelta as __pure_collectionScoreDelta } from './collection-score-delta.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הקשיחים; בדיקה לא מייבאת אטום-שכן)
const __d_collection_score_delta_T = {
  k1: 86400000,
};
const collectionScoreDelta = (...a) => __pure_collectionScoreDelta(...a, ...Array(Math.max(0, 5 - a.length)).fill(undefined), __d_collection_score_delta_T);
// שקע כמו-במקור: הריקון האחרון = מקסימום c.date, '' כשאין.
const lastIso = (box) => { let last = ''; for (const c of box.collections) if (c.date > last) last = c.date; return last; };
const boxOf = (...dates) => ({ collections: dates.map((d) => ({ date: d, amount: 1 })) });
let f = 0;
const chk = (n, got, want) => { if (got !== want) { console.error(`✗ דוגמה ${n}: ${got} ≠ ${want}`); f = 1; } };
chk(1, collectionScoreDelta(boxOf(), '2026-08-01', 120, lastIso), 12);
chk(2, collectionScoreDelta(boxOf(), '2026-08-01', 49, lastIso), 10);
chk(3, collectionScoreDelta(boxOf('2026-07-01'), '2026-08-01', 100, lastIso), 17);
chk(4, collectionScoreDelta(boxOf('2026-01-01'), '2026-08-01', 100, lastIso), 12);
chk(5, collectionScoreDelta(boxOf('2026-08-10'), '2026-08-01', 100, lastIso), 12);
chk(6, collectionScoreDelta(boxOf(), '2026-08-01', 55, lastIso, { emptyPts: 0, ilsPerPoint: 10, streakDays: 30, streakPts: 3 }), 5);
if (f) process.exit(1);
console.log('✓ collection-score-delta: 6 דוגמאות-חוזה — ירוק');
