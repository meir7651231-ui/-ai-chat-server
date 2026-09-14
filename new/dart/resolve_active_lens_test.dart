// בדיקת-Golden · resolveActiveLens — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'resolve_active_lens.dart';

void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((resolveActiveLens(CatalogLens.category, const <CatalogLens>[])).toString(), 'CatalogLens.category', '#0'); n++;
  _eq((resolveActiveLens(CatalogLens.smartTree, const <CatalogLens>[CatalogLens.category,CatalogLens.smartTree])).toString(), 'CatalogLens.smartTree', '#1'); n++;
  _eq((resolveActiveLens(CatalogLens.variant, const <CatalogLens>[CatalogLens.smartTree])).toString(), 'CatalogLens.smartTree', '#2'); n++;
  _eq((resolveActiveLens(CatalogLens.category, const <CatalogLens>[CatalogLens.category,CatalogLens.smartTree])).toString(), 'CatalogLens.category', '#3'); n++;
  _eq((resolveActiveLens(CatalogLens.category, const <CatalogLens>[CatalogLens.smartTree])).toString(), 'CatalogLens.smartTree', '#4'); n++;
  _eq((resolveActiveLens(CatalogLens.smartTree, const <CatalogLens>[])).toString(), 'CatalogLens.category', '#5'); n++;
  _eq((resolveActiveLens(CatalogLens.smartTree, const <CatalogLens>[CatalogLens.smartTree])).toString(), 'CatalogLens.smartTree', '#6'); n++;
  _eq((resolveActiveLens(CatalogLens.variant, const <CatalogLens>[])).toString(), 'CatalogLens.category', '#7'); n++;
  _eq((resolveActiveLens(CatalogLens.variant, const <CatalogLens>[CatalogLens.category,CatalogLens.smartTree])).toString(), 'CatalogLens.category', '#8'); n++;
  print('✓ resolveActiveLens: '+n.toString()+' Golden');
}
