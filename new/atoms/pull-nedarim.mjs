/** חוט · pull-nedarim — משיכת-נדרים בקליק: POST ל-nedarimPull עם טוקן-הכניסה.
 *  חוזה: pull-nedarim.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloud.ts:687-705 (תורגם TS→JS); ‏requireAuth ⇒ שקע
 *  auth, מצב-המודול scope ⇒ שקע {cloudRoot, slug}, ‏fetch ⇒ שקע doFetch (חוק-1). */
export async function pullNedarim(pullUrl, opts = {}, auth, scope, doFetch = fetch) {
  const clean = String(pullUrl || '').trim();
  if (!/^https:\/\//i.test(clean)) throw new Error('כתובת-משיכה לא-תקינה (חייבת https)');
  const user = auth.currentUser;
  if (!user) throw new Error('נדרשת התחברות-ענן');
  const token = await user.getIdToken();
  const org = scope.cloudRoot ? 'root' : scope.slug;
  const u = new URL(clean);
  u.searchParams.set('org', org);
  u.searchParams.set('full', '1');
  if (opts.reset) u.searchParams.set('reset', '1');
  const r = await doFetch(u.toString(), { method: 'POST', headers: { Authorization: 'Bearer ' + token } });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || j.ok === false) throw new Error(j.error || 'משיכה נכשלה (' + r.status + ')');
  return j;
}
