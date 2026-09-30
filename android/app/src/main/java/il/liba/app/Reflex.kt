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

    private val NUM = mapOf("אחת" to 1, "אחד" to 1, "שתיים" to 2, "שתי" to 2, "שניים" to 2, "שני" to 2, "שלוש" to 3, "שלושה" to 3, "ארבע" to 4, "ארבעה" to 4,
        "חמש" to 5, "חמישה" to 5, "שש" to 6, "שישה" to 6, "שבע" to 7, "שבעה" to 7, "שמונה" to 8, "תשע" to 9, "תשעה" to 9, "עשר" to 10, "עשרה" to 10,
        "חמש עשרה" to 15, "עשרים" to 20, "עשרים וחמש" to 25, "שלושים" to 30, "ארבעים" to 40, "ארבעים וחמש" to 45, "חמישים" to 50, "שישים" to 60)
    data class Timer(val ms: Long, val said: String, val what: String)
    /** "עשר דקות לקחת תרופה" / "חצי שעה" / "שעתיים שהכביסה מוכנה" -> how long, the words for it, and what for; null if no time */
    fun timer(rest: String): Timer? {
        var r = rest.trim().removePrefix("עוד ").trim()
        val specials = listOf("שעה וחצי" to 90, "חצי שעה" to 30, "רבע שעה" to 15, "שלושת רבעי שעה" to 45, "שעתיים" to 120, "דקה" to 1, "שעה" to 60)
        var min = -1; var said = ""
        for ((w, m) in specials) if (r == w || r.startsWith("$w ")) { min = m; said = w; r = r.removePrefix(w).trim(); break }
        if (min < 0) {
            val words = r.split(Regex("\\s+"))
            val unitAt = words.indexOfFirst { it == "דקות" || it == "דקה" || it == "שעות" || it == "שעה" }
            if (unitAt < 1) return null
            val numWords = words.subList(0, unitAt).joinToString(" ")
            val n = numWords.toIntOrNull() ?: NUM[numWords] ?: return null
            val unit = words[unitAt]; min = if (unit.startsWith("שע")) n * 60 else n
            said = "$numWords $unit"; r = words.drop(unitAt + 1).joinToString(" ")
        }
        if (min <= 0 || min > 24 * 60) return null
        val what = r.trim().removePrefix("-").removePrefix(":").trim()
        return Timer(min * 60_000L, said, what)
    }
    fun timerSay(t: Timer): String = "בסדר. בעוד ${t.said} אזכיר לך" + (if (t.what.isNotEmpty()) ": ${t.what}." else ".")
    fun timerRing(t: Timer): String = if (t.what.isNotEmpty()) "תזכורת: ${t.what}." else "עברו ${t.said}, ביקשת שאזכיר לך."
}
