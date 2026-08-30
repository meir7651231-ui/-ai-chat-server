/** חוט · explain-call — תיאור-אנושי בעברית של מה שמתקשר יחווה (item 16, סימולטור-שיחה חי).
 *  חוזה: explain-call.contract.md
 *  חולץ כלשונו מ-maor/telephony/lib/simulate.mjs:231-302 (המקור הטהור; ‏engine.ts:87-91
 *  הוא רק re-export מוקלד). השכנים simulateCall (אותו קובץ) ו-featureOn (config.mjs)
 *  הוזרקו כאובייקט-שקעים eng (חוק-1 — אפס import פנימי). העוזרים הפרטיים
 *  DOW_HE + closedTag הם חלק מהיחידה — נשארו בקובץ. */

// סיבת-סגירה להצגה — רק ספציפית (חג/שבת/dnd/חירום), לא הגנרית "מחוץ-לשעות".
function closedTag(reason) {
  return reason && reason !== 'מחוץ-לשעות' && reason !== 'שעות-פעילות' ? ` (${reason})` : '';
}

export function explainCall(tenant, call = {}, opts = {}, eng = {}, DOW_HE) {
  const { simulateCall, featureOn } = eng;
  const sim = simulateCall(tenant, call, opts); // R6-8: אופק-חלון מושחל
  const lines = [];
  const office = tenant.destinations?.office?.ext?.join(', ') || '—';
  const manager = tenant.destinations?.manager?.ext || '—';
  const vm = tenant.destinations?.voicemail?.box || '—';
  const when = call.dow != null ? `יום ${DOW_HE[call.dow]} ${call.hhmm || ''}` : call.date ? `${call.date} ${call.hhmm || ''}` : '';

  if (call.direction === 'outbound') {
    lines.push(`📞 חיוג-יוצא: ${call.did || ''}`);
    if (sim.outcome === 'non-kosher-blocked') lines.push('⛔ מצב-כשר: ניסיון-יציאה דרך SIM לא-כשר — נחסם.');
    else if (sim.outcome === 'no-such-sim') lines.push('⚠️ הערוץ שנבחר לא-קיים.');
    else if (sim.outcome === 'no-default') lines.push('⚠️ אין SIM ליציאת-ברירת-מחדל.');
    else lines.push(`✅ יוצא דרך: ${sim.outcome.replace('via:', '')}`);
    return { outcome: sim.outcome, reason: '', summary: lines.join(' '), lines, sim };
  }

  if (call.callerId) lines.push(`📲 מתקשר ${call.callerId}${when ? ` · ${when}` : ''}`);
  switch (sim.outcome) {
    case 'unknown-did':
      lines.push('❓ המספר שחויג אינו מוכר למרכזייה — לא ינותב.'); break;
    case 'blocked':
      lines.push(sim.path.includes('allowlist') ? '⛔ המתקשר אינו ברשימת-ההיתר (או חסוי) — נותק.' : '⛔ המתקשר ברשימת-החסומים — נותק.'); break;
    case 'priority':
      lines.push(`🆘 מוקד-מצוקה: מתקשר-בסיכון — מנותב ישירות לאחראי (${sim.path.find((p) => p.startsWith('resp:'))?.slice(5) || manager}), עוקף שעות/חג.`); break;
    case 'mourning':
      lines.push(`🕯️ מצב-שבעה פעיל: מנותב למחליף (${sim.path.find((p) => p.startsWith('sub:'))?.slice(4) || manager}).`); break;
    case 'announcement':
      lines.push('📢 קו-הכרזה: משמיע הודעה מוקלטת ומנתק.'); break;
    case 'office':
      lines.push(`✅ בשעות-פעילות → מצלצל במשרד (${office}).`); break;
    case 'ivr-menu':
      lines.push('✅ בשעות → תפריט-קולי (IVR) ממתין לבחירה.'); break;
    case 'queue':
      lines.push('✅ בשעות → תור-המתנה עד שנציג מושך את השיחה.'); break;
    case 'voicemail':
      lines.push(`🌙 מחוץ-לשעות${closedTag(sim.reason)} → מנהל (${manager}) → תא-קולי (${vm}).`); break;
    case 'manager':
      lines.push(`🌙 מחוץ-לשעות${closedTag(sim.reason)} → מנהל (${manager}) (בלי תא-קולי).`); break;
    case 'afterhours': {
      // F11: מודע-voicemail — כשהתא-הקולי כבוי, אחרי-שעות מנגן צליל-תפוס ומנתק (בלי לכידה).
      const trg = sim.path.includes('ivr-invalid') ? 'בחירה לא-תקינה ב-IVR' : 'אין-מענה במשרד';
      lines.push(featureOn(tenant, 'voicemail')
        ? `🌙 ${trg} → מנהל (${manager}) → תא-קולי.`
        : `🌙 ${trg} → מנהל (${manager}) → צליל-תפוס (אין תא-קולי).`);
      break;
    }
    default:
      if (String(sim.outcome).startsWith('ivr:')) lines.push(`✅ בחירת-IVR → ${sim.outcome.slice(4)}.`);
      else lines.push(`תוצאה: ${sim.outcome}`);
  }
  return { outcome: sim.outcome, reason: sim.reason || '', summary: lines.join(' '), lines, sim };
}
