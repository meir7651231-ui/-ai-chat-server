/** חוט · migrate-supporters-to-keyed — מיגרציית אכיפת-התומכים: כתיבה-מחדש של
 *  כל התומכים והאירועים עם skey (צברי-400, dek אופציונלי; אידמפוטנטית).
 *  חוזה: migrate-supporters-to-keyed.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloud.ts:215-240; השכנים (requireDb · supKeyMapOf ·
 *  supKeyOf · docSkey · toPlain · encryptDoc · scopedCol · doc · writeBatch)
 *  הוזרקו כאובייקט-שקעים io (חוק-1 — אפס import פנימי). */
export async function migrateSupportersToKeyed(supporters, events, dek, io) {
  const { requireDb, supKeyMapOf, supKeyOf, docSkey, toPlain, encryptDoc, scopedCol, doc, writeBatch } = io;
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
