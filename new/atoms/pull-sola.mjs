/** חוט · pull-sola — משיכה-בקליק מסולה: POST ל-solaPull עם טוקן-הכניסה + גשר-vault.
 *  חוזה: pull-sola.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloud.ts:706-725 (תורגם TS→JS); ‏requireAuth ⇒ שקע
 *  auth, מצב-המודול scope ⇒ שקע {cloudRoot, slug}, ‏fetch ⇒ שקע doFetch (חוק-1). */
export async function pullSola(pullUrl, opts = {}, auth, scope, doFetch = fetch) {
  const clean = String(pullUrl || '').trim();
  if (!/^https:\/\//i.test(clean)) throw new Error('כתובת-משיכה לא-תקינה (חייבת https)');
  const user = auth.currentUser;
  if (!user) throw new Error('נדרשת התחברות-ענן');
  const token = await user.getIdToken();
  const org = scope.cloudRoot ? 'root' : scope.slug;
  const u = new URL(clean);
  u.searchParams.set('org', org);
  // לקוח-השורש: האוספים ב-root אבל הכספת (orgSecrets) נכתבת תחת ה-slug האמיתי —
  // vault מגשר כדי שהפונקציה תמצא את ה-xKey שהוזן בהגדרות.
  if (scope.cloudRoot && scope.slug && scope.slug !== 'default') u.searchParams.set('vault', scope.slug);
  if (opts.reset) u.searchParams.set('reset', '1');
  const r = await doFetch(u.toString(), { method: 'POST', headers: { Authorization: 'Bearer ' + token } });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || j.ok === false) throw new Error(j.error || 'משיכה נכשלה (' + r.status + ')');
  return j;
}
