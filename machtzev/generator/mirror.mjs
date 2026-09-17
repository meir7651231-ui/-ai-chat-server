// 🪞 mirror — שלב-2 של ship: המראה מ-גנסיס ל-buildsmart (lib/genesis), **עותק אחד**.
//   הרקע (up-compile · 17.9): שער-קומפילציה-למשפטים (nl-smoke --compile) צריך בדיוק את אותה מראה
//   ש-ship עושה לפני `flutter analyze`. עותק שני = שתי אמיתות שסוחפות זו מזו בשקט (מי שמעתיק
//   את שלב-2 ליד לא מקבל את G48ב כשהוא נוסף ל-ship). לכן הקוד הוצא לכאן **מילולית** מ-ship.mjs
//   ושתי הקריאות מייבאות אותו. אין כאן מנוע חדש — יש כאן הפסקת-שכפול.
import fs from 'node:fs';
import path from 'node:path';

/** מראה ל-buildsmart. ROOT = שורש-גנסיס · APP = <buildsmart>/app_flutter · log = לוג-שלב (אופציונלי).
 *  forge: ניקוי+העתקה · gen_*: יתומים מוסרים · ds/: קבצים קיימים בלבד · G48/G48ב: קופסאות+ייבואים-נעקבים. */
export function mirror(ROOT, APP, log = () => {}) {
  const GEN = path.join(ROOT, 'new/dart-gen-bs'), FORGE = path.join(ROOT, 'new/dart-forge-bs'), DS = path.join(ROOT, 'new/dart-ui-bs/ds');
  const LIB = path.join(APP, 'lib/genesis');
  const rmTree = (d, keep) => { if (!fs.existsSync(d)) return; for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) { rmTree(p, keep); if (!fs.readdirSync(p).length) fs.rmdirSync(p); } else if (!keep.includes(e.name)) fs.unlinkSync(p); } };
  rmTree(path.join(LIB, 'dart-forge-bs'), ['HANDOFF-FORGE.md']);
  fs.cpSync(FORGE, path.join(LIB, 'dart-forge-bs'), { recursive: true });
  const genDst = path.join(LIB, 'dart-gen-bs'); fs.mkdirSync(genDst, { recursive: true });
  for (const f of fs.readdirSync(genDst)) if (/^gen_.*\.dart$/.test(f) && !fs.existsSync(path.join(GEN, f))) fs.unlinkSync(path.join(genDst, f));
  for (const f of fs.readdirSync(GEN)) if (/^gen_.*\.dart$/.test(f)) fs.copyFileSync(path.join(GEN, f), path.join(genDst, f));
  for (const f of fs.readdirSync(DS)) if (f.endsWith('.dart')) fs.copyFileSync(path.join(DS, f), path.join(LIB, 'dart-ui-bs/ds', f));
  // G21/G22 · המראה ≡ גנסיס גם לאטומי-DS בשורש (retrofit-תפר) ולקובצי-התוכן של מסכי-הגלריה: קובץ שקיים בשני הצדדים מסונכרן (כמו dart-maor)
  const syncExisting = (srcDir, dstDir, re = /\.dart$/) => { if (!fs.existsSync(dstDir) || !fs.existsSync(srcDir)) return; for (const f of fs.readdirSync(dstDir)) if (re.test(f) && fs.existsSync(path.join(srcDir, f))) { const a = fs.readFileSync(path.join(srcDir, f)); if (!fs.existsSync(path.join(dstDir, f)) || !a.equals(fs.readFileSync(path.join(dstDir, f)))) fs.writeFileSync(path.join(dstDir, f), a); } };
  syncExisting(path.join(ROOT, 'new/dart-ui-bs'), path.join(LIB, 'dart-ui-bs'));
  syncExisting(path.join(ROOT, 'new/dart-data-bs/auto'), path.join(LIB, 'dart-data-bs/auto'), /^gen_.*_content\.dart$/);
  // G32 · קובצי-תוכן של אפליקציות-app-ds (gen_app_*_content) = מראה מלאה: חדש נכנס, יתום יוצא (מסך חדש כמו «התנהגות» אינו דורש העתקה-ביד)
  { const s = path.join(ROOT, 'new/dart-data-bs/auto'), d = path.join(LIB, 'dart-data-bs/auto'); if (fs.existsSync(s) && fs.existsSync(d)) { for (const f of fs.readdirSync(d)) if (/^gen_(app|balagan)_.*_content\.dart$/.test(f) && !fs.existsSync(path.join(s, f))) fs.unlinkSync(path.join(d, f)); for (const f of fs.readdirSync(s)) if (/^gen_(app|balagan)_.*_content\.dart$/.test(f)) fs.copyFileSync(path.join(s, f), path.join(d, f)); } }
  const DMIR = path.join(LIB, 'dart-maor'); if (fs.existsSync(DMIR)) for (const f of fs.readdirSync(DMIR)) if (f.endsWith('.dart') && fs.existsSync(path.join(ROOT, 'new/dart-maor', f))) fs.copyFileSync(path.join(ROOT, 'new/dart-maor', f), path.join(DMIR, f));   // G20 · מנועי-maor: קבצים קיימים-במראה בלבד (חתימות מהודקות)
  for (const f of fs.readdirSync(genDst)) if (/^zz_shot_/.test(f)) fs.unlinkSync(path.join(genDst, f));   // שאריות-ראיה
  // G48 · קופסאות שנבחרו-בהוכחה (gen_behaviors מייבא ../dart-boxes/…) ⇒ מראה נקודתית (רק הנבחרות; לא כל 62)
  { const gb = path.join(GEN, 'gen_behaviors.dart'); if (fs.existsSync(gb)) { const boxes = [...fs.readFileSync(gb, 'utf8').matchAll(/^import '\.\.\/(dart-boxes\/[^']+)'(?: as \w+)?;/gm)].map((m) => m[1]); if (boxes.length) { fs.mkdirSync(path.join(LIB, 'dart-boxes'), { recursive: true }); for (const b of boxes) fs.copyFileSync(path.join(ROOT, 'new', b), path.join(LIB, b)); } } }
  // G48ב · up-compose: המראה עוקבת אחרי הייבואים של **כל** קובץ-מחולל — אטום (dart-maor/dart/dart-boxes) שקובץ gen_* מייבא ואינו במראה ⇒ מועתק נקודתית (לא כל המדף). נמדד: gen_goal_*.dart (behavior-compose --plan) ייבא 3 אטומי-op חדשים שלא היו במראה ⇒ 3 שגיאות-URI ב-flutter analyze
  { let n = 0; for (const f of fs.readdirSync(genDst)) { if (!/^gen_.*\.dart$/.test(f)) continue; for (const m of fs.readFileSync(path.join(genDst, f), 'utf8').matchAll(/^import '\.\.\/((?:dart-maor|dart|dart-boxes)\/[^']+)'/gm)) { const src = path.join(ROOT, 'new', m[1]), dst = path.join(LIB, m[1]); if (fs.existsSync(src) && !fs.existsSync(dst)) { fs.mkdirSync(path.dirname(dst), { recursive: true }); fs.copyFileSync(src, dst); n++; } } } if (n) log(`mirror · ייבואים-נעקבים: ${n} אטומים הועתקו`); }
}
