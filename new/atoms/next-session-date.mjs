/** חוט · next-session-date — מועד-המפגש הקרוב הבא של חוג (זכאות-השלמה 48 שעות).
 *  חוזה: next-session-date.contract.md
 *  חולץ כלשונו מ-maor/src/components/courses/lib.ts:376-390; השכן sessionsOf
 *  (המפגשים-בפועל) הוזרק כשקע (חוק-1 — אפס import פנימי). `now` מוזרק ⇒ דטרמיניסטי. */
export function nextSessionDate(c, now = new Date(), sessionsOf) {
  const n = now;
  let best = null;
  for (const ss of sessionsOf(c)) {
    const t = (ss.time || '17:00').split(':');
    const d = new Date(n.getFullYear(), n.getMonth(), n.getDate(), +t[0], +(t[1] ?? 0) || 0);
    let add = (ss.day - d.getDay() + 7) % 7;
    if (add === 0 && d <= n) add = 7;
    d.setDate(d.getDate() + add);
    if (!best || d < best) best = d;
  }
  return best;
}
