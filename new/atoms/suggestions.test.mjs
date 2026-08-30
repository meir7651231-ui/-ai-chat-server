import { suggestions as __pure_suggestions } from './suggestions.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_suggestions_SUGGESTIONS_T = {
  k1: "active",
  k2: "shop",
  k3: "families",
  k4: "courses",
  k5: "punch",
  k6: "הכרטיסייה נגמרה",
  k7: "sug:holiday:",
  k8: "מתנת-חג · ",
  k9: " בעוד ",
  k10: " ימים",
  k11: "nav.families",
  k12: "משפחות",
  k13: " פעילות — שקלו חלוקת מתנות לקראת החג",
  k14: "sug:school:",
  k15: "ערכת בית-ספר · ",
  k16: "בן/בת ",
  k17: " — לקראת/בתחילת כיתה א׳",
  k18: "sug:baby:",
  k19: "ערכת תינוק · ",
  k20: "entity.familyOf",
  k21: "משפחת",
  k22: " — תינוק/ת חדש/ה ב",
  k23: "entity.family",
  k24: "משפחה",
  k25: "sug:renew:",
  k26: "חידוש כרטיסייה · ",
  k27: "נותרו ",
  k28: " ניקובים",
};
const suggestions = (...a) => __pure_suggestions(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), __d_suggestions_SUGGESTIONS_T);
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };

// שקעי-בדיקה דטרמיניסטיים (חוזה)
const noon = (iso) => new Date(iso.slice(0, 10) + 'T12:00:00');
const ageAt = (birth, todayIso) => {
  if (!birth) return null;
  const b = noon(birth), t = noon(todayIso);
  if (isNaN(b.getTime()) || isNaN(t.getTime())) return null;
  let a = t.getFullYear() - b.getFullYear();
  const md = t.getMonth() - b.getMonth();
  if (md < 0 || (md === 0 && t.getDate() < b.getDate())) a--;
  return a;
};
const termOf = (cfg, k, fb) => fb;
const holPesach = () => ({ name: 'פסח', inDays: 12, hebYear: 5786 });
const holNone = () => null;
const sockets = (upcomingHoliday, moduleOn = () => true) => ({ termOf, moduleOn, upcomingHoliday, ageAt });

const TODAY = '2026-08-24';
const emptyDb = { families: [], enrollments: [], courses: [] };

