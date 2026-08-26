// 🧪 הוכחת-חוצה-שפות · קופסת support-chat (Dart) — אותם קלטים/WANT כמו new/boxes/support-chat.test.mjs.
// דרך הקופסה בלבד (חוק-4). ירוק ⇒ מאור(JS) ובנייה-חכמה(Dart) על אותה קופסה — אותם קלטים ⇒ אותו JSON.
// 🛡 מגן-ההכרעה שבבדיקת-ה-JS (readFileSync + regex על מקור-הקופסה) הוא מגן-מקור-JS ⇒ מדולג (הערה).
import 'dart:convert';
import 'support-chat.dart' as S;

int n = 0, fails = 0;
void eq(String name, Object? got, Object? want) {
  final g = jsonEncode(got), w = jsonEncode(want);
  if (g != w) { print('✗ $name: got $g want $w'); fails++; } else { n++; }
}
void ok(String name, bool c) { if (!c) { print('✗ $name'); fails++; } else { n++; } }

void main() {
  // ── SUPPORT_MSG_MAX ──
  eq('SUPPORT_MSG_MAX', S.supportMsgMax, 2000);

  // ── sanitizeSupportText (תקרה מוזרקת מהקופסה) ──
  eq('sanitize trim', S.sanitizeSupportText('  שלום  '), 'שלום');
  eq('sanitize null', S.sanitizeSupportText(null), '');
  eq('sanitize תקרה-2000', S.sanitizeSupportText('a' * 2100).length, 2000);

  // ── isSendableSupportText ──
  eq('sendable ריק', S.isSendableSupportText('  '), false);
  eq('sendable לא-ריק', S.isSendableSupportText(' x '), true);
  eq('sendable null', S.isSendableSupportText(null), false);

  // ── sortSupportMsgs (עולה, לא-משנה-מקור) ──
  {
    final src = [{'at': '2026-08-24T10:00'}, {'at': '2026-08-24T08:00'}];
    final out = S.sortSupportMsgs(src);
    ok('sortSupportMsgs עולה', out[0]['at'] == '2026-08-24T08:00' && out[1]['at'] == '2026-08-24T10:00');
    eq('sortSupportMsgs לא-משנה-מקור', src[0]['at'], '2026-08-24T10:00');
    eq('sortSupportMsgs ריק', S.sortSupportMsgs([]), []);
  }

  // ── supportMsgTime (עמיד; שבור⇒'') ──
  eq('supportMsgTime שבור', S.supportMsgTime('שבור'), '');
  ok('supportMsgTime HH:MM', RegExp(r'^\d{2}:\d{2}$').hasMatch(S.supportMsgTime('2026-08-24T09:05:00')));
  // 'T' חסר ⇒ מתווסף T12:00:00 (לא זורק) ⇒ HH:MM (הטיפוס String מובטח ע"י הקופסה).
  ok('supportMsgTime בלי-T', RegExp(r'^\d{2}:\d{2}$').hasMatch(S.supportMsgTime('2026-08-24')));

  // ── supportDayLabel (todayIso מוזרק) ──
  eq('dayLabel היום', S.supportDayLabel('2026-08-24T10:00', '2026-08-24'), 'היום');
  eq('dayLabel אתמול', S.supportDayLabel('2026-08-23T10:00', '2026-08-24'), 'אתמול');
  eq('dayLabel תאריך', S.supportDayLabel('2026-08-01T10:00', '2026-08-24'), '01/08/2026');

  // ── supportPreview ──
  eq('preview כיווץ', S.supportPreview('  a   b  '), 'a b');
  {
    final p = S.supportPreview('x' * 50);
    ok('preview חיתוך-40+…', p.length == 40 && p.endsWith('…'));
  }
  eq('preview undefined', S.supportPreview(null), '');

  // ── supportUnread (לא-שלילי; חסר⇒0) ──
  eq('unread admin', S.supportUnread({'unreadAdmin': 3}, 'admin'), 3);
  eq('unread שלילי⇒0', S.supportUnread({'unreadAdmin': -2}, 'admin'), 0);
  eq('unread null⇒0', S.supportUnread(null, 'admin'), 0);
  eq('unread user', S.supportUnread({'unreadUser': 5}, 'user'), 5);

  // ── sortTeamMsgs ──
  {
    final out = S.sortTeamMsgs([{'at': 'b'}, {'at': 'a'}]);
    ok('sortTeamMsgs עולה', out[0]['at'] == 'a' && out[1]['at'] == 'b');
  }

  // ── sortSupportThreads (לא-נקרא קודם, ואז חדש-קודם) ──
  {
    final out = S.sortSupportThreads([{'uid': 'a', 'lastAt': '2'}, {'uid': 'b', 'unreadAdmin': 1, 'lastAt': '1'}]);
    eq('threads לא-נקרא-קודם', out[0]['uid'], 'b');
    final out2 = S.sortSupportThreads([{'uid': 'a', 'lastAt': '1'}, {'uid': 'b', 'lastAt': '2'}]);
    eq('threads חדש-קודם', out2[0]['uid'], 'b');
    eq('threads ריק', S.sortSupportThreads([]), []);
  }

  if (fails > 0) {
    print('❌ קופסת-support-chat (Dart): $fails אי-התאמות מול golden ה-JS');
    throw StateError('support-chat dart proof failed');
  }
  print('✓ קופסת-support-chat (Dart): $n טענות — 10 חוטים · פלט זהה-ביט ל-JS · שתי המערכות על אותה קופסה');
}
