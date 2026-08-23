/** 🪨 טיוטת-חוט (דרגת-מחצבה) · publishIcsFeed — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/icsFeed.ts:34-43 (10 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): publishIcsFeed, encode, readIcsFeedToken, mintFeedToken, setDoc, cloudDb, toISOString
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export async function publishIcsFeed(slug, ics, opts) {
    if (new TextEncoder().encode(ics).length > MAX_ICS_BYTES) {
        throw new Error('לוח-השנה גדול מדי לפרסום כפיד — פנו לתמיכה');
    }
    const token = (opts?.rotate ? null : await readIcsFeedToken(slug)) ?? mintFeedToken();
    await setDoc(doc(cloudDb(), ICS_FEEDS, slug), { token, ics, updatedAt: new Date().toISOString() });
    return token;
}
/** כתובת-המנוי הציבורית — פונקציית icsFeed בפרויקט-הענן של הארגון. */
