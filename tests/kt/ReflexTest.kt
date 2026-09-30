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

fun timerTests() {
    val a = Reflex.timer("עשר דקות לקחת תרופה")!!
    ok(a.ms == 600_000L && a.said == "עשר דקות" && a.what == "לקחת תרופה", "timer: עשר דקות לקחת תרופה -> " + a)
    ok(Reflex.timer("חצי שעה")!!.ms == 1_800_000L && Reflex.timer("רבע שעה שהכביסה מוכנה")!!.what == "שהכביסה מוכנה", "timer: half and quarter hour")
    ok(Reflex.timer("שעתיים")!!.ms == 7_200_000L && Reflex.timer("שעה וחצי")!!.ms == 5_400_000L && Reflex.timer("דקה")!!.ms == 60_000L, "timer: שעתיים, שעה וחצי, דקה")
    ok(Reflex.timer("5 דקות")!!.ms == 300_000L && Reflex.timer("שלוש שעות להתקשר לאבא")!!.ms == 3 * 3600_000L, "timer: digits and hours")
    ok(Reflex.timer("מחר בתשע לקנות חלב") == null && Reflex.timer("") == null && Reflex.timer("המון דקות") == null, "timer: no duration - not a timer (it goes to Claude)")
    ok(Reflex.timerSay(a) == "בסדר. בעוד עשר דקות אזכיר לך: לקחת תרופה." && Reflex.timerRing(a) == "תזכורת: לקחת תרופה.", "timer: what is said: " + Reflex.timerSay(a))
    val core = il.liba.app.ReminderCore()
    core.addLocal(il.liba.app.Reminder("t-1", 1000, 5000, "תזכורת: x", cap = false))
    core.replace(listOf(il.liba.app.Reminder("p-1", 2000, 9000, "מהדף")))
    ok(core.items.map { it.id }.toSet() == setOf("p-1", "t-1"), "timer: the page's list does not wipe a phone timer: " + core.items.map { it.id })
}
