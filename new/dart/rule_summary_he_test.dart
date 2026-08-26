// בדיקת-חוזה · ruleSummaryHe — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/rule_summary_he_test.dart
import 'rule_summary_he.dart';

const Map<String, String> _ops = {'gte': '≥', 'eq': '='};

void _eq(String got, String want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got="$got" want="$want"');
}

void main() {
  var n = 0;

  _eq(
    ruleSummaryHe(
      triggerLabel: 'הזמנה חדשה',
      fieldLabel: 'סכום',
      opRaw: 'gte',
      value: 500,
      actionLabel: 'שלח מייל',
      opLabels: _ops,
    ),
    'הזמנה חדשה · סכום ≥ 500 · שלח מייל',
    '1 numeric gte',
  );
  n++;

  _eq(
    ruleSummaryHe(
      triggerLabel: 'הזמנה חדשה',
      fieldLabel: 'דרגה',
      opRaw: 'eq',
      value: 'VIP',
      actionLabel: 'שלח מייל',
      opLabels: _ops,
    ),
    'הזמנה חדשה · דרגה = VIP · שלח מייל',
    '2 string eq',
  );
  n++;

  // 3 — אופרטור לא-במפה נופל לגולמי.
  _eq(
    ruleSummaryHe(
      triggerLabel: 'ט',
      fieldLabel: 'ס',
      opRaw: 'lt',
      value: 10,
      actionLabel: 'א',
      opLabels: _ops,
    ),
    'ט · ס lt 10 · א',
    '3 op fall-through',
  );
  n++;

  // 4 — value בוליאני מוטבע דרך toString.
  _eq(
    ruleSummaryHe(
      triggerLabel: 'ט',
      fieldLabel: 'ס',
      opRaw: 'eq',
      value: true,
      actionLabel: 'א',
      opLabels: _ops,
    ),
    'ט · ס = true · א',
    '4 bool value',
  );
  n++;

  assert(
    ruleSummaryHe(
          triggerLabel: 'a',
          fieldLabel: 'b',
          opRaw: 'eq',
          value: 1,
          actionLabel: 'c',
          opLabels: _ops,
        ) ==
        'a · b = 1 · c',
    'assert-live guard',
  );
  print('OK ruleSummaryHe: $n asserts passed');
}
