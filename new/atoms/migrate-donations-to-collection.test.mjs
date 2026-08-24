import { migrateDonationsToCollection } from './migrate-donations-to-collection.mjs';
let f = 0;
const chk = (name, cond) => { if (!cond) { console.error('✗ ' + name); f = 1; } };

// שקע-diff בסמנטיקת-maor (מקומי לבדיקה): פירוק כל תרומה למסמך; prev ריק ⇒ הכול sets
const diffCalls = [];
const donationPartitionDiff = (prev, next) => {
  diffCalls.push({ prev, next });
  const explode = (list) => list.flatMap((sp) => (sp.donations ?? []).map((d) => ({ id: sp.id + '_' + d.rid, supporterId: sp.id, donation: d })));
  const prevIds = new Set(explode(prev).map((x) => x.id));
  return { sets: explode(next).filter((x) => !prevIds.has(x.id)), deletes: [...prevIds].filter((id) => !explode(next).some((x) => x.id === id)) };
};
const pushed = [];
const pushDonations = async (diff, dek) => { pushed.push({ diff, dek }); };

const sups = [
  { id: 's1', donations: [{ rid: 'R-1', amount: 100 }, { rid: 'R-2', amount: 50 }] },
  { id: 's2', donations: [{ rid: 'R-3', amount: 25 }] },
];

// דוגמאות 1–3 — ספירה, prev ריק, dek עובר כמו-שהוא
{
  diffCalls.length = 0; pushed.length = 0;
  const dek = { k: 'DEK' };
  const n = await migrateDonationsToCollection(sups, dek, donationPartitionDiff, pushDonations);
  chk('1 מוחזר-3', n === 3);
  chk('1 3-sets-0-deletes', pushed[0].diff.sets.length === 3 && pushed[0].diff.deletes.length === 0);
  chk('2 קריאה-אחת', diffCalls.length === 1);
  chk('2 prev-ריק', Array.isArray(diffCalls[0].prev) && diffCalls[0].prev.length === 0);
  chk('2 next=supporters', diffCalls[0].next === sups);
  chk('3 dek-כמו-שהוא', pushed[0].dek === dek);
  pushed.length = 0;
  await migrateDonationsToCollection(sups, null, donationPartitionDiff, pushDonations);
  chk('3 dek=null', pushed[0].dek === null);
}
// דוגמה 4 — אפס-תרומות ⇒ 0, והכתיבה עדיין נקראת עם sets ריק
{
  pushed.length = 0;
  const n = await migrateDonationsToCollection([], null, donationPartitionDiff, pushDonations);
  chk('4 מוחזר-0', n === 0);
  chk('4 כתיבה-נקראת', pushed.length === 1 && pushed[0].diff.sets.length === 0);
}
// דוגמה 5 — הכתיבה נשלמת (await) לפני ההחזרה
{
  let done = false;
  const slowPush = () => new Promise((res) => setTimeout(() => { done = true; res(); }, 10));
  const n = await migrateDonationsToCollection(sups, null, donationPartitionDiff, slowPush);
  chk('5 await-לפני-החזרה', done === true && n === 3);
}
if (f) process.exit(1);
console.log('✓ migrate-donations-to-collection: 5 דוגמאות-חוזה — ירוק');
