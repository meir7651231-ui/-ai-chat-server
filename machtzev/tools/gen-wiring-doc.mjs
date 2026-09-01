#!/usr/bin/env node
/** מחצב · מחולל-מפת-החיווט — WIRING.md נגזר מהעץ עצמו (imports אמיתיים),
 *  לא נכתב ביד ⇒ לא מרקיב (הלקח מרקב-מספרי-הדגלים). פורמט: WIRING של buildsmart. */
import fs from 'node:fs';
const ROOT = new URL('../..', import.meta.url).pathname;
const boxes = fs.readdirSync(ROOT + 'new/boxes').filter(f => f.endsWith('.mjs') && !f.endsWith('.test.mjs'));
const atoms = fs.readdirSync(ROOT + 'new/atoms').filter(f => f.endsWith('.mjs') && !f.endsWith('.test.mjs'));
let md = `# WIRING — מפת-החיווט החיה של Genesis\n> **מחולל אוטומטית מה-imports — אל תערוך ידנית** (\`node machtzev/gen-wiring-doc.mjs\`).\n> כל קופסה: אילו חוטים היא מחווטת + ההכרעה-החתומה שלה (מהחוזה) + הזהב שלה.\n\n`;
md += `**מלאי:** ${atoms.length} אטומים · ${boxes.length} קופסאות · מחווטים: `;
const wired = new Set();
const rows = [];
for (const b of boxes) {
  const src = fs.readFileSync(ROOT + 'new/boxes/' + b, 'utf8');
  const uses = [...src.matchAll(/from '\.\.\/atoms\/([a-z0-9-]+)\.mjs'/g)].map(m => m[1]);
  uses.forEach(u => wired.add(u));
  const contract = ROOT + 'new/boxes/' + b.replace('.mjs', '.contract.md');
  const head = fs.existsSync(contract) ? (fs.readFileSync(contract, 'utf8').match(/\*\*תפקיד:\*\* ([^\n]+)/) || ['', ''])[1] : '';
  const hasGuard = fs.existsSync(ROOT + 'new/boxes/' + b.replace('.mjs', '.test.mjs')) &&
    fs.readFileSync(ROOT + 'new/boxes/' + b.replace('.mjs', '.test.mjs'), 'utf8').includes('מגן-הכרעה');
  const hasGold = fs.existsSync('/home/user/maor-system/machtzev/parity/' + b.replace('.mjs', '.parity.test.ts'));
  rows.push(`## #${b.replace('.mjs', '')}\n${head}\n- **חוטים (${uses.length}):** ${uses.join(' · ')}\n- 🛡 מגן-הכרעה: ${hasGuard ? '✅' : '—'} · 🏆 רתמת-זהב: ${hasGold ? '✅' : '⏳'}\n`);
}
md += `${wired.size}/${atoms.length} (${Math.round(wired.size / atoms.length * 100)}%)\n\n` + rows.join('\n');
md += `\n## אטומים-במלאי (טרם-חווטו): ${atoms.length - wired.size}\n_ההתקדמות האמיתית = אחוז-המחווט (L10)._\n`;
fs.writeFileSync(ROOT + 'WIRING.md', md);
console.log(`WIRING.md חולל: ${boxes.length} קופסאות · ${wired.size}/${atoms.length} מחווט (${Math.round(wired.size / atoms.length * 100)}%)`);
