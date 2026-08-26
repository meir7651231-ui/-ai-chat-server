// 🏅 רתמת-זהב · bs-studio-proof — מריצה golden של 10 האטומים דרך ה-API של הקופסה.
// כל טענה נכשלת ⇒ StateError. הצינור מוכח מקצה-לקצה עם אוצר-הטווח הלכיד של הקופסה.
// הרצה: dart run --enable-asserts new/dart-boxes/bs-studio-proof.dart
import 'bs-studio.dart';

int _n = 0;
void _check(bool ok, String label) {
  if (!ok) throw StateError('FAIL [$label]');
  _n++;
}

void _eqS(String got, String want, String label) =>
    _check(got == want, '$label: got="$got" want="$want"');

bool _eqSet<T>(Set<T> a, Set<T> b) => a.length == b.length && a.containsAll(b);

// namespaceOf: החלק שלפני '.' הראשון; אין '.' ⇒ '' (verbatim studio_scope_tokens_test).
String _ns(String id) {
  final i = id.indexOf('.');
  return i <= 0 ? '' : id.substring(0, i);
}

// שקעי Gantt (verbatim build_tasks_gantt_test).
int _days(DateTime a, DateTime b) => DateTime(b.year, b.month, b.day)
    .difference(DateTime(a.year, a.month, a.day))
    .inDays;
int _done(TaskItem t) => t.status == 'done' ? 100 : 50;

