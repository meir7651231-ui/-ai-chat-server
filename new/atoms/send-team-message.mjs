/** חוט · send-team-message — הודעת איש-צוות לערוץ-הארגון (teamChats/{slug}/messages).
 *  חוזה: send-team-message.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloudConfig.ts:413-424 (תורגם TS→JS); השכן
 *  sanitizeSupportText הוזרק כשקע sanitize, ושכני firebase/firestore
 *  (cloudDb·addDoc·collection) הוזרקו כאובייקט-שקעים fs (חוק-1 — אפס import
 *  פנימי). קבוע-המנגנון TEAM_CHATS הוטבע כלשונו. */

export async function sendTeamMessage(slug, sender, name, text, sanitize, fs, T) {
  const { db, addDoc, collection } = fs;
  const clean = sanitize(text);
  if (!clean) return;
  await addDoc(collection(db, T.tbl1, slug, T.k1), {
    sender: (sender || '').slice(0, T.k2),
    name: (name || '').slice(0, T.k3),
    text: clean,
    at: new Date().toISOString(),
  });
}
