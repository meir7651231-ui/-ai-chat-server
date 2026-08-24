/** חוט · find-caller — זיהוי-מתקשר לפי מספר: משפחה→בן-משפחה→תורם→מתנדב→רכז.
 *  חוזה: find-caller.contract.md
 *  חולץ כלשונו מ-maor/src/lib/callerId.ts:70-112 (תורגם TS→JS);
 *  השכן phoneKey הוזרק כשקע (חוק-1 — אפס import פנימי). */
export function findCaller(db, raw, phoneKey) {
    const key = phoneKey(raw);
    if (key.length < 6)
        return null; // קצר מדי = לא בר-התאמה בטוחה (הימנעות מ-false-positive)
    const hit = (p) => !!p && phoneKey(p) === key;
    for (const f of db.families) {
        if (hit(f.phone) || hit(f.phone2)) {
            return { kind: 'family', name: f.name, phone: f.phone || f.phone2, id: f.id, view: 'families', famId: f.id };
        }
    }
    for (const f of db.families) {
        for (const m of f.members || []) {
            if (hit(m.phone) || hit(m.phone2)) {
                return { kind: 'member', name: m.first + ' · ' + f.name, phone: m.phone || m.phone2, id: m.id, view: 'families', famId: f.id };
            }
        }
    }
    for (const s of db.supporters) {
        if (hit(s.phone))
            return { kind: 'supporter', name: s.name, phone: s.phone, id: s.id, view: 'supporters' };
    }
    for (const v of db.volunteers || []) {
        if (hit(v.phone))
            return { kind: 'volunteer', name: v.name, phone: v.phone, id: v.id, view: 'shop7' };
    }
    for (const c of db.tzCoordinators || []) {
        if (hit(c.phone))
            return { kind: 'coordinator', name: c.name, phone: c.phone, id: c.id, view: 'tzedaka' };
    }
    return null;
}
