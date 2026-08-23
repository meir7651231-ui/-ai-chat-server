/** 🪨 טיוטת-חוט (דרגת-מחצבה) · previewTelephony — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/telephony/lib.ts:133-185 (53 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): previewTelephony, telephonyToTenant, anchorToday, validateTenant, buildTenant, explainCall, trustReport
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function previewTelephony(tc, orgName, tenantId) {
    const raw = telephonyToTenant(tc, orgName, tenantId);
    const anchor = anchorToday();
    const opts = { anchorDate: anchor, calendarWindow: 400 };
    const v = validateTenant(raw);
    if (!v.ok)
        return { ok: false, errors: v.errors, warnings: v.warnings, rows: [], trust: null, files: null };
    const tenant = v.tenant;
    const built = buildTenant(raw, opts);
    const voiceDid = (tc.numbers.find((n) => n.kind === 'sim' || n.kind === 'virtual') || tc.numbers[0])?.e164 || '';
    const caller = '050-1234567';
    // תרחישים מייצגים: יום-חול בשעות · יום-חול אחרי-שעות · שבת (אם מגודר).
    const rows = [];
    const scenarios = [
        { when: 'יום שלישי 10:00 (בשעות)', call: { did: voiceDid, callerId: caller, dow: 2, hhmm: '10:00' } },
        { when: 'יום שלישי 20:00 (אחרי-שעות)', call: { did: voiceDid, callerId: caller, dow: 2, hhmm: '20:00' } },
        { when: 'שבת 11:00', call: { did: voiceDid, callerId: caller, dow: 6, hhmm: '11:00' } },
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
/**
 * הסגירה ההלכתית הבאה (שבת/יו״ט) בחלון 10 הימים הקרובים — לווידג'ט-הבית
 * "זמני שבת/חג". רץ על מנוע-הזמנים הטהור (NOAA, חישוב-מקומי בלבד — downstream,
 * אין ספק/שירות). דורש עיר-עוגן; בלי telephony ⇒ null (אין נ״צ). דטרמיניסטי.
 * @param config קונפיג-הארגון (config.telephony.city) @param todayIso עוגן היום
 */
