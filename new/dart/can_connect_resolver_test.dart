// 🧪 בדיקת-חוזה · canConnectResolver — מוכיחה את דוגמאות-החוזה עצמן (חוק-4).
// מקור-ההתנהגות: buildsmart/app_flutter/lib/domain/connection_resolver.dart:211-222.
// מייבאת אך ורק את האטום-שלה (דיבר-4).
// DoD: dart run --enable-asserts new/dart/can_connect_resolver_test.dart ⇒ exit 0.

import 'can_connect_resolver.dart';

/// מחזיק-תוצאה מקומי-לבדיקה (בקופסה: ConnectResult; כאן R גנרי מולבש).
class TRes {
  const TRes(this.tag, {this.mates = false, this.severity});
  final String tag;
  final bool mates;
  final String? severity; // null ⇔ אין-miss (מקביל ל-ConnectResult.severity)
}

/// מפרט-מוצר מקומי (בקופסה: ProductConnectorSpec; כאן רק ends נקרא).
class TSpec {
  const TSpec(this.ends);
  final List<String> ends;
}

void main() {
  var n = 0;
  void ok(bool cond, String msg) {
    assert(cond, msg);
    n++;
  }

  const noRule = TRes('noRule');
  const noMatch = TRes('noMatch'); // mates:false, severity:null — "אין-חוקה" לזוג

  // רתמה: טבלת-תוצאות פר-זוג + יומן-קריאות (מוכיח סדר + הפסקה-מוקדמת).
  List<String> calls = [];
  TRes Function(String, String) eval(Map<String, TRes> table) {
    calls = [];
    return (a, b) {
      calls.add('$a|$b');
      return table['$a|$b'] ?? noMatch;
    };
  }

  R run<R>(TSpec a, TSpec b, TRes Function(String, String) pair) =>
      canConnectResolver<TSpec, String, TRes>(
        a,
        b,
        ends: (s) => s.ends,
        endPairMemoized: pair,
        mates: (r) => r.mates,
        hasMissSeverity: (r) => r.severity != null,
        noRule: noRule,
      ) as R;

  const a = TSpec(['a1', 'a2']);
  const b = TSpec(['b1', 'b2']);

  // ── דוגמה 1 בחוזה: ה-mate הראשון מנצח ומוחזר מיד (‏:213-216) ─────────────
  const mate12 = TRes('mate12', mates: true);
  var r = run<TRes>(a, b, eval({'a1|b2': mate12}));
  ok(identical(r, mate12), 'דוגמה-1: תוצאת-ה-mate מוחזרת בזהות-אובייקט');
  ok(calls.join(',') == 'a1|b1,a1|b2',
      'דוגמה-1: סדר a.ends-חיצוני/b.ends-פנימי + עצירה מיד — היה: $calls');

  // ── דוגמה 2: ‏miss קודם אינו חוסם mate מאוחר (‏:216 קודם ל-:217) ─────────
  const missEarly = TRes('missEarly', severity: 'warning');
  r = run<TRes>(a, b, eval({'a1|b1': missEarly, 'a1|b2': mate12}));
  ok(identical(r, mate12), 'דוגמה-2: ה-mate מנצח גם אחרי miss');
  ok(calls.length == 2, 'דוגמה-2: הוערכו 2 זוגות בלבד — היה: $calls');

  // ── דוגמה 3: אין-mate ⇒ ה-miss ה-ראשון (severity!=null) מעצב את הפלט ─────
  const miss1 = TRes('miss1', severity: 'critical');
  const miss2 = TRes('miss2', severity: 'warning');
  r = run<TRes>(a, b, eval({'a1|b2': miss1, 'a2|b1': miss2}));
  ok(identical(r, miss1),
      'דוגמה-3: ה-miss-הראשון מוחזר בזהות-אובייקט (מאוחר אינו דורס — ‏:217)');
  ok(calls.length == 4, 'דוגמה-3: סריקה מלאה של כל 4 הזוגות — היה: $calls');

  // ── דוגמה 4: אין-mate ואין-miss ⇒ noRule המוזרק (‏:220 · ‏:197-198) ──────
  r = run<TRes>(a, b, eval({}));
  ok(identical(r, noRule), 'דוגמה-4: noRule מוחזר בזהות-אובייקט');
  ok(calls.length == 4, 'דוגמה-4: כל הזוגות הוערכו — היה: $calls');

  // ── דוגמה 5: ends ריק ⇒ noRule, אפס קריאות (‏:209-210) ───────────────────
  r = run<TRes>(const TSpec([]), b, eval({'a1|b1': mate12}));
  ok(identical(r, noRule) && calls.isEmpty,
      'דוגמה-5א: a.ends ריק ⇒ noRule, endPairMemoized לא נקרא');
  r = run<TRes>(a, const TSpec([]), eval({'a1|b1': mate12}));
  ok(identical(r, noRule) && calls.isEmpty,
      'דוגמה-5ב: b.ends ריק ⇒ noRule, endPairMemoized לא נקרא');

  // ── קצה: mates=true מוחזר מיד גם כשנושא severity (‏:216 בודק mates ראשון) ─
  const oddMate = TRes('oddMate', mates: true, severity: 'warning');
  r = run<TRes>(a, b, eval({'a1|b1': oddMate}));
  ok(identical(r, oddMate) && calls.length == 1,
      'קצה: mates נבדק לפני severity — החזרה מידית');

  // ── קצה: miss יחיד בזוג האחרון עדיין נלכד ─────────────────────────────────
  r = run<TRes>(a, b, eval({'a2|b2': miss2}));
  ok(identical(r, miss2), 'קצה: miss בזוג-האחרון (a2b2) מוחזר');

  print('OK canConnectResolver: $n asserts passed');
}
