/** חוט · trust-report — דוח-אמון פר-עמותה (טלפוניה · item 18): כרטיס-אמון לוועד.
 *  חוזה: trust-report.contract.md
 *  חולץ כלשונו מ-maor/telephony/lib/report.mjs:22-81 (המקור הטהור;
 *  ‏src/lib/telephony/engine.ts:92 הוא רק re-export מוקלד). השכנים
 *  featureOn/auditRoutes/failsafeRoute/recordingEncryption/secretPreflight/
 *  crossTenantLeakScan הוזרקו כאובייקט-שקעים eng (חוק-1 — אפס import פנימי).
 *  הקבוע הפרטי SEV הוא חלק מהיחידה — נשאר בקובץ. */

// חומרת-כשל פר-בדיקה: critical=חוסם-חי · high=סיכון · info=מידע.
const SEV = { critical: 3, high: 2, info: 1 };

export function trustReport(bundle, opt = {}, eng = {}) {
  const { featureOn, auditRoutes, failsafeRoute, recordingEncryption, secretPreflight, crossTenantLeakScan } = eng;
  const tenant = bundle.tenant || {};
  const checks = [];
  const add = (key, label, pass, severity, detail) => checks.push({ key, label, pass: !!pass, severity, detail });

  // 1. סגירת-מסלולים (⭐1) — אין גשר/transfer/שער יתום.
  const ar = auditRoutes(bundle);
  add('route-closure', 'סגירת-מסלולים (אין ניתוב-יתום)', ar.ok, 'critical',
    ar.ok ? 'כל גשר/transfer/שער מוביל ליעד-קיים' : `יתומים: ${[...ar.dangling, ...ar.orphanTransfers, ...ar.missingGateways].join(', ')}`);

  // 2. מסלול-חירום (fail-safe) — תמיד יש מנהל לחזור אליו.
  const fs = failsafeRoute(tenant);
  add('failsafe', 'מסלול-חירום (השיחה תמיד עונה)', fs.ok, 'critical', fs.ok ? `נפילה למנהל ${fs.fallback}` : 'אין מנהל — מבוי-סתום אפשרי');

  // 3. תקרות-toll-fraud — הגנת חשבון-הסלולר.
  const toll = featureOn(tenant, 'voice.hardening');
  add('toll-caps', 'תקרות חיוג-יוצא (toll-fraud)', toll, 'high', toll ? 'בו-זמניות+משך מוגבלים' : 'כבוי — cred-גנוב יכול להצטבר (voice.hardening)');

  // 4. שלמות-כשרות — מצב-כשר עם SIM-כשר ליציאה.
  if (featureOn(tenant, 'voice.kosher')) {
    const hasK = (tenant.numbers || []).some((n) => n.kosher && n.onramp === 'sim-in-gateway' && Number.isInteger(n.gatewayChannel) && (n.channels || []).includes('voice'));
    add('kosher-integrity', 'שלמות-כשרות (יציאה כשרה)', hasK, 'high', hasK ? 'יש SIM-כשר ליציאה' : 'מצב-כשר בלי SIM-כשר — יציאה מושבתת');
  }

  // 5. הצפנת-הקלטות (במנוחה) — רק אם הקלטה פעילה. **נחיל-5 F4:** הדיאלפלן כותב .wav
  // גולמי ל-recordings_dir (generate: record_session **בלי** REC_KEY) ⇒ הצפנת-המנוחה
  // היא מודל-דורמנטי טרם-מחווט (כמו הצפנת-הענן של מאור). אסור להצהיר לוועד "AES-256-GCM
  // פעיל" על-סמך דגל-הקונפיג בלבד — זו הצהרה בלתי-ניתנת-לאימות. pass:false בשני המצבים.
  if (featureOn(tenant, 'recording')) {
    const rec = recordingEncryption(tenant);
    add('recording-encryption', 'הצפנת-הקלטות', false, 'high', rec.enabled
      ? 'מוגדר אך דורמנטי — record_session כותב .wav גולמי, REC_KEY טרם מחווט (חלון-בעלים)'
      : 'הקלטות פעילות בלי הצפנה');
  }

  // 6. preflight-סודות — env מלא (אם נמסר).
  if (opt.env) {
    const pf = secretPreflight([bundle], opt.env);
    add('secrets', 'סודות-סביבה מוזרקים', pf.ok, 'critical', pf.ok ? 'כל הסודות קיימים' : `חסרים ${pf.missing.length} (שער-דומם)`);
  }

  // 7. בידוד חוצה-דיירים — אם נמסרו peers.
  if (Array.isArray(opt.peers) && opt.peers.length) {
    const leak = crossTenantLeakScan([bundle, ...opt.peers]);
    add('isolation', 'בידוד חוצה-דיירים', leak.clean, 'critical', leak.clean ? 'אין דליפת-סוד/זהות בין-לקוחות' : `${leak.violations.length} דליפות`);
  }

  // 8. אינווריאנטים (תמיד עוברים — הצהרה לוועד).
  add('downstream', 'pure-downstream (אין תלות-ספק)', true, 'info', 'מדבר רק עם ציוד-הלקוח');
  add('cti-readonly', 'זיהוי-מתקשר קריאה-בלבד', true, 'info', 'לעולם לא כותב למאור');

  const failing = checks.filter((c) => !c.pass);
  // ציון: משוקלל לפי חומרה (critical=3, high=2, info=1).
  const totalW = checks.reduce((s, c) => s + SEV[c.severity], 0);
  const gotW = checks.reduce((s, c) => s + (c.pass ? SEV[c.severity] : 0), 0);
  const score = totalW ? Math.round((gotW / totalW) * 100) : 100;
  const anyCritical = failing.some((c) => c.severity === 'critical');
  const grade = anyCritical ? 'F' : score >= 95 ? 'A' : score >= 85 ? 'B' : score >= 70 ? 'C' : 'D';
  return { tenantId: tenant.tenantId, checks, failing, score, grade, ready: !anyCritical };
}
