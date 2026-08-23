/** 🪨 טיוטת-חוט (דרגת-מחצבה) · mapsRouteUrl — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/mapsLink.ts:26-41 (16 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): mapsRouteUrl, encodeURIComponent
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function mapsRouteUrl(stops) {
    const clean = stops.map(cleanStop).filter(Boolean);
    if (clean.length === 0)
        return null;
    if (clean.length === 1) {
        return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(clean[0]);
    }
    const destination = clean[clean.length - 1];
    const waypoints = clean.slice(0, -1);
    return ('https://www.google.com/maps/dir/?api=1&travelmode=driving&destination=' +
        encodeURIComponent(destination) +
        '&waypoints=' +
        waypoints.map(encodeURIComponent).join('%7C'));
}
