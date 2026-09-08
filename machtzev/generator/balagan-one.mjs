#!/usr/bin/env node
// 🧭 balagan-one — שער האפליקציה-האחת (GENMAX · G33 · הכרעה-29): «בלגן» = כל המודולים בפנים, בלי רשימה סגורה, בלי יד.
//   (1) N = מודולי-הנייר עם «היום» (apps/*.json) ≡ פירוקים ב-peruk-index ≡ מודולים ב-balagan-index ≡ ייבוא-ה-Today ב«היום» המאוחד ≡ מקרי-הפתיחה ב«מה קרה?»
//   (2) מזהה-הרגע: כותרת+«הרגע» של כל מודול ⇒ עצמו ב-top-1 (דטרמיניסטי, מחושב מחדש כאן — לא מהקובץ)
//   (3) אפס-רשימה-סגורה: balagan.mjs אינו מכיל שם-מודול ליטרלי (perukNN) · (4) main רושם קשרים לכל מודול-עם-קשרים · (5) המפתח = הגדרה-במכשיר, לא ליטרל
//   (6) ratchet: N רק-עולה (balagan-one-baseline.json). --gate בלבד (ריצה = balagan.mjs).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadModules, buildIdentifier, selfTest } from './balagan.mjs';
import * as R from '../root.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const rd = (p) => (fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '');
const GEN = R.outDir();
const fails = [];
const mods = loadModules();
const index = JSON.parse(rd(path.join(HERE, 'peruk-index.json')) || '[]');
const bi = JSON.parse(rd(path.join(HERE, 'balagan-index.json')) || '{"modules":[]}');
const paperIdx = index.filter((n) => fs.existsSync(path.join(HERE, 'apps', `${n.ns}.json`)));
const nPeruk = mods.filter((m) => m.layer !== 'base').length;
if (nPeruk !== paperIdx.length) fails.push(`מודולי-פירוק ${nPeruk} ≠ פירוקים-עם-מניפסט ${paperIdx.length}`);
if (bi.modules.length !== mods.length) fails.push(`balagan-index ${bi.modules.length} ≠ ${mods.length} (הרץ node machtzev/generator/balagan.mjs)`);
const home = rd(path.join(GEN, 'gen_balagan_home.dart')), ask = rd(path.join(GEN, 'gen_balagan_ask.dart')), main = rd(path.join(GEN, 'gen_balagan_main.dart')), shell = rd(path.join(GEN, 'gen_balagan_shell.dart')), keys = rd(path.join(GEN, 'gen_balagan_keys.dart')), topics = rd(path.join(GEN, 'gen_balagan_topics.dart'));
if (!home || !ask || !main || !shell || !keys || !topics) fails.push('חסר קובץ-בלגן (home/ask/main/shell/keys/topics)');
const todays = (home.match(/\w+HomeScreenToday\.module/g) || []).length;
if (todays !== mods.length) fails.push(`«היום» ממזג ${todays} מודולים ≠ ${mods.length}`);
const cases = (ask.match(/case \d+: return \w+\(initial: initial\)/g) || []).length;
if (cases !== mods.length) fails.push(`«מה קרה?» פותח ${cases} מודולים ≠ ${mods.length}`);
for (const m of mods) { if (!topics.includes(`const ${m.root.cls}()`)) fails.push(`«נושאים» בלי ${m.ns}`); }
const bad = selfTest(mods, buildIdentifier(mods));
if (bad.length) fails.push(`מזהה-הרגע: ${bad.join(' · ')}`);
const src = rd(path.join(HERE, 'balagan.mjs'));
if (/peruk\d{2}/.test(src)) fails.push('balagan.mjs מכיל שם-מודול ליטרלי (רשימה סגורה)');
for (const m of mods.filter((x) => x.relations)) if (!main.includes(`r_${m.ns}.registerAppRelations(appStore)`)) fails.push(`main בלי קשרי ${m.ns}`);
if (!/appStore\.setting\('ai\.key'\)/.test(keys) || /sk-ant-[A-Za-z0-9]{8,}/.test(keys + ask)) fails.push('מפתח-הבינה אינו הגדרה-במכשיר (או ליטרל בקוד)');
if (!/DsApproveCard\(/.test(ask) || !/balaganIdentify\(/.test(ask) || !/balaganFacts\(/.test(ask)) fails.push('«מה קרה?» בלי זיהוי/עובדות/«הבנתי כך?»');
if (!/cards\.take\(3\)/.test(home) || !/DsFold\(/.test(home)) fails.push('«היום» בלי 3-למעלה-והשאר-מקופל');
const confirm = rd(path.join(GEN, 'gen_balagan_confirm.dart'));
if (!/DsFold\(/.test(confirm) || !/appStore\.add\(widget\.module\.rootSlug/.test(confirm) || !/balaganRemember\(/.test(confirm)) fails.push('«הבנתי כך?» בלי טופס-מקוצר/שמירה/זיכרון');
if (!/GenBalaganConfirmScreen\(module:/.test(ask)) fails.push('«מה קרה?» אינו פותח את טופס-האישור');
const baseMods = mods.filter((m) => m.layer === 'base');
if (baseMods.length < 2 || !baseMods.every((m) => m.root.fields.some((f) => f.type === 'date'))) fails.push(`שכבת-הבסיס: ${baseMods.length} מודולים (נדרש ≥2 עם תאריך: משימות · יומן)`);
const BASE = path.join(HERE, 'balagan-one-baseline.json');
const base = fs.existsSync(BASE) ? JSON.parse(rd(BASE)) : { modules: 0 };
if (mods.length < base.modules) fails.push(`ratchet: מודולים ירדו ${base.modules}⇒${mods.length}`);
if (fails.length) { console.log(`🔴 balagan-one: ${fails.join(' · ')}`); process.exit(1); }
if (process.argv.includes('--write') || !fs.existsSync(BASE)) fs.writeFileSync(BASE, JSON.stringify({ modules: mods.length }));
console.log(`✓ balagan-one: אפליקציה אחת · ${mods.length} מודולים ב«היום»+«מה קרה?»+«נושאים» · מזהה-הרגע ${mods.length}/${mods.length} · אפס רשימה-סגורה (רצפה ${base.modules})`);
