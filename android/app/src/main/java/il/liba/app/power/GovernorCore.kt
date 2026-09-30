package il.liba.app.power

/**
 * step duty-governor: gears instead of on/off. FULL - the mic always open, the pulse every 30 s; ECO - the mic 300 ms of
 * every second, the pulse every two minutes; SURVIVAL - 200 ms of every two seconds, ten minutes; COLD - no mic, half an
 * hour. The gear comes from the day's projection against Meir's budget, the battery, charging, the screen, the phone's
 * own idle mode and heat. Down at once; up only after ten minutes in the gear, and only past a gap (70% of the budget),
 * so it never flaps. Pure Kotlin (JVM-tested); Governor holds it on the device.
 */
enum class Tier(val beatMs: Long, val onMs: Int, val offMs: Int, val he: String) {
    FULL(30_000L, 100, 0, "הילוך מלא"), ECO(120_000L, 300, 700, "הילוך חסכוני"), SURVIVAL(600_000L, 200, 1800, "הילוך הישרדות"), COLD(1_800_000L, 0, 0, "הילוך קר")
}
data class PowerState(val projPct: Double?, val budgetPct: Double, val battery: Int, val charging: Boolean, val screenOn: Boolean, val deviceIdle: Boolean, val tempC: Double? = null)
data class Job(val tag: String, val importance: Int)   // 0 nice to have .. 3 must (Meir asked, urgent)

object GovernorCore {
    const val DWELL_MS = 10 * 60_000L
    /** the gear the state asks for, before hysteresis, with the reason */
    fun want(s: PowerState): Pair<Tier, String> {
        if (s.charging) return Tier.FULL to "בטעינה"
        if (s.battery in 0..5) return Tier.COLD to "הסוללה כמעט ריקה"
        if (s.battery in 6..15) return Tier.SURVIVAL to "נשארו פחות מחמישה עשר אחוז"
        if (s.tempC != null && s.tempC >= 45.0) return Tier.SURVIVAL to "הטלפון חם"
        val p = s.projPct; val b = s.budgetPct
        if (p != null && b > 0) { if (p > b * 1.5) return Tier.SURVIVAL to "אני שורפת הרבה מעל התקציב"; if (p > b) return Tier.ECO to "אני שורפת מעל התקציב" }
        if (s.deviceIdle && !s.screenOn) return Tier.ECO to "הטלפון במנוחה"
        return Tier.FULL to ""
    }
    /** the gear to be in: down at once, up only after the dwell and with a gap below the budget */
    fun choose(s: PowerState, cur: Tier, since: Long, now: Long): Pair<Tier, String> {
        val (w, why) = want(s)
        if (w.ordinal >= cur.ordinal) return (if (w == cur) cur else w) to why
        if (now - since < DWELL_MS && !s.charging) return cur to ""
        val p = s.projPct; val b = s.budgetPct
        if (!s.charging && p != null && b > 0 && p > b * 0.7 && cur != Tier.COLD && cur != Tier.SURVIVAL) return cur to ""
        return w to (if (why.isEmpty()) "הקצב ירד" else why)
    }
    /** the admission gate: in a lower gear, only what matters runs now */
    fun admit(t: Tier, j: Job): Boolean = when (t) { Tier.FULL -> true; Tier.ECO -> j.importance >= 1; Tier.SURVIVAL -> j.importance >= 2; Tier.COLD -> j.importance >= 3 }
    /** one sentence when the gear changes - said once, not a status loop */
    fun words(from: Tier, to: Tier, why: String): String =
        (if (to.ordinal > from.ordinal) "עברתי ל" + to.he else "חזרתי ל" + to.he) + (if (why.isNotEmpty()) ", כי $why" else "") +
            (when (to) { Tier.ECO -> ". עדיין שומעת אותך, רק בהפסקות קצרות."; Tier.SURVIVAL -> ". אני שומעת פחות - לחיצה עליי תמיד עובדת."; Tier.COLD -> ". המיקרופון כבוי - לחץ עליי כשתצטרך."; else -> "." })
    /** of the words said in the mic's off windows, how many were probably missed: the share of time off times how often
     *  there was voice in the on windows */
    fun missEstimate(t: Tier, voiceFrac: Double): Double = if (t.onMs + t.offMs == 0) 1.0 else voiceFrac * t.offMs / (t.onMs + t.offMs)
}
