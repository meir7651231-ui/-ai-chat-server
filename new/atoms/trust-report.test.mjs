import { trustReport as __pure_trustReport } from './trust-report.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_trustReport_TRUST_REPORT_T = {
  k1: "route-closure",
  k2: "סגירת-מסלולים (אין ניתוב-יתום)",
  k3: "critical",
  k4: "כל גשר/transfer/שער מוביל ליעד-קיים",
  k5: "failsafe",
  k6: "מסלול-חירום (השיחה תמיד עונה)",
  k7: "אין מנהל — מבוי-סתום אפשרי",
  k8: "voice.hardening",
  k9: "toll-caps",
  k10: "תקרות חיוג-יוצא (toll-fraud)",
  k11: "high",
  k12: "בו-זמניות+משך מוגבלים",
  k13: "כבוי — cred-גנוב יכול להצטבר (voice.hardening)",
  k14: "voice.kosher",
  k15: "sim-in-gateway",
  k16: "voice",
  k17: "kosher-integrity",
  k18: "שלמות-כשרות (יציאה כשרה)",
  k19: "יש SIM-כשר ליציאה",
  k20: "מצב-כשר בלי SIM-כשר — יציאה מושבתת",
  k21: "recording",
  k22: "recording-encryption",
  k23: "הצפנת-הקלטות",
  k24: "מוגדר אך דורמנטי — record_session כותב .wav גולמי, REC_KEY טרם מחווט (חלון-בעלים)",
  k25: "הקלטות פעילות בלי הצפנה",
  k26: "secrets",
  k27: "סודות-סביבה מוזרקים",
  k28: "כל הסודות קיימים",
  k29: "isolation",
  k30: "בידוד חוצה-דיירים",
  k31: "אין דליפת-סוד/זהות בין-לקוחות",
  k32: "downstream",
  k33: "pure-downstream (אין תלות-ספק)",
  k34: "info",
  k35: "מדבר רק עם ציוד-הלקוח",
  k36: "cti-readonly",
  k37: "זיהוי-מתקשר קריאה-בלבד",
  k38: "לעולם לא כותב למאור",
};
const trustReport = (...a) => __pure_trustReport(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_trustReport_TRUST_REPORT_T);
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
