/** בדיקת-קצה של קופסת-היומן — כל דוגמאות-החוזה דרך החוטים המחווטים בלבד.
 *  מותר לייבא אך-ורק את הקופסה עצמה (חוק-4). */
import {
  fmtDate, localIso, isoToday, DAY_NAMES, pad2, timeToMin, minToHM, groupLabelOf,
  ABSENCE_REASON_CHIPS, makeupEligibility, blockReason, buildSlots, enrollmentsForSession,
  weeklyRoomSessions, inactiveRoomCourses, planLabelOf, enrollStatusMeta, chipStyle, roomInfoLabel,
} from './diary.mjs';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';

let f = 0;
const eq = (got, exp, msg) => { try { assert.deepStrictEqual(got, exp); } catch { console.error(`✗ ${msg}: got ${JSON.stringify(got)}`); f = 1; } };

// fmtDate
eq(fmtDate('2026-08-24'), '24/08/2026', 'fmtDate תקין');
eq(fmtDate(''), '—', 'fmtDate ריק');
eq(fmtDate('bad'), '—', 'fmtDate שבור');
// localIso / isoToday
eq(localIso(new Date(2026, 7, 24, 12, 0)), '2026-08-24', 'localIso');
eq(isoToday(new Date(2026, 7, 24, 12, 0)), '2026-08-24', 'isoToday עם now מוזרק');
// DAY_NAMES — 7 ימים כולל שבת (וריאנט-היומן, לא 6 של הקורסים)
eq(DAY_NAMES.length, 7, 'DAY_NAMES אורך');
eq(DAY_NAMES[6], 'שבת', 'DAY_NAMES שבת');
// pad2 / timeToMin / minToHM
eq(pad2(5), '05', 'pad2');
eq(timeToMin('09:30'), 570, 'timeToMin');
eq(Number.isNaN(timeToMin('bad')), true, 'timeToMin שבור→NaN');
eq(timeToMin(' 8:05 '), 485, 'timeToMin trim');
eq(minToHM(570), '09:30', 'minToHM');
eq(minToHM(0), '00:00', 'minToHM 0');
// groupLabelOf
eq(groupLabelOf({ label: '' }, 0), 'קבוצה 1', 'groupLabelOf ריק');
eq(groupLabelOf({ label: 'א' }, 3), 'א', 'groupLabelOf label');
// ABSENCE_REASON_CHIPS
eq(ABSENCE_REASON_CHIPS[0], 'מחלה', 'chips[0]');
eq(ABSENCE_REASON_CHIPS.length, 5, 'chips אורך');
// makeupEligibility
eq(makeupEligibility('noshow', true, 999), { eligible: false, dropsPunch: true }, 'noshow לעולם לא-זכאי');
eq(makeupEligibility('cancel', false, 48), { eligible: true, dropsPunch: false }, 'ביטול-מוקדם ≥48');
eq(makeupEligibility('cancel', false, 10), { eligible: false, dropsPunch: true }, 'ביטול מאוחר');
eq(makeupEligibility('cancel', true, null), { eligible: true, dropsPunch: false }, 'מוצדק');
// blockReason
eq(blockReason(new Date(2026, 7, 22, 12)), 'שבת', 'שבת');
eq(blockReason(new Date(2026, 7, 21, 12)), 'יום שישי (שעתיים לפני שבת)', 'שישי');
eq(blockReason(new Date(2022, 7, 7, 12)), 'תשעה באב (נדחה)', 'ט׳ באב נדחה (ראשון)');
eq(blockReason(new Date(2026, 7, 22, 12), false), null, 'דגל-חסימה כבוי');
// planLabelOf — וריאנט-יומן
eq(planLabelOf({ plan: 'punch', purchased: 10, used: 3 }), 'כרטיסייה · יתרה 7/10', 'planLabelOf punch');
eq(planLabelOf({ plan: 'punch', purchased: 5, used: 8 }), 'כרטיסייה · יתרה 0/5', 'planLabelOf punch לא-שלילי');
eq(planLabelOf({ plan: 'month' }), 'מנוי חודשי', 'planLabelOf month');
// enrollStatusMeta — וריאנט-יומן (null default)
eq(enrollStatusMeta({ status: 'wait' }), { label: 'רשימת-המתנה ⏳', bg: '#e7edf5', c: '#3a5a86' }, 'wait');
eq(enrollStatusMeta({ status: 'paused' }), { label: 'מוקפא', bg: '#fdf1d4', c: '#9a6414' }, 'paused');
eq(enrollStatusMeta({ status: 'active' }), null, 'active→null (וריאנט-יומן)');
// chipStyle / roomInfoLabel
eq(chipStyle('#fff', '#000').background, '#fff', 'chipStyle bg');
eq(chipStyle('#fff', '#000').borderRadius, 999, 'chipStyle radius');
eq(roomInfoLabel({ slot: 45, cap: 12, access: true, eq: { מקרן: true } }),
  'משבצות של 45 דק׳ · עד 12 משתתפים · נגיש · מקרן', 'roomInfoLabel מלא');
