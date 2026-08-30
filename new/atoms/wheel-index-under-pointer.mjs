/** חוט · wheel-index-under-pointer — קודם אוטומטית (אפיון-Golden). חוזה: wheel-index-under-pointer.contract.md */
export function wheelIndexUnderPointer(rot, n, T) {
    if (n <= 1)
        return 0;
    const step = T.k1 / n;
    const off = (((-rot) % T.k1) + T.k1) % T.k1;
    return Math.floor(off / step) % n;
}
