package il.liba.app

/**
 * step kotlin-egress: the phone knows where the sound is going and what may be said there. A message comes with its
 * sensitivity (0-3, classified by the page where it was born); the route is where the voice would come out. Meir's
 * ear (the earpiece), his wired headset and the Bluetooth headset he named as his own carry anything; the loudspeaker,
 * the car and an unknown route carry up to 1; somebody else's Bluetooth speaker or a cast carry nothing personal. What
 * is held is not lost: one sentence says there is a personal message and how to hear it - "תקריאי" is Meir's explicit
 * yes for the loudspeaker or the car, never for a stranger's speaker. Pure Kotlin (JVM-tested).
 */
enum class Route(val he: String, val max: Int) {
    EARPIECE("השפופרת", 3), WIRED("האוזניות", 3), BT_MINE("האוזניות שלך", 3), SPEAKER("הרמקול", 1), CAR("הרכב", 1),
    UNKNOWN("יעד לא ידוע", 1), BT_OTHER("רמקול בלוטות' זר", 0), CAST("שידור למסך", 0)
}
data class SayVerdict(val speak: Boolean, val hold: String? = null, val reason: String = "")

object EgressCore {
    fun decide(r: Route, sens: Int, override: Boolean = false): SayVerdict {
        val s = sens.coerceIn(0, 3)
        if (s <= r.max) return SayVerdict(true)
        if (override && (r == Route.SPEAKER || r == Route.CAR || r == Route.UNKNOWN)) return SayVerdict(true, reason = "override")
        val how = if (r == Route.BT_OTHER || r == Route.CAST) "נתק את ${r.he} או הצמד את הטלפון לאוזן" else "הצמד את הטלפון לאוזן, חבר אוזניות, או תגיד 'תקריאי'"
        return SayVerdict(false, "יש הודעה אישית. לא אקריא אותה דרך ${r.he} - $how.", "sens $s > ${r.max} on ${r.name}")
    }
    /** a lock-screen notification of anything personal shows that there is one, not what it says */
    fun notifText(sens: Int, text: String): Pair<String, Boolean> = if (sens >= 1) "יש הודעה מליבה" to true else text to false
    /** a link opened from a command carries no content in its address */
    fun urlClean(u: String): Boolean = !Regex("[?#].+").containsMatchIn(u.substringAfter("://").substringAfter('/', ""))
}
