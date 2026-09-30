package il.liba.app.sense

/**
 * step context-fusion + the body part of place-sense, decided without Android (tested on the JVM).
 * Body: when Meir woke up - the first screen-on after four hours of the screen off. A short wake in the night (the
 * screen on for less than ten minutes, then off again) is not a morning and does not reset the night.
 * Context: what the phone knows right now - the screen, the lock, a headset, a call - sent only when it changes.
 * No new permission for any of it; the place (location) waits for Meir's decision.
 */
class BodyCore {
    var offSince = 0L; private var candidate = 0L; private var onSince = 0L
    var lastWake = 0L; var wakeSource = ""
    companion object { const val NIGHT = 4 * 3600_000L; const val SHORT = 10 * 60_000L }
    /** returns the wake time when one is confirmed now */
    fun screen(on: Boolean, at: Long): Long? {
        if (on) {
            onSince = at
            if (offSince > 0 && at - offSince >= NIGHT && candidate == 0L) candidate = at
            return null
        }
        // off
        val c = candidate
        if (c > 0 && at - c < SHORT) { candidate = 0L; onSince = 0L; return null }   // a short wake: the night goes on from where it was
        candidate = 0L; offSince = at; onSince = 0L
        return if (c > 0) confirm(c) else null
    }
    /** a candidate that stayed on ten minutes is a morning (called by a tick) */
    fun tick(now: Long): Long? { val c = candidate; if (c > 0 && now - c >= SHORT) { candidate = 0L; return confirm(c) }; return null }
    private fun confirm(c: Long): Long { lastWake = c; wakeSource = "unlock"; return c }
}

data class Ctx(val screen: Boolean, val locked: Boolean, val headset: Boolean, val call: Boolean)

class FusionCore {
    var last: Ctx? = null
    /** the new context if it changed, else null */
    fun update(c: Ctx): Ctx? { if (c == last) return null; last = c; return c }
}
