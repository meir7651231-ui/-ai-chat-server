package il.liba.app.power

/**
 * step duty-governor: one pulse instead of a chain of timers each waking the phone on its own. Every periodic job is a row
 * (name, period); the bubble's one beat asks due(now) and runs what is due. A slower gear stretches every period; a job
 * that must not stretch (the watchdog) says so. Pure Kotlin (JVM-tested).
 */
class PulseCore {
    data class Row(val name: String, val periodMs: Long, val stretch: Boolean = true, var last: Long = 0L, var on: Boolean = true)
    private val rows = LinkedHashMap<String, Row>()
    fun every(name: String, periodMs: Long, stretch: Boolean = true, now: Long = 0L) { rows[name] = Row(name, periodMs, stretch, now) }
    fun enable(name: String, on: Boolean) { rows[name]?.on = on }
    fun touch(name: String, now: Long) { rows[name]?.last = now } // the job ran by another road (a start, a manual check)
    /** the names due now, in the order they were declared; each is marked as run */
    fun due(now: Long, stretchK: Double = 1.0): List<String> {
        val out = ArrayList<String>()
        for (r in rows.values) { if (!r.on) continue
            val p = if (r.stretch) (r.periodMs * stretchK.coerceAtLeast(1.0)).toLong() else r.periodMs
            if (now - r.last >= p) { r.last = now; out.add(r.name) } }
        return out
    }
    fun names(): List<String> = rows.keys.toList()
}
