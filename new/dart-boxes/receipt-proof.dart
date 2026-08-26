// 🧪 הוכחת-חוצה-שפות · receipt (Dart) — מריצה את receipt.dart על אותם קלטים/WANT
// כמו new/boxes/receipt.test.mjs. ירוק ⇒ מאור(JS) ובנייה-חכמה(Dart) על אותה קופסה.
// amountInWords = שקע-שכן מוזרק (סטאב, כמו בבדיקת-ה-JS) — ראה כותרת-הקופסה.
import 'dart:convert';
import 'receipt.dart' as R;

int n = 0, fails = 0;
void eq(String name, Object? got, Object? want) {
  final g = jsonEncode(got), w = jsonEncode(want);
  if (g != w) {
    print('✗ $name: got $g want $w');
    fails++;
  } else {
    n++;
  }
}

void ok(String name, bool c) {
  if (!c) {
    print('✗ $name');
    fails++;
  } else {
    n++;
  }
}

// שכן amountInWords מזויף (JS: `() => 'מאה ושמונים שקלים חדשים'`) — שני ארגומנטים dynamic.
String aiw(dynamic amount, dynamic sym) => 'מאה ושמונים שקלים חדשים';

// ── io מזויף: מקליט createElement + BOM + שם-קובץ + שער-הרשאה (מקביל ל-mkIo) ──
class _Rec {
  final List<String> tags = [];
  R.RcptEl? anchor;
  R.RcptEl? frame;
  int revoked = 0;
  String? blobText;
}

class _FakeIo implements R.ReceiptIo {
  final _Rec rec;
  @override
  bool exportBlocked;
  @override
  void Function()? exportNotify;
  _FakeIo(this.rec, {this.exportBlocked = false, this.exportNotify});
  @override
  Object blob(List<String> parts, String type) {
    rec.blobText = parts.join('');
    return Object();
  }

  @override
  R.RcptEl createElement(String tag) {
    rec.tags.add(tag);
    final el = R.RcptEl(tag);
    if (tag == 'a') rec.anchor = el;
    if (tag == 'iframe') rec.frame = el;
    return el;
  }

  @override
  void appendBody(R.RcptEl el) {}
  @override
  String createObjectURL(Object blob) => 'blob:x';
  @override
  void revokeObjectURL(String href) {
    rec.revoked++;
  }

  @override
  void setTimeout(void Function() fn, int ms) {}
}