eq(roomInfoLabel({ slot: 0 }), 'משבצות של 60 דק׳', 'roomInfoLabel ברירת-מחדל');

// buildSlots / enrollmentsForSession / weeklyRoomSessions / inactiveRoomCourses — תרחיש-קצה מלא
const cfg = { terms: {} };
const room = { id: 'r1', from: '09:00', to: '11:00', slot: 60, active: true };
const course = { id: 'c1', roomId: 'r1', name: 'ציור', weekday: 1, time: '09:00', start: '', end: '', sessions: [] };
const db = { courses: [course], events: [], rooms: [room], enrollments: [{ courseId: 'c1', group: '' }] };
const mon = '2026-08-24'; // יום שני
const slots = buildSlots(db, room, mon, null, cfg, false);
eq(slots.some((s) => s.kind === 'course' && s.label.includes('ציור')), true, 'buildSlots משבץ חוג');
eq(slots.every((s) => s.kind !== 'cleaning'), true, 'buildSlots ללא ניקיון (דגל כבוי)');
const withClean = buildSlots(db, { ...room, from: '14:00', to: '17:00' }, mon, null, cfg, true);
eq(withClean.some((s) => s.kind === 'cleaning'), true, 'buildSlots ניקיון 15:00');
eq(enrollmentsForSession(db, course, 0).length, 1, 'enrollmentsForSession מפגש-יחיד');
eq(weeklyRoomSessions(db, 'r1', mon), 1, 'weeklyRoomSessions');
eq(inactiveRoomCourses({ courses: [course], rooms: [{ id: 'r1', active: false, name: 'אולם' }] }, mon, cfg),
  [{ course, roomName: 'אולם' }], 'inactiveRoomCourses חדר-לא-פעיל');

/* 🛡 מגן-הכרעה (דפוס הגנת-מקור): וריאנטי-היומן של planLabelOf/enrollStatusMeta
   ו-courseOnDate = הכרעות-קופסה חתומות מול המקור. */
const src = readFileSync(new URL('./diary.mjs', import.meta.url), 'utf8');
if (!src.includes('כרטיסייה · יתרה ${Math.max(0, e.purchased - e.used)}/${e.purchased}')) { console.error('✗ מגן: planLabelOf וריאנט-יומן שונה'); f = 1; }
if (!/enrollStatusMeta[\s\S]*?return null;/.test(src)) { console.error('✗ מגן: enrollStatusMeta ברירת-מחדל null נמחקה'); f = 1; }
if (!src.includes("(!c.start || iso >= c.start) && (!c.end || iso <= c.end)")) { console.error('✗ מגן: courseOnDate שונה מהמקור'); f = 1; }
// אימות אי-ייבוא וריאנטי-הקורסים (הכרעת L4 — אסור לחווט את atom plan-label-of/enroll-status-meta)
if (/atoms\/(plan-label-of|enroll-status-meta)\.mjs/.test(src)) { console.error('✗ מגן: יובא וריאנט-קורסים במקום וריאנט-יומן'); f = 1; }

if (f) process.exit(1);
console.log('✓ קופסת-יומן: 19 חוטים · כל דוגמאות-החוזה + buildSlots + מגן-הכרעה — ירוק');
