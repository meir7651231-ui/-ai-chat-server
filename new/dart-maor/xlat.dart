// חוט · xlat — טבלת-תעתיקים עברית↔אנגלית↔רוסית + הרחבת-שאילתה (פורט-Dart ידני).
// זהה-ביט ל-new/atoms/xlat.mjs: הטבלה verbatim בסדר-ההכנסה (אין מפתחות דמויי-שלם
// ⇒ חוק-14 לא נדרש); ‏Object.entries ≡ איטרציית-Map של Dart; ‏[...new Set(out)] ≡
// ‏LinkedHashSet (דדופ שומר-הופעה-ראשונה); ‏!nq = truthiness (חוק-7: ''/null כוזבים).
// שקע: norm — פונקציית-נרמול מוזרקת (חוט לא מכיר חוט).
const Map<String, List<String>> xlatTable = {
  'כהן': ['cohen', 'kohen', 'коэн'],
  'לוי': ['levi', 'леви'],
  'מזרחי': ['mizrahi', 'мизрахи'],
  'פרידמן': ['fridman', 'friedman', 'фридман'],
  'אברמוב': ['abramov', 'абрамов'],
  'שרעבי': ['sharabi', 'шараби'],
  'גולדשטיין': ['goldstein', 'гольдштейн'],
  'בן דוד': ['bendavid', 'ben david', 'бен давид'],
  'אוחיון': ['ohayon', 'охайон'],
  'משה': ['moshe', 'моше', 'מוישי', 'מוישה'],
  'שרה': ['sara', 'sarah', 'сара', 'שרהלה'],
  'דוד': ['david', 'давид', 'דודי'],
  'תמר': ['tamar', 'тамар'],
  'יוסף': ['yosef', 'иосиф', 'יוסי'],
  'רחל': ['rachel', 'рахель', 'רחלי'],
  'בנימין': ['binyamin', 'беньямин', 'בני'],
  'נועה': ['noa', 'ноа'],
  'איתן': ['eitan', 'эйтан'],
  'הודיה': ['hodaya'],
  'מיכאל': ['michael', 'михаил', 'מיכי'],
  'ליאה': ['lea', 'лея'],
  'יונתן': ['yonatan', 'йонатан', 'יוני'],
  'אבישי': ['avishai'],
  'טליה': ['talia', 'талия'],
  'עומר': ['omer'],
  'אגם': ['agam'],
  'ליאם': ['liam'],
  'רומי': ['romi'],
  'אליה': ['eliya', 'элия'],
  'צבי': ['zvi', 'цви'],
  'אסתר': ['esther', 'эстер', 'אסתי'],
  'כינור': ['violin', 'скрипка'],
  'גיטרה': ['guitar', 'гитара'],
  'פסנתר': ['piano', 'пианино', 'פסנטר'],
  'אורגנית': ['organ', 'орган', 'אורגן'],
  'מסאז׳': ['massage', 'массаж', 'מסאז', 'עיסוי'],
  'גרפיקה': ['graphics', 'графика'],
  'פיתוח קול': ['vocal', 'שירה'],
  'אומנות': ['art', 'אמנות'],
  'צילום': ['photo', 'photography', 'фото', 'מצלמה'],
  'ספרות': ['writing', 'литература', 'כתיבה', 'ספר'],
  'אפייה': ['baking', 'выпечка', 'בישול', 'קונדיטוריה'],
  'אנגלית': ['english', 'английский', 'שפה'],
  'העצמה': ['empowerment', 'ביטחון עצמי'],
  'התעמלות': ['fitness', 'гимнастика', 'ספורט', 'כושר', 'ג׳ים'],
  'רפלקסולוגיה': ['reflexology', 'рефлексология', 'עיסוי'],
  'ציור': ['art', 'рисование', 'אמנות', 'יצירה'],
  'תפירה': ['sewing', 'шитьё', 'מחט'],
  'אפילציה': ['epilation', 'эпиляция', 'טיפוח'],
  'מוזיקה': ['music', 'музыка', 'נגינה', 'כינור', 'גיטרה', 'אורגנית'],
  'ירושלים': ['jerusalem', 'иерусалим'],
  'בני ברק': ['bnei brak', 'бней брак'],
  'פתח תקווה': ['petah tikva', 'петах тиква'],
  'ראש העין': ['rosh haayin'],
  'מודיעין עילית': ['modiin illit'],
  'ביתר עילית': ['beitar illit'],
};

bool _falsy(dynamic v) =>
    v == null || v == false || v == '' || (v is num && (v == 0 || v.isNaN));

List<dynamic> expandQuery(dynamic q, dynamic Function(dynamic) norm) {
  final nq = norm(q);
  final out = <dynamic>[q];
  if (_falsy(nq)) return out;
  for (final entry in xlatTable.entries) {
    if (norm(entry.key) == nq) {
      out.addAll(entry.value);
    } else if (entry.value.any((a) => norm(a) == nq)) {
      out.add(entry.key);
    }
  }
  // ‏[...new Set(out)] — דדופ שומר-הופעה-ראשונה (LinkedHashSet של Dart)
  return <dynamic>{...out}.toList();
}
