import { setExportBlocked } from './set-export-blocked.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };

// 1) חסימה עם התרעה — עוברת בזהות-הפניה ואינה נקראת
{
  let calls = 0;
  const spy = () => { calls++; };
  const out = setExportBlocked(true, spy);
  ok(out.blocked === true, 'blocked=true חייב להישמר');
  ok(out.notify === spy, 'ההתרעה חייבת לעבור בזהות-הפניה — אותה פונקציה בדיוק');
  ok(calls === 0, 'האטום אסור שיקרא להתרעה — הקריאה שייכת ל-guardExport');
}
// 2) לא-חסום בלי התרעה ⇒ notify=null
{
  const out = setExportBlocked(false, undefined);
  ok(out.blocked === false && out.notify === null, 'התרעה חסרה חייבת להתנרמל ל-null');
}
// 3) חסימה בלי toast תקפה
{
  const out = setExportBlocked(true, undefined);
  ok(out.blocked === true && out.notify === null, 'חסימה בלי התרעה: {blocked:true, notify:null}');
}
// 4) null נשאר null (?? null)
{
  const out = setExportBlocked(false, null);
  ok(out.notify === null, 'onBlocked=null חייב להישאר null');
}
// 5) שתי קריאות זהות ⇒ הפניות שונות, תוכן שווה, בדיוק שני מפתחות
{
  const a = setExportBlocked(true, undefined);
  const b = setExportBlocked(true, undefined);
  ok(a !== b, 'אותו אובייקט הוחזר פעמיים — מצב דולף בין קריאות');
  ok(a.blocked === b.blocked && a.notify === b.notify, 'תוכן שתי הקריאות חייב להיות זהה');
  ok(Object.keys(a).length === 2, 'הפלט חייב להכיל בדיוק blocked+notify');
}
if (f) process.exit(1);
console.log('✓ set-export-blocked: 5 דוגמאות-חוזה — ירוק (טהור; ההשמה = חיווט-קופסה)');
