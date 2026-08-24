import * as m from './audit-cat-colors.mjs';
const SNAP = {"AUDIT_CAT_COLORS":"{\"כפילות\":[\"#fdeaea\",\"#b91c1c\"],\"ת\\\"ז\":[\"#fdf1d4\",\"#9a6414\"],\"טלפון\":[\"#e7edf5\",\"#3a5a86\"],\"אימייל\":[\"#efe7f3\",\"#7c3aed\"],\"כתובת\":[\"#eceae2\",\"#4d463c\"],\"לוגיקה\":[\"#dff0ec\",\"#0f766e\"],\"ילדים\":[\"#fbeef3\",\"#be185d\"],\"קשר\":[\"#f6ead1\",\"#9a6414\"]}"};
let f = 0;
for (const [k, s] of Object.entries(SNAP)) if (JSON.stringify(m[k]) !== s) { console.error('✗ ' + k + ' סטה מהצילום'); f = 1; }
if (f) process.exit(1); console.log('✓ audit-cat-colors: צילום-ערך תואם — ירוק');
