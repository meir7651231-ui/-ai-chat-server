/** 🪨 טיוטת-חוט (דרגת-מחצבה) · allSupPhones — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/supporters/lib.ts:284-294 (11 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): allSupPhones, phoneRegion
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function allSupPhones(sp) {
    const rows = [];
    if (sp.phone)
        rows.push({ num: sp.phone, label: '', note: '', wa: false, region: phoneRegion(sp.phone), primary: true });
    for (const p of sp.phones ?? []) {
        if (!p.num)
            continue;
        rows.push({ num: p.num, label: p.label ?? '', note: p.note ?? '', wa: !!p.wa, region: phoneRegion(p.num), primary: false });
    }
    return rows;
}
/** האם לתורם יש מספר באזור המבוקש (לסינון חול/ישראל בלוח התורמים). */
