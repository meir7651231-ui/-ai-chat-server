/** 🪨 טיוטת-חוט (דרגת-מחצבה) · telephonyToTenant — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/telephony/lib.ts:68-132 (65 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): telephonyToTenant, anchorToday, getFullYear, getMonth, getDate
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function telephonyToTenant(tc, orgName, tenantId) {
    let gw = 0;
    const numbers = (tc.numbers || [])
        .filter((n) => n.e164 && n.e164.trim())
        .map((n) => {
        const base = {
            id: n.id,
            e164: n.e164.trim(),
            label: n.label || n.id,
            type: n.kind,
            onramp: ONRAMP[n.kind],
            channels: CHANNELS[n.kind],
            ...(n.kosher ? { kosher: true } : {}),
        };
        if (n.kind === 'sim') {
            gw += 1;
            base.gatewayChannel = gw;
        }
        return base;
    });
    const firstSim = numbers.find((n) => n.onramp === 'sim-in-gateway');
    const features = {
        'voice.kosher': tc.kosherMode,
        'calendar.hebrew': tc.hebrewCalendar,
        'calendar.shabbat': tc.shabbat,
        'calendar.fasts': tc.fasts,
        'calendar.zmanim': tc.zmanim,
        voicemail: tc.voicemail,
    };
    return {
        tenantId,
        orgName: orgName || 'ארגון',
        timezone: 'Asia/Jerusalem',
        ...(tc.city ? { city: tc.city } : {}),
        officeHours: { days: [...tc.officeDays].sort((a, b) => a - b), start: tc.officeStart, end: tc.officeEnd },
        numbers,
        destinations: {
            office: { ext: [tc.officeExt], ringSeconds: 25 },
            manager: { ext: tc.managerExt, ringSeconds: 30 },
            voicemail: { box: tc.vmBox },
        },
        outbound: { defaultNumberId: firstSim ? firstSim.id : (numbers[0]?.id ?? 'n1') },
        cti: { org: tenantId, mode: 'directory' },
        features,
    };
}
// עוגן-לוח דטרמיניסטי לתצוגה-המקדימה (12 חודשים קדימה מהיום). לא נשמר — רק לתצוגה.
function anchorToday() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
/**
 * תצוגה-מקדימה חיה: בונה tenant, מריץ סימולטור-שיחה על תרחישים מייצגים (בשעות/
 * אחרי-שעות/שבת), ומחשב דוח-אמון. הכול בדפדפן, בלי PBX. downstream — קריאה-בלבד.
 */
