import { planAyinAdvance as __pure_planAyinAdvance } from './plan-ayin-advance.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_planAyinAdvance_PLAN_AYIN_ADVANCE_T = {
  k1: "new",
  k2: "lead",
  k3: "eyes",
  k4: "answer",
  k5: "נמסר — נרשם בלוח היומי ובכרטיס",
  k6: "done",
  k7: "הטיפול הושלם ✓ — נרשם בלוח",
};
const planAyinAdvance = (...a) => __pure_planAyinAdvance(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), __d_planAyinAdvance_PLAN_AYIN_ADVANCE_T);
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
// שקעים בהתנהגות ברירת-המחדל של maor (ayin.ts):
const STAGE = { new: 'חדש', lead: 'בהכנה', eyes: 'רישום', answer: 'מסירה', done: 'הושלם' };
const sockets = {
  ayinActionVisible: (a) => {
    const st = a.stage;
    if (st === 'done') return false;
    if (st === 'new') return a.names.length > 0;
    if (st === 'eyes') return a.names.some((n) => n.eyes !== '' && n.eyes != null);
    return true;
  },
  featLabel: () => 'מעקב טיפול',
  itemLabel: () => 'שם לטיפול',
  unitLabel: () => 'כמות',
  stageLabel: (_cfg, st) => STAGE[st],
  eyesTotal: (a) => a.names.reduce((t, x) => t + (+x.eyes || 0), 0),
};
const cfg = {};
const nm = (eyes) => ({ id: 'n', name: 'x', eyes, done: false });
// stage='new' עם 2 שמות:
const r1 = planAyinAdvance(cfg, 'רות', { stage: 'new', names: [nm(''), nm('')] }, sockets);
ok(JSON.stringify(r1.patch) === JSON.stringify({ stage: 'lead' }), "new ⇒ patch{stage:'lead'}");
ok(r1.event.title === 'מעקב טיפול: בהכנה — רות (2 שם לטיפול)' && r1.event.done === false, 'new event: ' + JSON.stringify(r1.event));
ok(r1.toast === 'נרשמו 2 — נכנס ללוח: בהכנה', 'new toast: ' + r1.toast);
// stage='new' בלי שמות ⇒ null:
ok(planAyinAdvance(cfg, 'רות', { stage: 'new', names: [] }, sockets) === null, 'new ריק ⇒ null');
// stage='lead':
const r2 = planAyinAdvance(cfg, 'רות', { stage: 'lead', names: [nm('')] }, sockets);
ok(JSON.stringify(r2.event) === JSON.stringify({ title: 'מעקב טיפול: בהכנה ✓ — רות', done: true }), 'lead event: ' + JSON.stringify(r2.event));
ok(r2.toast === 'אושר — נרשם בלוח ובדוח. עכשיו: רישום' && r2.patch.stage === 'eyes', 'lead toast+patch');
// stage='eyes' עם מונים 3+2:
const r3 = planAyinAdvance(cfg, 'רות', { stage: 'eyes', names: [nm(3), nm(2)] }, sockets);
ok(JSON.stringify(r3.patch) === JSON.stringify({ stage: 'answer' }), "eyes ⇒ patch{stage:'answer'}");
ok(r3.event.title === 'מעקב טיפול: מסירה — רות (5 כמות)', 'eyes event.title: ' + r3.event.title);
ok(r3.toast === 'נרשם — נכנס ללוח: מסירה', 'eyes toast: ' + r3.toast);
// stage='answer' לפני-דחיפה:
const r4 = planAyinAdvance(cfg, 'רות', { stage: 'answer', names: [nm(3)], answerPushed: false }, sockets);
ok(JSON.stringify(r4.patch) === JSON.stringify({ answerPushed: true }), 'answer ⇒ patch{answerPushed:true}');
ok(JSON.stringify(r4.event) === JSON.stringify({ title: 'מעקב טיפול: מסירה — רות', done: false }), 'answer event: ' + JSON.stringify(r4.event));
ok(r4.toast === 'נמסר — נרשם בלוח היומי ובכרטיס', 'answer toast: ' + r4.toast);
// stage='answer' אחרי-דחיפה:
const r5 = planAyinAdvance(cfg, 'רות', { stage: 'answer', names: [nm(3)], answerPushed: true }, sockets);
ok(JSON.stringify(r5.patch) === JSON.stringify({ stage: 'done' }), "answerPushed ⇒ patch{stage:'done'}");
ok(JSON.stringify(r5.event) === JSON.stringify({ title: 'מעקב טיפול: הושלם — רות', done: true }), 'done event: ' + JSON.stringify(r5.event));
ok(r5.toast === 'הטיפול הושלם ✓ — נרשם בלוח', 'done toast: ' + r5.toast);
// stage='done' ⇒ null:
ok(planAyinAdvance(cfg, 'רות', { stage: 'done', names: [nm(3)] }, sockets) === null, 'done ⇒ null');
if (f) process.exit(1);
console.log('✓ plan-ayin-advance: 15 דוגמאות-חוזה — ירוק');
