/** חוט · pull-nedarim — משיכת-נדרים בקליק: POST ל-nedarimPull עם טוקן-הכניסה.
 *  חוזה: pull-nedarim.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloud.ts:687-705 (תורגם TS→JS); ‏requireAuth ⇒ שקע
 *  auth, מצב-המודול scope ⇒ שקע {cloudRoot, slug}, ‏fetch ⇒ שקע doFetch (חוק-1). */
export async function pullNedarim(pullUrl, opts = {}, auth, scope, doFetch = fetch, T) {
  const clean = String(pullUrl || '').trim();
  if (!/^https:\/\//i.test(clean)) throw new Error(T.k1);
  const user = auth.currentUser;
  if (!user) throw new Error(T.k2);
  const token = await user.getIdToken();
  const org = scope.cloudRoot ? T.k3 : scope.slug;
  const u = new URL(clean);
  u.searchParams.set(T.k4, org);
  u.searchParams.set(T.k5, '1');
  if (opts.reset) u.searchParams.set(T.k6, '1');
  const r = await doFetch(u.toString(), { method: T.k7, headers: { Authorization: T.k8 + token } });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || j.ok === false) throw new Error(j.error || T.k9 + r.status + ')');
  return j;
}
