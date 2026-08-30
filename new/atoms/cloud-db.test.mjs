import { cloudDb as __pure_cloudDb } from './cloud-db.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_cloudDb_CLOUD_DB_T = {
  k1: "הענן לא אותחל — פנו למנהל המערכת",
};
const cloudDb = (...a) => __pure_cloudDb(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_cloudDb_CLOUD_DB_T);
let f = 0;
const chk = (name, cond) => { if (!cond) { console.error('✗ ' + name); f = 1; } };

// 1) ידית קיימת ⇒ זהות-הפניה
const handle = { app: 'maor' };
chk('1 מחזיר את אותו אובייקט (===)', cloudDb(handle) === handle);

// 2) null ⇒ throw בעברית מדויקת
let msg = '';
try { cloudDb(null); } catch (e) { msg = e.message; }
chk('2 null ⇒ הודעה עברית מדויקת', msg === 'הענן לא אותחל — פנו למנהל המערכת');

// 3) undefined ⇒ אותו throw
msg = '';
try { cloudDb(undefined); } catch (e) { msg = e.message; }
chk('3 undefined ⇒ אותו throw', msg === 'הענן לא אותחל — פנו למנהל המערכת');

// 4) טהור — קריאה חוזרת זהה
chk('4 טהור: קריאה שנייה זהה', cloudDb(handle) === handle);

if (f) process.exit(1);
console.log('✓ cloud-db: 4 דוגמאות-חוזה (שער-ידית + throw עברי) — ירוק');
