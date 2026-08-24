import { studentHistory } from './student-history.mjs';

// שקעי-בדיקה כמוגדר בחוזה (הבדיקה מייבאת רק את האטום שלה)
const ylCalls = [];
const academicYearLabel = (iso) => { ylCalls.push(iso); return 'YL:' + iso; };
const enrollSummary = (e) => ({ sum: e.id });

const c1 = { id: 'c1', name: 'ציור', start: '2025-09-01', end: '2026-06-30', year: '' };
const c2 = { id: 'c2', name: 'נגינה', start: '2026-09-01', year: 'תשפ"ז' };
const e1 = { id: 'e1', memberId: 'm1', courseId: 'c1', enrolledAt: '2025-08-20', renewedToId: 'e2' };
const e2 = { id: 'e2', memberId: 'm1', courseId: 'c2', enrolledAt: '2026-08-01' };
const e3 = { id: 'e3', memberId: 'm1', courseId: 'ghost', enrolledAt: '2024-01-01' };
const eOther = { id: 'e9', memberId: 'm2', courseId: 'c1', enrolledAt: '2025-08-20' };
const db = { enrollments: [e1, e2, e3, eOther], courses: [c1, c2] };

let f = 0;
const chk = (n, ok) => { if (!ok) { console.error(`✗ ${n}`); f = 1; } };

const h = studentHistory(db, 'm1', academicYearLabel, enrollSummary);

// 1. שלוש רשומות של m1, e2 ראשון (מהחדש לישן), e3 (בלי start) אחרון
chk('דוגמה-1: מיון מהחדש לישן', h.length === 3 && h[0].enrollment === e2 && h[1].enrollment === e1 && h[2].enrollment === e3);
// 2. שם-החוג ותאריכיו נשאבים
chk('דוגמה-2: שאיבת-חוג', h[1].courseName === 'ציור' && h[1].start === '2025-09-01' && h[1].end === '2026-06-30');
// 3. yearLabel: course.year גובר; אחרת השקע על start
chk('דוגמה-3: yearLabel', h[0].yearLabel === 'תשפ"ז' && h[1].yearLabel === 'YL:2025-09-01' && !ylCalls.includes('2026-09-01'));
// 4. חוג-רפאים
chk('דוגמה-4: חוג-רפאים', h[2].courseName === '—' && h[2].start === '' && h[2].end === '' && h[2].yearLabel === '');
// 5. סינון לפי memberId
chk('דוגמה-5: סינון', h.every((r) => r.enrollment.memberId === 'm1')
  && studentHistory(db, 'm-none', academicYearLabel, enrollSummary).length === 0);
// 6. חידושים: e1 חודש קדימה, e2 יעד-חידוש; summary מהשקע
chk('דוגמה-6: חידושים', h[1].renewedForward === true && h[1].fromRenewal === false
  && h[0].fromRenewal === true && h[0].renewedForward === false
  && h[0].summary.sum === 'e2');
// 7. שובר-שוויון: אותו חוג, enrolledAt מאוחר ראשון
const eA = { id: 'eA', memberId: 'm3', courseId: 'c1', enrolledAt: '2025-08-01' };
const eB = { id: 'eB', memberId: 'm3', courseId: 'c1', enrolledAt: '2025-08-15' };
const h7 = studentHistory({ enrollments: [eA, eB], courses: [c1] }, 'm3', academicYearLabel, enrollSummary);
chk('דוגמה-7: שובר-שוויון', h7[0].enrollment === eB && h7[1].enrollment === eA);

if (f) process.exit(1);
console.log('✓ student-history: 7 דוגמאות-חוזה — ירוק');
