/** חוט · gen-join-code — קודם אוטומטית (אפיון-Golden). חוזה: gen-join-code.contract.md */
export function genJoinCode(seed) {
    let h = 2166136261;
    for (let i = 0; i < seed.length; i++) {
        h ^= seed.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    let out = '';
    let x = h >>> 0;
    for (let i = 0; i < 8; i++) {
        out += (x % 36).toString(36);
        x = Math.floor(x / 36) || (h >>> 0) + i + 1;
    }
    return out;
}
/** קישור-הזמנה לעובד/ת — ‏{origin}{base}?org={slug}&join={code}. */
