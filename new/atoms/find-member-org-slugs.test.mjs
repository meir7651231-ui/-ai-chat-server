import { findMemberOrgSlugs as __pure_findMemberOrgSlugs } from './find-member-org-slugs.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הקשיחים; בדיקה לא מייבאת אטום-שכן)
const __d_find_member_org_slugs_T = {
  k1: "platformOrgs",
  k2: "members",
  k3: "array-contains",
};
const findMemberOrgSlugs = (...a) => __pure_findMemberOrgSlugs(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_find_member_org_slugs_T);
let f = 0;
const eq = (a, b, msg) => { if (JSON.stringify(a) !== JSON.stringify(b)) { console.error(`✗ ${msg} ⇒ ${JSON.stringify(a)}`); f = 1; } };

const fakeFs = (docs, { throwOnGet = false } = {}) => {
  const calls = { collection: [], where: [], query: [], getDocs: [] };
  const db = { tag: 'db' };
  const colRef = { tag: 'colRef' };
  const whereRef = { tag: 'whereRef' };
  const qRef = { tag: 'qRef' };
  return {
    calls, db, colRef, whereRef, qRef,
    fs: {
      db,
      collection: (d, path) => { calls.collection.push([d, path]); return colRef; },
      where: (field, op, value) => { calls.where.push([field, op, value]); return whereRef; },
      query: (c, w) => { calls.query.push([c, w]); return qRef; },
      getDocs: async (q) => {
        calls.getDocs.push(q);
        if (throwOnGet) throw new Error('permission-denied');
        return { docs };
      },
    },
  };
};

// 1) נרמול המייל + מיפוי מזהי-המסמכים
const t1 = fakeFs([{ id: 'org1' }, { id: 'org2' }]);
eq(await findMemberOrgSlugs(' Meir@X.com ', t1.fs), ['org1', 'org2'], 'מיפוי-סלאגים שגוי');
eq(t1.calls.where, [['members', 'array-contains', 'meir@x.com']], 'where לא מנורמל trim+lowercase');

// 2) צורת-הקריאה
if (t1.calls.collection.length !== 1 || t1.calls.collection[0][0] !== t1.db || t1.calls.collection[0][1] !== 'platformOrgs') {
  console.error('✗ collection לא נקרא עם (db, "platformOrgs") פעם אחת'); f = 1;
}
if (t1.calls.query.length !== 1 || t1.calls.query[0][0] !== t1.colRef || t1.calls.query[0][1] !== t1.whereRef) {
  console.error('✗ query לא הורכב מ-(colRef, whereRef)'); f = 1;
}
if (t1.calls.getDocs.length !== 1 || t1.calls.getDocs[0] !== t1.qRef) {
  console.error('✗ getDocs לא נקרא על השאילתה שהורכבה'); f = 1;
}

// 3) מייל ריק/רווחים ⇒ [] בלי אף קריאת-ענן
const t3 = fakeFs([{ id: 'org1' }]);
eq(await findMemberOrgSlugs('', t3.fs), [], "מייל ריק לא החזיר []");
eq(await findMemberOrgSlugs('   ', t3.fs), [], "מייל-רווחים לא החזיר []");
if (t3.calls.getDocs.length !== 0) { console.error('✗ מייל ריק בכל-זאת פנה לענן'); f = 1; }

// 4) getDocs זורק ⇒ [] (נפילה בטוחה)
eq(await findMemberOrgSlugs('a@b.com', fakeFs([], { throwOnGet: true }).fs), [], 'כשל-ענן לא נבלע ל-[]');

// 5) אין תואמים ⇒ []
eq(await findMemberOrgSlugs('a@b.com', fakeFs([]).fs), [], 'docs ריק לא החזיר []');

if (f) process.exit(1);
console.log('✓ find-member-org-slugs: 5 דוגמאות-חוזה — ירוק');
