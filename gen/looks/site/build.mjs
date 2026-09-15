/* build.mjs — כותב את קבצי-האתר מתוך מודולי-המסכים.
   `node gen/looks/site/build.mjs` ⇒ index.html + מסך לכל אגף + gviya.html (עותק של 6-final עם מגירת-הניווט). */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { page, navDrawer, NAV_CSS } from './base.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const files = readdirSync(join(here, 'screens')).filter(f => f.endsWith('.mjs')).sort();

const built = [];
for (const f of files) {
  const s = (await import(join(here, 'screens', f))).default;
  const out = s.id === 'bait' ? 'index.html' : s.id + '.html';
  writeFileSync(join(here, out), page(s));
  built.push([out, s.name]);
}

/* גבייה כבר קיים ואושר — מעתיקים אותו כמו שהוא ומחברים לו את מגירת-הניווט בלבד */
let g = readFileSync(join(here, '..', '6-final.html'), 'utf8');
if (!g.includes('class="nav"')) {
  g = g.replace('</style>', NAV_CSS + '\n.nav .sheet{font-size:13.5px}\n</style>')
    .replace(/(<h1>גבייה[^<]*<small>[^<]*<\/small><\/h1>)/, '$1\n  ' + navDrawer('gviya'));
}
writeFileSync(join(here, 'gviya.html'), g);
built.push(['gviya.html', 'גבייה']);

console.log(built.map(([f, n]) => f.padEnd(16) + n).join('\n'));
