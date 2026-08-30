/** חוט · trust-report — דוח-אמון פר-עמותה (טלפוניה · item 18): כרטיס-אמון לוועד.
 *  חוזה: trust-report.contract.md
 *  חולץ כלשונו מ-maor/telephony/lib/report.mjs:22-81 (המקור הטהור;
 *  ‏src/lib/telephony/engine.ts:92 הוא רק re-export מוקלד). השכנים
 *  featureOn/auditRoutes/failsafeRoute/recordingEncryption/secretPreflight/
 *  crossTenantLeakScan הוזרקו כאובייקט-שקעים eng (חוק-1 — אפס import פנימי).
 *  הקבוע הפרטי SEV הוא חלק מהיחידה — נשאר בקובץ. */

// חומרת-כשל פר-בדיקה: critical=חוסם-חי · high=סיכון · info=מידע.

export function trustReport(bundle, opt = {}, eng = {}, T) {
  // 🪺 עוזרים קוננו פנימה (מנוע-הטיהור v4) — שקעי-הדאטה נראים להם דרך הסגירה
  const SEV = { critical: 3, high: 2, info: 1 };

  const { featureOn, auditRoutes, failsafeRoute, recordingEncryption, secretPreflight, crossTenantLeakScan } = eng;
  const tenant = bundle.tenant || {};
  const checks = [];
  const add = (key, label, pass, severity, detail) => checks.push({ key, label, pass: !!pass, severity, detail });

  // 1. סגירת-מסלולים (⭐1) — אין גשר/transfer/שער יתום.
  const ar = auditRoutes(bundle);
  add(T.k1, T.k2, ar.ok, T.k3,
    ar.ok ? T.k4 : `${T.k39}${[...ar.dangling, ...ar.orphanTransfers, ...ar.missingGateways].join(', ')}`);

  // 2. מסלול-חירום (fail-safe) — תמיד יש מנהל לחזור אליו.
  const fs = failsafeRoute(tenant);
  add(T.k5, T.k6, fs.ok, T.k3, fs.ok ? `${T.k40}${fs.fallback}` : T.k7);

  // 3. תקרות-toll-fraud — הגנת חשבון-הסלולר.
  const toll = featureOn(tenant, T.k8);
  add(T.k9, T.k10, toll, T.k11, toll ? T.k12 : T.k13);

  // 4. שלמות-כשרות — מצב-כשר עם SIM-כשר ליציאה.
  if (featureOn(tenant, T.k14)) {
    const hasK = (tenant.numbers || []).some((n) => n.kosher && n.onramp === T.k15 && Number.isInteger(n.gatewayChannel) && (n.channels || []).includes(T.k16));
    add(T.k17, T.k18, hasK, T.k11, hasK ? T.k19 : T.k20);
  }

  // 5. הצפנת-הקלטות (במנוחה) — רק אם הקלטה פעילה. **נחיל-5 F4:** הדיאלפלן כותב .wav
  // גולמי ל-recordings_dir (generate: record_session **בלי** REC_KEY) ⇒ הצפנת-המנוחה
  // היא מודל-דורמנטי טרם-מחווט (כמו הצפנת-הענן של מאור). אסור להצהיר לוועד "AES-256-GCM
  // פעיל" על-סמך דגל-הקונפיג בלבד — זו הצהרה בלתי-ניתנת-לאימות. pass:false בשני המצבים.
  if (featureOn(tenant, T.k21)) {
    const rec = recordingEncryption(tenant);
    add(T.k22, T.k23, false, T.k11, rec.enabled
      ? T.k24
      : T.k25);
  }

  // 6. preflight-סודות — env מלא (אם נמסר).
  if (opt.env) {
    const pf = secretPreflight([bundle], opt.env);
    add(T.k26, T.k27, pf.ok, T.k3, pf.ok ? T.k28 : `${T.k41}${pf.missing.length}${T.k42}`);
  }

  // 7. בידוד חוצה-דיירים — אם נמסרו peers.
  if (Array.isArray(opt.peers) && opt.peers.length) {
    const leak = crossTenantLeakScan([bundle, ...opt.peers]);
    add(T.k29, T.k30, leak.clean, T.k3, leak.clean ? T.k31 : `${leak.violations.length}${T.k43}`);
  }

  // 8. אינווריאנטים (תמיד עוברים — הצהרה לוועד).
  add(T.k32, T.k33, true, T.k34, T.k35);
  add(T.k36, T.k37, true, T.k34, T.k38);

  const failing = checks.filter((c) => !c.pass);
  // ציון: משוקלל לפי חומרה (critical=3, high=2, info=1).
  const totalW = checks.reduce((s, c) => s + SEV[c.severity], 0);
  const gotW = checks.reduce((s, c) => s + (c.pass ? SEV[c.severity] : 0), 0);
  const score = totalW ? Math.round((gotW / totalW) * 100) : 100;
  const anyCritical = failing.some((c) => c.severity === T.k3);
  const grade = anyCritical ? 'F' : score >= 95 ? 'A' : score >= 85 ? 'B' : score >= 70 ? 'C' : 'D';
  return { tenantId: tenant.tenantId, checks, failing, score, grade, ready: !anyCritical };
}
