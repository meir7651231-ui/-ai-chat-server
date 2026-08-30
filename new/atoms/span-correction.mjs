/** חוט · span-correction — תיקון-מרווחים: המרווח קדימה שווה hi ⇒ 2, המרווח אחורה שווה lo ⇒ 1, אחרת 0. מנגנון עיוור. חוזה: span-correction.contract.md */
export const spanCorrection = (prev, cur, next, hi, lo) => (next - cur === hi ? 2 : cur - prev === lo ? 1 : 0);
