import { planDemoCleanup as __pure_planDemoCleanup } from './plan-demo-cleanup.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_planDemoCleanup_PLAN_DEMO_CLEANUP_T = {
  k1: "name",
  k2: "father",
  k3: "mother",
  k4: "phone",
  k5: "phone2",
  k6: "city",
  k7: "address",
  k8: "email",
  k9: "idNum",
  k10: "cat",
  k11: "forWho",
  k12: "description",
  k13: "price",
  k14: "price1",
  k15: "price2",
  k16: "specialty",
  k17: "location",
  k18: "cap",
  k19: "title",
  k20: "type",
  k21: "customType",
  k22: "notes",
  k23: "time",
  k24: "area",
  k25: "note",
  k26: "goal",
  k27: "kind",
  k28: "value",
  k29: "basePrice",
  k30: "label",
  k31: "desc",
  k32: "sku",
  k33: "(ללא שם)",
  k34: "families",
  k35: "enrollments",
  k36: "courses",
  k37: "deliveries",
  k38: "distributionDays",
  k39: "volunteers",
  k40: "shopAssignments",
  k41: "shopProducts",
  k42: "tzBoxes",
  k43: "tzCoordinators",
};
const planDemoCleanup = (...a) => __pure_planDemoCleanup(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_planDemoCleanup_PLAN_DEMO_CLEANUP_T);
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const famDemo = { id: 'f1', name: 'כהן', father: 'אהרן', mother: 'בתיה', phone: '0501111111', phone2: '', city: 'צפת', address: 'רח 1', email: 'k@x.co', members: [{ id: 'm1' }] };
const famReal = { id: 'f2', name: 'לוי', father: 'דוד', mother: 'רות', phone: '0502222222', phone2: '', city: 'חיפה', address: 'רח 2', email: 'l@x.co', members: [{ id: 'm9' }] };
const crsDemo = { id: 'c1', name: 'ציור', description: 'חוג ציור', price: 100, price1: 0, price2: 0 };
const crsReal = { id: 'c2', name: 'נגרות', description: '', price: 200, price1: 0, price2: 0 };
const db = {
  families: [famDemo, famReal],
  courses: [crsDemo, crsReal],
  enrollments: [
    { id: 'e1', memberId: 'm1', courseId: 'c2' },
    { id: 'e2', memberId: 'm9', courseId: 'c1' },
    { id: 'e3', memberId: 'm9', courseId: 'c2' },
  ],
  rooms: [{ id: 'r1', name: 'חדר אמת', location: '', cap: 10 }],
};
// דמו: אותם שדות-זיהוי, id שונה ובלי members — טביעת-האצבע תופסת בכל-זאת:
const demoDb = {
  families: [{ ...famDemo, id: 'demo9', members: undefined }],
  courses: [{ ...crsDemo, id: 'demoC' }],
};
const r = planDemoCleanup(db, demoDb);
ok(JSON.stringify(r.removed.families) === JSON.stringify({ count: 1, names: ['כהן'] }), 'removed.families: ' + JSON.stringify(r.removed.families));
ok(r.removed.courses.count === 1 && r.removed.courses.names[0] === 'ציור', 'removed.courses: ' + JSON.stringify(r.removed.courses));
ok(r.removed.enrollments.count === 2, 'מפל-שיבוצים: count=2 (חבר-דמו m1 + חוג-דמו c1), בפועל ' + JSON.stringify(r.removed.enrollments));
ok(r.total === 4, 'total=4, בפועל ' + r.total);
ok(r.cleaned.families.length === 1 && r.cleaned.families[0].id === 'f2', 'cleaned.families=[f2]');
ok(r.cleaned.enrollments.length === 1 && r.cleaned.enrollments[0].id === 'e3', 'cleaned.enrollments=[e3]');
ok(r.cleaned.rooms === db.rooms, 'ישות בלי דמו ⇒ אותה הפניה');
ok(db.families.length === 2 && db.enrollments.length === 3, 'db המקורי לא שונה (אימוטביליות)');
// demoDb ריק ⇒ אפס הסרות:
const r2 = planDemoCleanup(db, {});
ok(r2.total === 0 && Object.keys(r2.removed).length === 0, 'demoDb ריק ⇒ total=0, removed={}');
if (f) process.exit(1);
console.log('✓ plan-demo-cleanup: 10 דוגמאות-חוזה — ירוק');
