import { planDemoCleanup } from './plan-demo-cleanup.mjs';
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
