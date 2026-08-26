// רתמת-זהב · normalize-prices (Dart) — אותם קלטים/WANT כמו new/atoms/normalize-prices.test.mjs.
// שקעי-דמה כדוגמאות-החוזה (הבדיקה מייבאת רק את האטום שלה).
import 'dart:convert';
import 'normalize-prices.dart';

const allModules = ['families', 'courses'];
const defaultIntegrationPrices = {'whatsapp': 50, 'ai': 120};
const defaultPrices = {
  'base': 290,
  'modules': {'families': 0, 'courses': 120},
  'integrations': defaultIntegrationPrices,
  'sizeMult': {'small': 1, 'medium': 1.6, 'large': 2.4},
  'setup': 1500,
  'enterprise': {'oneTime': 55000, 'annualMaintenance': 9000},
};
Map<String, dynamic> norm(dynamic raw) =>
    normalizePrices(raw, allModules, defaultPrices, defaultIntegrationPrices);

int f = 0;
void eq(String name, Object? got, Object? want) {
  final g = jsonEncode(got), w = jsonEncode(want);
  if (g != w) { print('✗ $name: $g ≠ $w'); f = 1; }
}

void main() {
  eq('דוגמה 1 (null ⇒ ברירות-מחדל)', norm(null), {
    'base': 290,
    'modules': {'families': 0, 'courses': 120},
    'integrations': {'whatsapp': 50, 'ai': 120},
    'sizeMult': {'small': 1, 'medium': 1.6, 'large': 2.4},
    'setup': 1500,
    'enterprise': {'oneTime': 55000, 'annualMaintenance': 9000},
  });
  eq('דוגמה 2 (שלילי)', norm({'base': -5})['base'], 290);
  final r3 = norm({'base': 350, 'modules': {'courses': 0}});
  eq('דוגמה 3 (אפס חוקי)', [r3['base'], (r3['modules'] as Map)['courses']], [350, 0]);
  final r4 = norm({'base': '100', 'sizeMult': {'small': double.nan}});
  eq('דוגמה 4 (מחרוזת/NaN)', [r4['base'], (r4['sizeMult'] as Map)['small']], [290, 1]);
  eq('דוגמה 5 (מודול זר)', norm({'modules': {'shop': 999}})['modules'], {'families': 0, 'courses': 120});
  eq('דוגמה 6 (הרחבה זרה)', norm({'integrations': {'whatsapp': 70, 'junk': 5}})['integrations'], {'whatsapp': 70, 'ai': 120});

  if (f != 0) throw StateError('normalize-prices dart golden failed');
  print('✓ normalize-prices (Dart): 6 דוגמאות-חוזה — זהה-ביט למקור-JS');
}
