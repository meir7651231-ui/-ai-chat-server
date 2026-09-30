// step sense-bus-ears: the bus on the JVM. Run through: node tools/kt-test.mjs
import il.liba.app.sense.*

fun senseTests() {
    val now = 1_790_000_000_000L
    val c = SenseCore()
    ok(c.emit("notif", "k1", "com.whatsapp", "דני", "מתי אתה מגיע?", now) == null, "sense: nothing is heard from an app Meir did not name")
    c.apps.add("com.whatsapp"); c.apps.add("com.google.android.gm"); c.apps.add("com.google.android.dialer")
    val a = c.emit("notif", "k1", "com.whatsapp", "דני", "מתי אתה מגיע?", now)
    ok(a != null && a.importance == 2, "sense: a person writing on WhatsApp is importance 2: ${a?.importance}")
    ok(c.emit("notif", "k1", "com.whatsapp", "דני", "מתי אתה מגיע?", now + 5) == null, "sense: the same notification twice is kept once")
    ok(c.emit("notif", "k2", "com.whatsapp", "אבא", "תתקשר דחוף", now)?.importance == 3, "sense: urgent words make it 3")
    ok(c.emit("notif", "k3", "com.google.android.gm", "שופרסל", "מבצע הנחה 30% רק היום", now)?.importance == 0, "sense: a promotion is noise, 0")
    ok(c.emit("notif", "k4", "com.google.android.dialer", "שיחה שלא נענתה", "משה", now)?.importance == 3, "sense: a missed call is 3")
    ok(c.emit("notif", "k5", "com.whatsapp", "", "", now) == null, "sense: an empty notification is not an event")
    repeat(600) { c.emit("notif", "flood$it", "com.whatsapp", "קבוצה", "הודעה $it", now + it) }
    ok(c.ring.size == SenseCore.CAP, "sense: the ring is bounded at ${SenseCore.CAP}, the oldest go first: ${c.ring.size}")
    val b = c.batch(50, now + 1000); c.ack(b.map { it.id })
    ok(b.size == 50 && c.ring.size == SenseCore.CAP - 50, "sense: a batch of 50 acked leaves the rest waiting")
    ok(c.batch(10, now + 3 * 86_400_000L).isEmpty(), "sense: what is older than two days is not sent any more")
}
