/** 🪨 טיוטת-חוט (דרגת-מחצבה) · genRecoveryKey — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/crypto.ts:69-78 (10 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): genRecoveryKey, rand
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function genRecoveryKey() {
    const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // בלי I,O,0,1
    const bytes = rand(24);
    const chars = [...bytes].map((b) => ALPHABET[b % ALPHABET.length]);
    const groups = [];
    for (let i = 0; i < chars.length; i += 4)
        groups.push(chars.slice(i, i + 4).join(''));
    return groups.join('-');
}
/** יצירת מעטפת מוצפנת חדשה: DEK אקראי, עטוף בסיסמה ובמפתח השחזור. */
