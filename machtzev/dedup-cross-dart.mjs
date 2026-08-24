#!/usr/bin/env node
/** 🌐 בודק-כפליות חוצה-ענפים (Dart↔Dart) — עכשיו שמאור עובר ל-Dart, אפשר להשוות
 *  גוף-לוגיקה בין בנייה-חכמה (new/dart) למאור (new/dart-maor), לא רק שמות.
 *  שלוש עדשות: שם · גוף-מנורמל · חתימת-מבנה (טוקנים-ממוינים). מוצא = ליבה-אימפריאלית
 *  (מועמד-לאיחוד: יכולת בשני הענפים ⇒ קופסה אחת משותפת). */
import fs from 'node:fs';
import crypto from 'node:crypto';
const R = new URL('../new/', import.meta.url).pathname;
const read = (dir) => fs.existsSync(R + dir) ? fs.readdirSync(R + dir)
  .filter(f => f.endsWith('.dart') && !f.endsWith('_test.dart')).map(f => ({ name: f.replace('.dart', ''), dir, src: fs.readFileSync(R + dir + '/' + f, 'utf8') })) : [];
const norm = (s) => s.split('\n').filter(l => !/^\s*\/\//.test(l)).join('\n')
  .replace(/\bdynamic\b|\bfinal\b|\bvar\b/g, '').replace(/\s+/g, ' ')
  .replace(/[a-z_][\w]*/gi, 'ID').trim();  // הפשטת-שמות ⇒ מבנה-בלבד
const nkey = (n) => n.replace(/[^a-z0-9]/gi, '').toLowerCase();

const bs = read('dart'), maor = read('dart-maor');
console.log(`בנייה-חכמה-Dart: ${bs.length} · מאור-Dart: ${maor.length}`);
if (!maor.length) { console.log('(מאור עדיין לא-מומר ל-Dart — הרץ שוב אחרי ההמרה)'); process.exit(0); }

const mByName = new Map(maor.map(a => [nkey(a.name), a]));
const mByStruct = new Map(); for (const a of maor) { const k = crypto.createHash('sha1').update(norm(a.src)).digest('hex').slice(0, 12); (mByStruct.get(k) || mByStruct.set(k, []).get(k)).push(a); }

let hits = 0;
for (const b of bs) {
  const byName = mByName.get(nkey(b.name));
  const sk = crypto.createHash('sha1').update(norm(b.src)).digest('hex').slice(0, 12);
  const byStruct = mByStruct.get(sk) || [];
  if (byName) { console.log(`🔗 שם: ${b.name} (בנייה) ≡ ${byName.name} (מאור) ⇒ ליבה-אימפריאלית`); hits++; }
  for (const m of byStruct) if (!byName || m.name !== byName.name) { console.log(`🧬 מבנה-זהה: ${b.name} (בנייה) ≡ ${m.name} (מאור) ⇒ מועמד-איחוד`); hits++; }
}
console.log(hits ? `\n${hits} מועמדי-ליבה-אימפריאלית` : '\n(אין חפיפה עדיין — הענפים משלימים, כפי שהראה הניתוח)');
