/** חוט · age-of — גיל מלא. חוזה: age-of.contract.md · שקע: now */
export function ageOf(birth, now, T) {
  if (!birth) return null;
  const d = new Date(birth.slice(0, T.k1) + 'T12:00:00');
  if (isNaN(d.getTime())) return null;
  const n = now;
  let a = n.getFullYear() - d.getFullYear();
  const md = n.getMonth() - d.getMonth();
  if (md < 0 || (md === 0 && n.getDate() < d.getDate())) a--;
  return a;
}
