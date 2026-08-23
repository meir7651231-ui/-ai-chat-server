/** 🪨 טיוטת-חוט (דרגת-מחצבה) · sendSupportReply — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloudConfig.ts:362-374 (13 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): sendSupportReply, sanitizeSupportText, toISOString, addDoc, collection, cloudDb, setDoc, increment
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export async function sendSupportReply(uid, text) {
    const clean = sanitizeSupportText(text);
    if (!clean)
        return;
    const now = new Date().toISOString();
    await addDoc(collection(cloudDb(), SUPPORT_CHATS, uid, 'messages'), { from: 'admin', text: clean, at: now });
    await setDoc(doc(cloudDb(), SUPPORT_CHATS, uid), { lastText: clean.slice(0, 120), lastAt: now, lastFrom: 'admin', unreadUser: increment(1) }, { merge: true });
}
/** האזנה-חיה להודעות השיחה (onSnapshot) — ממוינות בצד-הלקוח (בלי אינדקס). */
