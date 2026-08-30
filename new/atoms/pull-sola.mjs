/** חוט · pull-sola — משיכה-בקליק מסולה: POST ל-solaPull עם טוקן-הכניסה + גשר-vault.
 *  חוזה: pull-sola.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloud.ts:706-725 (תורגם TS→JS); ‏requireAuth ⇒ שקע
 *  auth, מצב-המודול scope ⇒ שקע {cloudRoot, slug}, ‏fetch ⇒ שקע doFetch (חוק-1). */
export async function pullSola(pullUrl, opts = {}, auth, scope, doFetch = fetch, T) {
  const clean = String(pullUrl || '').trim();
  if (!/^https:\/\//i.test(clean)) throw new Error(T.k1);
  const user = auth.currentUser;
  if (!user) throw new Error(T.k2);
  const token = await user.getIdToken();
  const org = scope.cloudRoot ? T.k3 : scope.slug;
  const u = new URL(clean);
  u.searchParams.set(T.k4, org);
  // לקוח-השורש: האוספים ב-root אבל הכספת (orgSecrets) נכתבת תחת ה-slug האמיתי —
  // vault מגשר כדי שהפונקציה תמצא את ה-xKey שהוזן בהגדרות.
  if (scope.cloudRoot && scope.slug && scope.slug !== T.k5) u.searchParams.set(T.k6, scope.slug);
  if (opts.reset) u.searchParams.set(T.k7, '1');
  const r = await doFetch(u.toString(), { method: T.k8, headers: { Authorization: T.k9 + token } });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || j.ok === false) throw new Error(j.error || T.k10 + r.status + ')');
  return j;
}
