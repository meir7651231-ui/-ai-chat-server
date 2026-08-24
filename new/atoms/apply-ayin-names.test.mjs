import { applyAyinNames } from './apply-ayin-names.mjs';
// מימושי-שקע לבדיקה — נאמנים למקור (domain.emptyAyin · ayin.planAddName):
const emptyAyin = () => ({ stage: 'new', note: '', answeredNote: '', answerPushed: false, nextTalk: '', nextTalkTime: '', lastTouch: '', names: [], answers: [], log: [], time: [], mat: [] });
const norm = (s) => s.trim().toLowerCase();
const planAddName = (a, rawName, eyes, id) => {
  const nm = rawName.trim();
  if (!nm) return { ok: false, error: 'ריק' };
  if (a.names.some((x) => norm(x.name) === norm(nm))) return { ok: false, error: 'כפול' };
  return { ok: true, names: [...a.names, { id, name: nm, eyes, done: false }] };
};
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
let ids = 0;
const mkId = () => 'id-' + ++ids;
const sp = { id: 's1', name: 'לוי' };
const out = applyAyinNames(sp, ['ראובן', '', 'ראובן', 'שמעון'], mkId, emptyAyin, planAddName);
ok(out.ayin.names.length === 2, 'נוספו 2 שמות, בפועל ' + out.ayin.names.length);
ok(out.ayin.names[0].name === 'ראובן' && out.ayin.names[1].name === 'שמעון', 'השמות: ראובן, שמעון');
ok(ids === 2, 'mkId נקרא בדיוק פעמיים (בפועל ' + ids + ') — ריק/כפול לא שרפו מזהה');
ok(out.ayin.names.every((n) => n.eyes === '' && n.done === false), "eyes='' · done=false");
ok(applyAyinNames(sp, [], mkId, emptyAyin, planAddName) === sp, 'בלי שמות ⇒ אותה הפניה');
const sp2 = { id: 's2', name: 'כהן', ayin: { ...emptyAyin(), names: [{ id: 'n1', name: 'ראובן', eyes: 3, done: false }] } };
ok(applyAyinNames(sp2, ['ראובן'], mkId, emptyAyin, planAddName) === sp2, 'הכל-כפול ⇒ אותה הפניה');
const out2 = applyAyinNames(sp2, ['ראובן', 'שמעון'], mkId, emptyAyin, planAddName);
ok(out2.ayin.names.length === 2 && out2.ayin.names[1].name === 'שמעון', 'קיים מדולג, חדש נוסף');
ok(sp2.ayin.names.length === 1, 'sp.ayin המקורי לא שונה (אימוטביליות)');
if (f) process.exit(1);
console.log('✓ apply-ayin-names: 8 דוגמאות-חוזה — ירוק');
