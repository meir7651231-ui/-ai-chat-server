/** חוט · merge-supporters-by-fields — מיזוג קבוצת-תורמים לפי בחירת-שדות; כל הכסף נשמר.
 *  חוזה: merge-supporters-by-fields.contract.md
 *  חולץ כלשונו מ-maor/src/lib/dedup.ts:430-453; השכנים הוזרקו כשקעים (חוק-1):
 *  mergeSupportersGroup (מיזוג-הבסיס הבטוח) · supDupFieldValue (הכרעת ערך-שדה
 *  edit/pick/ראשון-עם-ערך) · supDupFields (רשימת הגדרות-השדות הסקלריים —
 *  במקור הקבוע SUP_DUP_FIELDS; חוק-5 — הרכב-הרשימה = ידע-קופסה). */
export function mergeSupportersByFields(sups, pick, edit, mergeSupportersGroup, supDupFieldValue, supDupFields) {
    const base = mergeSupportersGroup(sups[0], sups.slice(1));
    const out = { ...base };
    for (const def of supDupFields) {
        const val = supDupFieldValue(sups, def, pick, edit);
        switch (def.key) {
            case 'name':
                out.name = val;
                break;
            case 'phone':
                out.phone = val;
                break;
            case 'email':
                out.email = val;
                break;
            case 'idNum':
                out.idNum = val;
                break;
            case 'city':
                out.city = val;
                break;
            case 'address':
                out.address = val;
                break;
            case 'cat':
                out.cat = val;
                break;
            case 'forWho':
                out.forWho = val;
                break;
            case 'notes':
                out.notes = val;
                break;
        }
    }
    return out;
}
