import { explainCall as __pure_explainCall } from './explain-call.mjs';
const __d_explainCall_EXPLAIN_CALL_T = {
  k1: "מחוץ-לשעות",
  k2: "שעות-פעילות",
  k3: "outbound",
  k4: "non-kosher-blocked",
  k5: "⛔ מצב-כשר: ניסיון-יציאה דרך SIM לא-כשר — נחסם.",
  k6: "no-such-sim",
  k7: "⚠️ הערוץ שנבחר לא-קיים.",
  k8: "no-default",
  k9: "⚠️ אין SIM ליציאת-ברירת-מחדל.",
  k10: "unknown-did",
  k11: "❓ המספר שחויג אינו מוכר למרכזייה — לא ינותב.",
  k12: "blocked",
  k13: "allowlist",
  k14: "⛔ המתקשר אינו ברשימת-ההיתר (או חסוי) — נותק.",
  k15: "⛔ המתקשר ברשימת-החסומים — נותק.",
  k16: "priority",
  k17: "mourning",
  k18: "announcement",
  k19: "📢 קו-הכרזה: משמיע הודעה מוקלטת ומנתק.",
  k20: "office",
  k21: "ivr-menu",
  k22: "✅ בשעות → תפריט-קולי (IVR) ממתין לבחירה.",
  k23: "queue",
  k24: "✅ בשעות → תור-המתנה עד שנציג מושך את השיחה.",
  k25: "voicemail",
  k26: "manager",
  k27: "afterhours",
  k28: "ivr-invalid",
  k29: "בחירה לא-תקינה ב-IVR",
  k30: "אין-מענה במשרד",
  k31: "ivr:",
};
// צילום-מקומי מ-explain-call-data + עטיפת-כריכה (מנוע-הטיהור v2; בדיקה לא מייבאת אטום-שכן)
const DOW_HE = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
const explainCall = (...a) => __pure_explainCall(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), DOW_HE, __d_explainCall_EXPLAIN_CALL_T);
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
  const out = explainCall(tenant, call, opts, eng);
  chk('1 office: שורה עברית + sim זהה + שקע נקרא פעם אחת עם הקלטים עצמם',
    JSON.stringify(out.lines) === JSON.stringify(['✅ בשעות-פעילות → מצלצל במשרד (101, 102).']) &&
    out.reason === 'שעות-פעילות' && out.outcome === 'office' && out.sim === sim &&
    calls.length === 1 && calls[0][0] === tenant && calls[0][1] === call && calls[0][2] === opts);

  // 2+7) callerId + dow ⇒ שורת-מתקשר, ו-summary = join(' ')
  const out2 = explainCall(tenant, { callerId: '0501234567', dow: 2, hhmm: '10:00' }, {}, eng);
  chk('2 שורת-מתקשר עם יום שלישי', out2.lines[0] === '📲 מתקשר 0501234567 · יום שלישי 10:00');
  chk('7 summary = lines.join(" ")',
    out2.summary === '📲 מתקשר 0501234567 · יום שלישי 10:00 ✅ בשעות-פעילות → מצלצל במשרד (101, 102).');
}

// 3) voicemail: סיבה ספציפית מוצגת, גנרית לא
{
  const tenant = { destinations: { manager: { ext: '200' }, voicemail: { box: '300' } } };
  const holiday = { path: ['closed'], outcome: 'voicemail', reason: 'חג' };
  const generic = { path: ['closed'], outcome: 'voicemail', reason: 'מחוץ-לשעות' };
  const a = explainCall(tenant, {}, {}, engWith(holiday).eng);
  const b = explainCall(tenant, {}, {}, engWith(generic).eng);
  chk('3א סיבת-חג בסוגריים', a.lines[0] === '🌙 מחוץ-לשעות (חג) → מנהל (200) → תא-קולי (300).');
  chk('3ב גנרית בלי סוגריים', b.lines[0] === '🌙 מחוץ-לשעות → מנהל (200) → תא-קולי (300).');
}

// 4) afterhours F11 — מודע-voicemail + יעדים חסרים ⇒ '—' + טריגר ivr-invalid
{
  const sim = { path: ['open', 'office', 'manager'], outcome: 'afterhours', reason: '' };
  const off = explainCall({}, {}, {}, engWith(sim, false).eng);
  chk('4א voicemail כבוי ⇒ צליל-תפוס ויעד "—"',
    off.lines[0] === '🌙 אין-מענה במשרד → מנהל (—) → צליל-תפוס (אין תא-קולי).');
  const on = explainCall({}, {}, {}, engWith(sim, true).eng);
  chk('4ב voicemail דלוק ⇒ תא-קולי', on.lines[0] === '🌙 אין-מענה במשרד → מנהל (—) → תא-קולי.');
  const inv = explainCall({}, {}, {},
    engWith({ path: ['open', 'ivr', 'ivr-invalid'], outcome: 'afterhours', reason: '' }, true).eng);
  chk('4ג טריגר ivr-invalid', inv.lines[0] === '🌙 בחירה לא-תקינה ב-IVR → מנהל (—) → תא-קולי.');
}

// 5) חיוג-יוצא: via + כשר-חסום, reason='' תמיד
{
  const via = explainCall({}, { direction: 'outbound', did: '035551234' }, {},
    engWith({ path: ['outbound'], outcome: 'via:sim1' }).eng);
  chk('5א יוצא דרך sim1',
    JSON.stringify(via.lines) === JSON.stringify(['📞 חיוג-יוצא: 035551234', '✅ יוצא דרך: sim1']) &&
    via.reason === '' && via.outcome === 'via:sim1');
  const kosher = explainCall({}, { direction: 'outbound', did: '035551234' }, {},
    engWith({ path: ['outbound'], outcome: 'non-kosher-blocked' }).eng);
  chk('5ב כשר-חסום', kosher.lines[1] === '⛔ מצב-כשר: ניסיון-יציאה דרך SIM לא-כשר — נחסם.');
}

// 6) default: ivr:* + outcome לא-מוכר
{
  const ivr = explainCall({}, {}, {}, engWith({ path: ['open', 'ivr', 'opt:1'], outcome: 'ivr:office', reason: 'שעות-פעילות' }).eng);
  chk('6א בחירת-IVR', ivr.lines[0] === '✅ בחירת-IVR → office.');
  const odd = explainCall({}, {}, {}, engWith({ path: [], outcome: 'zzz', reason: '' }).eng);
  chk('6ב לא-מוכר', odd.lines[0] === 'תוצאה: zzz');
}

if (f) process.exit(1);
console.log('✓ explain-call: 7 דוגמאות-חוזה (שקעי-eng, סיפור עברי מלא) — ירוק');
