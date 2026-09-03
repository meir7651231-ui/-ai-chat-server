import { CLEAN_ATOM, pad } from './_clean.mjs';
export default [
  { gate: 'contract', name: 'חוט-בלי-חוזה ⇒ אדום', want: 1, files: { 'atoms/x.mjs': 'export const x = 1;\n' } },
  { gate: 'contract', name: 'בדיקה-אדומה ⇒ אדום', want: 1, files: { 'atoms/x.mjs': 'export const x = 1;\n', 'atoms/x.contract.md': pad, 'atoms/x.test.mjs': 'process.exit(1);\n' } },
  { gate: 'contract', name: 'חוק-6: מייל-PII-באטום ⇒ אדום', want: 1, files: { ...CLEAN_ATOM, 'atoms/pii.mjs': "export const M = 'someone@gmail.com';\n", 'atoms/pii.contract.md': pad, 'atoms/pii.test.mjs': 'console.log(1)\n' } },
  { gate: 'contract', name: 'ראצ׳ט-איכות: עבריין חדש ⇒ אדום (c3ב)', want: 1, files: { ...CLEAN_ATOM, 'atoms/zz.mjs': 'export const zz = (x) => x + 1;\n', 'atoms/zz.contract.md': pad, 'atoms/zz.test.mjs': 'console.log(1)\n' } },
  { gate: 'contract', name: 'sandbox: בדיקה קוראת מחוץ ל-new ⇒ אדום', want: 1, files: { ...CLEAN_ATOM, 'atoms/spy.mjs': 'export const spy = 1;\n', 'atoms/spy.contract.md': '# חוזה · spy\nדוגמאות: 1⇒1. ' + pad, 'atoms/spy.test.mjs': "import { spy } from './spy.mjs';\nimport fs from 'node:fs';\nif (spy !== 1) process.exit(1);\nfs.readFileSync('/etc/hostname');\n" } },
  { gate: 'contract', name: 'עץ-נקי ⇒ ירוק (ביקורת-שלילית)', want: 0, files: CLEAN_ATOM },
];
