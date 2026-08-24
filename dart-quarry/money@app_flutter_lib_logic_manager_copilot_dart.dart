// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · money — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/manager_copilot.dart:59-100 (42 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): toString, write, take, promptSafeText, clamp, writeln
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
  String money(int n) {
    final neg = n < 0;
    final s = n.abs().toString(); // group over abs, re-apply sign (no "₪-,100")
    final b = StringBuffer();
    for (var i = 0; i < s.length; i++) {
      if (i > 0 && (s.length - i) % 3 == 0) b.write(',');
      b.write(s[i]);
    }
    return '${neg ? '-' : ''}₪$b';
  }

  // Pipeline line in canonical stage order, only stages with a count.
  final pipe = [
    for (final e in kCopilotStageLabel.entries)
      if ((stageCounts[e.key] ?? 0) > 0) '${e.value} ${stageCounts[e.key]}',
  ].join(' · ');

  // Top customers by spend (already sorted desc) — name, spend, orders, credit %.
  final top = [
    for (final c in customers.take(5))
      // Sanitize the name: it is contractor-controlled free-text flowing into the
      // prompt — collapse newlines + cap so it can't inject a fake context line or
      // an "ignore the above" payload (the same lever guarded in reject_reason).
      // Credit % is clamped to 100 to match every dashboard surface (no "180%").
      '  - ${promptSafeText(c.name, maxLen: 40, collapseWhitespace: true)}: ${money(c.totalSpend)} ב-${c.orderCount} הזמנות'
          '${c.creditLimit > 0 ? ' (ניצול-אשראי ${((c.totalSpend / c.creditLimit) * 100).round().clamp(0, 100)}%)' : ''}',
  ].join('\n');

  final creditLimitTotal =
      customers.fold<int>(0, (s, c) => s + c.creditLimit);

  final b = StringBuffer()
    ..writeln('— הזמנות: סה"כ $totalOrders · פתוחות ${analytics.openOrders} · מחזור ${money(revenue)}')
    ..writeln('— צינור-ההזמנות: ${pipe.isEmpty ? 'אין הזמנות' : pipe}')
    ..writeln('— קטלוג: ${analytics.catalogCount} מוצרים · ${analytics.categoryCount} קטגוריות · חנויות פעילות ${analytics.storesLabel}')
    ..writeln('— אשראי (פיקוח): סך-מסגרות ${money(creditLimitTotal)} · סך-ניצול ${money(revenue)}')
    ..writeln('— לקוחות מובילים (לפי רכש):')
    ..write(top.isEmpty ? '  (אין לקוחות עדיין)' : top);
  return b.toString();
}

/// The grounded Q&A prompt — context + the owner's (capped) question.
