/** 🪨 טיוטת-חוט (דרגת-מחצבה) · readIcsFeedToken — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/icsFeed.ts:24-33 (10 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): readIcsFeedToken, getDoc, cloudDb, exists, data
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export async function readIcsFeedToken(slug) {
    const snap = await getDoc(doc(cloudDb(), ICS_FEEDS, slug));
    const d = snap.exists() ? snap.data() : null;
    return d && typeof d.token === 'string' && d.token ? d.token : null;
}
/**
 * פרסום/רענון הפיד. token קיים נשמר (הקישור אצל המנויים ממשיך לעבוד);
 * `rotate` מנפיק token חדש — הקישור הישן מת מיידית (ביטול-שיתוף).
 */
