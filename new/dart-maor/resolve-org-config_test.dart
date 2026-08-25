// בדיקת-חוזה (רתמת-זהב) · resolveOrgConfig — מייבאת אך ורק את האטום-שלה (חוק-4).
// מתרגמת את כל בדיקת-ה-JS new/atoms/resolve-org-config.test.mjs ואת 4 ערבויות-החוזה
// (אפס-שינוי · שימור-slug · השלמת-firebase · עדיפות-ענן) — אותם קלטים→פלטים.
// הרצה: dart run --enable-asserts new/dart-maor/resolve-org-config_test.dart  ⇒ OK
// השוואת-אוסף = אורך + איבר-איבר (כלל-8; לעולם לא join). כשל ⇒ StateError.
import 'resolve-org-config.dart';

// — deepStrictEqual של node עבור הדאטה כאן: מפות (מפתחות: אורך + איבר-איבר)
//   וערכים סקלריים; מפתחות מושווים גם בסדרם (Map של Dart ≡ object של JS). —
void _deepEq(dynamic got, dynamic want, String label) {
  if (got is Map && want is Map) {
    final gk = got.keys.toList();
    final wk = want.keys.toList();
    if (gk.length != wk.length) {
      throw StateError('FAIL [$label]: מספר-מפתחות ${gk.length} != ${wk.length}');
    }
    for (var i = 0; i < gk.length; i++) {
      if (gk[i] != wk[i]) {
        throw StateError('FAIL [$label]: מפתח #$i "${gk[i]}" != "${wk[i]}"');
      }
      _deepEq(got[gk[i]], want[wk[i]], '$label → ${gk[i]}');
    }
    return;
  }
  if (got != want) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
}

void main() {
  var n = 0;

  // passThru — תרגום-נאמן של שקע-הבדיקה ב-JS:
  // ‏raw && typeof raw === 'object' ⇒ {...raw} (העתקה רדודה) · אחרת null.
  dynamic passThru(dynamic raw) =>
      raw is Map ? (Map<String, dynamic>.from(raw)) : null;

  final st = <String, dynamic>{
    'slug': 'root',
    'name': 'סטטי',
    'firebase': {'apiKey': 'K'},
    'modules': <String, dynamic>{},
  };

  // — 1) ענן לא-שמיש ⇒ אותה-רפרנס (ערבות 1: אפס-שינוי, ratchet) —
  if (!identical(resolveOrgConfig(st, null, passThru), st)) {
    throw StateError('FAIL: cloudRaw=null — לא הוחזרה אותה-רפרנס של staticCfg');
  }
  n++;
  if (!identical(resolveOrgConfig(st, 'junk', passThru), st)) {
    throw StateError('FAIL: cloudRaw="junk" — לא הוחזרה אותה-רפרנס של staticCfg');
  }
  n++;

  // — 2) slug של הכתובת מנצח (ערבות 2) —
  final m = resolveOrgConfig(st, {'slug': 'evil', 'name': 'ענן'}, passThru);
  if (m['slug'] != 'root') {
    throw StateError('FAIL: slug="${m['slug']}" — הענן שינה את הכתובת');
  }
  n++;
  if (m['name'] != 'ענן') {
    throw StateError('FAIL: name="${m['name']}" — הענן לא גבר על הסטטי');
  }
  n++;

  // — 3) firebase מהסטטי כשהענן בלי (ערבות 3) —
  _deepEq(m['firebase'], {'apiKey': 'K'}, 'דוגמה 3 — השלמת-firebase');
  n++;
  // העתקה-רדודה כמו spread של JS: אותה-רפרנס של staticCfg.firebase.
  if (!identical(m['firebase'], st['firebase'])) {
    throw StateError('FAIL: firebase שהושלם אינו אותה-רפרנס של הסטטי');
  }
  n++;

  // — 3b) הענן מגדיר ⇒ הענן גובר (ערבות 3 רישא) —
  final m2 = resolveOrgConfig(st, {
    'firebase': {'apiKey': 'CLOUD'},
  }, passThru);
  _deepEq(m2['firebase'], {'apiKey': 'CLOUD'}, 'דוגמה 3b — עדיפות-ענן');
  n++;

  // — 4) שאר-השדות: הענן גובר במלואו + סדר-מפתחות של ה-spread (ערבות 4) —
  // ‏{...cloud, slug} ⇒ מפתחות-הענן בסדרם; slug קיים-בענן מוחלף-במקומו,
  // ‏firebase חסר-בענן מתווסף-בסוף — זהה-ביט ל-JS.
  _deepEq(
    m,
    {'slug': 'root', 'name': 'ענן', 'firebase': {'apiKey': 'K'}},
    'דוגמה 4 — spread מלא + סדר-מפתחות',
  );
  n++;
  // ‏m2: אין slug בענן ⇒ slug מתווסף אחרי firebase.
  _deepEq(
    m2,
    {'firebase': {'apiKey': 'CLOUD'}, 'slug': 'root'},
    'דוגמה 4b — סדר-הוספת-slug כשחסר בענן',
  );
  n++;

  // — 5) טוהר: staticCfg לא עבר מוטציה, והפלט רפרנס חדשה —
  _deepEq(
    st,
    {
      'slug': 'root',
      'name': 'סטטי',
      'firebase': {'apiKey': 'K'},
      'modules': <String, dynamic>{},
    },
    'דוגמה 5 — staticCfg לא שונה',
  );
  n++;
  if (identical(m, st) || identical(m2, st)) {
    throw StateError('FAIL: פלט-המיזוג הוא אותה-רפרנס של הסטטי');
  }
  n++;

  // — 6) קצה-truthiness (חוק-7): שקע שמחזיר מפה-ריקה ({} truthy ב-JS) ⇒ מיזוג,
  //   לא נפילת-אפס-שינוי; שקע שמחזיר false/''/0/NaN (falsy) ⇒ אפס-שינוי. —
  final m3 = resolveOrgConfig(st, <String, dynamic>{}, passThru);
  _deepEq(
    m3,
    {'slug': 'root', 'firebase': {'apiKey': 'K'}},
    'דוגמה 6 — ‎{}‎ truthy ⇒ מיזוג (slug ואז firebase מושלם-בסוף)',
  );
  n++;
  for (final falsyCfg in [false, '', 0, double.nan]) {
    if (!identical(resolveOrgConfig(st, 'raw', (_) => falsyCfg), st)) {
      throw StateError('FAIL: שקע החזיר $falsyCfg (falsy) — לא הוחזר הסטטי');
    }
    n++;
  }

  // assert חי (הרצה עם --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(m['slug'] == 'root', 'assert-live guard');

  print('OK resolveOrgConfig: $n asserts passed — חוזה+בדיקת-JS ירוקים');
}
