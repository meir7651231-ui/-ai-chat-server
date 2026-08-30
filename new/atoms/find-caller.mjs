/** חוט · find-caller — זיהוי-מתקשר לפי מספר: משפחה→בן-משפחה→תורם→מתנדב→רכז.
 *  חוזה: find-caller.contract.md
 *  חולץ כלשונו מ-maor/src/lib/callerId.ts:70-112 (תורגם TS→JS);
 *  השכן phoneKey הוזרק כשקע (חוק-1 — אפס import פנימי). */
export function findCaller(db, raw, phoneKey, T) {
    const key = phoneKey(raw);
    if (key.length < 6)
        return null; // קצר מדי = לא בר-התאמה בטוחה (הימנעות מ-false-positive)
    const hit = (p) => !!p && phoneKey(p) === key;
    for (const f of db.families) {
        if (hit(f.phone) || hit(f.phone2)) {
            return { kind: T.k1, name: f.name, phone: f.phone || f.phone2, id: f.id, view: T.k2, famId: f.id };
        }
    }
    for (const f of db.families) {
        for (const m of f.members || []) {
            if (hit(m.phone) || hit(m.phone2)) {
                return { kind: T.k3, name: m.first + ' · ' + f.name, phone: m.phone || m.phone2, id: m.id, view: T.k2, famId: f.id };
            }
        }
    }
    for (const s of db.supporters) {
        if (hit(s.phone))
            return { kind: T.k4, name: s.name, phone: s.phone, id: s.id, view: T.k5 };
    }
    for (const v of db.volunteers || []) {
        if (hit(v.phone))
            return { kind: T.k6, name: v.name, phone: v.phone, id: v.id, view: T.k7 };
    }
    for (const c of db.tzCoordinators || []) {
        if (hit(c.phone))
            return { kind: T.k8, name: c.name, phone: c.phone, id: c.id, view: T.k9 };
    }
    return null;
}
