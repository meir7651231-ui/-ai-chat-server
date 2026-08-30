/** חוט · gen-join-code — קודם אוטומטית (אפיון-Golden). חוזה: gen-join-code.contract.md */
export function genJoinCode(seed, T) {
    let h = T.k1;
    for (let i = 0; i < seed.length; i++) {
        h ^= seed.charCodeAt(i);
        h = Math.imul(h, T.k2);
    }
    let out = '';
    let x = h >>> 0;
    for (let i = 0; i < 8; i++) {
        out += (x % T.k3).toString(T.k3);
        x = Math.floor(x / T.k3) || (h >>> 0) + i + 1;
    }
    return out;
}
/** קישור-הזמנה לעובד/ת — ‏{origin}{base}?org={slug}&join={code}. */
