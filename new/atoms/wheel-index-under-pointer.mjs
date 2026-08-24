/** חוט · wheel-index-under-pointer — קודם אוטומטית (אפיון-Golden). חוזה: wheel-index-under-pointer.contract.md */
export function wheelIndexUnderPointer(rot, n) {
    if (n <= 1)
        return 0;
    const step = 360 / n;
    const off = (((-rot) % 360) + 360) % 360;
    return Math.floor(off / step) % n;
}
