/** חוט · cycle-carry — מצטבר-מחזורים עם שארית נגררת: base·n + רצפת (p0 + q·n) ÷ parts. מנגנון עיוור. חוזה: cycle-carry.contract.md */
export const cycleCarry = (n, base, p0, q, parts) => base * n + Math.floor((p0 + q * n) / parts);