void main() {
  // ═══ אשכול א׳ · סיווג-טווח הסטודיו (Stage-A) ═══

  // studioScopeTokens — הקופסה מזריקה scope:all/scope:screen: (אוצר לכיד).
  _check(_eqSet(studioScopeTokens(elementIds: () => const [], namespaceOf: _ns),
      {'scope:all'}), 'sst empty');
  _check(
      _eqSet(
          studioScopeTokens(
              elementIds: () => const ['home.title', 'home.btn', 'cart.b'],
              namespaceOf: _ns),
          {'scope:all', 'scope:screen:home', 'scope:screen:cart'}),
      'sst two-screens+dedupe');
  _check(
      _eqSet(
          studioScopeTokens(
              elementIds: () => const ['', 'flat'], namespaceOf: _ns),
          {'scope:all'}),
      'sst empty-ns-skipped');

  // studioScopePrompt — הקופסה מזריקה scope:single: (אותו אוצר) ⇒ צינור-לכיד עם sst.
  const instr =
      'בחר token אחד בלבד מהרשימה הסגורה שמתאר את טווח-העריכה, או השב '
      'AMBIGUOUS אם הבקשה אינה חד-משמעית. החזר שורה אחת: ה-token בלבד.';
  String expectedPrompt(List<String> tokenLines, String safe) {
    final b = StringBuffer();
    b.writeln('טווחי-עריכה זמינים (token = תיאור):');
    for (final l in tokenLines) {
      b.writeln(l);
    }
    b.writeln('scope:single:<id> = אלמנט בודד (id אמיתי מהרישום)');
    b.writeln();
    b.writeln('בקשת המנהל: "$safe".');
    b.writeln(instr);
    return b.toString();
  }

  final he = {'scope:all': 'הכול', 'scope:screen:home': 'מסך הבית'};
  final prompt = studioScopePrompt(
    'ערוך את הכפתור  ',
    safeText: (u) => u.trim(),
    scopeTokens: () => {'scope:all', 'scope:screen:home'},
    scopeTokenHe: (t) => he[t] ?? t,
  );
  _eqS(
      prompt,
      expectedPrompt(
          const ['scope:all = הכול', 'scope:screen:home = מסך הבית'],
          'ערוך את הכפתור'),
      'ssp golden (single-prefix from box vocab)');

  // צינור מקצה-לקצה: studioScopeTokens ⇒ studioScopePrompt (אותו אוצר!).
  final live = studioScopeTokens(
      elementIds: () => const ['home.title', 'cart.btn'], namespaceOf: _ns);
  final piped = studioScopePrompt(
    'שנה טקסט',
    safeText: (u) => u,
    scopeTokens: () => live,
    scopeTokenHe: (t) => t,
  );
  _check(
      piped.contains('scope:screen:home = scope:screen:home') &&
          piped.contains('scope:screen:cart = scope:screen:cart') &&
          piped.contains('scope:single:<id>'),
      'pipe sst→ssp coherent vocab');

  // ═══ אשכול ב׳ · דיף-תצוגה — מונחי-פעולה (type-adapter קנוני) ═══

  _eqS(kindEmoji(ConfigOpKind.setText), '✏️', 'ke setText');
  _eqS(kindEmoji(ConfigOpKind.setStyle), '🎨', 'ke setStyle');
  _eqS(kindEmoji(ConfigOpKind.setAction), '⚙️', 'ke setAction');

  _eqS(kindPlural(ConfigOpKind.setText, false), 'טקסטים', 'kp setText');
  _eqS(kindPlural(ConfigOpKind.setStyle, true), 'צבעים', 'kp style all-color');
  _eqS(kindPlural(ConfigOpKind.setStyle, false), 'עיצובים', 'kp style mixed');
  _eqS(kindPlural(ConfigOpKind.setAction, true), 'פעולות', 'kp action flag-noop');

  // מגן-סחף האדפטר: אורך שני ה-enums זהה ⇒ מיפוי-אינדקס תקף (הכרעת-קופסה 2).
  _check(configOpKindCount == 6 && configOpKindCount == configOpKindCountPlural,
      'adapter enum-parity');
  // הצלבה: כל ערך קנוני מפיק גם אמוג'י וגם רבים בלי חריגה.
  for (final k in ConfigOpKind.values) {
    _check(kindEmoji(k).isNotEmpty && kindPlural(k, false).isNotEmpty,
        'adapter maps ${k.name}');
  }

  // ═══ אשכול ג׳ · קופיילוט-המנהל — פרומפטים ═══

  _eqS(
    managerCopilotPrompt('3 הזמנות פתוחות', 'מה דחוף?',
        promptSafeText: (t, {int maxLen = 0}) => t),
    'מצב-העסק כעת (נתוני-אמת):\n3 הזמנות פתוחות\n\n'
        'שאלת-הבעלים: "מה דחוף?"\n'
        'ענה בעברית, אך ורק לפי הנתונים שלמעלה.',
    'mcp basic',
  );
  // שקע-החיטוי מקבל maxLen 400 מהקורא, וחותך את q.
  final clipped = managerCopilotPrompt('ctx', 'abcdefgh',
      promptSafeText: (t, {int maxLen = 0}) =>
          t.length <= 5 ? t : t.substring(0, 5));
  _check(clipped.contains('"abcde"'), 'mcp clip socket reaches q');

  final brief = managerMorningBriefPrompt('2 הזמנות תקועות');
  _check(
      brief.startsWith(
              'מצב-העסק כעת (נתוני-אמת):\n2 הזמנות תקועות\n\nכתוב תדריך-בוקר') &&
          brief.endsWith('פתח ב-"☀️ תדריך-בוקר:".') &&
          brief.contains('בלי להמציא (אין נתוני-עבר/מגמה).'),
      'mmb structure');

  // ═══ אשכול ד׳ · אינטל-הסטודיו — קוהורטה + Gantt ═══

  final day = DateTime.utc(2026, 1, 1);
  DateTime plus(int d) => day.add(Duration(days: d));
  final cohort = buildCohort(day, <Set<DateTime>>[
    {plus(0), plus(2)},
    {plus(1), plus(2)},
    <DateTime>{},
  ]);
  _check(cohort.cohortDay == day && cohort.size == 3, 'bc head');
  _check(
      cohort.returningByDay.length == 3 &&
          cohort.returningByDay[0] == 1 &&
          cohort.returningByDay[1] == 1 &&
          cohort.returningByDay[2] == 2,
      'bc returningByDay');
  final emptyCohort = buildCohort(day, const []);
  _check(emptyCohort.size == 0 && emptyCohort.returningByDay[0] == 0,
      'bc empty');

  final gantt = buildTasksGantt(
    [
      TaskItem(
          id: 'T1',
          name: 'רצפה',
          days: 3,
          status: 'active',
          scheduledStart: DateTime(2026, 1, 5)),
      TaskItem(
          id: 'T2',
          name: 'יסוד',
          days: 2,
          status: 'done',
          scheduledStart: DateTime(2026, 1, 1)),
      const TaskItem(id: 'T3', name: 'גמר', days: 1, status: 'active'),
      TaskItem(
          id: 'T4',
          name: 'ניקוי',
          days: 0,
          status: 'active',
          scheduledStart: DateTime(2026, 1, 1)),
    ],
    daysBetweenDst: _days,
    donePercent: _done,
  );
  _check(gantt.unscheduled.length == 1 && gantt.unscheduled.first.id == 'T3',
      'btg unscheduled');
  _eqS(gantt.bars.map((b) => b.taskId).join(','), 'T2,T4,T1', 'btg order');
  _check(
      gantt.bars[0].startDay == 0 &&
          gantt.bars[0].lenDays == 2 &&
          gantt.bars[0].donePercent == 100,
      'btg T2 bar');
  _check(gantt.bars[1].lenDays == 1, 'btg T4 days0→1 floor');
  _check(gantt.bars[2].startDay == 4 && gantt.bars[2].donePercent == 50,
      'btg T1 offset+done');
  _check(gantt.spanDays == 7, 'btg spanDays');
  _check(buildTasksGantt(const [], daysBetweenDst: _days, donePercent: _done)
          .spanDays ==
      0, 'btg empty span');

  // ═══ אשכול ה׳ · קטלוג-בנייה — מערכות-מים + טמפרטורה ═══

  _check(
      _eqSet(productDivisionSystems('פולירול', verifiedEndSystems: null),
          {WaterSystem.supply}),
      'pds polirol→supply');
  _check(
      _eqSet(productDivisionSystems('חוליות', verifiedEndSystems: null),
          {WaterSystem.drainage}),
      'pds default→drainage');
  _check(
      _eqSet(
          productDivisionSystems('פולירול',
              verifiedEndSystems: {WaterSystem.drainage}),
          {WaterSystem.drainage}),
      'pds spec-over-brand');
  _check(
      _eqSet(productDivisionSystems('כלשהו', verifiedEndSystems: {}),
          {WaterSystem.drainage}),
      'pds empty-spec→brand');

  _check(productSuitableForTemp(60, maxTempC: null), 'pst null→true');
  _check(productSuitableForTemp(90, maxTempC: 90), 'pst eq→true');
  _check(!productSuitableForTemp(95, maxTempC: 90), 'pst over→false');
  _check(!productSuitableForTemp(-10, maxTempC: -20), 'pst neg-over→false');

  // assert חי (חוק: --enable-asserts).
  assert(kindEmoji(ConfigOpKind.setText) == '✏️', 'assert-live guard');

  print(
      'OK bs-studio: $_n asserts passed (10 atoms wired, Stage-A pipe + type-adapter proven)');
}
