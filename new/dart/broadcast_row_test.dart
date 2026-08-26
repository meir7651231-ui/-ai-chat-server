// בדיקת-חוזה golden · broadcastRow — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/broadcast_row_test.dart
import 'broadcast_row.dart';

// שקעי-התוויות (מדומים; האטום מאפיין את הקיבוץ/הסדר/§4, לא את מחרוזות-התווית).
String _emoji(ConfigOpKind k) => switch (k) {
      ConfigOpKind.setText => '✏️',
      ConfigOpKind.setEmoji => '😀',
      ConfigOpKind.setHidden => '👁️',
      ConfigOpKind.setOrder => '🔢',
      ConfigOpKind.setStyle => '🎨',
      ConfigOpKind.setAction => '⚡',
    };
String _plural(ConfigOpKind k, bool allColor) => switch (k) {
      ConfigOpKind.setText => 'טקסטים',
      ConfigOpKind.setEmoji => 'אמוג׳ים',
      ConfigOpKind.setHidden => 'הסתרות',
      ConfigOpKind.setOrder => 'סידורים',
      ConfigOpKind.setStyle => allColor ? 'צבעים' : 'עיצובים',
      ConfigOpKind.setAction => 'פעולות',
    };

String _run(List<ConfigOp> ops) =>
    broadcastRow(ops, kindEmoji: _emoji, kindPlural: _plural).text;

void _eq(String got, String want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got="$got" want="$want"');
}

void main() {
  var n = 0;

  // §4 — קבוצה מאותו-סוג ⇒ '$N שינויים'
  _eq(_run(const [SetText(), SetText(), SetText()]), '3 שינויים', '1 same-kind'); n++;

  // §9 — קיבוץ בסדר-enum: 2 text לפני 1 hidden
  _eq(_run(const [SetText(), SetHidden(), SetText()]),
      '✏️ 2 טקסטים · 👁️ 1 הסתרות', '2 mixed order'); n++;

  // styleAllColor=true (כל ה-SetStyle צבע) ⇒ 'צבעים'
  _eq(
      _run(const [
        SetText(),
        SetStyle(style: OpStyle(colorToken: 'brand')),
        SetStyle(style: OpStyle(colorToken: 'danger')),
      ]),
      '✏️ 1 טקסטים · 🎨 2 צבעים',
      '3 all-color'); n++;

  // styleAllColor=false (SetStyle אחד בלי colorToken) ⇒ 'עיצובים'
  _eq(
      _run(const [
        SetText(),
        SetStyle(style: OpStyle(colorToken: 'brand')),
        SetStyle(), // style==null ⇒ שובר את styleAllColor
      ]),
      '✏️ 1 טקסטים · 🎨 2 עיצובים',
      '4 not-all-color'); n++;

  // ops ריק ⇒ counts ריק (≠1) ⇒ frags ריק ⇒ מחרוזת ריקה
  _eq(_run(const []), '', '5 empty'); n++;

  // SetStyle יחיד (לא-צבע) ⇒ עדיין same-kind ⇒ '1 שינויים' (§4 לפני §9)
  _eq(_run(const [SetStyle()]), '1 שינויים', '6 single style'); n++;

  // שלושה סוגים שונים ⇒ סדר-enum מלא: order לפני style לפני action
  _eq(_run(const [SetAction(), SetOrder(), SetStyle(style: OpStyle(colorToken: 'x'))]),
      '🔢 1 סידורים · 🎨 1 צבעים · ⚡ 1 פעולות', '7 three kinds enum-order'); n++;

  assert(_run(const [SetText(), SetText()]) == '2 שינויים', 'assert-live');
  print('OK broadcastRow: $n asserts passed');
}
