import { CLEAN_ATOM, pad } from './_clean.mjs';
const under = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => ['new/' + k, v]));
export default [
  { gate: 'freeref', name: 'מזהה-לא-מוגדר באטום ⇒ אדום', want: 1, root: true, args: ['--gate'], files: { ...under(CLEAN_ATOM), 'new/atoms/fr.mjs': 'export const fr = (x) => x + HEX2;\n', 'new/atoms/fr.contract.md': pad, 'new/atoms/fr.test.mjs': 'console.log(1)\n' } },
  { gate: 'freeref', name: 'אטום-נקי ⇒ ירוק', want: 0, root: true, args: ['--gate'], files: under(CLEAN_ATOM) },
];
