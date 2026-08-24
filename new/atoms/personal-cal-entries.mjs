/** חוט · personal-cal-entries — שורות הלוח האישי של תומך/ת (legacy supCalMine).
 *  חוזה: personal-cal-entries.contract.md · שקע: supDonEvents
 *  חולץ כלשונו מ-maor/src/components/supporters/lib.ts (קריאת-השכן שוקעה). */
export function personalCalEntries(sp, supDonEvents) {
  const out = supDonEvents(sp).map((e) => ({ date: e.date, amount: e.amount, cur: e.cur, src: e.src }));
  if (sp.nextDate) out.push({ date: sp.nextDate, amount: 0, cur: '', src: '🎯 תאריך יעד לקשר הבא' });
  for (const l of sp.ayin?.log ?? []) {
    out.push({ date: l.date, amount: 0, cur: '', src: '🧿 ' + l.eyes + (l.name ? ' — ' + l.name : '') });
  }
  for (const an of sp.ayin?.answers ?? []) out.push({ date: an.date, amount: 0, cur: '', src: '📞 תשובה: ' + an.note });
  if (sp.ayin?.nextTalk) out.push({ date: sp.ayin.nextTalk, amount: 0, cur: '', src: '🔁 לדבר שוב' });
  return out.filter((e) => !!e.date);
}
