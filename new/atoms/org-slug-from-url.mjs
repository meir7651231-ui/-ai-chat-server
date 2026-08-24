/** 🔌 חוט · org-slug-from-url — ‏slug מ-‎?org=<slug>‎: פריסה אחת משרתת אינסוף לקוחות.
 *  מוצא: maor/src/lib/config.ts:812-819; קריאת ‏window.location.search הוצאה לקופסה —
 *  החוט מקבל את מחרוזת-החיפוש כקלט (חוק-1: הגבול-לדפדפן = חיווט-קופסה). */
/** @param search מחרוזת-החיפוש (למשל '?org=demo') — בקופסה: window.location.search */
export function orgSlugFromUrl(search) {
  try {
    const slug = new URLSearchParams(search).get('org');
    return slug && /^[a-z0-9-]{2,40}$/.test(slug) ? slug : null;
  } catch {
    return null;
  }
}
