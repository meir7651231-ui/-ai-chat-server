#!/usr/bin/env node
// 🧩 behavior-compose — שכבת-ההרכבה (G34ב · הכרעה-30): התנהגויות = חלקיקים-נבחרים מורכבים **במקום אחד** — gen_behaviors.dart.
//   הקלט = behavior-plan.json (החלקיק המוכח לכל צורך). הפלט = פונקציות bh* (ISO/מחרוזות/מספרים, טהורות) שכל קובץ-מחולל קורא להן:
//   דחייה (בסיס-מועד ⇒ הוספת-ימים ⇒ לא-בשבת) · תזכורות-שלפנינו · תווית-תאריך (חלקים) · «לפני» (חלקים) · תחילת-תוכנית · נרמול-שם/חיפוש/טלפון ·
//   שאילתת-ספרות · קידומת-חיפוש · ספירת-פתוחים · מפרידי-אלפים. אף קובץ-מחולל אחר אינו מייבא חלקיק ישירות (שער behavior ה).
//   בדיקה מחוללת: genesis_gen_behaviors_test.dart. אל תערוך ידנית.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as R from '../root.mjs';
import { readPlan } from './behavior-plan.mjs';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const P = readPlan(); const N = (id) => { const p = P[id]; if (!p || !p.pick) throw new Error(`behavior-compose: אין חלקיק מוכח לצורך ${id}`); return p.pick; };
const files = [...new Set(Object.values(P).filter((p) => p.pick).map((p) => p.file))].sort();
const code = `// 🧩 חולל ע"י behavior-compose (G34ב · הכרעה-30) — שכבת-ההרכבה: התנהגויות מחלקיקים מוכחים (behavior-plan.json), במקום אחד. אל תערוך ידנית.
${files.map((f) => `import '../${f}';`).join('\n')}
import '../dart-data-maor/norm-search-sockets.dart';

String bhIso(DateTime d) => d.toIso8601String().substring(0, 10);
String bhIsoT(DateTime d) => d.toIso8601String().substring(0, 19);
DateTime bhDate(String iso) => DateTime(int.parse(iso.substring(0, 4)), int.parse(iso.substring(5, 7)), int.parse(iso.substring(8, 10)));
/// ימים מאז iso עד todayIso (חיובי = עבר) — חלקיק ${N('iso.daysSince')}; לא-תקין ⇒ 0
int bhDaysSince(String iso, String todayIso) { final n = ${N('iso.daysSince')}(iso, todayIso); return n.isFinite ? n.toInt() : 0; }
String bhWeekStart(String iso) => bhIso(${N('week.start')}(bhDate(iso)));
/// יום-בשבוע 0=ראשון…6=שבת = הרכבה: תחילת-השבוע (${N('week.start')}) + ימים-מאז
int bhWeekday(String iso) => bhDaysSince(bhWeekStart(iso), iso);
String bhPlusDays(String iso, int n) => ${N('iso.addDays')}(iso, n);
/// P8 · רך לא נוחת בשבת
String bhSoftShift(String iso, bool hard) => hard || bhWeekday(iso) != 6 ? iso : bhPlusDays(iso, 1);
/// ב׳-פו · «דחה למחר» מבאיחור = מחר: הבסיס = היום כשהמועד עבר (${N('task.overdue')})
String bhDueBase(String dueIso, String todayIso) => ${N('task.overdue')}({'due': dueIso}, todayIso) ? todayIso : dueIso;
/// ב׳-צא · היסטי-תזכורת שיום-הירי שלהם עוד לפנינו (${N('iso.inRange')})
List<int> bhAheadOffsets(String dueIso, bool hard, String todayIso, List<int> offsets) => [for (final o in offsets) if (${N('iso.inRange')}(bhSoftShift(bhPlusDays(dueIso, -o), hard), (from: todayIso, to: null))) o];
String bhDayMonth(String iso, bool withYear) => int.parse(iso.substring(8, 10)).toString() + '.' + int.parse(iso.substring(5, 7)).toString() + (withYear ? '.' + iso.substring(0, 4) : '');
/// ב׳-מא · תאריך כמו שאומרים — חלקים [סוג, יום-בשבוע, יום.חודש]; המונחים מולבשים בקורא
List<String> bhDayLabelParts(String iso, String todayIso) { final n = -bhDaysSince(iso, todayIso); final wd = bhWeekday(iso).toString(); final dm = bhDayMonth(iso, iso.substring(0, 4) != todayIso.substring(0, 4)); if (n == 0) return ['today', wd, dm]; if (n == 1) return ['tomorrow', wd, dm]; if (n == -1) return ['yesterday', wd, dm]; return [n.abs() <= 6 ? 'weekday' : 'date', wd, dm]; }
/// ב׳-מח · מתי זה קרה — חלקים [סוג, n] (${N('time.minutesBetween')})
List<String> bhAgoParts(String atIsoT, String nowIsoT) { final m = ${N('time.minutesBetween')}(atIsoT, nowIsoT); if (m < 1) return ['now', '0']; if (m < 60) return ['min', m.toString()]; final h = m ~/ 60; if (h < 2) return ['hour', '1']; if (atIsoT.substring(0, 10) == nowIsoT.substring(0, 10)) return ['hours', h.toString()]; return ['day', atIsoT.substring(0, 10)]; }
/// ב׳-צח · תחילת-התוכנית: תחילת-היום, ואם היום התקדם — מעכשיו מעוגל ל-5 דק׳ (${N('time.toMin')}) ⇒ 'HH:MM'
String bhPlanStart(String todayIso, int startHour, String nowIsoT) { final base = startHour * 60; if (nowIsoT.length < 16 || nowIsoT.substring(0, 10) != todayIso) return _hm(base); final tm = ${N('time.toMin')}(nowIsoT.substring(11, 16)); final nowMin = tm is num && tm.isFinite ? tm.toInt() : base; if (nowMin <= base) return _hm(base); return _hm(((nowMin + 4) ~/ 5) * 5); }
String _hm(int m) => (m ~/ 60).toString().padLeft(2, '0') + ':' + (m % 60).toString().padLeft(2, '0');
String bhNormSearch(String s) => ${N('text.normSearch')}(s, normSearch_T);
String bhNormName(String s) => ${N('name.norm')}(s, (t) => ${N('text.normSearch')}(t, normSearch_T));
String bhPhoneDigits(String? s) => ${N('phone.digits')}(s);
/// ב׳-צה · שורה של ספרות («1250» · «052-123») = חיפוש; מחזירה את השורה או ריק
String bhDigitsQuery(String q) { final t = q.trim(); return RegExp(r'^[0-9][0-9,.\\- ]*\$').hasMatch(t) && bhPhoneDigits(t).length >= 2 ? t : ''; }
/// ב׳-צז · «איפה X» ⇒ X (${N('prefix.rule')})
String bhPrefixRest(String s, List<String> words) { final t = s.trim(); for (final w in words) { if (w.isNotEmpty && ${N('prefix.rule')}(w + ' ', t) != null && t.length > w.length + 2) return t.substring(w.length + 1).trim(); } return ''; }
/// ב׳-נב · כמה פתוחים (שלב לפני האחרון; בלי שלבים = הכל) — ${N('count.by')}
int bhOpenCount(List<Map<String, String>> records, int stages) { var n = 0; for (final e in ${N('count.by')}(records, (r) => stages == 0 || (int.tryParse(((r as Map)['__stage'] ?? '0').toString()) ?? 0) < stages - 1 ? 'open' : 'closed')) { if (e[0] == 'open') n = e[1] as int; } return n; }
/// מפרידי-אלפים בלי ₪ (${N('money.fmt')})
String bhThousands(num v) => ${N('money.fmt')}(v).replaceFirst('₪', '');
`;
fs.writeFileSync(path.join(R.outDir(), 'gen_behaviors.dart'), code);
const test = `// 🧩 חולל ע"י behavior-compose — בדיקת שכבת-ההרכבה (היום = 2026-09-08 יום-שלישי). אל תערוך ידנית.
import 'package:buildsmart/genesis/dart-gen-bs/gen_behaviors.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  test('יום-בשבוע · לא-בשבת · בסיס-דחייה · הוספת-ימים', () {
    expect(bhWeekday('2026-09-08'), 2); expect(bhWeekday('2026-09-12'), 6); expect(bhWeekday('2026-09-13'), 0);
    expect(bhSoftShift('2026-09-12', false), '2026-09-13'); expect(bhSoftShift('2026-09-12', true), '2026-09-12');
    expect(bhDueBase('2026-09-01', '2026-09-08'), '2026-09-08'); expect(bhDueBase('2026-09-20', '2026-09-08'), '2026-09-20');
    expect(bhPlusDays('2026-09-30', 1), '2026-10-01'); expect(bhDaysSince('2026-09-05', '2026-09-08'), 3);
  });
  test('תזכורות-שלפנינו · תווית-תאריך · לפני · תחילת-תוכנית', () {
    expect(bhAheadOffsets('2026-09-09', true, '2026-09-08', [3, 1, 0]), [1, 0]);
    expect(bhDayLabelParts('2026-09-13', '2026-09-08'), ['weekday', '0', '13.9']); expect(bhDayLabelParts('2027-10-03', '2026-09-08')[2], '3.10.2027'); expect(bhDayLabelParts('2026-09-09', '2026-09-08')[0], 'tomorrow');
    expect(bhAgoParts('2026-09-08T09:55:00', '2026-09-08T10:00:00'), ['min', '5']); expect(bhAgoParts('2026-09-08T09:59:40', '2026-09-08T10:00:10')[0], 'now');
    expect(bhPlanStart('2026-09-08', 9, '2026-09-08T15:03:00'), '15:05'); expect(bhPlanStart('2026-09-08', 9, '2026-09-08T07:00:00'), '09:00');
  });
  test('נרמול · ספרות · קידומת · פתוחים · אלפים', () {
    expect(bhNormName('רות לוי'), 'רותלוי'); expect(bhNormSearch('שלום'), 'שלומ');
    expect(bhDigitsQuery('1,250'), '1,250'); expect(bhDigitsQuery('ארנונה 1250'), '');
    expect(bhPrefixRest('איפה הפיקדון', ['איפה', 'חפש']), 'הפיקדון'); expect(bhPrefixRest('הפיקדון איפה', ['איפה']), '');
    expect(bhOpenCount([{'__stage': '0'}, {'__stage': '2'}, {}], 3), 2); expect(bhThousands(1650), '1,650');
  });
}
`;
const bsTest = path.join(R.ROOT, '..', 'buildsmart', 'app_flutter', 'test'); if (fs.existsSync(path.join(bsTest, '..', 'pubspec.yaml'))) fs.writeFileSync(path.join(bsTest, 'genesis_gen_behaviors_test.dart'), test);
console.log(`🧩 gen_behaviors.dart · ${files.length} חלקיקים מוכחים ⇒ ${(code.match(/^\w[^\n]* bh\w+\(/gm) || []).length} התנהגויות-מורכבות + בדיקה מחוללת`);
