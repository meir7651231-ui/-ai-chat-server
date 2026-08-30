/** חוט · push-diff — דחיפת diff הישויות לענן באצוות ≤400 + meta בטוח-למונים.
 *  חוזה: push-diff.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloud.ts:422-457 (תורגם TS→JS); ‏requireDb ⇒ db,
 *  ‏scopedCol, ערכת-Firestore (doc/writeBatch) ⇒ fs, ‏encryptDoc,
 *  ‏pushMetaCounterSafe ⇒ pushMeta, ומצב-האכיפה (supEnforceOn/SUP_KEYED_COLS/
 *  docSkey/stripAuditMeta) ⇒ sup — כולם שקעים (חוק-1).
 *  toPlain הוטמע (עוזר-פרטי של המקור, cloud.ts:383-385). */

/** Firestore דוחה undefined — סיבוב JSON מנקה (וגם מנתק הפניות). */
const toPlain = (data) => JSON.parse(JSON.stringify(data));

export async function pushDiff(
  diff, dek, supKeyBySpId = new Map(),
  db, scopedCol, fs, encryptDoc, pushMeta,
  sup = { enforceOn: false, keyedCols: [], docSkey: null, stripAuditMeta: null }, T) {
  const ops = [];
  for (const s of diff.sets) {
    const inner = dek ? await encryptDoc(toPlain(s.data), dek) : toPlain(s.data);
    // אכיפת-נתונים (dormant): מסמך באוסף-נאכף (supporters/events) נושא `skey` plaintext
    // מחוץ למעטפה, כדי ש-Rules ושאילתת-where יבחנו אותו גם בארגון-מוצפן. כבוי ⇒ ביט-זהה.
    const keyed = sup.enforceOn && sup.keyedCols.includes(s.col);
    const body = keyed
      ? { skey: sup.docSkey(s.col, s.data, supKeyBySpId), ...inner }
      : inner;
    ops.push((b) => b.set(fs.doc(db, scopedCol(s.col), s.id), body));
  }
  for (const d of diff.deletes) {
    ops.push((b) => b.delete(fs.doc(db, scopedCol(d.col), d.id)));
  }
  for (let i = 0; i < ops.length; i += T.k1) {
    const batch = fs.writeBatch(db);
    for (const op of ops.slice(i, i + T.k1)) op(batch);
    await batch.commit();
  }
  // מסמך ה-meta נכתב בעסקה נפרדת בטוחה-למונים (לא בכתיבת-האצווה העיוורת).
  // אכיפת-נתונים (משטח #3): לוג-הפעולות נושא שמות-תורמים ורוכב על meta המשותף —
  // כשהאכיפה דלוקה מקלפים אותו (הלוג נשאר מקומי). כבוי ⇒ ביט-זהה (רוכב כרגיל).
  const meta = sup.enforceOn && diff.meta ? sup.stripAuditMeta(diff.meta) : diff.meta;
  if (meta) await pushMeta(toPlain(meta), dek);
}
