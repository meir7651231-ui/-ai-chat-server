import { campaignProgress as __pure_campaignProgress } from './site-campaign-progress.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_campaignProgress_SITE_CAMPAIGN_PROGRESS_T = {
  k1: "number",
  k2: 100,
  k3: 10,
  k4: 86400000,
};
const campaignProgress = (...a) => __pure_campaignProgress(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_campaignProgress_SITE_CAMPAIGN_PROGRESS_T);
let f = 0;
const eq = (a, b, msg) => { const g = JSON.stringify(a), w = JSON.stringify(b); if (g !== w) { console.error(`✗ ${msg} ⇒ ${g} ≠ ${w}`); f = 1; } };

// חצות-מקומי (בלי Z) — פרסור TZ-סימטרי, ההפרש חסין-אזור
const now = Date.parse('2026-09-01T00:00:00');

// 1) אחוז בסיסי + פלט מלא
eq(campaignProgress({ goal: 1000, raised: 250 }, now),
  { goal: 1000, raised: 250, pct: 25, currency: '₪', daysLeft: null, show: true }, 'בסיסי');

// 2) חריגה מהיעד — חסום ל-100
eq(campaignProgress({ goal: 1000, raised: 1500 }, now).pct, 100, 'חסימת-100');

// 3) ספירה-לאחור קלנדרית 1.9→11.9 = 10
eq(campaignProgress({ goal: 1000, raised: 250, end: '2026-09-11' }, now).daysLeft, 10, 'ימים-נותרו');

// 4) תאריך-יעד שעבר ⇒ 0
eq(campaignProgress({ goal: 1000, end: '2026-08-01' }, now).daysLeft, 0, 'עבר⇒0');

// 5) בלי goal ⇒ 0 + show=false
eq(campaignProgress({ raised: 250 }, now), { goal: 0, raised: 250, pct: 0, currency: '₪', daysLeft: null, show: false }, 'בלי-יעד');

// 6) מטבע מותאם
eq(campaignProgress({ goal: 1000, raised: 250, currency: '$' }, now).currency, '$', 'מטבע');

// 7) undefined לגמרי
eq(campaignProgress(undefined, now), { goal: 0, raised: 0, pct: 0, currency: '₪', daysLeft: null, show: false }, 'undefined');

// 8) תאריך-שבור ⇒ daysLeft null
eq(campaignProgress({ goal: 1000, raised: 250, end: 'זבל' }, now).daysLeft, null, 'תאריך-שבור');

// 9) עיגול round לא floor
eq(campaignProgress({ goal: 1000, raised: 335 }, now).pct, 34, 'round-335');
eq(campaignProgress({ goal: 1000, raised: 333 }, now).pct, 33, 'round-333');

// קצה: goal/raised לא-חיוביים נפסלים ל-0
eq(campaignProgress({ goal: -5, raised: -9 }, now), { goal: 0, raised: 0, pct: 0, currency: '₪', daysLeft: null, show: false }, 'שליליים');

if (f) process.exit(1);
console.log('✓ site-campaign-progress: 12 בדיקות מ-9 דוגמאות-חוזה — ירוק');
