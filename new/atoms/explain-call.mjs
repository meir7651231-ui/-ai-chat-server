/** חוט · explain-call — תיאור-אנושי בעברית של מה שמתקשר יחווה (item 16, סימולטור-שיחה חי).
 *  חוזה: explain-call.contract.md
 *  חולץ כלשונו מ-maor/telephony/lib/simulate.mjs:231-302 (המקור הטהור; ‏engine.ts:87-91
 *  הוא רק re-export מוקלד). השכנים simulateCall (אותו קובץ) ו-featureOn (config.mjs)
 *  הוזרקו כאובייקט-שקעים eng (חוק-1 — אפס import פנימי). העוזרים הפרטיים
 *  DOW_HE + closedTag הם חלק מהיחידה — נשארו בקובץ. */

// סיבת-סגירה להצגה — רק ספציפית (חג/שבת/dnd/חירום), לא הגנרית "מחוץ-לשעות".

export function explainCall(tenant, call = {}, opts = {}, eng = {}, DOW_HE, T) {
  // 🪺 עוזרים קוננו פנימה (מנוע-הטיהור v4) — שקעי-הדאטה נראים להם דרך הסגירה
  function closedTag(reason) {
    return reason && reason !== T.k1 && reason !== T.k2 ? ` (${reason})` : '';
  }

  const { simulateCall, featureOn } = eng;
  const sim = simulateCall(tenant, call, opts); // R6-8: אופק-חלון מושחל
  const lines = [];
  const office = tenant.destinations?.office?.ext?.join(', ') || '—';
  const manager = tenant.destinations?.manager?.ext || '—';
  const vm = tenant.destinations?.voicemail?.box || '—';
  const when = call.dow != null ? `יום ${DOW_HE[call.dow]} ${call.hhmm || ''}` : call.date ? `${call.date} ${call.hhmm || ''}` : '';

  if (call.direction === T.k3) {
    lines.push(`📞 חיוג-יוצא: ${call.did || ''}`);
    if (sim.outcome === T.k4) lines.push(T.k5);
    else if (sim.outcome === T.k6) lines.push(T.k7);
    else if (sim.outcome === T.k8) lines.push(T.k9);
    else lines.push(`✅ יוצא דרך: ${sim.outcome.replace('via:', '')}`);
    return { outcome: sim.outcome, reason: '', summary: lines.join(' '), lines, sim };
  }

  if (call.callerId) lines.push(`📲 מתקשר ${call.callerId}${when ? ` · ${when}` : ''}`);
  switch (sim.outcome) {
    case T.k10:
      lines.push(T.k11); break;
    case T.k12:
      lines.push(sim.path.includes(T.k13) ? T.k14 : T.k15); break;
    case T.k16:
      lines.push(`🆘 מוקד-מצוקה: מתקשר-בסיכון — מנותב ישירות לאחראי (${sim.path.find((p) => p.startsWith('resp:'))?.slice(5) || manager}), עוקף שעות/חג.`); break;
    case T.k17:
      lines.push(`🕯️ מצב-שבעה פעיל: מנותב למחליף (${sim.path.find((p) => p.startsWith('sub:'))?.slice(4) || manager}).`); break;
    case T.k18:
      lines.push(T.k19); break;
    case T.k20:
      lines.push(`✅ בשעות-פעילות → מצלצל במשרד (${office}).`); break;
    case T.k21:
      lines.push(T.k22); break;
    case T.k23:
      lines.push(T.k24); break;
    case T.k25:
      lines.push(`🌙 מחוץ-לשעות${closedTag(sim.reason)} → מנהל (${manager}) → תא-קולי (${vm}).`); break;
    case T.k26:
      lines.push(`🌙 מחוץ-לשעות${closedTag(sim.reason)} → מנהל (${manager}) (בלי תא-קולי).`); break;
    case T.k27: {
      // F11: מודע-voicemail — כשהתא-הקולי כבוי, אחרי-שעות מנגן צליל-תפוס ומנתק (בלי לכידה).
      const trg = sim.path.includes(T.k28) ? T.k29 : T.k30;
      lines.push(featureOn(tenant, T.k25)
        ? `🌙 ${trg} → מנהל (${manager}) → תא-קולי.`
        : `🌙 ${trg} → מנהל (${manager}) → צליל-תפוס (אין תא-קולי).`);
      break;
    }
    default:
      if (String(sim.outcome).startsWith(T.k31)) lines.push(`✅ בחירת-IVR → ${sim.outcome.slice(4)}.`);
      else lines.push(`תוצאה: ${sim.outcome}`);
  }
  return { outcome: sim.outcome, reason: sim.reason || '', summary: lines.join(' '), lines, sim };
}
