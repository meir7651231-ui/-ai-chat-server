/** חוט · intel-trend-from-scan — Golden. חוזה: intel-trend-from-scan.contract.md
 * מוצא: intel.ts:154 (trendFromScan). חוק-4 verbatim. מגמה: מחצית-חדשה מול ישנה. טהור.
 */
export function trendFromScan(scan) {
  const mo = scan.monthly, n = mo.length, h = Math.floor(n / 2);
  let older = 0, newer = 0;
  for (let i = 0; i < h; i++) older += mo[i];
  for (let i = n - h; i < n; i++) newer += mo[i];
  if (older === 0 && newer === 0) return { dir: 'flat', pct: 0 };
  const pct = older === 0 ? 100 : Math.round(((newer - older) / older) * 100);
  const dir = pct > 8 ? 'up' : pct < -8 ? 'down' : 'flat';
  return { dir, pct };
}
