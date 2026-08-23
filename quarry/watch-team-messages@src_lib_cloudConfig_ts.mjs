/** 🪨 טיוטת-חוט (דרגת-מחצבה) · watchTeamMessages — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloudConfig.ts:425-432 (8 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): watchTeamMessages, onSnapshot, collection, cloudDb, data
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function watchTeamMessages(slug, cb) {
    return onSnapshot(collection(cloudDb(), TEAM_CHATS, slug, 'messages'), (snap) => cb(snap.docs.map((d) => d.data())), () => { });
}
