package il.liba.app

import android.content.Context
import android.provider.Settings
import org.json.JSONObject

/**
 * step fixed-cardinality-telemetry: one sign of life per device, edge-triggered.
 * The watchdog asks every 30 seconds; a pulse goes out only when something that matters changed, or once every
 * five minutes - at most 288 a day, all into the same one document (pulse/<dev>) on the page side. A full database
 * refuses new documents but still takes writes to an existing one, so this survives exactly when it is needed.
 */
object Pulse {
    const val EVERY_MS = 5 * 60 * 1000L
    private var lastSig = ""
    private var lastSentAt = 0L
    private var since = 0L

    /** stable per install and signing key (ANDROID_ID is scoped to both since Android 8), never the raw id */
    fun devId(ctx: Context): String {
        val raw = (Settings.Secure.getString(ctx.contentResolver, Settings.Secure.ANDROID_ID) ?: "none") + "|" + ctx.packageName
        val md = java.security.MessageDigest.getInstance("SHA-256")
        return "d-" + md.digest(raw.toByteArray()).take(6).joinToString("") { "%02x".format(it) }
    }

    fun name(): String = (android.os.Build.MANUFACTURER + " " + android.os.Build.MODEL).trim().take(40)

    /** the state that matters; times are carried but are not part of the signature (they change every time) */
    data class State(val mic: Boolean, val overlay: Boolean, val battery: Int, val charging: Boolean, val net: Boolean,
                     val vad: Boolean, val ttsOk: Boolean, val pageReady: Boolean, val ver: String, val battOpt: Boolean = true,
                     val doze: Boolean = false, val login: Boolean = false, val life: String = "", val gasp: String = "")

    /** returns the body to send now, or null when nothing changed and five minutes have not passed */
    fun due(s: State, lastHeard: Long, lastSpoke: Long, now: Long): String? {
        // battery in steps of ten, so a draining phone is not a change every minute
        val sig = listOf(s.mic, s.overlay, s.battery / 10, s.charging, s.net, s.vad, s.ttsOk, s.pageReady, s.ver, s.battOpt, s.doze, s.login).joinToString("|")
        val changed = sig != lastSig
        if (changed) { since = now }
        if (!changed && now - lastSentAt < EVERY_MS) return null
        lastSig = sig; lastSentAt = now
        return JSONObject()
            .put("mic", s.mic).put("overlay", s.overlay).put("battery", s.battery).put("charging", s.charging)
            .put("net", s.net).put("vad", s.vad).put("ttsOk", s.ttsOk).put("pageReady", s.pageReady).put("ver", s.ver)
            .put("battOpt", s.battOpt).put("uptime", android.os.SystemClock.elapsedRealtime() / 1000)
            .put("doze", s.doze).put("login", s.login).put("life", s.life).put("gasp", s.gasp)
            .put("lastHeard", lastHeard).put("lastSpoke", lastSpoke).put("since", since).put("why", if (changed) "change" else "beat")
            .toString()
    }

    /** a page that was not ready missed the last pulse: the next one goes out at once */
    fun resend() { lastSentAt = 0L; lastSig = "" }
}
