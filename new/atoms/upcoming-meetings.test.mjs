import { upcomingMeetings as __pure_upcomingMeetings } from './upcoming-meetings.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_upcomingMeetings_UPCOMING_MEETINGS_T = {
  k1: "meeting",
};
const upcomingMeetings = (...a) => __pure_upcomingMeetings(...a, ...Array(Math.max(0, 6 - a.length)).fill(undefined), __d_upcomingMeetings_UPCOMING_MEETINGS_T);
let f = 0;
const eq = (a, b, msg) => {
  if (JSON.stringify(a) !== JSON.stringify(b)) { console.error(`✗ ${msg} ⇒ ${JSON.stringify(a)}`); f = 1; }
};

const pad2 = (n) => String(n).padStart(2, '0');
const isoOf = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const beneficiaryLabel = (db, a) => 'מוטב:' + a.familyId;
const TODAY = '2026-08-24';
const mk = (over) => ({ kind: 'meeting', done: false, date: TODAY, title: 'ללא שיבוץ', ...over });
const db0 = { shopEvents: [], shopAssignments: [], rooms: [] };

// 1) סינון: kind/done/טווח
{
  const db = { ...db0, shopEvents: [
    mk({ id: 'e1' }),                                  // היום — נכלל
    mk({ id: 'e2', date: '2026-08-25' }),              // מחר — נכלל
    mk({ id: 'e3', date: '2026-08-26' }),              // מחרתיים — מחוץ לטווח
    mk({ id: 'e4', done: true }),                      // סגור — מוחרג
    mk({ id: 'e5', kind: 'delivery' }),                // לא פגישה — מוחרג
  ] };
  const out = upcomingMeetings(db, TODAY, 2, undefined, isoOf, beneficiaryLabel);
  eq(out.map((o) => o.ev.id), ['e1', 'e2'], 'דוגמה 1: סינון');
}

// 2) מיון בתוך יום — בלי-שעה לסוף (99:99)
{
  const db = { ...db0, shopEvents: [
    mk({ id: 'late', time: '14:00' }), mk({ id: 'none' }), mk({ id: 'early', time: '09:00' }),
  ] };
  const out = upcomingMeetings(db, TODAY, 2, undefined, isoOf, beneficiaryLabel);
  eq(out.map((o) => o.ev.id), ['early', 'late', 'none'], 'דוגמה 2: מיון');
}

// 3) who משיבוץ — השקע נקרא עם (db, השיבוץ, config)
{
  const cfg = { tag: 'cfg' };
  let got = null;
  const db = { ...db0, shopAssignments: [{ id: 'as1', familyId: 'f7' }],
    shopEvents: [mk({ id: 'e1', assignmentId: 'as1' })] };
  const out = upcomingMeetings(db, TODAY, 2, cfg, isoOf, (d, a, c) => { got = [d, a, c]; return 'מוטב:' + a.familyId; });
  eq(out[0].who, 'מוטב:f7', 'דוגמה 3: who');
  if (got[0] !== db || got[1] !== db.shopAssignments[0] || got[2] !== cfg) {
    console.error('✗ דוגמה 3: קריאת-השקע שגויה'); f = 1;
  }
}

// 4) who בנפילה — שיבוץ לא-קיים ⇒ ev.title
{
  const db = { ...db0, shopEvents: [mk({ id: 'e1', assignmentId: 'missing', title: 'פגישת ייעוץ' })] };
  eq(upcomingMeetings(db, TODAY, 2, undefined, isoOf, beneficiaryLabel)[0].who, 'פגישת ייעוץ', 'דוגמה 4: נפילה ל-title');
}

// 5) roomName: קיים / לא-קיים / בלי roomId
{
  const db = { ...db0, rooms: [{ id: 'r1', name: 'חדר הדרכה' }], shopEvents: [
    mk({ id: 'a', time: '09:00', roomId: 'r1' }),
    mk({ id: 'b', time: '10:00', roomId: 'rX' }),
    mk({ id: 'c', time: '11:00' }),
  ] };
  const out = upcomingMeetings(db, TODAY, 2, undefined, isoOf, beneficiaryLabel);
  eq(out.map((o) => o.roomName), ['חדר הדרכה', '', ''], 'דוגמה 5: roomName');
}

// 6) פגישת-אתמול לא מוחזרת
{
  const db = { ...db0, shopEvents: [mk({ id: 'old', date: '2026-08-23' })] };
  eq(upcomingMeetings(db, TODAY, 2, undefined, isoOf, beneficiaryLabel), [], 'דוגמה 6: אתמול מוחרג');
}

if (f) process.exit(1);
console.log('✓ upcoming-meetings: 6 דוגמאות-חוזה — ירוק');
