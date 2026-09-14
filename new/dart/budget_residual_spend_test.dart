// בדיקת-Golden · budgetResidualSpend — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'budget_residual_spend.dart';

void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((budgetResidualSpend(const <String, int>{}, const <String>{})).toString(), '0', '#0'); n++;
  _eq((budgetResidualSpend(const <String, int>{}, const <String>{'a'})).toString(), '0', '#1'); n++;
  _eq((budgetResidualSpend(const <String, int>{'a': 1}, const <String>{})).toString(), '1', '#2'); n++;
  _eq((budgetResidualSpend(const <String, int>{'a': 1}, const <String>{'a'})).toString(), '0', '#3'); n++;
  print('✓ budgetResidualSpend: '+n.toString()+' Golden');
}
