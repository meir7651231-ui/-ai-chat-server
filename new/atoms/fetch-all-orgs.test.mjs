import { fetchAllOrgs as __pure_fetchAllOrgs } from './fetch-all-orgs.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הקשיחים; בדיקה לא מייבאת אטום-שכן)
const __d_fetch_all_orgs_T = {
  k1: "platformOrgs",
};
const fetchAllOrgs = (...a) => __pure_fetchAllOrgs(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_fetch_all_orgs_T);
let f = 0;
const eq = (a, b, msg) => { if (JSON.stringify(a) !== JSON.stringify(b)) { console.error(`✗ ${msg} ⇒ ${JSON.stringify(a)}`); f = 1; } };

const fakeFs = (docs) => {
  const calls = { collection: [], getDocs: [] };
  const db = { tag: 'db' };
  const colRef = { tag: 'colRef' };
  return {
    calls, colRef, db,
    fs: {
      db,
      collection: (d, path) => { calls.collection.push([d, path]); return colRef; },
      getDocs: async (ref) => { calls.getDocs.push(ref); return { docs }; },
    },
  };
};

// 1) מיפוי slug+שדות, סדר-הענן נשמר
const t1 = fakeFs([
  { id: 'org1', data: () => ({ name: 'א', deleted: false }) },
  { id: 'org2', data: () => ({ name: 'ב' }) },
]);
eq(await fetchAllOrgs(t1.fs),
  [{ slug: 'org1', name: 'א', deleted: false }, { slug: 'org2', name: 'ב' }], 'מיפוי-ארגונים שגוי');

// 2) צורת-הקריאה: collection(db,'platformOrgs') פעם אחת + getDocs על ההפניה
if (t1.calls.collection.length !== 1 || t1.calls.collection[0][0] !== t1.db || t1.calls.collection[0][1] !== 'platformOrgs') {
  console.error('✗ collection לא נקרא עם (db, "platformOrgs") פעם אחת'); f = 1;
}
if (t1.calls.getDocs.length !== 1 || t1.calls.getDocs[0] !== t1.colRef) {
  console.error('✗ getDocs לא נקרא על הפניית-האוסף שהוחזרה'); f = 1;
}

// 3) אוסף ריק ⇒ []
eq(await fetchAllOrgs(fakeFs([]).fs), [], 'אוסף ריק לא החזיר []');

// 4) שדה slug בנתונים דורס את מזהה-המסמך (סדר-הפריסה כלשון-המקור)
eq(await fetchAllOrgs(fakeFs([{ id: 'org9', data: () => ({ slug: 'אחר' }) }]).fs),
  [{ slug: 'אחר' }], 'סדר-הפריסה השתנה');

if (f) process.exit(1);
console.log('✓ fetch-all-orgs: 4 דוגמאות-חוזה — ירוק');
