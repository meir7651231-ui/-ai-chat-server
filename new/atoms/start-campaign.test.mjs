import { startCampaign } from './start-campaign.mjs';

const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
let f = 0;
const chk = (n, got, want) => {
  if (!eq(got, want)) { console.error(`✗ ${n}: ${JSON.stringify(got)} ≠ ${JSON.stringify(want)}`); f = 1; }
};

// 1. דדופ + סינון-ריק, סדר נשמר
chk('דוגמה-1', startCampaign('חורף', ['a', 'b', 'a', '', 'c'], '2026-08-24'),
  { name: 'חורף', startedAt: '2026-08-24', queue: ['a', 'b', 'c'], total: 3, log: [] });
// 2. רשימה ריקה
chk('דוגמה-2', startCampaign('ריק', [], '2026-01-01'),
  { name: 'ריק', startedAt: '2026-01-01', queue: [], total: 0, log: [] });
// 3. סדר-ההזנה הוא סדר-החיוג
chk('דוגמה-3', startCampaign('סדר', ['c', 'a', 'b'], '2026-08-24').queue, ['c', 'a', 'b']);
// 4. כל falsy מסונן
chk('דוגמה-4', startCampaign('falsy', [null, undefined, 'x'], '2026-08-24').queue, ['x']);
// 5. הכל-כפול ⇒ אחד
const c5 = startCampaign('הכל-כפול', ['z', 'z', 'z'], '2026-08-24');
chk('דוגמה-5', [c5.queue, c5.total], [['z'], 1]);

if (f) process.exit(1);
console.log('✓ start-campaign: 5 דוגמאות-חוזה — ירוק');
