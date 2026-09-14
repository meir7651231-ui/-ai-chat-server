// בדיקת-Golden · kindOf — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'kind_of.dart';

// --- מימוש-השקע verbatim מהמקור (לבדיקה בלבד; לא אטום מיובא) ---
bool _src_isSizeToken(String w) {
  if (RegExp(r'^DN', caseSensitive: false).hasMatch(w)) return true;
  return RegExp(r'^[\d]+([./×x\-"׳״⅛¼½¾⅜⅝⅞]+[\d"׳״]*)*[\"׳״]?$')
          .hasMatch(w) &&
      RegExp(r'\d').hasMatch(w);
}

void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((kindOf('size', isSizeToken: _src_isSizeToken)).toString(), 'null', '#0'); n++;
  _eq((kindOf('color', isSizeToken: _src_isSizeToken)).toString(), 'null', '#1'); n++;
  _eq((kindOf('model', isSizeToken: _src_isSizeToken)).toString(), 'null', '#2'); n++;
  _eq((kindOf('subtype', isSizeToken: _src_isSizeToken)).toString(), 'null', '#3'); n++;
  _eq((kindOf('', isSizeToken: _src_isSizeToken)).toString(), 'null', '#4'); n++;
  _eq((kindOf('abc', isSizeToken: _src_isSizeToken)).toString(), 'null', '#5'); n++;
  _eq((kindOf('כהן לוי', isSizeToken: _src_isSizeToken)).toString(), 'null', '#6'); n++;
  _eq((kindOf('2026-08-24', isSizeToken: _src_isSizeToken)).toString(), 'AttrKind.size', '#7'); n++;
  _eq((kindOf('0501234567', isSizeToken: _src_isSizeToken)).toString(), 'AttrKind.size', '#8'); n++;
  _eq((kindOf('  x  ', isSizeToken: _src_isSizeToken)).toString(), 'null', '#9'); n++;
  print('✓ kindOf: '+n.toString()+' Golden');
}
