/** חוט · fam-history-of — ציר-ההיסטוריה הנגזר של משפחה (עד 40, מהחדש לישן). חוזה: fam-history-of.contract.md
 *  חולץ כלשונו מ-maor/src/components/families/lib.ts:154-198; השכן termOf הוזרק
 *  כשקע, וברירת-המחדל DEFAULT_CONFIG ירדה — הקונפיג מוזרק מהקופסה (חוק-1/6). */
export function famHistoryOf(db, fam, config, termOf) {
  const out = [];
  const push = (date, tag, bg, c, text) => {
    if (date) out.push({ date, tag, bg, c, text });
  };
  if (fam.createdAt) push(fam.createdAt, 'הצטרפות', '#e7edf5', '#3a5a86', 'ה' + termOf(config, 'entity.family', 'משפחה') + ' הצטרפה');
  // אירועי הלוח של המשפחה (P3 פריט 9) — נשזרים בציר, כולל סימון ✓ בוצע
  for (const ev of db.events) {
    if (ev.famId !== fam.id || !ev.date) continue;
    push(ev.date, 'אירוע', '#efe7f3', '#7c3aed', ev.title + (ev.time ? ' · ' + ev.time : '') + (ev.done ? ' · ✓ בוצע' : ''));
  }
  for (const l of fam.cred?.log ?? []) {
    push(l.date, termOf(config, 'entity.cred', 'אמינות'), '#f6ead1', '#9a6414', l.reason + ' (' + (l.delta > 0 ? '+' : '') + l.delta + ' נק׳)');
  }
  for (const d of fam.docs) push(d.addedAt, 'מסמך', '#eceae2', '#4d463c', 'מסמך נוסף: ' + d.name);
  const ids = new Set(fam.members.map((m) => m.id));
  for (const e of db.enrollments) {
    if (!ids.has(e.memberId)) continue;
    const first = fam.members.find((x) => x.id === e.memberId)?.first ?? '';
    const cname = db.courses.find((x) => x.id === e.courseId)?.name ?? '';
    push(
      e.enrolledAt,
      termOf(config, 'entity.enrollment', 'שיבוץ'),
      '#eef7e6',
      '#3f6212',
      // 'wait' מסומן — אחרת שיבוץ-בהמתנה נראה בהיסטוריה/בתדפיס כרישום רגיל
      'נרשמ/ה ' + first + ' ל' + cname + (e.group ? ' · ' + e.group : '') + (e.status === 'wait' ? ' · ברשימת-המתנה' : ''),
    );
    for (const p of e.payments) {
      push(p.date, 'תשלום', '#e4f5ea', '#12803c', 'תשלום ₪' + p.amount + ' (' + p.method + ') — ' + cname + ' · ' + p.rid);
    }
    for (const a of e.absences) {
      push(
        a.date,
        a.noshow ? 'No-Show' : 'היעדרות',
        '#fdeaea',
        '#b91c1c',
        'היעדרות — ' + cname + (a.reason ? ' · ' + a.reason : '') + (a.makeup ? ' · זכאי/ת השלמה' : ''),
      );
    }
  }
  return out.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 40);
}
