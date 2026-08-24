/** חוט · merge-supporter-into — מיזוג שני כרטיסי-תומך: כל הכסף ל"שומר", הצבירה מחושבת-מחדש.
 *  חוזה: merge-supporter-into.contract.md
 *  חולץ כלשונו מ-maor/src/lib/dedup.ts:342-387; השכנים הוזרקו כשקעים (חוק-1):
 *  mergeHist (מיזוג-היסטוריה אידמפוטנטי — האטום merge-hist) · photoMax (תקרת-
 *  התמונות של האפליקציה; במקור PHOTO_MAX=5 — ידע-הצבה, חוק-5: מוזרק בקופסה). */
export function mergeSupporterInto(keep, drop, mergeHist, photoMax) {
    const donations = [...keep.donations, ...drop.donations].sort((a, b) => a.date.localeCompare(b.date));
    // 🐛 (21.8): ההיסטוריה שורשרה כמו-שהיא — אותו חיוב-סליקה שישב על **שני** כרטיסי-
    // הכפילות (ייבוא לשניהם) נספר פעמיים ב-supIls לנצח אחרי המיזוג. mergeHist
    // האידמפוטנטי (מפתח d|a|c, כמות=max) הוא אותו-כלל כמו בייבוא — עסקת-אמת כפולה
    // באותו כרטיס נשמרת, כפל-בין-כרטיסים מתמזג.
    const hist = mergeHist(keep.hist ?? [], drop.hist ?? []);
    // 🐛 (21.8): photos של הנמחק נזרקו בשקט (כל שדה-תוכן אחר ניצל) — איחוד עד
    // תקרת-האפליקציה (photoMax), של השומר קודם; nextNote — של השומר גובר, ריק ⇒ של הנמחק.
    const photos = [...new Set([...(keep.photos ?? []), ...(drop.photos ?? [])])].slice(0, photoMax);
    const nextNote = keep.nextNote || drop.nextNote;
    const ils = donations.filter((d) => d.cur !== '$').reduce((a, d) => a + d.amount, 0);
    const usd = donations.filter((d) => d.cur === '$').reduce((a, d) => a + d.amount, 0);
    const notes = [keep.notes, drop.notes].map((n) => (n || '').trim()).filter(Boolean);
    return {
        ...keep,
        phone: keep.phone || drop.phone,
        email: keep.email || drop.email,
        address: keep.address || drop.address,
        city: keep.city || drop.city,
        idNum: keep.idNum || drop.idNum,
        cat: keep.cat || drop.cat,
        forWho: keep.forWho || drop.forWho,
        notes: [...new Set(notes)].join(' · '),
        nextDate: keep.nextDate || drop.nextDate,
        ...(nextNote ? { nextNote } : {}),
        nextEventId: keep.nextEventId || undefined,
        donations,
        ...(hist.length ? { hist } : {}),
        ...(photos.length ? { photos } : {}),
        count: donations.length,
        ils,
        usd,
        first: donations[0]?.date ?? keep.first ?? '',
        last: donations[donations.length - 1]?.date ?? keep.last ?? '',
        ...(keep.extId || drop.extId ? { extId: keep.extId || drop.extId } : {}),
        ...(keep.hok || drop.hok ? { hok: keep.hok ?? drop.hok } : {}),
        ...(keep.ayin || drop.ayin ? { ayin: keep.ayin ?? drop.ayin } : {}),
    };
}
