/** חוט · merge-supporters-by-fields — מיזוג קבוצת-תורמים לפי בחירת-שדות; כל הכסף נשמר.
 *  חוזה: merge-supporters-by-fields.contract.md
 *  חולץ כלשונו מ-maor/src/lib/dedup.ts:430-453; השכנים הוזרקו כשקעים (חוק-1):
 *  mergeSupportersGroup (מיזוג-הבסיס הבטוח) · supDupFieldValue (הכרעת ערך-שדה
 *  edit/pick/ראשון-עם-ערך) · supDupFields (רשימת הגדרות-השדות הסקלריים —
 *  במקור הקבוע SUP_DUP_FIELDS; חוק-5 — הרכב-הרשימה = ידע-קופסה). */
export function mergeSupportersByFields(sups, pick, edit, mergeSupportersGroup, supDupFieldValue, supDupFields, T) {
    const base = mergeSupportersGroup(sups[0], sups.slice(1));
    const out = { ...base };
    for (const def of supDupFields) {
        const val = supDupFieldValue(sups, def, pick, edit);
        switch (def.key) {
            case T.k1:
                out.name = val;
                break;
            case T.k2:
                out.phone = val;
                break;
            case T.k3:
                out.email = val;
                break;
            case T.k4:
                out.idNum = val;
                break;
            case T.k5:
                out.city = val;
                break;
            case T.k6:
                out.address = val;
                break;
            case T.k7:
                out.cat = val;
                break;
            case T.k8:
                out.forWho = val;
                break;
            case T.k9:
                out.notes = val;
                break;
        }
    }
    return out;
}
