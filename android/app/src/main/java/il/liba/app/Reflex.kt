package il.liba.app

import java.time.ZoneId
import java.time.ZonedDateTime

/**
 * step reflex-core: questions the phone knows the answer to are answered by the phone - at once, in a tunnel, with the
 * page down. Before this "מה השעה" went to a remote session and back (tens of seconds, and nothing at all offline).
 * Time and date are on Meir's clock (Jerusalem), never the phone's zone. The board questions ("איפה עצרנו", "מה פתוח")
 * are LocalBrain's; this answers what the phone itself measures. Pure Kotlin (JVM-tested).
 */
object Reflex {
    val ZONE: ZoneId = ZoneId.of("Asia/Jerusalem")
    private val DAYS = listOf("שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת", "ראשון") // java DayOfWeek: MONDAY = 1
    private val MONTHS = listOf("בינואר", "בפברואר", "במרץ", "באפריל", "במאי", "ביוני", "ביולי", "באוגוסט", "בספטמבר", "באוקטובר", "בנובמבר", "בדצמבר")
    fun time(nowMs: Long): String { val z = ZonedDateTime.ofInstant(java.time.Instant.ofEpochMilli(nowMs), ZONE)
        return "השעה " + z.hour + ":" + z.minute.toString().padStart(2, '0') + "." }
    fun date(nowMs: Long): String { val z = ZonedDateTime.ofInstant(java.time.Instant.ofEpochMilli(nowMs), ZONE)
        val d = DAYS[z.dayOfWeek.value - 1]
        return (if (d == "שבת") "היום שבת" else "היום יום $d") + ", " + z.dayOfMonth + " " + MONTHS[z.monthValue - 1] + "." }
    fun battery(pct: Int, charging: Boolean): String =
        if (pct < 0) "אני לא מצליחה לקרוא את הסוללה עכשיו." else "הסוללה ב-$pct אחוז" + (if (charging) ", בטעינה." else if (pct <= 15) ". כדאי לחבר למטען." else ".")
    fun net(validated: Boolean, wifi: Boolean, cell: Boolean): String = when {
        validated && wifi -> "יש אינטרנט, דרך Wi-Fi."
        validated && cell -> "יש אינטרנט, דרך הסלולר."
        validated -> "יש אינטרנט."
        wifi || cell -> "יש חיבור, אבל האינטרנט לא עובד כרגע. מה שתגיד יישמר וישלח כשיחזור."
        else -> "אין אינטרנט עכשיו. מה שתגיד יישמר וישלח כשהרשת תחזור."
    }
    /** the answer for a reflex intent id, or null when it is not one */
    fun answer(id: String?, nowMs: Long, pct: Int, charging: Boolean, validated: Boolean, wifi: Boolean, cell: Boolean): String? = when (id) {
        "reflex.time" -> time(nowMs); "reflex.date" -> date(nowMs)
        "reflex.battery" -> battery(pct, charging); "reflex.net" -> net(validated, wifi, cell)
        else -> null
    }
}
