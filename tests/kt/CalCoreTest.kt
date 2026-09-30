// step calendar-sense on the JVM. Run through: node tools/kt-test.mjs
import il.liba.app.sense.*

fun calTests() {
    val h = 3600_000L; val t = 1_790_000_000_000L
    val raw = listOf(
        CalItem("1", "פגישה עם דני", t + 2 * h, t + 3 * h, false, "משרד", 3, CalCore.SELF_ACCEPTED, 1),
        CalItem("2", "פגישה עם דני", t + 2 * h, t + 3 * h, false, "משרד", 3, CalCore.SELF_NONE, 2),   // the same, from a second account
        CalItem("3", "יום הולדת לשרה", t - 10 * h, t + 14 * h, true, "", 0, CalCore.SELF_NONE, 1),
        CalItem("4", "ישיבת צוות", t + 5 * h, t + 6 * h, false, "", 5, CalCore.SELF_DECLINED, 1),
        CalItem("5", "", t + 7 * h, t + 8 * h, false, "", 0, 0, 1),
        CalItem("6", "רחוק", t + 30 * 24 * h, t + 30 * 24 * h + h, false, "", 0, 0, 1))
    val m = CalCore.merge(raw, t - 24 * h, t + 7 * 24 * h)
    ok(m.map { it.id } == listOf("3", "1", "4"), "calendar: one per meeting across accounts, sorted, inside the window, no empty titles: ${m.map { it.id }}")
    ok(m.first { it.title == "פגישה עם דני" }.self == CalCore.SELF_ACCEPTED, "calendar: the copy with Meir's own status wins")
    ok(m.any { it.self == CalCore.SELF_DECLINED }, "calendar: a declined meeting is still listed (said as declined)")
    ok(CalCore.isMeeting(m[1]) && !CalCore.isMeeting(m[0]) && !CalCore.isMeeting(m[2]), "calendar: a meeting = two or more, not all-day, not declined")
}
