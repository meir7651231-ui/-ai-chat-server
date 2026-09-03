import { CLEAN_ATOM, pad } from './_clean.mjs';
export default [
  { gate: 'mutation', name: 'בדיקה-ריקה (ירוקה על חלול) ⇒ אדום', want: 1, sub: 'atoms', files: { 'atoms/v.mjs': 'export const v = (x) => x * 2;\n', 'atoms/v.contract.md': pad, 'atoms/v.test.mjs': "import { v } from './v.mjs';\nif (typeof v !== 'function') process.exit(1);\n" } },
  { gate: 'mutation', name: 'export default (לא-מפורסר) ⇒ אדום fail-closed', want: 1, sub: 'atoms', files: { 'atoms/d.mjs': 'export default (x) => x;\n', 'atoms/d.contract.md': pad, 'atoms/d.test.mjs': "import d from './d.mjs';\nif (d(1) !== 1) process.exit(1);\n" } },
  { gate: 'mutation', name: 'בדיקה-אמיתית ⇒ ירוק', want: 0, sub: 'atoms', files: CLEAN_ATOM },
];
