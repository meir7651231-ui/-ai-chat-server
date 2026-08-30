/** חוט · preview-telephony — תצוגה-מקדימה חיה לקונפיג-טלפוניה (סימולטור+דוח-אמון).
 *  חוזה: preview-telephony.contract.md
 *  שקעים: telephonyToTenant, anchorToday, validateTenant, buildTenant, explainCall, trustReport
 *  חולץ כלשונו מ-maor/src/components/telephony/lib.ts:133-185 (קריאות-השכן שוקעו;
 *  anchorToday הפרטי — מקור אי-הדטרמיניזם — הוזרק אף הוא). */
export function previewTelephony(tc, orgName, tenantId, telephonyToTenant, anchorToday, validateTenant, buildTenant, explainCall, trustReport, T, caller) {
    const raw = telephonyToTenant(tc, orgName, tenantId);
    const anchor = anchorToday();
    const opts = { anchorDate: anchor, calendarWindow: T.k6 };
    const v = validateTenant(raw);
    if (!v.ok)
        return { ok: false, errors: v.errors, warnings: v.warnings, rows: [], trust: null, files: null };
    const tenant = v.tenant;
    const built = buildTenant(raw, opts);
    const voiceDid = (tc.numbers.find((n) => n.kind === T.k1 || n.kind === T.k2) || tc.numbers[0])?.e164 || '';
    // תרחישים מייצגים: יום-חול בשעות · יום-חול אחרי-שעות · שבת (אם מגודר).
    const rows = [];
    const scenarios = [
        { when: T.k3, call: { did: voiceDid, callerId: caller, dow: 2, hhmm: '10:00' } },
        { when: T.k4, call: { did: voiceDid, callerId: caller, dow: 2, hhmm: '20:00' } },
        { when: T.k5, call: { did: voiceDid, callerId: caller, dow: 6, hhmm: '11:00' } },
    ];
    for (const s of scenarios) {
        const e = explainCall(tenant, s.call, opts);
        rows.push({ when: s.when, caller, summary: e.summary, outcome: e.outcome });
    }
    let trust = null;
    if (built.ok) {
        const tr = trustReport(built);
        trust = {
            grade: tr.grade,
            score: tr.score,
            ready: tr.ready,
            failing: tr.failing.map((c) => ({ label: c.label, detail: c.detail, severity: c.severity })),
        };
    }
    return { ok: true, errors: [], warnings: built.warnings || v.warnings || [], rows, trust, files: built.files || null };
}
