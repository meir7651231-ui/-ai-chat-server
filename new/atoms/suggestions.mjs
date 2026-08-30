/** חוט · suggestions — מנוע מקדים-הצורך (SHOP8): חג מתקרב · גיל בית-ספר · תינוק ·
 *  כרטיסייה נגמרת. חוזה: suggestions.contract.md.
 *  חולץ כלשונו מ-maor/src/components/shop8/lib.ts:62-139; השכנים
 *  termOf/moduleOn/upcomingHoliday/ageAt הוזרקו כשקעים (חוק-1 — אפס import פנימי). */
export function suggestions(db, todayIso, config, { termOf, moduleOn, upcomingHoliday, ageAt }, T2) {
  const T = (k, fb) => (config ? termOf(config, k, fb) : fb);
  // גידור-מודולים במנוע (20.8, ממצא-ביקורת): הצעה שה-act שלה במודול כבוי לא נוצרת —
  // בלי config (בדיקות ישנות) הכול פעיל, כמו חוזה-הדגלים.
  const modOn = (m) => !config || moduleOn(config, m);
  const out = [];
  const activeFams = db.families.filter((f) => f.status === T2.k1);
  // A — חג מתקרב (מודול חנות בלבד — היעד הוא מתנת-חג בחנות)
  const hol = upcomingHoliday(todayIso, 30);
  if (modOn(T2.k2) && hol && activeFams.length > 0) {
    // תיקון (swarm-audit): מפתחות 'sug:' פטורים מגיזום-30-הימים (useApp postLoad) —
    // מפתח בלי שנה עברית ⇒ ביטול חד-פעמי של "מתנת-חג · פסח" קובר את ההצעה לנצח,
    // לכל השנים. השנה העברית של מופע-החג במפתח ⇒ החג הבא (שנה אחרת) עולה מחדש.
    out.push({
      key: `${T2.k7}${hol.name}:${hol.hebYear}`,
      emoji: '🎁',
      title: `${T2.k8}${hol.name}${T2.k9}${hol.inDays}${T2.k10}`,
      detail: `${activeFams.length} ${T(T2.k11, T2.k12)}${T2.k13}`,
      act: T2.k2,
    });
  }
  // B/C — לפי גיל הילדים
  for (const f of activeFams) {
    for (const m of f.members) {
      if (m.isParent) continue;
      const age = ageAt(m.birth, todayIso);
      if (age === 6 || age === 5) {
        // תיקון (swarm-audit): הגיל במפתח — ביטול בגיל 5 לא מסתיר את ההצעה
        // המחודשת בגיל 6 (מפתח יחיד היה מכסה את שתי השנים; 'sug:' לא נגזם).
        out.push({
          key: `${T2.k14}${m.id}:${age}`,
          emoji: '🎒',
          title: `${T2.k15}${m.first} (${f.name})`,
          detail: `${T2.k16}${age}${T2.k17}`,
          famId: f.id,
          act: T2.k3,
        });
      } else if (age === 0) {
        out.push({
          key: `${T2.k18}${m.id}`,
          emoji: '👶',
          title: `${T2.k19}${T(T2.k20, T2.k21)} ${f.name}`,
          detail: `${m.first}${T2.k22}${T(T2.k23, T2.k24)}`,
          famId: f.id,
          act: T2.k3,
        });
      }
    }
  }
  // D — כרטיסייה נגמרת (מודול חוגים בלבד — הנתון והיעד שניהם בחוגים)
  for (const e of modOn(T2.k4) ? db.enrollments : []) {
    if (e.plan !== T2.k5 || e.status !== T2.k1) continue;
    const rem = e.purchased - e.used;
    if (rem > 2 || rem < 0) continue;
    const course = db.courses.find((c) => c.id === e.courseId);
    const fam = db.families.find((f) => f.members.some((m) => m.id === e.memberId));
    const member = fam?.members.find((m) => m.id === e.memberId);
    // תיקון (swarm-audit): purchased = סמן-דור-מילוי דטרמיניסטי — אחרי חידוש
    // הכרטיסייה (purchased גדל) המפתח מתחלף, וההצעה הבאה כש"נגמרת שוב" עולה
    // גם אם הקודמת בוטלה ('sug:' פטור מגיזום ⇒ מפתח קבוע היה נקבר לנצח).
    out.push({
      key: `${T2.k25}${e.id}:${e.purchased}`,
      emoji: '🎫',
      title: `${T2.k26}${member?.first ?? '—'} · ${course?.name ?? '—'}`,
      detail: rem <= 0 ? T2.k6 : `${T2.k27}${rem}${T2.k28}`,
      famId: fam?.id,
      courseId: e.courseId,
      act: T2.k4,
    });
  }
  return out;
}
