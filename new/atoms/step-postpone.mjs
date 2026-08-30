/** חוט · step-postpone — כלל-דחייה צעדי: אם ((m·(d+1)) mod k) < t אז d+1, אחרת d. מנגנון עיוור. חוזה: step-postpone.contract.md */
export const stepPostpone = (d, m, k, t) => ((m * (d + 1)) % k) < t ? d + 1 : d;
