/** 🪨 טיוטת-חוט (דרגת-מחצבה) · icsFeedUrl — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/icsFeed.ts:44-47 (4 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): icsFeedUrl, encodeURIComponent
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function icsFeedUrl(projectId, slug, token) {
    return 'https://us-central1-' + projectId + '.cloudfunctions.net/icsFeed?org=' + encodeURIComponent(slug) + '&key=' + token;
}
