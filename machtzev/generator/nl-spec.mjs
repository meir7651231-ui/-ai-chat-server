#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════════════════
//  nl-spec.mjs — צפן §22: משפט-בעברית-חופשית ⇒ אפיון-מובנה (ישות … עם …).
//  ⚙️ מנגנון-עיוור (חוק-הטוהר · §19): אפס מילה-עברית בקוד. כל ידע-השפה מוזרק
//  מאטום-הדאטה 'nl-lang.data.json' (מילות-פיגום · מפרידי-שדות · חיבור-רשימה).
//  המנוע רק: מפצל-לפי-מבנה (מפריד/פסיק/חיבור מהדאטה) → מסיר-פיגום → נושאים=ישויות ·
//  אחרי-מפריד=שדות. ⇒ app-ds.buildApp ⇒ אפליקציה עובדת (רצפת-§22). זיהוי-חלקי ⇒ פשוט יותר.
// ══════════════════════════════════════════════════════════════════════════
import fs from 'node:fs';
const LANG = JSON.parse(fs.readFileSync(new URL('./nl-lang.data.json', import.meta.url), 'utf8'));
const LEAD = new Set(LANG.leadins || []);
const MARK = LANG.fieldMarks || [];
const CONJ = LANG.listConj || [];
const DEF_FIELDS = LANG.defaultFields || [];
const FALLBACK = LANG.fallbackName || '';
const TPL_ENT = LANG.tplEntity || '';
const TPL_WITH = LANG.tplWith || '';
const PLURAL_RE = new RegExp('(' + (LANG.pluralSuffixes || []).join('|') + ')$');   // אות-ריבוי מהדאטה (עיוור)
const heWords = (s) => [...(s || '').matchAll(/[֐-׿][֐-׿'"׳״]*/g)].map((m) => m[0]);
const content = (ws) => ws.filter((w) => w.length > 1 && !LEAD.has(w) && !MARK.includes(w) && !CONJ.includes(w));
const nameOf = (s) => content(heWords(s)).slice(0, 2).join(' ') || null;
// דפוסים-מבניים נבנים מהדאטה המוזרקת (המנוע עיוור לתוכן):
const MARK_RE = MARK.length ? new RegExp(`\\s+(?:${MARK.join('|')})\\s+`) : null;
const ITEM_RE = new RegExp(`\\s*[,،]\\s*${CONJ.length ? `|\\s+(?:${CONJ.join('|')})(?=[֐-׿])` : ''}`);
const splitItems = (s) => s.split(ITEM_RE).map((x) => x.trim()).filter(Boolean);

export function nlToSpec(text) {
  const t = String(text || '').replace(/[•\-–—:]/g, ' ');
  const clauses = t.split(/[.;\n]+/).map((c) => c.trim()).filter((c) => heWords(c).length);
  const ents = []; const seen = new Set();
  const push = (name, fieldStrs) => {
    if (!name || name.length < 2 || seen.has(name)) return; seen.add(name);
    const fs = [...new Set(fieldStrs.map((g) => content(heWords(g)).join(' ')).filter((f) => f.length > 1))];
    ents.push({ name, fields: fs.length ? fs : DEF_FIELDS });
  };
  for (const clause of clauses) {
    const seg = MARK_RE ? clause.split(MARK_RE) : [clause];
    const headStr = seg[0];
    const tailStr = seg.slice(1).join(' ');
    const headItems = splitItems(headStr).map(nameOf).filter(Boolean);
    const headReal = content(heWords(headStr));
    const tailItems = tailStr ? splitItems(tailStr).filter((x) => content(heWords(x)).length) : [];
    // אות-ריבוי מורפולוגי (מבני, לא מילון): פריט ברבים (ים/ות) = ישות · ביחיד = שדה.
    const plural = (s) => PLURAL_RE.test(content(heWords(s))[0] || '');
    const tailPlural = tailItems.filter(plural);
    const tailSingular = tailItems.filter((x) => !plural(x));
    if (headReal.length === 0 && tailItems.length) {
      tailItems.forEach((tt) => push(nameOf(tt), []));                  // 'מערכת עם A, B, C' ⇒ A/B/C ישויות
    } else if (headItems.length > 1) {
      headItems.forEach((h, i) => push(h, i === headItems.length - 1 ? tailSingular : []));   // רשימת-ישויות בראש
      tailPlural.forEach((tt) => push(nameOf(tt), []));                 // פריטי-זנב ברבים = ישויות נוספות
    } else {
      // ישות-אחת + זנב: פריטי-רבים = ישויות-קשורות · פריטי-יחיד = שדות.
      push(headItems[0] || nameOf(headStr), tailSingular);
      tailPlural.forEach((tt) => push(nameOf(tt), []));
    }
  }
  if (!ents.length) push(nameOf(t) || FALLBACK, []);
  return ents.map((e) => `${TPL_ENT} ${e.name} ${TPL_WITH} ${e.fields.join(', ')}`).join('\n');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const text = process.argv.slice(2).join(' ');
  if (!text) { console.log('usage: node nl-spec.mjs "<free hebrew sentence>"'); process.exit(0); }
  console.log('IN:  ' + text + '\nSPEC:\n' + nlToSpec(text).split('\n').map((l) => '  ' + l).join('\n'));
}
