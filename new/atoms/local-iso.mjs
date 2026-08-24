/** חוט · local-iso — Date ⇒ ISO מקומי (YYYY-MM-DD), האצלה למקור-האמת.
 *  חוזה: local-iso.contract.md
 *  חולץ כלשונו מ-maor/src/components/diary/lib.ts:25-27; השכן isoLocal
 *  (date-util) הוזרק כשקע (חוק-1 — אפס import פנימי). */
export function localIso(d, isoLocal) {
    return isoLocal(d);
}
