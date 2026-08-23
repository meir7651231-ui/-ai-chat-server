/** 🪨 טיוטת-חוט (דרגת-מחצבה) · pushDiff — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloud.ts:422-457 (36 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): pushDiff, requireDb, encryptDoc, toPlain, docSkey, scopedCol, writeBatch, commit, stripAuditMeta, pushMetaCounterSafe
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export async function pushDiff(diff, dek, supKeyBySpId = new Map()) {
    const db = requireDb();
    const ops = [];
    for (const s of diff.sets) {
        const inner = dek ? await encryptDoc(toPlain(s.data), dek) : toPlain(s.data);
        // אכיפת-נתונים (dormant): מסמך באוסף-נאכף (supporters/events) נושא `skey` plaintext
        // מחוץ למעטפה, כדי ש-Rules ושאילתת-where יבחנו אותו גם בארגון-מוצפן. כבוי ⇒ ביט-זהה.
        const keyed = supEnforceOn && SUP_KEYED_COLS.includes(s.col);
        const body = keyed
            ? { skey: docSkey(s.col, s.data, supKeyBySpId), ...inner }
            : inner;
        ops.push((b) => b.set(doc(db, scopedCol(s.col), s.id), body));
    }
    for (const d of diff.deletes) {
        ops.push((b) => b.delete(doc(db, scopedCol(d.col), d.id)));
    }
    for (let i = 0; i < ops.length; i += 400) {
        const batch = writeBatch(db);
        for (const op of ops.slice(i, i + 400))
            op(batch);
        await batch.commit();
    }
    // מסמך ה-meta נכתב בעסקה נפרדת בטוחה-למונים (לא בכתיבת-האצווה העיוורת).
    // אכיפת-נתונים (משטח #3): לוג-הפעולות נושא שמות-תורמים ורוכב על meta המשותף —
    // כשהאכיפה דלוקה מקלפים אותו (הלוג נשאר מקומי). כבוי ⇒ ביט-זהה (רוכב כרגיל).
    const meta = supEnforceOn && diff.meta ? stripAuditMeta(diff.meta) : diff.meta;
    if (meta)
        await pushMetaCounterSafe(toPlain(meta), dek);
}
/* ============================ הצפנת-ענן — envelope + מיגרציה ============================ */
/**
 * קריאת ה-envelope (ה-DEK העטוף) מ-`_enc/envelope`. **failure-safe:** כל שגיאה
 * (הרשאות ה-Rules לא מתירות `_enc`, רשת, ענן-לא-אותחל) ⇒ null ⇒ הקורא ממשיך
 * בנתיב plaintext כהיום. כך הוספת הבדיקה לזרימת-החיבור **אינה יכולה לשבור את
 * הלקוח החי** גם אם ה-Rules של `_enc` טרם פורסמו. null = אין הצפנה בארגון הזה.
 */