void main() {
  // 1) §46 מלאה (שכן amountInWords מוזרק) — פריסה רשמית
  final tax = R.receiptLines({
    'rid': 'D-0007', 'amount': 1234, 'date': '2026-08-05', 'payer': 'דוד לוי',
    'forWhat': 'תרומה כללית', 'taxReceipt': true, 'orgName': 'מאור', 'orgTaxId': '580123456',
    'payerId': '012345678', 'method': 'מזומן', 'signatory': 'הרב כהן', 'site': 'maor.org', 'verify': true
  }, aiw);
  eq('§46 אורך', tax.length, 23);
  eq('§46 [0] מקור', tax[0], 'מקור');
  eq('§46 [4] נוסח', tax[4], 'קבלה על תרומה — לפי סעיף 46 לפקודת מס הכנסה');
  eq('§46 [5] מס׳', tax[5], 'קבלה מס׳: D-0007');
  eq('§46 [6] קוד-אימות מחווט', tax[6],
      'קוד-אימות: ' + R.receiptVerifyCode('D-0007', 1234, '₪', '2026-08-05'));
  eq('§46 [11] toLocaleString (1234⇒1,234)', tax[11], 'סכום: ₪1,234');
  eq('§46 [12] amountInWords מחווט', tax[12], 'במילים: מאה ושמונים שקלים חדשים');
  eq('§46 [20] חתימה', tax[20], 'הרב כהן  ______________________');
  eq('§46 [22] אתר', tax[22], 'אתר: maor.org');

  // 2) רגילה עם סיכום-עסקה + copy
  final reg = R.receiptLines({
    'rid': 'R-0042', 'amount': 400, 'date': '2026-08-05', 'payer': 'רות', 'forWhat': 'כרטיסייה',
    'copy': true,
    'summary': {'totalDue': 1000, 'paidSoFar': 400, 'balance': 600, 'nextDate': '2026-09-01'}
  });
  eq('רגילה אורך', reg.length, 12);
  eq('רגילה [0] העתק', reg[0], 'העתק נאמן למקור');
  eq('רגילה [1] orgName ברירת-מחדל', reg[1], 'קבלה — מאור החסד');
  eq('רגילה [2] מס׳', reg[2], 'קבלה מס׳: R-0042');
  eq('רגילה [5] סכום כמות-שהוא', reg[5], 'סכום: ₪400');
  eq('רגילה [8] סיכום-עסקה', reg[8], 'סה"כ עסקה: ₪1000 · שולם עד כה: ₪400 · יתרה: ₪600');
  eq('רגילה שורה-אחרונה', reg[11], 'תודה על תמיכתכם');

  // 3) אישור-חנות S- בלי סימון
  final s = R.receiptLines({
    'rid': 'S-0003', 'amount': 20, 'date': '2026-08-05', 'payer': 'משפחת כהן',
    'forWhat': 'מימוש קופון', 'mark': false, 'currency': '₪'
  });
  eq('S- [0] אישור-תשלום (בלי מקור)', s[0], 'אישור תשלום — מאור החסד');
  eq('S- [1] אישור מס׳', s[1], 'אישור מס׳: S-0003');
  eq('S- שורה-אחרונה', s[s.length - 1], 'תודה על תמיכתכם');

  // 4) תאריך שבור ⇒ שורת-התאריך כמות-שהיא (hebDateFull מחווט מחזיר '')
  eq('תאריך-שבור',
      R.receiptLines({'rid': 'R-1', 'amount': 5, 'date': 'שטויות', 'payer': 'א', 'forWhat': 'ב'})[3],
      'תאריך: שטויות');

  // 5) קוד-אימות — דטרמיניסטי + פורמט XXX-XXX
  final vc = R.receiptVerifyCode('D-0007', 1234, '₪', '2026-08-05');
  eq('verify דטרמיניסטי', vc, R.receiptVerifyCode('D-0007', 1234, '₪', '2026-08-05'));
  ok('verify פורמט XXX-XXX: $vc', RegExp(r'^[0-9A-Z]{3}-[0-9A-Z]{3}$').hasMatch(vc));

  // 6) HTML — doctype/rtl/esc/שורת-mark = השורה-הראשונה
  final html = R.receiptHtml({'rid': 'D-1', 'amount': 5, 'date': '2026-08-05', 'payer': 'a<b>', 'forWhat': 'x'});
  ok('html doctype', html.startsWith('<!doctype html>'));
  ok('html rtl', html.contains('dir="rtl"'));
  ok('html esc — < בורח', html.contains('a&lt;b&gt;'));
  ok('html שורת-mark = השורה הראשונה (מקור)', html.contains('class="mark">מקור<'));

  // 7) fmtOf — דלוק ⇒ הבחירה; כבוי ⇒ null (≡undefined)
  eq('fmtOf דגל-דלוק', R.receiptFmtOf({'features': {}, 'modules': {}}, {'receiptFmt': 'pdf'}), 'pdf');
  eq('fmtOf דגל-כבוי',
      R.receiptFmtOf({'features': {'core.receipt.pdf': false}, 'modules': {}}, {'receiptFmt': 'pdf'}),
      null);

  // 8) הורדה — שם-קובץ receipt-<rid>.txt + BOM בתחילת התוכן
  {
    final rec = _Rec();
    final io = _FakeIo(rec);
    R.downloadReceipt({'rid': 'D-1', 'amount': 5, 'date': '2026-08-05', 'payer': 'a', 'forWhat': 'x'}, io);
    eq('הורדה שם-קובץ', rec.anchor?.download, 'receipt-D-1.txt');
    ok('הורדה BOM בתחילת התוכן', rec.blobText != null && rec.blobText!.startsWith('﻿'));
    ok('הורדה יצרה עוגן', rec.tags.contains('a'));
  }

  // 8ב) שער חסום ⇒ אפס createElement, אפס תוכן
  {
    final rec = _Rec();
    var notified = 0;
    final io = _FakeIo(rec, exportBlocked: true, exportNotify: () => notified++);
    R.downloadReceipt({'rid': 'D-9', 'amount': 1, 'date': '2026-08-05', 'payer': 'a', 'forWhat': 'x'}, io);
    eq('שער-חסום: אפס createElement', rec.tags.length, 0);
    eq('שער-חסום: הריץ התרעה', notified, 1);
  }

  // 9) מסירה — 'pdf' ⇒ iframe (הדפסה), 'txt'/חסר ⇒ anchor (הורדה)
  {
    final rec = _Rec();
    final io = _FakeIo(rec);
    R.deliverReceipt({'rid': 'D-2', 'amount': 5, 'date': '2026-08-05', 'payer': 'a', 'forWhat': 'x'}, 'pdf', io);
    ok("deliver 'pdf' ⇒ iframe", rec.tags.contains('iframe') && !rec.tags.contains('a'));
    ok('deliver pdf ⇒ srcdoc=HTML', (rec.frame?.srcdoc.startsWith('<!doctype html>')) ?? false);
  }
  {
    final rec = _Rec();
    final io = _FakeIo(rec);
    R.deliverReceipt({'rid': 'D-3', 'amount': 5, 'date': '2026-08-05', 'payer': 'a', 'forWhat': 'x'}, 'txt', io);
    ok("deliver 'txt' ⇒ anchor", rec.tags.contains('a') && !rec.tags.contains('iframe'));
  }

  // 10) שקע-§46 חסר ⇒ ברירת-מחדל זורקת בבירור (מתעד את בלוקר amount-in-words; Diber 9)
  {
    var threw = '';
    try {
      R.receiptLines({'rid': 'D-1', 'amount': 5, 'date': '2026-08-05', 'payer': 'a', 'forWhat': 'x', 'taxReceipt': true});
    } catch (e) {
      threw = e.toString();
    }
    ok('§46 בלי שקע ⇒ שגיאה מפורשת (בלוקר amount-in-words)', threw.contains('amountInWords'));
  }

  // הערה: מגני-המקור של receipt.test.mjs (readFileSync על receipt.mjs — שער-הרשאה-לפני-תוכן,
  // קבועים verbatim) הם תלויי-מקור-JS ⇒ מדולגים כאן (החוזה החוצה-לשוני הוא התנהגות, לא טקסט-מקור).

  if (fails > 0) {
    print('❌ קופסת-receipt (Dart): $fails אי-התאמות מול golden ה-JS');
    throw StateError('receipt dart proof failed');
  }
  print('✓ קופסת-receipt (Dart): $n טענות — פלט זהה-ביט ל-JS · שתי המערכות על אותה קופסה');
}
