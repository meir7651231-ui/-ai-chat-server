/** חוט · foreign-host — זיהוי מארח-זר (עותק-מגורר). חוזה: foreign-host.contract.md
 *  חולץ כלשונו מ-maor/src/lib/originGuard.ts:13-31 (כולל העוזרים הפרטיים
 *  ‏normHost ו-LOCAL_HOSTS מאותו קובץ — אפס import פנימי, חוק-1). */

/** מארחים מקומיים תמיד-מותרים (פיתוח/בדיקה) — לא נחשבים "זרים". */
const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '0.0.0.0', '::1']);

/** נורמליזציה: אותיות-קטנות, בלי www., בלי פורט. */
function normHost(h) {
  return (h || '').toLowerCase().trim().replace(/:\d+$/, '').replace(/^www\./, '');
}

export function foreignHost(hostname, allowed) {
  if (!allowed || allowed.length === 0) return false; // דורמנטי — אין רשימה ⇒ אין בדיקה
  const h = normHost(hostname);
  if (!h || LOCAL_HOSTS.has(h) || h.endsWith('.local')) return false;
  const list = allowed.map(normHost).filter(Boolean);
  return !list.some((a) => h === a || h.endsWith('.' + a));
}
