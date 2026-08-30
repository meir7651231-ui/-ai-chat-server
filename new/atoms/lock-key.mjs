/** חוט · lock-key — מפתח-הנעילה הממורחב-שמות. חוזה: lock-key.contract.md · שקע: nsLsKey */
export function lockKey(nsLsKey, T) {
  // 🪺 עוזרים קוננו פנימה (מנוע-הטיהור v4) — שקעי-הדאטה נראים להם דרך הסגירה
  const LOCK_BASE = T.k1;

  return nsLsKey(LOCK_BASE);
}
