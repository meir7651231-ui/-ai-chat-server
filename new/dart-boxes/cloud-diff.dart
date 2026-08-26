// 📦 קופסת-חיבורים · cloud-diff (Dart) — מחווטת 11 אטומי-Dart. מקבילה ל-new/boxes/cloud-diff.mjs.
// חוזה משותף: new/boxes/cloud-diff.contract.md. מקור-האמת: maor/src/lib/cloud-diff.ts.
// זהו ההוכחה ש-מאור(JS) ובנייה-חכמה(Dart) מתחברות לאותה קופסה: אותם קלטים ⇒ אותו פלט.
//
// ── החיווט (זהה למקור-ה-JS) ──
// המקור מפצל את מנוע-ה-diff לאטומים; הקריאות-לשכן שוקעו כפרמטרים בחוטים (חוק-1) ומחווטות
// כאן בקופסה verbatim. שתי הכרעות-הקופסה (META_KEYS · sameJson) חיות כאן, לא בחוטים —
// בדיוק כמו ב-cloud-diff.mjs (השקעים המקבילים ל-JS). אפס נגיעה בחוטים.
import '../dart-maor/entity-collections.dart' as ec;
import '../dart-maor/col-path.dart' as cp;
import '../dart-maor/meta-path.dart' as mp;
import '../dart-maor/env-path.dart' as ep;
import '../dart-maor/donations-col.dart' as dc;
import '../dart-maor/donations-path.dart' as dp;
import '../dart-maor/strip-supporter-donations.dart' as ss;
import '../dart-maor/meta-of.dart' as mo;
import '../dart-maor/diff-db.dart' as dd;
import '../dart-maor/full-db-diff.dart' as fd;
import '../dart-maor/empty-diff.dart' as ed;

import 'dart:convert';

// ── הכרעות-הקופסה (חיות כאן, לא בחוטים — verbatim מ-cloud-diff.mjs:19-37) ──
// META_KEYS: מפתחות-ה-Db שנבדקים לשינוי-meta. savedAt מוחרג במכוון (משתנה בכל שמירה = רעש).
// המימוש והסדר verbatim מ-maor/src/lib/cloud-diff.ts:87-105.
const List<String> metaKeys = [
  'orgName',
  'orgSite',
  'orgDonate',
  'orgGoal',
  'budget',
  'usdRate',
  'audit',
  'notif',
  'reports',
  'ui',
  'seq',
  'receiptSeq',
  'donationSeq',
  'shopReceiptSeq',
  'attnDone',
];

// sameJson: אסטרטגיית-ההשוואה — === מהיר, אחרת שוויון-JSON. verbatim מ-cloud-diff.ts:138-141.
// המרה מ-JS: `a === b` ⇒ identical (זהות-רפרנס; מספרים/מחרוזות קנוניים גם-כן) ·
// `JSON.stringify(a) === JSON.stringify(b)` ⇒ jsonEncode(a) == jsonEncode(b)
// (LinkedHashMap שומר-סדר-הכנסה ⇒ אותו סדר-מפתחות כמו JSON.stringify של JS).
bool sameJson(dynamic a, dynamic b) => identical(a, b) || jsonEncode(a) == jsonEncode(b);

// ── ה-API הפומבי (ביט-זהה לחתימות cloud-diff.mjs) ────────────────────────────

/// 23 שמות-אוספי-הישויות בסדר-המקור. (קבוע חשוף ישירות — כמו ה-export ב-JS.)
List<String> get entityCollections => ec.entityCollections;

/// שם אוסף-התרומות הנפרד (מסלול-B). (קבוע חשוף ישירות.)
String get donationsCol => dc.donationsCol;

/// גוף מסמך meta/org — 16 מפתחות בלבד, savedAt כלול. (חוט חשוף ישירות.)
Map<String, dynamic> metaOf(Map<String, dynamic> db) => mo.metaOf(db);

/// ריקון donations ממסמכי-תומך ב-diff (מסלול-B). (חוט חשוף ישירות, אפס-מוטציה.)
Map<dynamic, dynamic> stripSupporterDonations(dynamic diff) => ss.stripSupporterDonations(diff);

/// האם diff-הענן ריק (אין מה לדחוף). (חוט חשוף ישירות.)
bool emptyDiff(Map d) => ed.emptyDiff(d);

/// נתיב אוסף-הענן (שורש vs פר-ארגון). (חוט חד-חד-ערכי — חשוף ישירות.)
String colPath(String slug, bool cloudRoot, String col) => cp.colPath(slug, cloudRoot, col);

/// נתיב מסמך meta/org. (חוט חד-חד-ערכי — חשוף ישירות; slug/cloudRoot dynamic כמו במקור.)
String metaPath(dynamic slug, dynamic cloudRoot) => mp.metaPath(slug, cloudRoot);

/// נתיב מסמך מעטפת-ההצפנה. (חוט חד-חד-ערכי — חשוף ישירות.)
String envPath(dynamic slug, dynamic cloudRoot) => ep.envPath(slug, cloudRoot);

/// נתיב אוסף-התרומות הנפרד — **מחווט 2-שקעים** (colPath+donationsCol) כמו במקור.
/// השקעים היו שכני-קובץ ב-JS; מחווטים כאן. חתימת cp.colPath תואמת בדיוק לשקע-הפרמטר.
String donationsPath(String slug, bool cloudRoot) =>
    dp.donationsPath(slug, cloudRoot, cp.colPath, dc.donationsCol);

/// diff מינימלי בין שני מצבי-DB — **מחווט 4-שקעים** (אוספים · META_KEYS · sameJson · metaOf).
/// כל ארבעת השקעים חיים בקופסה (הכרעות-הקופסה) ומוזרקים כאן verbatim מהמקור.
Map<String, dynamic> diffDb(Map<String, dynamic> prev, Map<String, dynamic> next) =>
    dd.diffDb(prev, next, ec.entityCollections, metaKeys, sameJson, mo.metaOf);

/// ה-DB המלא כ-diff להעלאה ראשונה — **מחווט 2-שקעים** (אוספים · metaOf).
Map<String, dynamic> fullDbDiff(Map<String, dynamic> db) =>
    fd.fullDbDiff(db, ec.entityCollections, mo.metaOf);
