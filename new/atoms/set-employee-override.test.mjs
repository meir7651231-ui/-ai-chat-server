import { setEmployeeOverride } from './set-employee-override.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const nrm = (e) => e.trim().toLowerCase();

// 1) ארגון בלי מפה — המפתח מנורמל, {...undefined} תקף
{
  const out = setEmployeeOverride({}, '  A@B.com ', { modules: { shop: false } }, nrm);
  ok(Object.keys(out.memberConfigs).length === 1, 'חייב מפתח אחד בדיוק');
  ok(JSON.stringify(out.memberConfigs['a@b.com']) === JSON.stringify({ modules: { shop: false } }),
    'הכרטיס חייב להיכתב תחת המייל המנורמל a@b.com');
}
// 2) החלפה מלאה — לא מיזוג
{
  const org = { memberConfigs: { 'a@b.com': { features: { x: false } } } };
  const out = setEmployeeOverride(org, 'a@b.com', { modules: { shop: false } }, nrm);
  const card = out.memberConfigs['a@b.com'];
  ok(card.features === undefined, 'הכרטיס החדש חייב להחליף — features הישן אסור שישרוד (לא מיזוג)');
  ok(card.modules.shop === false, 'הכרטיס החדש חייב להיכתב');
}
// 3) שכנים נשמרים — בזהות-הפניה
{
  const neighbor = { weeklyGoal: 5 };
  const org = { memberConfigs: { 'b@c.com': neighbor } };
  const out = setEmployeeOverride(org, 'a@b.com', {}, nrm);
  ok(Object.keys(out.memberConfigs).length === 2, 'חייבים שני מפתחות — השכן + החדש');
  ok(out.memberConfigs['b@c.com'] === neighbor, 'כרטיס-השכן חייב לעבור בזהות-הפניה');
  ok(JSON.stringify(out.memberConfigs['a@b.com']) === '{}', 'כרטיס ריק {} תקף — "רואה כמו הארגון"');
}
// 4) הכרטיס עובר בזהות-הפניה
{
  const override = { features: { 'core.export': false } };
  const out = setEmployeeOverride({}, 'x@y.z', override, nrm);
  ok(out.memberConfigs['x@y.z'] === override, 'הכרטיס חייב לעבור בזהות-הפניה, לא עותק');
}
// 5) immutability — המפה המקורית לא משוכתבת
{
  const orig = { 'a@b.com': { features: { x: false } } };
  const org = { memberConfigs: orig };
  const out = setEmployeeOverride(org, 'a@b.com', { modules: { shop: false } }, nrm);
  ok(org.memberConfigs === orig && orig['a@b.com'].features.x === false,
    'org.memberConfigs המקורי אסור שישתנה');
  ok(out.memberConfigs !== orig, 'חייבת לחזור מפה חדשה בהפניה');
}
if (f) process.exit(1);
console.log('✓ set-employee-override: 5 דוגמאות-חוזה — ירוק (שקע normEmail; טהור)');