// 1) הצעת-חג — 2 משפחות פעילות, בלי config
{
  const db = { ...emptyDb, families: [
    { id: 'f1', name: 'כהן', status: 'active', members: [] },
    { id: 'f2', name: 'לוי', status: 'active', members: [] },
  ] };
  const out = suggestions(db, TODAY, undefined, sockets(holPesach));
  ok(out.length === 1, 'דוגמה 1: מספר-הצעות ≠ 1');
  const s = out[0];
  ok(s.key === 'sug:holiday:פסח:5786', 'דוגמה 1: key שגוי — ' + s.key);
  ok(s.emoji === '🎁' && s.act === 'shop', 'דוגמה 1: emoji/act שגויים');
  ok(s.title === 'מתנת-חג · פסח בעוד 12 ימים', 'דוגמה 1: title שגוי — ' + s.title);
  ok(s.detail.startsWith('2 משפחות'), 'דוגמה 1: detail לא מתחיל ב"2 משפחות" — ' + s.detail);
}
// 2) ערכת בית-ספר — גיל 6 וגם גיל 5
{
  const db = { ...emptyDb, families: [{ id: 'f1', name: 'כהן', status: 'active', members: [
    { id: 'm1', first: 'יוסי', birth: '2020-03-01' },   // גיל 6 ב-24.8.2026
    { id: 'm2', first: 'דנה', birth: '2021-03-01' },    // גיל 5
    { id: 'p1', first: 'אבא', birth: '1990-01-01', isParent: true },
  ] }] };
  const out = suggestions(db, TODAY, undefined, sockets(holNone));
  ok(out.length === 2, 'דוגמה 2: מספר-הצעות ≠ 2 (גיל 5 וגם 6)');
  const s6 = out.find((x) => x.key === 'sug:school:m1:6');
  const s5 = out.find((x) => x.key === 'sug:school:m2:5');
  ok(!!s6 && s6.emoji === '🎒' && s6.famId === 'f1' && s6.act === 'families', 'דוגמה 2: הצעת-גיל-6 שגויה');
  ok(!!s5, 'דוגמה 2: גיל 5 לא הציף');
}
// 3) ערכת תינוק — גיל 0; הורה בגיל 0 לא מציף
{
  const db = { ...emptyDb, families: [{ id: 'f1', name: 'לוי', status: 'active', members: [
    { id: 'b1', first: 'נועם', birth: '2026-05-01' },
    { id: 'p1', first: 'הורה', birth: '2026-05-01', isParent: true },
  ] }] };
  const out = suggestions(db, TODAY, undefined, sockets(holNone));
  ok(out.length === 1, 'דוגמה 3: מספר-הצעות ≠ 1 (isParent לא דולג?)');
  ok(out[0].key === 'sug:baby:b1' && out[0].emoji === '👶' && out[0].act === 'families', 'דוגמה 3: הצעת-תינוק שגויה');
}
// 4) חידוש-כרטיסייה — נותרו 2 / נגמרה / נותרו 3
{
  const fam = { id: 'f1', name: 'כהן', status: 'active', members: [{ id: 'm1', first: 'יוסי', birth: '2010-01-01' }] };
  const course = { id: 'c1', name: 'שחייה' };
  const enr = (used) => ({ id: 'e1', plan: 'punch', status: 'active', purchased: 10, used, courseId: 'c1', memberId: 'm1' });
  const db = (used) => ({ families: [fam], courses: [course], enrollments: [enr(used)] });
  const out2 = suggestions(db(8), TODAY, undefined, sockets(holNone));
  ok(out2.length === 1 && out2[0].key === 'sug:renew:e1:10', 'דוגמה 4: key-חידוש שגוי');
  ok(out2[0].detail === 'נותרו 2 ניקובים' && out2[0].courseId === 'c1' && out2[0].famId === 'f1', 'דוגמה 4: פרטי-חידוש שגויים');
  const out0 = suggestions(db(10), TODAY, undefined, sockets(holNone));
  ok(out0.length === 1 && out0[0].detail === 'הכרטיסייה נגמרה', 'דוגמה 4: "הכרטיסייה נגמרה" חסר');
  const out3 = suggestions(db(7), TODAY, undefined, sockets(holNone));
  ok(out3.length === 0, 'דוגמה 4: נותרו 3 — לא הייתה אמורה לעלות הצעה');
}
// 5) גידור-מודולים — shop כבוי ⇒ אין חג; courses כבוי ⇒ אין חידוש
{
  const cfg = { slug: 't' };
  const db = { families: [{ id: 'f1', name: 'כהן', status: 'active', members: [{ id: 'm1', first: 'יוסי', birth: '2010-01-01' }] }],
    courses: [{ id: 'c1', name: 'שחייה' }],
    enrollments: [{ id: 'e1', plan: 'punch', status: 'active', purchased: 10, used: 9, courseId: 'c1', memberId: 'm1' }] };
  const noShop = suggestions(db, TODAY, cfg, sockets(holPesach, (c, m) => m !== 'shop'));
  ok(!noShop.some((x) => x.act === 'shop') && noShop.some((x) => x.act === 'courses'), 'דוגמה 5: shop כבוי לא גודר');
  const noCourses = suggestions(db, TODAY, cfg, sockets(holPesach, (c, m) => m !== 'courses'));
  ok(!noCourses.some((x) => x.act === 'courses') && noCourses.some((x) => x.act === 'shop'), 'דוגמה 5: courses כבוי לא גודר');
}
// 6) משפחה לא-פעילה — לא מציפה, ואין הצעת-חג בלי משפחות פעילות
{
  const db = { ...emptyDb, families: [{ id: 'f1', name: 'סגור', status: 'closed', members: [
    { id: 'm1', first: 'ילד', birth: '2020-03-01' },
  ] }] };
  const out = suggestions(db, TODAY, undefined, sockets(holPesach));
  ok(out.length === 0, 'דוגמה 6: משפחה סגורה הציפה הצעות');
}
if (f) process.exit(1);
console.log('✓ suggestions: 6 דוגמאות-חוזה — ירוק');
