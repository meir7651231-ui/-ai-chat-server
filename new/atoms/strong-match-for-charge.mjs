/** חוט · strong-match-for-charge — שיוך-אוטומטי-בטוח של עסקת-סליקה לכרטיס-תומך
 *  לפי מפתח-ודאי בלבד (ext>id>ph>em; שם-בלבד מוחרג). חוזה: strong-match-for-charge.contract.md
 *  חולץ כלשונו מ-maor/src/lib/nedarimSync.ts:405-426; השכן keysOf (מפתחות-שיוך
 *  מנורמלים) הוזרק כשקע (חוק-1 — אפס import פנימי). */
export function strongMatchForCharge(charge, supporters, keysOf) {
  const ck = new Set(keysOf({ extId: charge.toremId, zeout: charge.zeout, phone: charge.phone, email: charge.email }));
  if (!ck.size) return null;
  let best = null;
  for (const sp of supporters) {
    let score = 0;
    for (const k of keysOf({ extId: sp.extId, idNum: sp.idNum, phone: sp.phone, email: sp.email })) {
      if (!ck.has(k)) continue;
      if (k.startsWith('ext:')) score = Math.max(score, 5);
      else if (k.startsWith('id:')) score = Math.max(score, 4);
      else if (k.startsWith('ph:')) score = Math.max(score, 3);
      else if (k.startsWith('em:')) score = Math.max(score, 2);
    }
    if (score && (!best || score > best.score)) best = { sp, score };
  }
  return best?.sp ?? null;
}
