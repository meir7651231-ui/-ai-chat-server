/** 🪨 טיוטת-חוט (דרגת-מחצבה) · sendTeamMessage — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloudConfig.ts:413-424 (12 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): sendTeamMessage, sanitizeSupportText, addDoc, collection, cloudDb, toISOString
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export async function sendTeamMessage(slug, sender, name, text) {
    const clean = sanitizeSupportText(text);
    if (!clean)
        return;
    await addDoc(collection(cloudDb(), TEAM_CHATS, slug, 'messages'), {
        sender: (sender || '').slice(0, 120),
        name: (name || '').slice(0, 60),
        text: clean,
        at: new Date().toISOString(),
    });
}
/** האזנה-חיה להודעות-הצוות (onSnapshot) — ממוינות בצד-הלקוח. */
