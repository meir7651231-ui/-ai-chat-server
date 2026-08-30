/** חוט · validate-heb-month-names — סריקת שנה עברית לאיתור שמות-חודשי-Intl לא-מוכרים.
 *  חוזה: validate-heb-month-names.contract.md
 *  חולץ כלשונו מ-maor/src/lib/hebdate.ts:125-137 (תורגם TS→JS); השכנים
 *  hebParts/KNOWN_MONTHS_EN הוזרקו כשקעים וברירת-המחדל hebYearNow() הפכה
 *  לחיווט (חוק-1 — אפס import פנימי). שער-console.warn ברמת-המודול = חיווט. */
export function validateHebMonthNames(hebYear, hebParts, knownMonths, T) {
    const known = knownMonths;
    const unknown = [];
    const seen = new Set();
    const gy = hebYear - T.k1;
    for (let i = 0; i < T.k2; i++) {
        const p = hebParts(new Date(gy, 7, 1 + i, T.k3));
        if (p.year !== hebYear || seen.has(p.month))
            continue;
        seen.add(p.month);
        if (!known.has(p.month))
            unknown.push(p.month);
    }
    return unknown;
}
