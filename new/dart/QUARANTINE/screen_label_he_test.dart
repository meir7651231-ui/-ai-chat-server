import '../dart-data/screen_label_he.dart';
// בדיקת-Golden · screenLabelHe — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'screen_label_he.dart';

void _eq(String got, String want, String lbl) {
  if (got != want) throw StateError('FAIL [$lbl]: got="$got" want="$want"');
}

// שקע-אמת: normalizeScreen עם alias יחיד מדגים כיווץ-כפילות; humanize = גיבוי-זנב.
String _normalize(String s) => s == 'home_v2' ? 'home' : s;
String _humanize(String s) => 'HUMAN:$s';

void main() {
  var n = 0;
  // מזהה ישיר במפה.
  _eq(screenLabelHe('home', normalizeScreen: _normalize, humanize: _humanize, kScreenLabelsHe: kKScreenLabelsHe),
      'בית', '#0');
  n++;
  // מזהה מורכב במפה.
  _eq(
      screenLabelHe('courier_portal_tab',
          normalizeScreen: _normalize, humanize: _humanize, kScreenLabelsHe: kKScreenLabelsHe),
      'שליח — פורטל',
      '#1');
  n++;
  // נרמול-כפילות: 'home_v2' → 'home' → 'בית'.
  _eq(screenLabelHe('home_v2', normalizeScreen: _normalize, humanize: _humanize, kScreenLabelsHe: kKScreenLabelsHe),
      'בית', '#2');
  n++;
  // חוסר-התאמה ⇒ נפילה ל-humanize (על המפתח המנורמל).
  _eq(
      screenLabelHe('totally_unknown_zzz',
          normalizeScreen: _normalize, humanize: _humanize, kScreenLabelsHe: kKScreenLabelsHe),
      'HUMAN:totally_unknown_zzz',
      '#3');
  n++;
  print('✓ screenLabelHe: ' + n.toString() + ' Golden');
}
