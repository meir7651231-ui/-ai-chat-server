import { trustReport } from './trust-report.mjs';
let f = 0;
const eq = (a, b, msg) => {
  if (JSON.stringify(a) !== JSON.stringify(b)) { console.error(`✗ ${msg} ⇒ ${JSON.stringify(a)}`); f = 1; }
};

// eng בסיסי — featureOn לפי מפה, שאר האורקלים ירוקים
const mkEng = (flags, over = {}) => ({
  featureOn: (t, key) => !!flags[key],
  auditRoutes: () => ({ ok: true, dangling: [], orphanTransfers: [], missingGateways: [] }),
  failsafeRoute: () => ({ ok: true, fallback: '200' }),
  recordingEncryption: () => ({ enabled: false }),
  secretPreflight: () => ({ ok: true, missing: [] }),
  crossTenantLeakScan: () => ({ clean: true, violations: [] }),
  ...over,
});
const bundle = { tenant: { tenantId: 't1' }, files: {} };

// 1) ירוק מינימלי — 5 בדיקות, score=100, grade='A'
{
  const out = trustReport(bundle, {}, mkEng({ 'voice.hardening': true }));
  eq(out.checks.map((c) => c.key), ['route-closure', 'failsafe', 'toll-caps', 'downstream', 'cti-readonly'], 'דוגמה 1: סדר-הבדיקות');
  eq([out.score, out.grade, out.ready, out.failing.length], [100, 'A', true, 0], 'דוגמה 1: ציון');
  eq(out.checks[1].detail, 'נפילה למנהל 200', 'דוגמה 1: failsafe detail');
  eq(out.tenantId, 't1', 'דוגמה 1: tenantId');
}

// 2) כשל-failsafe (critical) ⇒ score=70, grade='F', ready=false
{
  const out = trustReport(bundle, {}, mkEng({ 'voice.hardening': true },
    { failsafeRoute: () => ({ ok: false }) }));
  eq([out.score, out.grade, out.ready], [70, 'F', false], 'דוגמה 2: ציון');
  eq(out.failing.map((c) => c.key), ['failsafe'], 'דוגמה 2: failing');
  eq(out.failing[0].detail, 'אין מנהל — מבוי-סתום אפשרי', 'דוגמה 2: detail');
}

// 3) hardening כבוי (high) ⇒ score=80, grade='C', ready=true
{
  const out = trustReport(bundle, {}, mkEng({}));
  eq([out.score, out.grade, out.ready], [80, 'C', true], 'דוגמה 3: כשל-high לא חוסם');
}

// 4) recording פעיל ⇒ בדיקה שישית שתמיד pass=false; score=round(10/12*100)=83
{
  const out = trustReport(bundle, {}, mkEng({ 'voice.hardening': true, recording: true },
    { recordingEncryption: () => ({ enabled: true }) }));
  const rec = out.checks.find((c) => c.key === 'recording-encryption');
  eq([out.checks.length, rec.pass, out.score, out.grade], [6, false, 83, 'C'], 'דוגמה 4: ציון');
  if (!rec.detail.startsWith('מוגדר אך דורמנטי')) { console.error(`✗ דוגמה 4: detail ⇒ ${rec.detail}`); f = 1; }
}

// 5) כשרות תקינה ⇒ kosher-integrity pass; 12/12 ⇒ 100 'A'
{
  const b = { tenant: { tenantId: 't1', numbers: [{ kosher: true, onramp: 'sim-in-gateway', gatewayChannel: 2, channels: ['voice'] }] }, files: {} };
  const out = trustReport(b, {}, mkEng({ 'voice.hardening': true, 'voice.kosher': true }));
  const k = out.checks.find((c) => c.key === 'kosher-integrity');
  eq([k.pass, out.score, out.grade], [true, 100, 'A'], 'דוגמה 5: כשרות');
}

// 6) env+peers — קריאות-השקעים המדויקות + כשל-סודות ⇒ 'F'
{
  const env = { K: 'v' };
  const peer = { tenant: { tenantId: 't2' } };
  let pfArgs = null, leakArgs = null;
  const out = trustReport(bundle, { env, peers: [peer] }, mkEng({ 'voice.hardening': true }, {
    secretPreflight: (bundles, e) => { pfArgs = [bundles, e]; return { ok: false, missing: ['A', 'B'] }; },
    crossTenantLeakScan: (bundles) => { leakArgs = bundles; return { clean: true, violations: [] }; },
  }));
  if (pfArgs[0].length !== 1 || pfArgs[0][0] !== bundle || pfArgs[1] !== env) { console.error('✗ דוגמה 6: secretPreflight נקרא שגוי'); f = 1; }
  if (leakArgs.length !== 2 || leakArgs[0] !== bundle || leakArgs[1] !== peer) { console.error('✗ דוגמה 6: crossTenantLeakScan נקרא שגוי'); f = 1; }
  const sec = out.checks.find((c) => c.key === 'secrets');
  eq([out.grade, out.ready, sec.detail], ['F', false, 'חסרים 2 (שער-דומם)'], 'דוגמה 6: כשל-סודות');
}

// 7) route-closure בכשל — איחוד רשימות-היתומים
{
  const out = trustReport(bundle, {}, mkEng({ 'voice.hardening': true }, {
    auditRoutes: () => ({ ok: false, dangling: ['x'], orphanTransfers: ['y'], missingGateways: ['z'] }),
  }));
  eq(out.checks[0].detail, 'יתומים: x, y, z', 'דוגמה 7: detail יתומים');
}

if (f) process.exit(1);
console.log('✓ trust-report: 7 דוגמאות-חוזה — ירוק');
