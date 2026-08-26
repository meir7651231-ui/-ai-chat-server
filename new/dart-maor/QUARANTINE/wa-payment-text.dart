/// חוט · wa-payment-text — נוסח תזכורת-תשלום ידידותית (חוגים) לוואטסאפ.
/// חוזה: wa-payment-text.contract.md · מקור-האמת: new/atoms/wa-payment-text.mjs
/// (חולץ מ-maor/src/lib/wa.ts:58-64). השכנים renderTemplate ו-orgOf = שקעי-פרמטר
/// (חוק-1 — אפס import של אטום אחר).

/// ‏Math.round של JS: חצי מתעגל כלפי +∞ (‏-2.5 ⇒ -2), בניגוד ל-round() של Dart
/// (חצי מתרחק מאפס). ‏NaN/אינסוף עוברים כפי-שהם.
num _jsRound(num x) {
  final d = x.toDouble();
  if (d.isNaN || d.isInfinite) return d;
  final f = d.floorToDouble();
  return (d - f >= 0.5) ? f + 1 : f;
}

/// ‏toLocaleString('he-IL') על שלם: ספרות מערביות + פסיק כמפריד-אלפים
/// (1235 ⇒ '1,235'). שלילי: V8/ICU בעברית מקדים סימן-LTR ‏(U+200E) למינוס.
String _heIlInt(num n) {
  final d = n.toDouble();
  if (d.isNaN) return 'NaN';
  if (d.isInfinite) return d > 0 ? '∞' : '‎-∞';
  final neg = d < 0;
  final digits = (neg ? -d : d).toInt().toString();
  final b = StringBuffer();
  for (var i = 0; i < digits.length; i++) {
    if (i > 0 && (digits.length - i) % 3 == 0) b.write(',');
    b.write(digits[i]);
  }
  return neg ? '‎-$b' : b.toString();
}

dynamic waPaymentText(dynamic orgName, dynamic what, dynamic balance,
    dynamic cfg, dynamic renderTemplate, dynamic orgOf) {
  return renderTemplate(cfg, 'wa.payment', {
    'org': orgOf(orgName),
    'what': what,
    'amount': _heIlInt(_jsRound(balance)),
  });
}
