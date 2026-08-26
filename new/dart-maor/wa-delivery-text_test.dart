// בדיקת-חוזה (רתמת-זהב) · waDeliveryText — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/wa-delivery-text.test.mjs,
// כולל שקעי-האמת המקומיים כהתנהגות maor (renderTemplate — lib/templates.ts:57-66
// עם ברירת-המחדל של 'wa.delivery' · orgOf — wa.ts:47-49). אם עובר ⇒ Dart≡JS.
// כשל ⇒ StateError. הרצה:
//   dart run --enable-asserts new/dart-maor/wa-delivery-text_test.dart  ⇒ exit 0 + OK
import 'wa-delivery-text.dart';

// renderTemplate — שקע-אמת: דריסת-ארגון cfg?.templates?.[key] מקוצצת; ריקה ⇒
// ברירת-המחדל; החלפת {var} טקסטואלית (split/join). trim כאן על רווחי-ASCII של
// דוגמאות-החוזה — זהה ל-JS.trim עבורן.
const Map<String, String> _defs = {
  'wa.delivery': 'שלום {name}, משלוח מ{org} בדרך אליכם היום 🚚',
};

String _renderTemplate(dynamic cfg, dynamic key, dynamic vars) {
  final def = _defs[key] ?? '';
  final raw = (cfg == null
      ? ''
      : ((cfg['templates'] == null ? null : cfg['templates'][key]) ?? ''))
      as String;
  var t = raw.trim();
  if (t.isEmpty) t = def; // JS: `|| def` — '' כוזב
  (vars as Map).forEach((k, v) {
    t = t.split('{' + (k as String) + '}').join(v as String);
  });
  return t;
}

// orgOf — שקע-אמת: orgName.trim() ריק ⇒ 'העמותה'.
String _orgOf(dynamic orgName) {
  final t = (orgName as String).trim();
  return t.isEmpty ? 'העמותה' : t;
}

void _check(String label, String got, String want) {
  if (got != want) {
    throw StateError('FAIL $label: "$got" ≠ "$want"');
  }
}

void main() {
  var n = 0;

  // 1) הרכבה מלאה — org+fam מלאים, בלי cfg.
  _check(
      "('מאור החסד','כהן',undefined)",
      waDeliveryText('מאור החסד', 'כהן', null, _renderTemplate, _orgOf)
          as String,
      'שלום משפחת כהן, משלוח ממאור החסד בדרך אליכם היום 🚚');
  n++;

  // 2) נפילת-ארגון — orgName ריק ⇒ 'העמותה'.
  _check(
      "('','לוי',undefined)",
      waDeliveryText('', 'לוי', null, _renderTemplate, _orgOf) as String,
      'שלום משפחת לוי, משלוח מהעמותה בדרך אליכם היום 🚚');
  n++;

  // 3) טרים — famName ריק ⇒ 'משפחת' לבדו (הרווח הנגרר נגזם).
  _check(
      "('מאור החסד','',undefined)",
      waDeliveryText('מאור החסד', '', null, _renderTemplate, _orgOf) as String,
      'שלום משפחת, משלוח ממאור החסד בדרך אליכם היום 🚚');
  n++;

  // 4) דריסת-ארגון — תבנית מ-cfg.templates גוברת.
  _check(
      "('מאור','לוי',{templates:{'wa.delivery':'היי {name} — מ-{org}!'}})",
      waDeliveryText(
          'מאור',
          'לוי',
          {
            'templates': {'wa.delivery': 'היי {name} — מ-{org}!'}
          },
          _renderTemplate,
          _orgOf) as String,
      'היי משפחת לוי — מ-מאור!');
  n++;

  // 5) דריסה ריקה-אחרי-טרים לא גוברת ⇒ ברירת-המחדל.
  _check(
      "('מאור','לוי',{templates:{'wa.delivery':'  '}})",
      waDeliveryText(
          'מאור',
          'לוי',
          {
            'templates': {'wa.delivery': '  '}
          },
          _renderTemplate,
          _orgOf) as String,
      'שלום משפחת לוי, משלוח ממאור בדרך אליכם היום 🚚');
  n++;

  print('OK waDeliveryText: $n דוגמאות-חוזה — ירוק');
}
