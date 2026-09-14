#!/usr/bin/env node
/** מחצב · search-proof-check — שער `search-proof` (הדרך צעד 2 · 23-ד · שלב 9): אטום/קופסה חדשים ⇒ רשומת-חיפוש חתומה שהוכיחה "אין".
 *  לכל קובץ חדש (staged A) ב-new/{atoms,logic,boxes,dart,dart-maor,dart-boxes}: רשומה ב-machtzev/audit/search/ עם
 *  creates == הנתיב · sig תקפה · אורקל-החיפוש = האורקל הנוכחי (אחרת החיפוש ישן) · chosen === 'none' (אם נבחר מועמד קיים — למה יצרת חדש?)
 *  · כל מועמד-חזק (ציון ≥3) נזכר ב-why. שימוש: --files a,b (מ-pre-commit). יציאה 0/1. */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import * as R from './root.mjs';
import { scoreFor, loadOracle, layerOf } from './search-score.mjs';
const argv = process.argv.slice(2);
const fi = argv.indexOf('--files');
const added = fi >= 0 ? argv[fi + 1].split(',').filter(Boolean) : [];
const SCOPE = /^new\/(atoms|logic|boxes|dart|dart-maor|dart-boxes)\/[^/]+\.(mjs|dart)$/;
const targets = added.filter((f) => SCOPE.test(f) && !/\.test\.mjs$|_test\.dart$|-proof\.dart$|\.contract\.md$/.test(f));
if (!targets.length) { console.log('✓ search-proof: אין אטומים/קופסאות חדשים ב-staged'); process.exit(0); }
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
const DIR = R.MACH + 'audit/search/';
const records = fs.existsSync(DIR) ? fs.readdirSync(DIR).filter((f) => f.endsWith('.json')).map((f) => { try { return { file: f, ...JSON.parse(fs.readFileSync(DIR + f, 'utf8')) }; } catch { return null; } }).filter(Boolean) : [];
const oracle = loadOracle();
const cur = { atomIndexSha: sha(fs.readFileSync(R.MACH + 'generator/atom-index-full.json')), logicCensusSha: sha(fs.readFileSync(R.MACH + 'generator/logic-census.json')) };
const bad = [];
for (const t of targets) {
  const rec = records.filter((r) => r.creates === t).sort((a, b) => (b.ts || '').localeCompare(a.ts || ''))[0];
  if (!rec) { bad.push(`${t}: אין רשומת-חיפוש (node machtzev/search-record.mjs "<מילות-המטרה>" --creates ${t} --none "<למה>") — "אין" = "לא-חיפשת" (23-ד)`); continue; }
  const { file, sig, ...body } = rec;
  if (sha('machtzev-search-v1\n' + JSON.stringify({ ...body, sig: undefined })) !== sig) { bad.push(`${t}: רשומת-החיפוש ${file} נערכה אחרי החתימה (sig לא תואם) — הרץ מחדש`); continue; }
  if (rec.chosen !== 'none') { bad.push(`${t}: ברשומה נבחר ${rec.chosen || '(לא הוכרע)'} — אם יש אטום מתאים, חבר אותו; אטום חדש דורש --none "<למה>"`); continue; }
  if (rec.oracle?.atomIndexSha !== cur.atomIndexSha || rec.oracle?.logicCensusSha !== cur.logicCensusSha) {
    // G63 · החיפוש חייב לרוץ **לפני** היצירה — ואחרי הנחיתה האינדקס משתנה בהכרח (האטום החדש בפנים). «ישן» אינו פסול אם מוכח:
    //   (א) האטום-שנוצר אינו בין מועמדי-הרשומה (חיפוש-לפני-יצירה) · (ב) האורקל רק גדל · (ג) אף מועמד-חזק **חדש** (באותה שכבה, לא-עצמי)
    //   לא הופיע מאז — נבדק בניקוד-חי מול האורקל הנוכחי עם אותם טוקנים. אחרת: הרץ מחדש. (היה: כל שינוי-אינדקס = «הרץ מחדש» ⇒ אחרי
    //   נחיתה החיפוש-החוזר מוצא את האטום-עצמו כמועמד-חזק — הוכחה שמבטלת את עצמה.)
    const self = (e) => ('new/' + (e.file || '')) === t;
    const inRec = new Set((rec.candidates || []).map((c) => c.id));
    const lay = rec.strongLayer || layerOf(t);
    const grew = (rec.oracle?.display || 0) <= (oracle.display.length) && (rec.oracle?.logic || 0) <= (oracle.logic.length);
    const q = rec.tokens || [];
    // אותו דירוג של search-record: ניקוד-יורד ⇒ שם ⇒ חיתוך ל-N של הרשומה (הרשומה שומרת רק את ה-top-N; השוואה מלאה הייתה מציגה
    //   כ«חדשים» מועמדים שתמיד היו מעבר ל-N — isRtl על «is»). חזק-חדש = בתוך אותו חלון, באותה שכבה, לא-עצמי, ולא ברשומה.
    const TOP = (rec.candidates || []).length || 15;
    const ranked = oracle.all.filter((e) => !self(e)).map((e) => ({ id: e.id, layer: e.layer, s: scoreFor(q, e).s })).filter((e) => e.s > 0).sort((a, b) => b.s - a.s || a.id.localeCompare(b.id)).slice(0, TOP);
    const strongNow = ranked.filter((e) => e.s >= 3 && (!lay || e.layer === lay) && !inRec.has(e.id));
    const selfInRec = (rec.candidates || []).some((c) => ('new/' + (c.file || '')) === t);
    if (!grew || selfInRec) bad.push(`${t}: החיפוש רץ על אורקל ישן ${selfInRec ? '(האטום-עצמו כבר היה בו — לא חיפוש-לפני-יצירה)' : '(האורקל קטן מאז)'} — הרץ מחדש`);
    else if (strongNow.length) bad.push(`${t}: מאז החיפוש הופיעו מועמדים-חזקים חדשים: ${strongNow.map((e) => e.id).join(' · ')} — הרץ מחדש והתייחס אליהם`);
  }
  const ignored = (rec.strong || []).filter((id) => !(rec.why || '').includes(id));
  if (ignored.length) bad.push(`${t}: מועמדים-חזקים שלא נזכרו ב-why: ${ignored.join(' · ')}`);
}
if (bad.length) { console.log(`🔴 search-proof: ${bad.length} אטומים חדשים בלי הוכחת-חיפוש תקפה:`); bad.forEach((b) => console.log('   ✗ ' + b)); process.exit(1); }
console.log(`✓ search-proof: ${targets.length} חדשים · לכולם רשומת-חיפוש חתומה על האורקל הנוכחי עם "אין" מנומק`);
