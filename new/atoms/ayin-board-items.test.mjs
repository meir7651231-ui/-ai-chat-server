import { ayinBoardItems } from './ayin-board-items.mjs';
// מימוש-שקע לבדיקה — נאמן למקור (domain.ts emptyAyin):
const emptyAyin = () => ({ stage: 'new', note: '', answeredNote: '', answerPushed: false, nextTalk: '', nextTalkTime: '', lastTouch: '', names: [], answers: [], log: [], time: [], mat: [] });
const supporters = [
  { id: 's1', name: 'דוד', phone: '050', ayin: { stage: 'lead', names: [
    { name: 'משה', eyes: '7', note: 'x', done: 1 },
    { name: '', eyes: 2 },
    { name: 'רות' },
  ] } },
  { id: 's2', name: 'בלי-ayin' },
];
const out = ayinBoardItems(supporters, emptyAyin);
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const eq = (a, b, msg) => ok(JSON.stringify(a) === JSON.stringify(b), msg + ': ' + JSON.stringify(a));
ok(out.length === 2, 'אורך ' + out.length + ' ≠ 2 (שם-ריק + בלי-ayin מדולגים)');
eq(out[0], { supporterId: 's1', supporter: 'דוד', phone: '050', name: 'משה', eyes: 7, note: 'x', done: true, stage: 'lead' }, 'פריט משה');
ok(out[0].eyes === 7 && typeof out[0].eyes === 'number', "eyes:'7' ⇒ 7 מספר");
ok(out[0].done === true, 'done:1 ⇒ true');
eq(out[1], { supporterId: 's1', supporter: 'דוד', phone: '050', name: 'רות', eyes: '', note: '', done: false, stage: 'lead' }, 'פריט רות');
ok(out[1].eyes === '', "eyes:undefined ⇒ ''");
if (f) process.exit(1);
console.log('✓ ayin-board-items: 6 דוגמאות-חוזה — ירוק');
