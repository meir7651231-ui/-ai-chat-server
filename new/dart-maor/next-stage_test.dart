// בדיקת-חוזה (רתמת-זהב) · nextStage — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/next-stage.test.mjs:
//   AYIN_STAGES = ['new','lead','eyes','answer','done']
//   stageIndex(s) = indexOf(s), נפילה ל-0 כשלא-נמצא
//   'new'→'lead' · 'lead'→'eyes' · 'eyes'→'answer' · 'answer'→'done' ·
//   'done'→null · 'שטויות'→'lead' (לא-מוכר ⇒ אינדקס 0 ⇒ הבא הוא השני)
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/next-stage_test.dart  ⇒ exit 0
import 'next-stage.dart';

// שקעים מקומיים לבדיקה — סדר-השלבים ו-stageIndex כבמקור (verbatim מ-next-stage.test.mjs).
const List<String> ayinStages = ['new', 'lead', 'eyes', 'answer', 'done'];
int stageIndex(String s) {
  final i = ayinStages.indexOf(s);
  return i < 0 ? 0 : i;
}

void _eq(String? got, String? want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]:\n got =$got\n want=$want');
  }
}

void main() {
  var n = 0;

  // — ששת זוגות-החוזה verbatim מ-next-stage.test.mjs —
  _eq(nextStage('new', stageIndex, ayinStages), 'lead', 'new'); n++;
  _eq(nextStage('lead', stageIndex, ayinStages), 'eyes', 'lead'); n++;
  _eq(nextStage('eyes', stageIndex, ayinStages), 'answer', 'eyes'); n++;
  _eq(nextStage('answer', stageIndex, ayinStages), 'done', 'answer'); n++;
  _eq(nextStage('done', stageIndex, ayinStages), null, 'done (last)'); n++;
  _eq(nextStage('שטויות', stageIndex, ayinStages), 'lead', 'unknown ⇒ index 0'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(nextStage('done', stageIndex, ayinStages) == null, 'assert-live guard');

  print('OK nextStage: $n asserts passed');
}
