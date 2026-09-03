import { CLEAN_ATOM, pad } from './_clean.mjs';
export default [
  { gate: 'wiring', name: 'אטום-מייבא-אטום ⇒ אדום', want: 1, files: { ...CLEAN_ATOM, 'atoms/bad.mjs': "import { ok } from './ok.mjs';\nexport const bad = ok;\n", 'atoms/bad.contract.md': pad, 'atoms/bad.test.mjs': 'console.log(1)' } },
  { gate: 'wiring', name: 'קופסה-מייבאת-קופסה ⇒ אדום', want: 1, files: { 'boxes/a.mjs': "import x from './b.mjs';\n", 'boxes/b.mjs': 'export default 1;\n' } },
  { gate: 'wiring', name: 'בדיקה-מייבאת-את-האטום-שלה ⇒ ירוק', want: 0, files: CLEAN_ATOM },
];
