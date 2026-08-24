/** חוט · org-cal-entries — שורות לוח-התרומות הכלל-ארגוני (legacy supCalAll).
 *  חוזה: org-cal-entries.contract.md · שקעים: supDonEvents (אירועי-התרומה של תומכת).
 *  חולץ כלשונו מ-maor/src/components/supporters/lib.ts (קריאת-השכן שוקעה). */
export function orgCalEntries(supporters, supDonEvents) {
  const out = [];
  for (const sp of supporters) {
    for (const e of supDonEvents(sp)) out.push({ date: e.date, amount: e.amount, cur: e.cur, src: e.src, name: sp.name, spId: sp.id });
    for (const l of sp.ayin?.log ?? []) {
      out.push({ date: l.date, amount: 0, cur: '', src: '🧿 ' + l.eyes + (l.name ? ' — ' + l.name : ''), name: sp.name, spId: sp.id });
    }
    for (const an of sp.ayin?.answers ?? []) out.push({ date: an.date, amount: 0, cur: '', src: '📞 תשובה: ' + an.note, name: sp.name, spId: sp.id });
    if (sp.ayin?.nextTalk) out.push({ date: sp.ayin.nextTalk, amount: 0, cur: '', src: '🔁 לדבר שוב', name: sp.name, spId: sp.id });
  }
  return out.filter((e) => !!e.date);
}
