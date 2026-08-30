/** חוט · fam-history-of — ציר-ההיסטוריה הנגזר של משפחה (עד 40, מהחדש לישן). חוזה: fam-history-of.contract.md
 *  חולץ כלשונו מ-maor/src/components/families/lib.ts:154-198; השכן termOf הוזרק
 *  כשקע, וברירת-המחדל DEFAULT_CONFIG ירדה — הקונפיג מוזרק מהקופסה (חוק-1/6). */
export function famHistoryOf(db, fam, config, termOf, T) {
  const out = [];
  const push = (date, tag, bg, c, text) => {
    if (date) out.push({ date, tag, bg, c, text });
  };
  if (fam.createdAt) push(fam.createdAt, T.k1, T.k2, '#3a5a86', T.k3 + termOf(config, T.k4, T.k5) + T.k6);
  // אירועי הלוח של המשפחה (P3 פריט 9) — נשזרים בציר, כולל סימון ✓ בוצע
  for (const ev of db.events) {
    if (ev.famId !== fam.id || !ev.date) continue;
    push(ev.date, T.k7, T.k8, T.k9, ev.title + (ev.time ? ' · ' + ev.time : '') + (ev.done ? T.k10 : ''));
  }
  for (const l of fam.cred?.log ?? []) {
    push(l.date, termOf(config, T.k11, T.k12), T.k13, '#9a6414', l.reason + ' (' + (l.delta > 0 ? '+' : '') + l.delta + T.k14);
  }
  for (const d of fam.docs) push(d.addedAt, T.k15, T.k16, '#4d463c', T.k17 + d.name);
  const ids = new Set(fam.members.map((m) => m.id));
  for (const e of db.enrollments) {
    if (!ids.has(e.memberId)) continue;
    const first = fam.members.find((x) => x.id === e.memberId)?.first ?? '';
    const cname = db.courses.find((x) => x.id === e.courseId)?.name ?? '';
    push(
      e.enrolledAt,
      termOf(config, T.k18, T.k19),
      T.k20,
      '#3f6212',
      // 'wait' מסומן — אחרת שיבוץ-בהמתנה נראה בהיסטוריה/בתדפיס כרישום רגיל
      T.k21 + first + T.k22 + cname + (e.group ? ' · ' + e.group : '') + (e.status === T.k23 ? T.k24 : ''),
    );
    for (const p of e.payments) {
      push(p.date, T.k25, '#e4f5ea', '#12803c', T.k26 + p.amount + ' (' + p.method + ') — ' + cname + ' · ' + p.rid);
    }
    for (const a of e.absences) {
      push(
        a.date,
        a.noshow ? T.k27 : T.k28,
        T.k29,
        '#b91c1c',
        T.k30 + cname + (a.reason ? ' · ' + a.reason : '') + (a.makeup ? T.k31 : ''),
      );
    }
  }
  return out.sort((a, b) => b.date.localeCompare(a.date)).slice(0, T.k32);
}
