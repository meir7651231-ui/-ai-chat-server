// 🧪 הוכחת-חוצה-שפות · קופסת-הלוח-העברי (Dart) — אותם קלטים/WANT כמו
// new/boxes/hebrew-calendar.test.mjs. אותם 5 מקרי-זהב, אותו פלט צפוי.
import 'hebrew-calendar.dart' as C;

int n = 0, fails = 0;
void ok(String name, bool c) {
  if (!c) {
    print('✗ $name');
    fails++;
  } else {
    n++;
  }
}

void main() {
  // 1) תאריך-מלא בעברית (גימטריה + שם-חודש + שנה-פרטית)
  ok('fullDate 2026-08-24 ⇒ י״א אלול תשפ״ו',
      C.fullDate('2026-08-24') == 'י״א אלול תשפ״ו');
  // 2) קלט ריק ⇒ '' (מקביל ל-!iso)
  ok('fullDate("") ⇒ ""', C.fullDate('') == '');
  // 3) קלט שבור ⇒ '' (מקביל ל-isNaN(getTime))
  ok('fullDate("שבור") ⇒ ""', C.fullDate('שבור') == '');
  // 4) פסח = ט״ו בניסן ⇒ parts.day == 15
  ok('parts 2026-04-02 .day == 15', C.parts('2026-04-02')['day'] == 15);
  // 5) דין-אדר: פורים באדר-ב (מעוברת 2024) ≡ פורים באדר (פשוטה 2025)
  ok('annualKey 2024-03-24 ≡ 2025-03-14',
      C.annualKey('2024-03-24') == C.annualKey('2025-03-14'));

  if (fails > 0) {
    print('❌ קופסת-הלוח-העברי (Dart): $fails אי-התאמות מול golden ה-JS');
    throw StateError('hebrew-calendar dart proof failed');
  }
  print('✓ קופסת-הלוח-העברי (Dart): $n טענות — פלט זהה-ביט ל-JS · שתי המערכות על אותה קופסה');
}
