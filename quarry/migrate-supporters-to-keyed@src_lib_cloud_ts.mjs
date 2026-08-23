/** 🪨 טיוטת-חוט (דרגת-מחצבה) · migrateSupportersToKeyed — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloud.ts:214-240 (27 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): migrateSupportersToKeyed, requireDb, supKeyMapOf, encryptDoc, toPlain, scopedCol, supKeyOf, docSkey, writeBatch, commit
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export async function migrateSupportersToKeyed(supporters, events, dek) {
    const db = requireDb();
    const map = supKeyMapOf(supporters);
    const ops = [];
    for (const sp of supporters) {
        const inner = dek ? await encryptDoc(toPlain(sp), dek) : toPlain(sp);
        ops.push((b) => b.set(doc(db, scopedCol('supporters'), sp.id), { skey: supKeyOf(sp), ...inner }));
    }
    // אירועי-הלוח: skey=מפתח-התומך-המקושר (אירוע כללי ⇒ משותף) — כדי ששם-תורם בלוח
    // לא ידלוף לעובדת אחרת. אירוע ללא-קישור נשאר גלוי לכולן (משותף).
    for (const ev of events) {
        const inner = dek ? await encryptDoc(toPlain(ev), dek) : toPlain(ev);
        ops.push((b) => b.set(doc(db, scopedCol('events'), ev.id), { skey: docSkey('events', ev, map), ...inner }));
    }
    for (let i = 0; i < ops.length; i += 400) {
        const batch = writeBatch(db);
        for (const op of ops.slice(i, i + 400))
            op(batch);
        await batch.commit();
    }
    return supporters.length + events.length;
}
/** אתחול חד-פעמי (idempotent) — קריאה חוזרת מחזירה את אותם singletons. */
