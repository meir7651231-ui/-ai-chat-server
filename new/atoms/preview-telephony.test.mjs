import { previewTelephony as __pure_previewTelephony } from './preview-telephony.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור; בדיקה לא מייבאת אטום-שכן)
const __d_preview_telephony_caller = '050-1234567';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_previewTelephony_PREVIEW_TELEPHONY_T = {
  k1: "sim",
  k2: "virtual",
  k3: "יום שלישי 10:00 (בשעות)",
  k4: "יום שלישי 20:00 (אחרי-שעות)",
  k5: "שבת 11:00",
  k6: 400,
};
const previewTelephony = (...a) => __pure_previewTelephony(...a, ...Array(Math.max(0, 9 - a.length)).fill(undefined), __d_previewTelephony_PREVIEW_TELEPHONY_T, __d_preview_telephony_caller);
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
let f = 0;
const chk = (cond, label) => { if (!cond) { console.error('✗ ' + label); f = 1; } };

// שקעים רושמי-קריאות
function mkSockets(over = {}) {
  const log = { build: 0, explain: [], trust: 0 };
  const s = {
    telephonyToTenant: (tc, orgName, tenantId) => ({ raw: true, orgName, tenantId }),
    anchorToday: () => '2026-08-24',
    validateTenant: () => ({ ok: true, errors: [], warnings: ['vw'], tenant: { t: 1 } }),
    buildTenant: (raw, opts) => { log.build++; log.buildOpts = opts; return { ok: true, warnings: ['bw'], files: { 'a.conf': 'x' } }; },
    explainCall: (tenant, call, opts) => { log.explain.push({ call, opts }); return { summary: 'ס', outcome: 'תקין' }; },
    trustReport: () => { log.trust++; return { grade: 'A', score: 95, ready: true, failing: [{ label: 'l', detail: 'd', severity: 'warn', extra: 'זולג' }] }; },
    ...over,
  };
  return { s, log };
}
const call = (tc, { s }) => previewTelephony(tc, 'ארגון', 'ten1', s.telephonyToTenant, s.anchorToday, s.validateTenant, s.buildTenant, s.explainCall, s.trustReport);
const tcBase = { numbers: [{ kind: 'sim', e164: '+972501111111' }] };

// 1. ולידציה נכשלת — יציאה מוקדמת, buildTenant לא נקרא
{
  const m = mkSockets({ validateTenant: () => ({ ok: false, errors: ['אין DID'], warnings: ['w1'] }) });
  const r = call(tcBase, m);
  chk(eq(r, { ok: false, errors: ['אין DID'], warnings: ['w1'], rows: [], trust: null, files: null }), '1: ולידציה-נכשלת ⇒ יציאה מוקדמת');
  chk(m.log.build === 0 && m.log.explain.length === 0, '1ב: buildTenant/explainCall לא נקראו');
}

// 2. ולידציה עוברת — 3 תרחישים עם opts ו-caller קבועים
{
  const m = mkSockets();
  const r = call(tcBase, m);
  chk(r.ok === true && r.rows.length === 3, '2: rows=3');
  const want = [[2, '10:00'], [2, '20:00'], [6, '11:00']];
  chk(m.log.explain.every((e, i) => e.call.dow === want[i][0] && e.call.hhmm === want[i][1] && e.call.callerId === '050-1234567'
    && eq(e.opts, { anchorDate: '2026-08-24', calendarWindow: 400 })), '2ב: תרחישים+opts+caller כבחוזה');
}

// 3. בחירת-DID — sim גובר על הראשון
{
  const m = mkSockets();
  const tc = { numbers: [{ kind: 'landline', e164: '+97221111111' }, { kind: 'sim', e164: '+972501111111' }] };
  call(tc, m);
  chk(m.log.explain.every((e) => e.call.did === '+972501111111'), '3: sim גובר על המספר הראשון');
}

// 4. built.ok ⇒ trust ממופה (3 שדות בלבד) + files + warnings=built
{
  const m = mkSockets();
  const r = call(tcBase, m);
  chk(eq(r.trust, { grade: 'A', score: 95, ready: true, failing: [{ label: 'l', detail: 'd', severity: 'warn' }] }), '4: trust ממופה בלי שדות-זולגים');
  chk(eq(r.files, { 'a.conf': 'x' }) && eq(r.warnings, ['bw']), '4ב: files+warnings מ-buildTenant');
}

// 5. built.ok=false ⇒ trust=null, נפילת-warnings ל-v.warnings, files=null
{
  const m = mkSockets({ buildTenant: () => ({ ok: false }) });
  const r = call(tcBase, m);
  chk(r.ok === true && r.trust === null && r.files === null && eq(r.warnings, ['vw']), '5: build-נכשל ⇒ trust=null · warnings נופל ל-v.warnings');
  chk(m.log.trust === 0, '5ב: trustReport לא נקרא');
}

// בונוס-חוזה: בלי מספרים ⇒ did=''
{
  const m = mkSockets();
  call({ numbers: [] }, m);
  chk(m.log.explain.every((e) => e.call.did === ''), '6: אפס מספרים ⇒ did ריק');
}

if (f) process.exit(1);
console.log('✓ preview-telephony: 6 בדיקות-חוזה — ירוק');
