/** חוט · cycle-hit — פגיעת-מחזור: האם ((a·i+b) mod m) < t. מנגנון עיוור — אפס קבועים, אפס משמעות. חוזה: cycle-hit.contract.md */
export const cycleHit = (i, a, b, m, t) => (a * i + b) % m < t;
