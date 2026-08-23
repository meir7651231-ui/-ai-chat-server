/** 🪨 טיוטת-חוט (דרגת-מחצבה) · watchSupportThreadMeta — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloudConfig.ts:384-392 (9 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): watchSupportThreadMeta, onSnapshot, cloudDb, exists, data
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function watchSupportThreadMeta(uid, cb) {
    return onSnapshot(doc(cloudDb(), SUPPORT_CHATS, uid), (snap) => cb(snap.exists() ? snap.data() : null), () => { });
}
/** תיבת-השיחות של התמיכה (מייל-על) — כל השיחות, חי. */
