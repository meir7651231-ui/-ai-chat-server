/** 🪨 טיוטת-חוט (דרגת-מחצבה) · pullSola — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloud.ts:706-725 (20 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): pullSola, requireAuth, getIdToken, fetch, toString, json, catch
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export async function pullSola(pullUrl, opts = {}) {
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
    // לקוח-השורש: האוספים ב-root אבל הכספת (orgSecrets) נכתבת תחת ה-slug האמיתי —
    // vault מגשר כדי שהפונקציה תמצא את ה-xKey שהוזן בהגדרות.
    if (scope.cloudRoot && scope.slug && scope.slug !== 'default')
        u.searchParams.set('vault', scope.slug);
    if (opts.reset)
        u.searchParams.set('reset', '1');
    const r = await fetch(u.toString(), { method: 'POST', headers: { Authorization: 'Bearer ' + token } });
    const j = (await r.json().catch(() => ({})));
    if (!r.ok || j.ok === false)
        throw new Error(j.error || 'משיכה נכשלה (' + r.status + ')');
    return j;
}
/** סימון תשלום-נכנס כ"נרשם" (אחרי שהמזכירה רשמה תרומה/תשלום במערכת). */
