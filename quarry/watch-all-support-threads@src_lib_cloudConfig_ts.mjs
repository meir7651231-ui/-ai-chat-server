/** 🪨 טיוטת-חוט (דרגת-מחצבה) · watchAllSupportThreads — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloudConfig.ts:393-401 (9 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): watchAllSupportThreads, onSnapshot, collection, cloudDb, data
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function watchAllSupportThreads(cb) {
    return onSnapshot(collection(cloudDb(), SUPPORT_CHATS), (snap) => cb(snap.docs.map((d) => ({ uid: d.id, ...d.data() }))), () => { });
}
/** איפוס מונה-לא-נקרא לצד שקרא (אחרי פתיחת השיחה). */
