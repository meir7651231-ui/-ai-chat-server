/** 🪨 טיוטת-חוט (דרגת-מחצבה) · pullNedarim — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloud.ts:687-705 (19 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): pullNedarim, requireAuth, getIdToken, fetch, toString, json, catch
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export async function pullNedarim(pullUrl, opts = {}) {
    const clean = String(pullUrl || '').trim();
    if (!/^https:\/\//i.test(clean))
        throw new Error('כתובת-משיכה לא-תקינה (חייבת https)');
    const user = requireAuth().currentUser;
    if (!user)
        throw new Error('נדרשת התחברות-ענן');
    const token = await user.getIdToken();
    const org = scope.cloudRoot ? 'root' : scope.slug;
    const u = new URL(clean);
    u.searchParams.set('org', org);
    u.searchParams.set('full', '1');
    if (opts.reset)
        u.searchParams.set('reset', '1');
    const r = await fetch(u.toString(), { method: 'POST', headers: { Authorization: 'Bearer ' + token } });
    const j = (await r.json().catch(() => ({})));
    if (!r.ok || j.ok === false)
        throw new Error(j.error || 'משיכה נכשלה (' + r.status + ')');
    return j;
}
/** 🔄 משיכה-בקליק מסולה (21.8, חיווט-כמו-נדרים) — קורא ל-solaPull עם טוקן-הכניסה
 *  (בלי סוד בדפדפן); ה-xKey יושב בכספת-הענן והפונקציה קוראת אותו בעצמה. */
