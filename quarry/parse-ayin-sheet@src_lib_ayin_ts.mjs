/** 🪨 טיוטת-חוט (דרגת-מחצבה) · parseAyinSheet — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/ayin.ts:443-501 (59 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): parseAyinSheet, clean, hIdx, normName
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function parseAyinSheet(rows, supporters) {
    if (rows.length < 2)
        return { upds: [], miss: 0, error: 'הקובץ ריק או לא בפורמט CSV' };
    const clean = (x) => (x ?? '').replace(/\s+/g, ' ').trim();
    const header = (rows[0] ?? []).map((h) => clean(h));
    const hIdx = (keys) => header.findIndex((h) => keys.some((k) => h.includes(k)));
    const iSup = hIdx(['תומכת', 'תומך']);
    const iNm = hIdx(['שם למסירה', 'שם לעופרת', 'שם']);
    const iEyes = hIdx(['עיניים']);
    const iDone = hIdx(['נמסר']);
    const iPaid = hIdx(['שולם', 'תשלום']);
    const iAns = hIdx(['תשובה', 'הערה']);
    const iLead = hIdx(['עופרת']);
    if (iNm < 0 || iEyes < 0) {
        return { upds: [], miss: 0, error: 'חסרות עמודות "שם למסירה" ו/או "כמה עיניים"' };
    }
    const yes = (v) => /כן|yes|✓|v|שולם/i.test(v);
    const upds = [];
    let miss = 0;
    for (let r = 1; r < rows.length; r++) {
        const row = rows[r] ?? [];
        const supN = clean(iSup >= 0 ? row[iSup] : '');
        const nm = clean(row[iNm]);
        if (!nm)
            continue;
        const raw = clean(row[iEyes]);
        const eyes = /^\d+$/.test(raw) ? +raw : null;
        const doneRaw = clean(iDone >= 0 ? row[iDone] : '');
        const paidRaw = iPaid >= 0 ? clean(row[iPaid]) : '';
        const ansRaw = iAns >= 0 ? clean(row[iAns]) : '';
        const leadRaw = iLead >= 0 ? clean(row[iLead]) : '';
        const sp = supporters.find((x) => (!supN || normName(x.name) === normName(supN)) &&
            (x.ayin?.names ?? []).some((n) => normName(n.name) === normName(nm)));
        if (!sp) {
            miss++;
            continue;
        }
        const rec = (sp.ayin?.names ?? []).find((n) => normName(n.name) === normName(nm));
        if (eyes == null && !doneRaw && !paidRaw && !ansRaw && !leadRaw)
            continue;
        upds.push({
            supporterId: sp.id,
            nameId: rec.id,
            eyes,
            done: doneRaw ? yes(doneRaw) : null,
            paid: paidRaw ? yes(paidRaw) : null,
            answer: ansRaw || null,
            lead: leadRaw ? yes(leadRaw) : null,
        });
    }
    return { upds, miss };
}
/**
 * החלת העדכונים — טהורה ואימוטבילית, בדיוק לפי legacy:983-993:
 * eyes השתנה → unshift ל-log {date,eyes,name}; done; paid ברמת התיק; answer עם
 * דה-דופ מול ההערות הקיימות + answeredNote; lead='כן' ו-stage ∉ {eyes,answer,done}
 * → stage='eyes'; תמיד lastTouch=today. מחזירה גם את ספירת רישומי ה-log.
 */
