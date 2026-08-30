/** חוט · lin-cycles — מונה-מחזורים ליניארי: רצפת (a·n − b) ÷ c. מנגנון עיוור — אפס קבועים. חוזה: lin-cycles.contract.md */
export const linCycles = (n, a, b, c) => Math.floor((a * n - b) / c);
