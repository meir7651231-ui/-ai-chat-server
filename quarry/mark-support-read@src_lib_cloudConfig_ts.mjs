/** 🪨 טיוטת-חוט (דרגת-מחצבה) · markSupportRead — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloudConfig.ts:402-409 (8 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): markSupportRead, setDoc, cloudDb, catch
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export async function markSupportRead(uid, side) {
    const field = side === 'admin' ? 'unreadAdmin' : 'unreadUser';
    await setDoc(doc(cloudDb(), SUPPORT_CHATS, uid), { [field]: 0 }, { merge: true }).catch(() => { });
}
/* ───────── 💬 צ׳אט-צוות תוך-ארגוני (17.8) — teamChats/{slug}/messages ─────────
 * ערוץ-קבוצה אחד לכל הארגון: כל אנשי-הצוות (orgMember/allowedRoot-לשורש) כותבים
 * וקוראים חי. הודעות = create בלבד. מגודר בדגל `shell.teamchat`. */
