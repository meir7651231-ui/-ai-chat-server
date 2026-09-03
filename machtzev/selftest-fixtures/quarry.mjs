export default [
  { gate: 'quarry', name: 'טיוטה-בלי-מוצא ⇒ אדום', want: 1, sub: 'q', files: { 'q/x.mjs': 'export const x = 1;\n' } },
  { gate: 'quarry', name: 'טיוטה-שבורה ⇒ אדום', want: 1, sub: 'q', files: { 'q/x.mjs': '/** מוצא: כאן */\nexport const x = ((;\n' } },
  { gate: 'quarry', name: 'טיוטה-תקינה ⇒ ירוק', want: 0, sub: 'q', files: { 'q/x.mjs': '/** מוצא: כאן */\nexport const x = 1;\n' } },
];
