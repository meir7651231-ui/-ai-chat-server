/** 🪨 טיוטת-חוט (דרגת-מחצבה) · promptInstall — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/pwa.ts:37-45 (9 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): promptInstall, prompt
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export async function promptInstall() {
    const d = deferredInstall;
    if (!d)
        return false;
    deferredInstall = null;
    await d.prompt();
    return (await d.userChoice).outcome === 'accepted';
}
/** האם רצים כבר כאפליקציה מותקנת (standalone) — אז אין מה להציע. */
