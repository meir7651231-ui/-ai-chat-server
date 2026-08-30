import { mergeFamilies as __pure_mergeFamilies } from './merge-families.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_mergeFamilies_MERGE_FAMILIES_T = {
  k1: "active",
  k2: "pending",
  k3: "inactive",
  k4: "| מוזג: ",
};
const mergeFamilies = (...a) => __pure_mergeFamilies(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_mergeFamilies_MERGE_FAMILIES_T);
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const eq = (a, b, msg) => ok(JSON.stringify(a) === JSON.stringify(b), msg + ` ⇒ ${JSON.stringify(a)}`);

// שקעים מזויפים לפי החוזה
const deps = {
  normPhone: (s) => (s || '').replace(/\D/g, ''),
  dedupById: (items) => {
    const seen = new Set(); const out = [];
    for (const it of items) { if (!seen.has(it.id)) { seen.add(it.id); out.push(it); } }
    return out;
  },
};

// 1) השלמת-ריקים + phone2 + איחוד-חברים + הערות + createdAt מוקדם
const keeper = {
  id: 'f1', name: 'כהן', father: '', phone: '050-1111111', status: 'inactive',
  members: [{ id: 'm1' }], docs: [], createdAt: '2026-02-01', notes: '',
};
const loser = {
  id: 'f2', name: 'כהן', father: 'יוסף', phone: '0502222222', status: 'active',
  members: [{ id: 'm1' }, { id: 'm2' }], docs: [], createdAt: '2026-01-15', notes: 'ותיקה',
};
{
  const out = mergeFamilies(keeper, [loser], deps);
  ok(out.father === 'יוסף', `father לא הושלם ⇒ ${out.father}`);
  ok(out.phone === '050-1111111', `phone השומר לא נשמר ⇒ ${out.phone}`);
  ok(out.phone2 === '0502222222', `phone2 לא מולא מטלפון-שונה ⇒ ${out.phone2}`);
  ok(out.status === 'active', `status לא עלה ל-active ⇒ ${out.status}`);
  eq(out.members, [{ id: 'm1' }, { id: 'm2' }], 'איחוד-חברים בדה-דופ שגוי');
  ok(out.createdAt === '2026-01-15', `createdAt לא המוקדם ⇒ ${out.createdAt}`);
  ok(out.notes === 'ותיקה | מוזג: כהן', `notes שגוי ⇒ ${out.notes}`);
  ok(out.id === 'f1', `id השומר לא נשמר ⇒ ${out.id}`);
}

// 2) דירוג-סטטוס: pending + [inactive, active] ⇒ active
{
  const out = mergeFamilies({ id: 'a', status: 'pending' },
    [{ id: 'b', status: 'inactive' }, { id: 'c', status: 'active' }], deps);
  ok(out.status === 'active', `דירוג-סטטוס שגוי ⇒ ${out.status}`);
}

// 3) מונים = מקסימום; fullSefach = OR
{
  const out = mergeFamilies({ id: 'a', kidsHome: 2, fullSefach: false },
    [{ id: 'b', kidsHome: 5, fullSefach: true }], deps);
  ok(out.kidsHome === 5, `kidsHome לא מקסימום ⇒ ${out.kidsHome}`);
  ok(out.fullSefach === true, 'fullSefach לא OR');
}

// 4) טלפון זהה-מנורמל אינו הופך phone2
{
  const out = mergeFamilies({ id: 'a', phone: '0501111111' },
    [{ id: 'b', phone: '050-111-1111' }], deps);
  ok(out.phone2 === '', `phone2 מולא מטלפון זהה-מנורמל ⇒ ${out.phone2}`);
}

// 5) הערות זהות לא מוכפלות
{
  const out = mergeFamilies({ id: 'a', notes: 'חשוב' },
    [{ id: 'b', name: 'לוי', notes: 'חשוב' }], deps);
  ok(out.notes === 'חשוב | מוזג: לוי', `הערות הוכפלו ⇒ ${out.notes}`);
}

// 6) immutability — הקלט לא שוכתב
ok(keeper.father === '' && keeper.members.length === 1, 'keeper הנכנס שוכתב');

if (f) process.exit(1);
console.log('✓ merge-families: 6 דוגמאות-חוזה — ירוק');
