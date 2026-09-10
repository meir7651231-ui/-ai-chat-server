// ☁️ חולל ע"י server.mjs (G59 · הכרעה-31) — אל תערוך ידנית.
const { onSchedule } = require('firebase-functions/v2/scheduler');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const { getMessaging } = require('firebase-admin/messaging');

initializeApp();
const db = getFirestore();

/// כל 15 דקות: מועדים שהגיע זמנם ועוד לא נשלחו ⇒ דחיפה לכל מכשיר של אותו אדם.
/// טוקן שפג (unregistered) נמחק — אחרת התור מתמלא במכשירים שכבר לא קיימים.
exports.pushDue = onSchedule({ schedule: 'every 15 minutes', timeZone: 'Asia/Jerusalem', region: 'europe-west1' }, async () => {
  const now = new Date().toISOString();
  const snap = await db.collectionGroup('due').where('at', '<=', now).where('sent', '==', null).limit(500).get();
  for (const doc of snap.docs) {
    const uid = doc.ref.path.split('/')[1];
    const d = doc.data() || {};
    const toks = await db.collection('users/' + uid + '/push').get();
    if (toks.empty) { await doc.ref.set({ sent: now, note: 'no-device' }, { merge: true }); continue; }
    const message = {
      notification: { title: d.title || '', body: d.body || '' },
      data: { rid: String(d.rid || '') },
      tokens: toks.docs.map((t) => t.id),
    };
    try {
      const res = await getMessaging().sendEachForMulticast(message);
      res.responses.forEach((r, i) => {
        if (r.success) return;
        const code = (r.error && r.error.code) || '';
        if (code.includes('registration-token-not-registered') || code.includes('invalid-argument')) {
          db.doc('users/' + uid + '/push/' + toks.docs[i].id).delete().catch(() => {});
        }
      });
      await doc.ref.set({ sent: now, ok: res.successCount }, { merge: true });
    } catch (e) {
      await doc.ref.set({ tried: FieldValue.increment(1) }, { merge: true });   // כשל ⇒ ניסיון-חוזר בסבב הבא, לא בליעה
    }
  }
});
