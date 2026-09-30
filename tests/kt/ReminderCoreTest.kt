// step proactive: the phone's reminders on the JVM. Run through: node tools/kt-test.mjs
import il.liba.app.*

fun reminderTests() {
    val h = 3600_000L; val now = 1_790_000_000_000L
    val c = ReminderCore()
    c.replace((0 until 6).map { Reminder("pro-date.k$it", now - h + it, now + 10 * h, "אני נזכרת: דבר $it") } + Reminder("pro-date.later", now + 5 * h, now + 20 * h, "אני נזכרת: אחר כך"))
    ok(c.due(now, 3, "d1", false).isEmpty(), "reminders: nothing at three at night")
    ok(c.next(now, 3, now + 5 * h) == now + 5 * h, "reminders: at night the alarm moves to eight")
    ok(c.due(now, 10, "d1", true).isEmpty(), "reminders: nothing in night mode")
    val a = c.due(now, 10, "d1", false)
    ok(a.size == 3 && a[0].id == "pro-date.k0", "reminders: at ten, the three earliest - the budget is three a day: ${a.map { it.id }}")
    ok(c.due(now + 60_000, 11, "d1", false).isEmpty(), "reminders: and nothing more that day")
    val b = c.due(now + 60_000, 9, "d2", false)
    ok(b.size == 3 && b.none { it.id in a.map { x -> x.id } }, "reminders: the next day the next three, none twice: ${b.map { it.id }}")
    ok(c.next(now + 60_000, 9, 0) == now + 5 * h, "reminders: the next alarm is the later one")
    c.replace(listOf(Reminder("pro-date.k0", now, now + h, "x"), Reminder("pro-date.new", now, now + h, "y")))
    ok(c.items.map { it.id } == listOf("pro-date.new"), "reminders: a new list from the page never brings back what was said")
    val restart = ReminderCore(); restart.fired.addAll(c.fired); restart.replace(listOf(Reminder("pro-date.k1", now, now + h, "x")))
    ok(restart.items.isEmpty(), "reminders: after a restart (fired kept on disk) nothing is said twice")
}
