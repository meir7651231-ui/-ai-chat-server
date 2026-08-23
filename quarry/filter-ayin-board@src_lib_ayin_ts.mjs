/** 🪨 טיוטת-חוט (דרגת-מחצבה) · filterAyinBoard — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/ayin.ts:358-379 (22 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): filterAyinBoard, normSearch
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function filterAyinBoard(items, q, status, stage) {
    const nq = normSearch(q);
    return items.filter((it) => {
        if (status === 'wait' && it.done)
            return false;
        if (status === 'done' && !it.done)
            return false;
        if (stage && it.stage !== stage)
            return false;
        if (!nq)
            return true;
        return normSearch([it.supporter, it.name, it.note].join(' ')).includes(nq);
    });
}
/* ── גיליון העיניים — ייצוא/ייבוא round-trip (feature supporters.ayin.sheet) ──
   ratchet: ייצוא verbatim מ-legacy-main-script.js:196-198 (exportImportFormat,
   kind==='ayin'), ייבוא מ-legacy:852-869 (processImport) והחלה מ-legacy:983-993
   (applyImport). שם הקובץ: maor-ayin-eyes.csv. */
/** כותרת הגיליון — בדיוק כמו בלגאסי (legacy:196). */
