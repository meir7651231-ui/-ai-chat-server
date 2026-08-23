/** 🪨 טיוטת-חוט (דרגת-מחצבה) · sendSupportMessage — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloudConfig.ts:338-361 (24 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): sendSupportMessage, sanitizeSupportText, toISOString, addDoc, collection, cloudDb, setDoc, increment, message
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export async function sendSupportMessage(uid, meta, text) {
    const clean = sanitizeSupportText(text);
    if (!clean)
        return;
    const now = new Date().toISOString();
    await addDoc(collection(cloudDb(), SUPPORT_CHATS, uid, 'messages'), { from: 'user', text: clean, at: now });
    await setDoc(doc(cloudDb(), SUPPORT_CHATS, uid), {
        email: (meta.email ?? '').slice(0, 120),
        orgName: (meta.orgName ?? '').slice(0, 120),
        lastText: clean.slice(0, 120),
        lastAt: now,
        lastFrom: 'user',
        unreadAdmin: increment(1),
    }, { merge: true });
}
/** התמיכה (מייל-על) משיבה: message(from:'admin') + מטא (unreadUser++). */
