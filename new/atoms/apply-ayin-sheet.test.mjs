import { applyAyinSheet as __pure_applyAyinSheet } from './apply-ayin-sheet.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_applyAyinSheet_APPLY_AYIN_SHEET_T = {
  k1: "eyes",
  k2: "answer",
  k3: "done",
};
const applyAyinSheet = (...a) => __pure_applyAyinSheet(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_applyAyinSheet_APPLY_AYIN_SHEET_T);
const mkAyin = () => ({ stage: 'new', answeredNote: '', lastTouch: '', names: [{ id: 'n1', name: 'משה', eyes: 3, done: false }], answers: [], log: [] });
const TODAY = '2026-08-24';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const base = [{ id: 's1', name: 'לוי', ayin: mkAyin() }, { id: 's2', name: 'כהן', ayin: mkAyin() }];
const r1 = applyAyinSheet(base, [{ supporterId: 's1', nameId: 'n1', eyes: 5, done: null, paid: true, answer: 'התקבלה', lead: null }], TODAY);
const a1 = r1.supporters[0].ayin;
ok(r1.logged === 1, 'logged=1, בפועל ' + r1.logged);
ok(JSON.stringify(a1.log[0]) === JSON.stringify({ date: TODAY, eyes: 5, name: 'משה' }), 'log[0]: ' + JSON.stringify(a1.log[0]));
ok(a1.names[0].eyes === 5, 'names[0].eyes=5');
ok(a1.paid === true, 'paid=true');
ok(a1.answers[0].note === 'התקבלה' && a1.answeredNote === 'התקבלה', 'answer+answeredNote');
ok(a1.lastTouch === TODAY, 'lastTouch=today');
ok(r1.supporters[1] === base[1], 'תומך בלי upds ⇒ אותה הפניה');
ok(base[0].ayin.names[0].eyes === 3 && base[0].ayin.log.length === 0, 'המקור לא שונה (אימוטביליות)');
// eyes זהה ⇒ אין log; answer כפול ⇒ דה-דופ:
const r2 = applyAyinSheet(r1.supporters, [{ supporterId: 's1', nameId: 'n1', eyes: 5, done: null, paid: null, answer: 'התקבלה', lead: null }], TODAY);
ok(r2.logged === 0, 'eyes זהה ⇒ logged=0');
ok(r2.supporters[0].ayin.answers.length === 1, 'answer כפול ⇒ answers לא גדל');
// lead: stage='new' ⇒ 'eyes'; stage='done' ⇒ נשאר:
const r3 = applyAyinSheet(base, [{ supporterId: 's1', nameId: 'n1', eyes: null, done: null, paid: null, answer: null, lead: true }], TODAY);
ok(r3.supporters[0].ayin.stage === 'eyes', "lead על 'new' ⇒ stage='eyes'");
const doneSp = [{ id: 's1', name: 'לוי', ayin: { ...mkAyin(), stage: 'done' } }];
const r4 = applyAyinSheet(doneSp, [{ supporterId: 's1', nameId: 'n1', eyes: null, done: null, paid: null, answer: null, lead: true }], TODAY);
ok(r4.supporters[0].ayin.stage === 'done', "lead על 'done' ⇒ נשאר 'done'");
// nameId זר ⇒ מדולג כולו (בלי lastTouch):
const r5 = applyAyinSheet(base, [{ supporterId: 's1', nameId: 'זר', eyes: 9, done: null, paid: null, answer: null, lead: null }], TODAY);
ok(r5.logged === 0 && r5.supporters[0].ayin.lastTouch === '', 'nameId זר ⇒ לא נגוע');
if (f) process.exit(1);
console.log('✓ apply-ayin-sheet: 13 דוגמאות-חוזה — ירוק');
