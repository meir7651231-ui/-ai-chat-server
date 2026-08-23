/** 🪨 טיוטת-חוט (דרגת-מחצבה) · watchSupportMessages — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloudConfig.ts:375-383 (9 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): watchSupportMessages, onSnapshot, collection, cloudDb, data
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function watchSupportMessages(uid, cb) {
    return onSnapshot(collection(cloudDb(), SUPPORT_CHATS, uid, 'messages'), (snap) => cb(snap.docs.map((d) => d.data())), () => { });
}
/** האזנה-חיה למטא-השיחה (תגי לא-נקרא). null כשאין שיחה עדיין. */
