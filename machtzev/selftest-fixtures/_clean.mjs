// אטום-נקי משותף ל-fixtures (חוזה עם דוגמה-מספרית · בדיקה מייבאת ואוכפת).
export const CLEAN_ATOM = { "atoms/ok.mjs": "export const ok = (x) => x + 1;\n", "atoms/ok.contract.md": "# חוזה · ok\nתפקיד: מוסיף 1. קלט מספר, פלט מספר. דוגמאות: 1⇒2, 0⇒1. מוצא: selftest. אורך-מילוי כדי לעבור סף-מאה-תווים של השוטר.\n", "atoms/ok.test.mjs": "import { ok } from './ok.mjs';\nif (ok(1) !== 2) process.exit(1);\nconsole.log('ok');\n" };
export const pad = '#'.repeat(120);
