import il.liba.app.Reflex

fun reflexTests() {
    val t = java.time.ZonedDateTime.of(2026, 9, 30, 16, 5, 0, 0, Reflex.ZONE).toInstant().toEpochMilli()
    ok(Reflex.time(t) == "השעה 16:05.", "reflex: the time on Meir's clock: " + Reflex.time(t))
    ok(Reflex.time(java.time.ZonedDateTime.of(2026, 9, 30, 23, 30, 0, 0, java.time.ZoneOffset.UTC).toInstant().toEpochMilli()) == "השעה 2:30.", "reflex: a UTC instant is said in Jerusalem time")
    ok(Reflex.date(t) == "היום יום רביעי, 30 בספטמבר.", "reflex: the date: " + Reflex.date(t))
    val sat = java.time.ZonedDateTime.of(2026, 10, 3, 12, 0, 0, 0, Reflex.ZONE).toInstant().toEpochMilli()
    ok(Reflex.date(sat).startsWith("היום שבת"), "reflex: on Shabbat it says שבת, not יום שבת")
    ok(Reflex.battery(28, false) == "הסוללה ב-28 אחוז." && Reflex.battery(9, false).contains("מטען") && Reflex.battery(50, true).contains("בטעינה") && Reflex.battery(-1, false).contains("לא מצליחה"), "reflex: battery")
    ok(Reflex.net(true, true, false).contains("Wi-Fi") && Reflex.net(false, false, false).startsWith("אין אינטרנט") && Reflex.net(false, true, false).contains("לא עובד"), "reflex: network")
    ok(Reflex.answer("reflex.time", t, 0, false, true, false, false) != null && Reflex.answer("app.status", t, 0, false, true, false, false) == null, "reflex: only reflex ids are answered")
}
