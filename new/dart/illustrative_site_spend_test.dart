// בדיקת-Golden · illustrativeSiteSpend — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'illustrative_site_spend.dart';

void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((illustrativeSiteSpend(0, 0, 0)).toString(), '0', '#0'); n++;
  _eq((illustrativeSiteSpend(0, 0, 1)).toString(), '0', '#1'); n++;
  _eq((illustrativeSiteSpend(0, 0, -3)).toString(), '0', '#2'); n++;
  _eq((illustrativeSiteSpend(0, 0, 100)).toString(), '0', '#3'); n++;
  _eq((illustrativeSiteSpend(0, 0, 786)).toString(), '0', '#4'); n++;
  _eq((illustrativeSiteSpend(0, 1, 0)).toString(), '0.0', '#5'); n++;
  _eq((illustrativeSiteSpend(0, 1, 1)).toString(), '0.0', '#6'); n++;
  _eq((illustrativeSiteSpend(0, 1, -3)).toString(), '0.0', '#7'); n++;
  _eq((illustrativeSiteSpend(0, 1, 100)).toString(), '0.0', '#8'); n++;
  _eq((illustrativeSiteSpend(0, 1, 786)).toString(), '0.0', '#9'); n++;
  _eq((illustrativeSiteSpend(0, -3, 0)).toString(), '0', '#10'); n++;
  _eq((illustrativeSiteSpend(0, -3, 1)).toString(), '0', '#11'); n++;
  print('✓ illustrativeSiteSpend: '+n.toString()+' Golden');
}
