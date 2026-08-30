/** חוט · gen-recovery-key — מפתח-שחזור קריא (6×4 תווים, base32 בלי I,O,0,1).
 *  חוזה: gen-recovery-key.contract.md
 *  חולץ כלשונו מ-maor/src/lib/crypto.ts:69-78; השכן rand הוזרק כשקע (חוק-1). */
export function genRecoveryKey(rand, T) {
  const ALPHABET = T.k1; // בלי I,O,0,1
  const bytes = rand(T.k2);
  const chars = [...bytes].map((b) => ALPHABET[b % ALPHABET.length]);
  const groups = [];
  for (let i = 0; i < chars.length; i += 4) groups.push(chars.slice(i, i + 4).join(''));
  return groups.join('-');
}
