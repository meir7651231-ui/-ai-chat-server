/** 🪨 טיוטת-חוט (דרגת-מחצבה) · fetchOrgLeads — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloudConfig.ts:327-334 (8 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): fetchOrgLeads, getDocs, collection, cloudDb, data
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export async function fetchOrgLeads() {
    const snap = await getDocs(collection(cloudDb(), PLATFORM_LEADS));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
/* ───────────── 💬 צ׳אט-תמיכה חי (17.8) — supportChats/{uid} + messages ─────────────
 * חי-באמת דרך onSnapshot: הלקוח (auth.uid==uid) והתמיכה (מייל-על) בלבד. הודעות
 * בלתי-משתנות (create בלבד); from נאכף ב-Rules (user↔admin). טקסט בלבד, תחום-גודל. */
