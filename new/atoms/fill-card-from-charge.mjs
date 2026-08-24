/** חוט · fill-card-from-charge — מילוי-אם-ריק של פרטי-קשר מהעסקה לכרטיס.
 *  חוזה: fill-card-from-charge.contract.md
 *  חולץ כלשונו מ-maor/src/lib/nedarimSync.ts:303-321 (תורגם TS→JS);
 *  ‏normPhone/normId הוזרקו כשקעים (חוק-1 — אפס import פנימי). */
export function fillCardFromCharge(sp, charge, normPhone, normId) {
    const fill = {};
    // 🐛 נחיל-סולה C12: טלפון שלא שורד נורמליזציה (קצר/דמה) לא ממלא שדה ריק —
    // אחרת הוא חוסם השלמה אמיתית עתידית (מילוי-אם-ריק לא דורס).
    const rawPhone = (charge.phone || '').trim();
    const phone = normPhone(rawPhone).length >= 7 ? rawPhone : '';
    const email = (charge.email || '').trim();
    const zeout = normId(charge.zeout || '');
    const name = (charge.name || '').trim();
    if (phone && !(sp.phone || '').trim())
        fill.phone = phone;
    if (email && !(sp.email || '').trim())
        fill.email = email;
    if (zeout && !(sp.idNum || '').trim())
        fill.idNum = zeout;
    if (name && !(sp.name || '').trim())
        fill.name = name;
    return Object.keys(fill).length ? { ...sp, ...fill } : sp;
}
