#!/usr/bin/env node
// retention-erasure: open a memory export (memory/exports/items/<id>, saved as JSON) with the password Meir said.
//   node tools/export-open.mjs export.json 'הסיסמה'   ->  export.open.json + export.open.html (Hebrew, readable)
import { readFileSync, writeFileSync } from 'node:fs'
import { pbkdf2Sync, createDecipheriv } from 'node:crypto'
export function openExport(doc, pass) {
  const salt = Buffer.from(doc.salt, 'base64'), iv = Buffer.from(doc.iv, 'base64'), all = Buffer.from(doc.ct, 'base64')
  const key = pbkdf2Sync(Buffer.from(pass, 'utf8'), salt, 200000, 32, 'sha256')
  const d = createDecipheriv('aes-256-gcm', key, iv); d.setAuthTag(all.subarray(all.length - 16))
  return JSON.parse(Buffer.concat([d.update(all.subarray(0, all.length - 16)), d.final()]).toString('utf8'))
}
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))
const day = t => t ? new Date(+t).toLocaleDateString('he-IL') : ''
export function html(o) {
  const sec = (h, rows) => rows.length ? `<h2>${h} (${rows.length})</h2><ul>${rows.join('')}</ul>` : ''
  return `<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><title>הזיכרון של ליבה${o.subject ? ' - ' + esc(o.subject) : ''}</title>
<style>body{font-family:system-ui,sans-serif;max-width:760px;margin:24px auto;padding:0 16px;line-height:1.6}h2{border-bottom:1px solid #ccc}li{margin:4px 0}small{color:#666}</style></head><body>
<h1>מה ליבה יודעת${o.subject ? ' על ' + esc(o.subject) : ''}</h1><p><small>יוצא ב-${day(o.at)}</small></p>
${sec('עובדות', o.facts.map(f => `<li>${esc(f.text)} <small>${day(f.at)}</small></li>`))}
${sec('אנשים', o.people.map(p => `<li>${esc(p.name)}${p.relation ? ' - ' + esc(p.relation) : ''}${p.aliases.length ? ' <small>(' + esc(p.aliases.join(', ')) + ')</small>' : ''}</li>`))}
${sec('החלטות', o.decisions.map(d => `<li>${esc(d.q)} ← <b>${esc(d.a)}</b> <small>${day(d.at)}</small></li>`))}
${sec('שיחה', o.turns.map(t => `<li><b>${esc(t.who)}:</b> ${esc(t.text)} <small>${day(t.at)}</small></li>`))}
</body></html>`
}
if (process.argv[1] && process.argv[1].endsWith('export-open.mjs')) {
  const [f, pass] = process.argv.slice(2); if (!f || !pass) { console.error('שימוש: node tools/export-open.mjs export.json סיסמה'); process.exit(2) }
  let o; try { o = openExport(JSON.parse(readFileSync(f, 'utf8')), pass) } catch { console.error('הסיסמה לא נכונה או שהקובץ פגום'); process.exit(1) }
  const base = f.replace(/\.json$/, ''); writeFileSync(base + '.open.json', JSON.stringify(o, null, 2)); writeFileSync(base + '.open.html', html(o))
  console.log(`נפתח: ${o.facts.length} עובדות, ${o.people.length} אנשים, ${o.decisions.length} החלטות, ${o.turns.length} שורות שיחה → ${base}.open.html`)
}
