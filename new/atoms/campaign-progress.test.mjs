import { campaignProgress as __pure_campaignProgress } from './campaign-progress.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הקשיחים; בדיקה לא מייבאת אטום-שכן)
const __d_campaign_progress_T = {
  k1: 100,
};
const campaignProgress = (...a) => __pure_campaignProgress(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_campaign_progress_T);

// שקע-campaignTotal בסמנטיקת-המקור (tzedaka/lib.ts:68-73)
const campaignTotal = (boxes, campaignId) => {
  let sum = 0;
  for (const b of boxes)
    for (const c of b.collections) if (c.campaignId === campaignId) sum += Number.isFinite(c.amount) ? c.amount : 0;
  return sum;
};

const boxes = [
  { collections: [{ campaignId: 'k1', amount: 100 }, { campaignId: 'k2', amount: 999 }] },
  { collections: [{ campaignId: 'k1', amount: 150 }] },
];

let f = 0;
const eq = (n, got, want) => {
  const g = JSON.stringify(got), w = JSON.stringify(want);
  if (g !== w) { console.error(`✗ דוגמה ${n}: ${g} ≠ ${w}`); f = 1; }
};

// 1 · 250 מתוך 1000 — ריקון של מבצע-אחר לא נספר
eq('1', campaignProgress({ id: 'k1', goal: 1000 }, boxes, campaignTotal), { sum: 250, goal: 1000, pct: 25 });
// 2 · חריגה מהיעד — קטום ל-100
eq('2', campaignProgress({ id: 'k1', goal: 1000 }, [{ collections: [{ campaignId: 'k1', amount: 1500 }] }], campaignTotal).pct, 100);
// 3 · יעד חסר ⇒ goal 0, pct 0
eq('3', campaignProgress({ id: 'k1' }, boxes, campaignTotal), { sum: 250, goal: 0, pct: 0 });
// 4 · עיגול round (לא floor)
eq('4a', campaignProgress({ id: 'x', goal: 1000 }, [{ collections: [{ campaignId: 'x', amount: 333 }] }], campaignTotal).pct, 33);
eq('4b', campaignProgress({ id: 'x', goal: 1000 }, [{ collections: [{ campaignId: 'x', amount: 335 }] }], campaignTotal).pct, 34);
// 5 · בלי קופות
eq('5', campaignProgress({ id: 'k1', goal: 500 }, [], campaignTotal), { sum: 0, goal: 500, pct: 0 });

if (f) process.exit(1);
console.log('✓ campaign-progress: 6 בדיקות מ-5 דוגמאות-חוזה — ירוק');
