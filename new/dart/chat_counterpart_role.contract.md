# חוזה · chatCounterpartRole

> אטום-Dart · נחצב אוטומטית ע"י חצב-AST (חוק-4 — verbatim מהמקור).

## מקור
buildsmart/app_flutter/lib/screens/chats_screen.dart:1506

## התנהגות
#chat-dm-reroute — the SINGLE "other side" role of a seed thread for the
reading [persona], or null when there is no single real counterpart: the bot
thread, a per-user dm thread (empty role [ChatThread.participants]), or an
ambiguous multi-party thread (>1 non-self role). Pure ⇒ ratchet-tested.

It exists because a shared SEED role-thread (`th-contractor-manager`, …) can
hold at most ONE plain contractor: `ensureParticipantUids` stamps
participantUids ONCE, and a plain contractor (no role claim) can't re-stamp an
already-stamped thread (chatThreads rule). So a real conversation between two
plain users over a seed thread silently loses the second party — this maps the
seed thread to its counterpart role so the tap can reroute onto a real
dm-<uids> thread that lists BOTH uids from creation (create rule passes both).

## ייעוד-עברי
מקור: source-screen · screens__chats_screen — אימוג׳י · אין · שיחות · בארכיון · אעדכן · אותך · בהקדם · אפשרויות · ארכיון · בטל · השתקה · ביטול

## אימות
בדיקת-Golden (`chat_counterpart_role_test.dart`): אפיון דטרמיניסטי על סל-קלטים — הוקלט מהרצת הקוד-החלוץ. הרצה: `dart run --enable-asserts new/dart/chat_counterpart_role_test.dart`.
