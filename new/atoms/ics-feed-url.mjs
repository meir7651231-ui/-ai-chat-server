/** חוט · ics-feed-url — כתובת-המנוי הציבורית של פיד-היומן (icsFeed). חוזה: ics-feed-url.contract.md
 *  חולץ כלשונו מ-maor/src/lib/icsFeed.ts:44-47 — טהור, אפס שקעים (encodeURIComponent = סטנדרט-שפה).
 *  חוק-6: ‏projectId/slug/token הם קונפיגורציית-הצבה המוזרקת כקלט — שום זהות לא נצרבת באטום. */
export function icsFeedUrl(projectId, slug, token) {
  return 'https://us-central1-' + projectId + '.cloudfunctions.net/icsFeed?org=' + encodeURIComponent(slug) + '&key=' + token;
}
