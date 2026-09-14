# חוזה · chatMessageIsMine

> אטום-Dart · נחצב אוטומטית ע"י חצב-AST (חוק-4 — verbatim מהמקור).

## מקור
buildsmart/app_flutter/lib/state/sys_chat.dart:187

## התנהגות
#chat-identity (uid-based mine/theirs) — is message [m] "MINE" for the person
reading the thread? The reader is the auth [readerUid]; the display [persona]
is only the LEGACY fallback.

THE BUG THIS FIXES: attribution keyed on `fromRole == persona` treats ONE
person as TWO whenever they act from two boards. A manager who answers a
client from the CONTRACTOR board sends `fromRole: contractor`; from the
MANAGER board he sends `fromRole: manager`. Reading the same thread his two
lines then land on OPPOSITE sides — and worse, his contractor-board line is
indistinguishable from the REAL contractor client's (both `contractor`), so
the client sees the manager's reply rendered as the client's OWN message.

THE FIX: when the message carries a real sender uid AND the reader's uid is
known, "mine" is `fromUid == readerUid` — ONE PERSON, every board. Only when a
uid is missing (the seed + every legacy/local/demo message, the signed-out /
Firebase-free path, the whole test suite) do we fall back to the role compare,
so that path stays BYTE-IDENTICAL (zero regression).

## ייעוד-עברי
מקור: caller-screen · screens__chats_screen — אימוג׳י · אין · שיחות · בארכיון · אעדכן · אותך · בהקדם · אפשרויות · ארכיון · בטל · השתקה · ביטול

## אימות
בדיקת-Golden (`chat_message_is_mine_test.dart`): אפיון דטרמיניסטי על סל-קלטים — הוקלט מהרצת הקוד-החלוץ. הרצה: `dart run --enable-asserts new/dart/chat_message_is_mine_test.dart`.
