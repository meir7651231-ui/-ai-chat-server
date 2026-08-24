import { reassembleDonations } from './reassemble-donations.mjs';
let f = 0;
const chk = (name, cond) => { if (!cond) { console.error('✗ ' + name); f = 1; } };

// 1) סינון-זר + מיון-תאריך + החלפת donations + שימור-בסיס
const base = {
  id: 's1', name: 'לוי', hist: [{ note: 'ישן' }],
  donations: [{ rid: 'D-1', date: '2020-01-01', ils: 5 }],
};
const d7 = { rid: 'D-7', date: '2026-03-01', ils: 200 };
const d3 = { rid: 'D-3', date: '2026-01-15', ils: 100 };
const docs = [
  { id: 'D-7', supporterId: 's1', pkey: '_shared_', donation: d7 },
  { id: 'D-3', supporterId: 's1', pkey: '_shared_', donation: d3 },
  { id: 'D-9', supporterId: 's2', pkey: '_shared_', donation: { rid: 'D-9', date: '2026-02-01', ils: 50 } },
];
const out = reassembleDonations(base, docs);
chk('1 מיון-תאריך [D-3,D-7], הזר סונן, D-1 הוחלף',
  JSON.stringify(out.donations.map((d) => d.rid)) === JSON.stringify(['D-3', 'D-7']));
chk('1 ‏name ו-hist נשמרו', out.name === 'לוי' && out.hist === base.hist);

// 2) שובר-שוויון rid — השוואת-מחרוזות
const out2 = reassembleDonations({ id: 's1' }, [
  { id: 'a', supporterId: 's1', donation: { rid: 'D-9', date: '2026-05-01' } },
  { id: 'b', supporterId: 's1', donation: { rid: 'D-12', date: '2026-05-01' } },
]);
chk("2 אותו תאריך ⇒ ['D-12','D-9'] (מחרוזתי)",
  JSON.stringify(out2.donations.map((d) => d.rid)) === JSON.stringify(['D-12', 'D-9']));

// 3) docs ריק ⇒ donations=[]
const out3 = reassembleDonations(base, []);
chk('3 ‏docs=[] ⇒ donations=[]', Array.isArray(out3.donations) && out3.donations.length === 0);

// 4) אי-מוטציה
chk('4 תוצאה חדשה + base לא נגוע',
  out !== base && base.donations.length === 1 && base.donations[0].rid === 'D-1');

// 5) זהות-הפניה של התרומה
chk('5 התרומה עוברת בזהות-הפניה', out.donations[0] === d3 && out.donations[1] === d7);

if (f) process.exit(1);
console.log('✓ reassemble-donations: 5 דוגמאות-חוזה (סינון+מיון-דטרמיניסטי+אי-מוטציה) — ירוק');
