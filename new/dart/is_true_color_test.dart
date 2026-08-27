// בדיקת-Golden · isTrueColor — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'is_true_color.dart';
void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((isTrueColor('', kTrueColors: {
  'אדום', 'אפור', "בז'", 'גרפיטי', 'ירוק', 'כחול', 'כתום',
  'לבן', 'מט שחור', 'פרגמון', 'שחור', 'שחור ירוק', 'שחור מט',
})).toString(), 'false', '#0'); n++;
  _eq((isTrueColor('abc', kTrueColors: {
  'אדום', 'אפור', "בז'", 'גרפיטי', 'ירוק', 'כחול', 'כתום',
  'לבן', 'מט שחור', 'פרגמון', 'שחור', 'שחור ירוק', 'שחור מט',
})).toString(), 'false', '#1'); n++;
  _eq((isTrueColor('כהן לוי', kTrueColors: {
  'אדום', 'אפור', "בז'", 'גרפיטי', 'ירוק', 'כחול', 'כתום',
  'לבן', 'מט שחור', 'פרגמון', 'שחור', 'שחור ירוק', 'שחור מט',
})).toString(), 'false', '#2'); n++;
  _eq((isTrueColor('2026-08-24', kTrueColors: {
  'אדום', 'אפור', "בז'", 'גרפיטי', 'ירוק', 'כחול', 'כתום',
  'לבן', 'מט שחור', 'פרגמון', 'שחור', 'שחור ירוק', 'שחור מט',
})).toString(), 'false', '#3'); n++;
  _eq((isTrueColor('0501234567', kTrueColors: {
  'אדום', 'אפור', "בז'", 'גרפיטי', 'ירוק', 'כחול', 'כתום',
  'לבן', 'מט שחור', 'פרגמון', 'שחור', 'שחור ירוק', 'שחור מט',
})).toString(), 'false', '#4'); n++;
  _eq((isTrueColor('  x  ', kTrueColors: {
  'אדום', 'אפור', "בז'", 'גרפיטי', 'ירוק', 'כחול', 'כתום',
  'לבן', 'מט שחור', 'פרגמון', 'שחור', 'שחור ירוק', 'שחור מט',
})).toString(), 'false', '#5'); n++;
  print('✓ isTrueColor: '+n.toString()+' Golden');
}
