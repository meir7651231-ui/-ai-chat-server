/** חוט · intel-trend-from-scan — Golden. חוזה: intel-trend-from-scan.contract.md
 * מוצא: intel.ts:154 (trendFromScan). חוק-4 verbatim. מגמה: מחצית-חדשה מול ישנה. טהור.
 */
export function trendFromScan(scan, T) {
  const mo = scan.monthly, n = mo.length, h = Math.floor(n / 2);
  let older = 0, newer = 0;
  for (let i = 0; i < h; i++) older += mo[i];
  for (let i = n - h; i < n; i++) newer += mo[i];
  if (older === 0 && newer === 0) return { dir: T.k1, pct: 0 };
  const pct = older === 0 ? T.k3 : Math.round(((newer - older) / older) * T.k3);
  const dir = pct > 8 ? 'up' : pct < -8 ? T.k2 : T.k1;
  return { dir, pct };
}
