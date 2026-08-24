/** חוט · lock-key — מפתח-הנעילה הממורחב-שמות. חוזה: lock-key.contract.md · שקע: nsLsKey */
const LOCK_BASE = 'maor_lock';
export function lockKey(nsLsKey) {
  return nsLsKey(LOCK_BASE);
}
