// צילום-מקומי מאטום-הדאטה (בדיקה לא מייבאת אטום-שכן)
const DOW_HE = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
import { explainCall } from './explain-call.mjs';
let f = 0;
const chk = (name, cond) => { if (!cond) { console.error('✗ ' + name); f = 1; } };

const engWith = (sim, vmOn = true) => {
  const calls = [];
  return {
    calls,
    eng: {
      simulateCall: (...args) => { calls.push(args); return sim; },
      featureOn: (_t, key) => (key === 'voicemail' ? vmOn : false),
    },
  };
};

// 1) office + פרוטוקול-השקע + זהות-sim
{
  const sim = { path: ['open', 'office'], outcome: 'office', reason: 'שעות-פעילות' };
  const { calls, eng } = engWith(sim);
  const tenant = { destinations: { office: { ext: ['101', '102'] } } };
  const call = {};
  const opts = {};
  const out = explainCall(tenant, call, opts, eng, DOW_HE);
  chk('1 office: שורה עברית + sim זהה + שקע נקרא פעם אחת עם הקלטים עצמם',
    JSON.stringify(out.lines) === JSON.stringify(['✅ בשעות-פעילות → מצלצל במשרד (101, 102).']) &&
    out.reason === 'שעות-פעילות' && out.outcome === 'office' && out.sim === sim &&
    calls.length === 1 && calls[0][0] === tenant && calls[0][1] === call && calls[0][2] === opts);

  // 2+7) callerId + dow ⇒ שורת-מתקשר, ו-summary = join(' ')
  const out2 = explainCall(tenant, { callerId: '0501234567', dow: 2, hhmm: '10:00' }, {}, eng, DOW_HE);
  chk('2 שורת-מתקשר עם יום שלישי', out2.lines[0] === '📲 מתקשר 0501234567 · יום שלישי 10:00');
  chk('7 summary = lines.join(" ")',
    out2.summary === '📲 מתקשר 0501234567 · יום שלישי 10:00 ✅ בשעות-פעילות → מצלצל במשרד (101, 102).');
}

// 3) voicemail: סיבה ספציפית מוצגת, גנרית לא
{
  const tenant = { destinations: { manager: { ext: '200' }, voicemail: { box: '300' } } };
  const holiday = { path: ['closed'], outcome: 'voicemail', reason: 'חג' };
  const generic = { path: ['closed'], outcome: 'voicemail', reason: 'מחוץ-לשעות' };
  const a = explainCall(tenant, {}, {}, engWith(holiday).eng, DOW_HE);
  const b = explainCall(tenant, {}, {}, engWith(generic).eng, DOW_HE);
  chk('3א סיבת-חג בסוגריים', a.lines[0] === '🌙 מחוץ-לשעות (חג) → מנהל (200) → תא-קולי (300).');
  chk('3ב גנרית בלי סוגריים', b.lines[0] === '🌙 מחוץ-לשעות → מנהל (200) → תא-קולי (300).');
}

// 4) afterhours F11 — מודע-voicemail + יעדים חסרים ⇒ '—' + טריגר ivr-invalid
{
  const sim = { path: ['open', 'office', 'manager'], outcome: 'afterhours', reason: '' };
  const off = explainCall({}, {}, {}, engWith(sim, false).eng, DOW_HE);
  chk('4א voicemail כבוי ⇒ צליל-תפוס ויעד "—"',
    off.lines[0] === '🌙 אין-מענה במשרד → מנהל (—) → צליל-תפוס (אין תא-קולי).');
  const on = explainCall({}, {}, {}, engWith(sim, true).eng, DOW_HE);
  chk('4ב voicemail דלוק ⇒ תא-קולי', on.lines[0] === '🌙 אין-מענה במשרד → מנהל (—) → תא-קולי.');
  const inv = explainCall({}, {}, {},
    engWith({ path: ['open', 'ivr', 'ivr-invalid'], outcome: 'afterhours', reason: '' }, true).eng, DOW_HE);
  chk('4ג טריגר ivr-invalid', inv.lines[0] === '🌙 בחירה לא-תקינה ב-IVR → מנהל (—) → תא-קולי.');
}

// 5) חיוג-יוצא: via + כשר-חסום, reason='' תמיד
{
  const via = explainCall({}, { direction: 'outbound', did: '035551234' }, {},
    engWith({ path: ['outbound'], outcome: 'via:sim1' }).eng, DOW_HE);
  chk('5א יוצא דרך sim1',
    JSON.stringify(via.lines) === JSON.stringify(['📞 חיוג-יוצא: 035551234', '✅ יוצא דרך: sim1']) &&
    via.reason === '' && via.outcome === 'via:sim1');
  const kosher = explainCall({}, { direction: 'outbound', did: '035551234' }, {},
    engWith({ path: ['outbound'], outcome: 'non-kosher-blocked' }).eng, DOW_HE);
  chk('5ב כשר-חסום', kosher.lines[1] === '⛔ מצב-כשר: ניסיון-יציאה דרך SIM לא-כשר — נחסם.');
}

// 6) default: ivr:* + outcome לא-מוכר
{
  const ivr = explainCall({}, {}, {}, engWith({ path: ['open', 'ivr', 'opt:1'], outcome: 'ivr:office', reason: 'שעות-פעילות' }).eng, DOW_HE);
  chk('6א בחירת-IVR', ivr.lines[0] === '✅ בחירת-IVR → office.');
  const odd = explainCall({}, {}, {}, engWith({ path: [], outcome: 'zzz', reason: '' }).eng, DOW_HE);
  chk('6ב לא-מוכר', odd.lines[0] === 'תוצאה: zzz');
}

if (f) process.exit(1);
console.log('✓ explain-call: 7 דוגמאות-חוזה (שקעי-eng, סיפור עברי מלא) — ירוק');
