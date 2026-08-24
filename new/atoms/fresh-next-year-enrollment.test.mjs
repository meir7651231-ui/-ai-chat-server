import { freshNextYearEnrollment } from './fresh-next-year-enrollment.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const src = {
  id: 'e1', memberId: 'm1', courseId: 'c1', plan: 'card', purchased: 10, used: 7,
  group: 'g1', absences: [{ date: '2026-01-05' }], payments: [{ ils: 100 }],
  totalDue: 1200, dueDate: '2026-06-01', status: 'ended', note: 'ותיקה',
  enrolledAt: '2025-09-01', freq: 2, tier: 'מדרגה-ב',
};
const out = freshNextYearEnrollment(src, 'c9', 'e77', '2026-09-01');
// 1) איפוס-היסטוריה + שימור-ליבה
ok(out.purchased === 0 && out.used === 0, 'purchased/used לא אופסו');
ok(out.absences.length === 0 && out.payments.length === 0, 'absences/payments לא אופסו');
ok(out.dueDate === '' && out.status === 'active' && out.note === '', 'dueDate/status/note לא אופסו');
ok(out.memberId === 'm1' && out.plan === 'card' && out.totalDue === 1200, 'ליבה לא נשמרה');
// 2) יעד/מזהה/תאריך מוזרקים
ok(out.courseId === 'c9' && out.id === 'e77' && out.enrolledAt === '2026-09-01', 'הזרקות שגויות');
// 3) קבוצה — ברירת-מחדל אשתקד, ודריסה
ok(out.group === 'g1', 'group ברירת-מחדל ≠ אשתקד');
ok(freshNextYearEnrollment(src, 'c9', 'e78', '2026-09-01', 'g2').group === 'g2', 'groupOverride לא דרס');
// 4) תמחור אופציונלי — קיים מועתק, חסר לא-קיים
ok(out.freq === 2 && out.tier === 'מדרגה-ב', 'freq/tier לא הועתקו');
ok(!('termMonths' in out) && !('term' in out) && !('freqUnit' in out), 'מפתח-תמחור חסר נוצר בטעות');
// 5) המקור קדוש
ok(src.used === 7 && src.absences.length === 1 && src.status === 'ended', 'המקור השתנה');
if (f) process.exit(1);
console.log('✓ fresh-next-year-enrollment: 5 דוגמאות-חוזה (11 בדיקות) — ירוק');
