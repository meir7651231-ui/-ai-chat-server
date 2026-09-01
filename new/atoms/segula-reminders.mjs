/** חוט · segula-reminders — תזכורות-סגולה מדורגות מתאריך-התחלה. חוזה: segula-reminders.contract.md
 *  חולץ מ-maor/src/components/supporters/lib.ts:324-337. אטום טהור:
 *  ברירת-המחדל של הדילוגים מוטבעת (זהה ל-segula-offsets, בלי import — חוק-1). */
// קבוע-מתמטי: דילוגי-תזכורת ברירת-מחדל (ימים) — מוזרקים דרך offsets להתאמה
export function segulaReminders(startIso, offsets = [1, 7, 21, 35, 40]) {
  const base = new Date(`${startIso}T12:00:00`);
  const max = Math.max(...offsets);
  return offsets.map((day) => {
    const d = new Date(base);
    d.setDate(d.getDate() + day);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return { day, date: `${y}-${m}-${dd}`, final: day === max };
  });
}
