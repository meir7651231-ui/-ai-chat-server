// בדיקת-שימור support-msg-time — 12 הקלטות-Golden + מקרי-גבול-TimeClip עוינים.
import 'support-msg-time.dart';

void _eq(dynamic got, dynamic want, String label) {
  if (got != want) {
    throw AssertionError('✗ $label ⇒ ${jsonQ(got)} ≠ ${jsonQ(want)}');
  }
}

String jsonQ(dynamic v) => '"$v"';

void main() {
  // Golden (זהה ל-support-msg-time.test.mjs)
  _eq(supportMsgTime(''), '', 'empty');
  _eq(supportMsgTime('אבג'), '', 'hebrew');
  _eq(supportMsgTime('כהן לוי'), '', 'name');
  _eq(supportMsgTime('abc'), '', 'abc');
  _eq(supportMsgTime('a@b.com'), '', 'email');
  _eq(supportMsgTime('2026-08-24'), '12:00', 'date-only');
  _eq(supportMsgTime('2026-08-24T12:00:00'), '12:00', 'datetime');
  _eq(supportMsgTime('0501234567'), '', 'phone');
  _eq(supportMsgTime('03-1234567'), '', 'phone2');
  _eq(supportMsgTime('https://x.co'), '', 'url');
  _eq(supportMsgTime('שלום עולם'), '', 'greeting');
  _eq(supportMsgTime('12'), '', 'num');

  // TimeClip — גבול ±8.64e15ms (אומת מול V8/Node). ה-HH:MM המדויק תלוי-אזור-זמן
  // (כמו V8), לכן כאן נועלים רק את סף-התקינות (תקין ⇔ לא-ריק).
  void _valid(String at, String label) {
    if ((supportMsgTime(at) as String).isEmpty) throw AssertionError('✗ $label: ציפינו לתקין');
  }
  void _invalid(String at, String label) => _eq(supportMsgTime(at), '', label);

  _valid('+275760-09-13T00:00:00.000Z', 'max-inclusive');
  _valid('+275760-09-13T00:00:00Z', 'max-no-frac');
  _valid('+275760-09-13T00:00:00.0009Z', 'max-frac-truncates-to-0'); // שבר-בגבול נגזם ⇒ עדיין תקין
  _invalid('+275760-09-13T00:00:00.001Z', 'over-max-by-1ms');
  _invalid('+275760-09-13T00:00:01Z', 'over-max-by-1s');
  _valid('-271821-04-20T00:00:00.000Z', 'min-inclusive');
  _invalid('-271821-04-19T23:59:59.999Z', 'under-min-by-1ms');

  // שבר > 9 ספרות מותר; נגזם ל-3
  _valid('2026-01-01T00:00:00.123456789012Z', 'long-frac');

  // גידורי-טווח
  _invalid('2026-13-01T00:00:00Z', 'month-13');
  // הסגר (חוקים 3+4): V8 מגלגל יום-בטווח-[1,31] שחורג-מהחודש קדימה. Feb 30 ⇒ Mar 2 = תקין
  // (getHours מקומי; UTC ⇒ "00:00"). הבאג-שהיה: Dart דחה ל-Invalid (''). אומת מול Node ⇒ "00:00".
  _eq(supportMsgTime('2026-02-30T00:00:00Z'), '00:00', 'feb-30-rolls');
  _eq(supportMsgTime('2026-02-29T10:00:00'), '10:00', 'feb-29-nonleap-rolls');
  _valid('2026-01-01T24:00:00Z', 'T24-valid');
  _invalid('2026-01-01T24:00:01Z', 'T24-with-second');

  print('✓ support-msg-time: כל ההקלטות + מקרי-הגבול — ירוק');
}
