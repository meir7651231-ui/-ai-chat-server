/** קופסת-חיבורים · broadcast — הורכבה במנוע-הרכבת-הקופסאות (הכרעה 19).
 *  מוצא: src/components/courses/broadcast.ts · קובץ-עצמאי (type-imports בלבד) ⇒ TS→JS ביט-התנהגותי. */
import { S } from '../atoms/broadcast-strings.mjs';
export function classContacts(db, courseId) {
    const out = [];
    const seenPhone = new Set();
    for (const e of db.enrollments) {
        if (e.courseId !== courseId || e.status === S.k0 || e.status === S.k1)
            continue;
        for (const f of db.families) {
            const m = f.members.find((x) => x.id === e.memberId);
            if (!m)
                continue;
            const phone = f.phone || m.phone || '';
            if (phone && seenPhone.has(phone))
                break; // אותה משפחה — הודעה אחת
            if (phone)
                seenPhone.add(phone);
            out.push({ id: e.id, name: m.first + ' · ' + f.name, phone });
            break;
        }
    }
    return out;
}
/** נוסח-פתיחה לברירת-מחדל להודעת-כיתה. */
export function defaultClassMessage(courseName, orgName) {
    return S.k2 + (orgName || S.k3) + S.k4 + courseName + '": ';
}
/** רשימת-טלפונים להעתקה (מדולגים ריקים). */
export function classPhonesText(contacts) {
    return contacts.map((c) => c.phone).filter(Boolean).join(', ');
}
