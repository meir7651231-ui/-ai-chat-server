// בדיקת-Golden · facetTokens — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'facet_tokens.dart';

void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((facetTokens('')).toString(), '[]', '#0'); n++;
  _eq((facetTokens('abc')).toString(), '[abc]', '#1'); n++;
  _eq((facetTokens('כהן לוי')).toString(), '[כהן, לוי]', '#2'); n++;
  _eq((facetTokens('2026-08-24')).toString(), '[]', '#3'); n++;
  _eq((facetTokens('0501234567')).toString(), '[]', '#4'); n++;
  _eq((facetTokens('  x  ')).toString(), '[]', '#5'); n++;
  print('✓ facetTokens: '+n.toString()+' Golden');
}
