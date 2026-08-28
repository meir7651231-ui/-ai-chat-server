import '../dart-data/worker_short_name-terms.dart' as td_worker_short_name;
// בדיקת-Golden · workerShortName — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'worker_short_name.dart';
void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((workerShortName(0, kWorkers: ['רן (עובד)', 'עומר (עובד)'], term: (k)=>td_worker_short_name.kTerms[k]!)).toString(), 'רן', '#0'); n++;
  _eq((workerShortName(1, kWorkers: ['רן (עובד)', 'עומר (עובד)'], term: (k)=>td_worker_short_name.kTerms[k]!)).toString(), 'עומר', '#1'); n++;
  { var threw=false; try{ workerShortName(-3, kWorkers: ['רן (עובד)', 'עומר (עובד)'], term: (k)=>td_worker_short_name.kTerms[k]!); }catch(_){threw=true;} if(!threw) throw StateError('FAIL #2: expected throw'); n++; }
  { var threw=false; try{ workerShortName(100, kWorkers: ['רן (עובד)', 'עומר (עובד)'], term: (k)=>td_worker_short_name.kTerms[k]!); }catch(_){threw=true;} if(!threw) throw StateError('FAIL #3: expected throw'); n++; }
  { var threw=false; try{ workerShortName(786, kWorkers: ['רן (עובד)', 'עומר (עובד)'], term: (k)=>td_worker_short_name.kTerms[k]!); }catch(_){threw=true;} if(!threw) throw StateError('FAIL #4: expected throw'); n++; }
  print('✓ workerShortName: '+n.toString()+' Golden');
}
