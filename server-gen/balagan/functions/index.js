// ☁️ חולל ע"י server.mjs (G59 · הכרעה-31) — אל תערוך ידנית.
const { onSchedule } = require('firebase-functions/v2/scheduler');
const { onRequest } = require('firebase-functions/v2/https');
const { getAuth } = require('firebase-admin/auth');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const { getMessaging } = require('firebase-admin/messaging');

initializeApp();
const db = getFirestore();

/// כל 15 דקות: מועדים שהגיע זמנם ועוד לא נשלחו ⇒ דחיפה לכל מכשיר של אותו אדם.
/// טוקן שפג (unregistered) נמחק — אחרת התור מתמלא במכשירים שכבר לא קיימים.
// ── G60 · רענון-OAuth ─────────────────────────────────────────────────────────
//   גוגל אינה מנפיקה refresh_token ללקוח-דפדפן ציבורי, ולכן הטוקן מת אחרי כשעה
//   והמייל/היומן מתים איתו. הפתרון היחיד הוא סוד-לקוח שיושב **בשרת**:
//   ‏(1) המשתמש מאשר ⇒ גוגל מחזירה code לפונקציה הזאת;
//   ‏(2) הפונקציה מחליפה code ⇒ refresh_token (עם הסוד) ושומרת אותו במקום שהכללים חוסמים;
//   ‏(3) הלקוח מבקש access_token קצר בכל פעם — **טוקן-הרענון לעולם לא מגיע לדפדפן.**
//   הסודות מגיעים מהסביבה (GOOGLE_CLIENT_ID · GOOGLE_CLIENT_SECRET) ואינם בקוד (חוק-6).
const CID = () => process.env.GOOGLE_CLIENT_ID || '';
const CSEC = () => process.env.GOOGLE_CLIENT_SECRET || '';

async function uidOf(req) {
  const h = String(req.headers.authorization || '');
  if (!h.startsWith('Bearer ')) return '';
  try { return (await getAuth().verifyIdToken(h.slice(7))).uid; } catch (_) { return ''; }
}

/// חזרה מגוגל: code ⇒ refresh_token. ה-state הוא ה-ID-token של המשתמש — כך שאי-אפשר
/// לתלות טוקן של אדם אחד בחשבון של אחר.
exports.oauthCallback = onRequest({ region: 'europe-west1' }, async (req, res) => {
  const code = String(req.query.code || ''), state = String(req.query.state || '');
  if (!code || !state || !CID() || !CSEC()) { res.status(400).send('missing'); return; }
  let uid = '';
  try { uid = (await getAuth().verifyIdToken(state)).uid; } catch (_) { res.status(401).send('bad-state'); return; }
  const body = new URLSearchParams({ code, client_id: CID(), client_secret: CSEC(), grant_type: 'authorization_code', redirect_uri: 'https://' + req.hostname + req.path });
  const r = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body });
  const j = await r.json();
  if (!j.refresh_token) { res.status(400).send('no-refresh'); return; }
  await db.doc('users/' + uid + '/secret/google').set({ refresh: j.refresh_token, at: new Date().toISOString() }, { merge: true });
  res.set('content-type', 'text/html; charset=utf-8').send('<meta charset="utf-8"><p style="font:16px system-ui;direction:rtl">מחובר. אפשר לחזור לאפליקציה ולסגור את החלון.</p>');
});

/// טוקן-גישה קצר. הלקוח מזדהה ב-ID-token; מקבל **רק** access_token, לעולם לא את הרענון.
exports.oauthToken = onRequest({ region: 'europe-west1', cors: true }, async (req, res) => {
  const uid = await uidOf(req);
  if (!uid) { res.status(401).json({ error: 'auth' }); return; }
  const snap = await db.doc('users/' + uid + '/secret/google').get();
  const refresh = (snap.data() || {}).refresh;
  if (!refresh || !CID() || !CSEC()) { res.status(404).json({ error: 'not-connected' }); return; }
  const body = new URLSearchParams({ refresh_token: refresh, client_id: CID(), client_secret: CSEC(), grant_type: 'refresh_token' });
  const r = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body });
  const j = await r.json();
  if (!j.access_token) { res.status(400).json({ error: 'refresh-failed' }); return; }
  res.json({ access_token: j.access_token, expires_in: j.expires_in || 3600 });
});

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
