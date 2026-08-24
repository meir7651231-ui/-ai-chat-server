import { donationPartitionDiff } from './donation-partition-diff.mjs';
// שקע: explodeSupporter האמיתי (id=rid · pkey=purpose מחוטא או המשותף · התרומה שלמה).
const explode = (sp) => (sp.donations ?? []).map((d) => ({
  id: d.rid, supporterId: sp.id, pkey: (d.purpose ?? '').trim() || '_shared_', donation: d,
}));
const d1 = { rid: 'D-1', date: '2026-08-01', amount: 100, purpose: '' };
const d2 = { rid: 'D-2', date: '2026-08-02', amount: 50, purpose: 'כולל' };
const s1 = { id: 's1', name: 'כהן', donations: [d1, d2] };
let f = 0;
const chk = (name, cond) => { if (!cond) { console.error('✗ ' + name); f = 1; } };
// 1 — הכול חדש
let r = donationPartitionDiff([], [s1], explode);
chk('חדש: 2 sets', r.sets.length === 2 && r.sets[0].id === 'D-1' && r.sets[1].id === 'D-2');
chk('חדש: אפס deletes', r.deletes.length === 0);
chk('חדש: pkey משותף/ייעוד', r.sets[0].pkey === '_shared_' && r.sets[1].pkey === 'כולל');
// 2 — ללא שינוי
r = donationPartitionDiff([s1], [{ ...s1, donations: [{ ...d1 }, { ...d2 }] }], explode);
chk('ללא-שינוי: ריק', r.sets.length === 0 && r.deletes.length === 0);
// 3 — שינוי סכום D-2
r = donationPartitionDiff([s1], [{ ...s1, donations: [d1, { ...d2, amount: 75 }] }], explode);
chk('שינוי-סכום: רק D-2', r.sets.length === 1 && r.sets[0].id === 'D-2' && r.sets[0].donation.amount === 75 && r.deletes.length === 0);
// 4 — הסרת D-2
r = donationPartitionDiff([s1], [{ ...s1, donations: [d1] }], explode);
chk('הסרה: deletes=[D-2]', r.sets.length === 0 && JSON.stringify(r.deletes) === '["D-2"]');
// 5 — מעבר-תומך: D-2 עבר ל-s2
r = donationPartitionDiff([s1], [{ ...s1, donations: [d1] }, { id: 's2', name: 'לוי', donations: [d2] }], explode);
chk('מעבר-תומך: set לא-מחיקה', r.sets.length === 1 && r.sets[0].id === 'D-2' && r.sets[0].supporterId === 's2' && r.deletes.length === 0);
// 6 — שינוי ייעוד D-1
r = donationPartitionDiff([s1], [{ ...s1, donations: [{ ...d1, purpose: 'ישיבה' }, d2] }], explode);
chk('שינוי-ייעוד: pkey חדש', r.sets.length === 1 && r.sets[0].id === 'D-1' && r.sets[0].pkey === 'ישיבה');
if (f) process.exit(1);
console.log('✓ donation-partition-diff: 6 דוגמאות-חוזה — ירוק');
