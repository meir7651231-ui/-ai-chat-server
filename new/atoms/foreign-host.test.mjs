import { foreignHost } from './foreign-host.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
// 1) מארח זר
ok(foreignHost('evil.com', ['maor.org']) === true, 'evil.com לא זוהה כזר');
// 2) מארח רשמי
ok(foreignHost('maor.org', ['maor.org']) === false, 'maor.org זוהה כזר בטעות');
// 3) נורמליזציה — www/רישיות/פורט
ok(foreignHost('www.MAOR.org:8080', ['maor.org']) === false, 'נורמליזציית www/רישיות/פורט נכשלה');
// 4) התאמת-סיומת
ok(foreignHost('org.github.io', ['github.io']) === false, 'התאמת-סיומת github.io נכשלה');
// 5) מקומי לעולם לא-זר
ok(foreignHost('localhost', ['maor.org']) === false, 'localhost זוהה כזר');
ok(foreignHost('dev.local', ['maor.org']) === false, '*.local זוהה כזר');
// 6) דורמנטי — אין רשימה
ok(foreignHost('evil.com', []) === false, 'רשימה ריקה לא דורמנטית');
ok(foreignHost('evil.com', undefined) === false, 'undefined לא דורמנטי');
if (f) process.exit(1);
console.log('✓ foreign-host: 6 דוגמאות-חוזה (8 בדיקות) — ירוק');
