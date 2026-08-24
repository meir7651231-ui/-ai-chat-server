/** חוט · merge-supporter-row — החלת שורת-ייבוא על תומכת קיימת: לא-ריק דורס, ריק נשמר.
 *  חוזה: merge-supporter-row.contract.md
 *  חולץ כלשונו מ-maor/src/components/supporters/lib.ts:637-651; השכנים הוזרקו
 *  כשקעים (חוק-1): mergeHist (מיזוג-היסטוריה אידמפוטנטי — האטום merge-hist) ·
 *  fixPhone (עיצוב טלפון ישראלי — האטום fix-phone). בלי קבלות, בלי נגיעה במונים. */
export function mergeSupporterRow(sp, row, mergeHist, fixPhone) {
    return {
        ...sp,
        ...(row.hist?.length ? { hist: mergeHist(sp.hist ?? [], row.hist) } : {}),
        name: row.name.trim() || sp.name,
        phone: row.phone ? fixPhone(row.phone.trim()) : sp.phone,
        email: row.email.trim() || sp.email,
        idNum: row.idNum.trim() || sp.idNum,
        address: row.address.trim() || sp.address,
        cat: row.cat.trim() || sp.cat,
        forWho: row.forWho.trim() || sp.forWho,
    };
}
