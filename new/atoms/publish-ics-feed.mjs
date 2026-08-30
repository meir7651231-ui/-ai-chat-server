/** חוט · publish-ics-feed — פרסום/רענון פיד-ICS: שמירת גבול-הגודל, שימור token
 *  קיים, ‏rotate מנפיק חדש. חוזה: publish-ics-feed.contract.md
 *  חולץ כלשונו מ-maor/src/lib/icsFeed.ts:34-43; שכני-הענן הוזרקו כשקעים
 *  (חוק-1): ‏readToken (במקור readIcsFeedToken) · ‏mintToken (mintFeedToken) ·
 *  ‏writeFeed (setDoc על icsFeeds/{slug}); הקבוע הפרטי MAX_ICS_BYTES הוטמע. */
const MAX_ICS_BYTES = 900_000;

export async function publishIcsFeed(slug, ics, opts, sockets, T) {
  const { readToken, mintToken, writeFeed, nowIso = () => new Date().toISOString() } = sockets;
  if (new TextEncoder().encode(ics).length > MAX_ICS_BYTES) {
    throw new Error(T.k1);
  }
  const token = (opts?.rotate ? null : await readToken(slug)) ?? mintToken();
  await writeFeed(slug, { token, ics, updatedAt: nowIso() });
  return token;
}
