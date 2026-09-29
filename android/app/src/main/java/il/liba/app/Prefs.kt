package il.liba.app

import android.content.Context
import org.json.JSONArray
import org.json.JSONObject

/** Small persistent state: toggles, conversation log, update info. */
object Prefs {
    private fun p(c: Context) = c.getSharedPreferences("liba", Context.MODE_PRIVATE)
    fun hey(c: Context) = p(c).getBoolean("hey", false)
    fun setHey(c: Context, v: Boolean) = p(c).edit().putBoolean("hey", v).apply()
    fun style(c: Context) = p(c).getInt("style", 2)
    fun setStyle(c: Context, v: Int) = p(c).edit().putInt("style", v).apply()
    fun conv(c: Context) = p(c).getBoolean("conv", true)
    fun setConv(c: Context, v: Boolean) = p(c).edit().putBoolean("conv", v).apply()
    fun rate(c: Context) = p(c).getFloat("rate", 1.25f)
    fun setRate(c: Context, v: Float) = p(c).edit().putFloat("rate", v).apply()
    fun night(c: Context) = p(c).getBoolean("night", false)
    fun setNight(c: Context, v: Boolean) = p(c).edit().putBoolean("night", v).apply()
    fun tones(c: Context) = p(c).getBoolean("tones", true)
    fun setTones(c: Context, v: Boolean) = p(c).edit().putBoolean("tones", v).apply()
    fun barge(c: Context) = p(c).getBoolean("barge", false)
    fun setBarge(c: Context, v: Boolean) = p(c).edit().putBoolean("barge", v).apply()
    fun headset(c: Context) = p(c).getBoolean("headset", false)
    fun setHeadset(c: Context, v: Boolean) = p(c).edit().putBoolean("headset", v).apply()
    fun pendingShare(c: Context): String? = p(c).getString("share", null)
    fun setPendingShare(c: Context, v: String?) = p(c).edit().putString("share", v).apply()
    fun reports(c: Context) = p(c).getBoolean("reports", true)
    fun setReports(c: Context, v: Boolean) = p(c).edit().putBoolean("reports", v).apply()
    fun crash(c: Context): String? = p(c).getString("crash", null)
    fun clearCrash(c: Context) = p(c).edit().remove("crash").apply()
    fun updateUrl(c: Context): String? = p(c).getString("updateUrl", null)
    /** step 1: the hash and the name travel with the url, so the download can be proven before it installs. */
    fun updateSha(c: Context): String? = p(c).getString("updateSha", null)
    fun updateCode(c: Context) = p(c).getInt("updateCode", 0)
    fun updateName(c: Context): String = p(c).getString("updateName", "") ?: ""
    fun setUpdate(c: Context, url: String?, code: Int, sha: String? = null, name: String = "") =
        p(c).edit().putString("updateUrl", url).putInt("updateCode", code)
            .putString("updateSha", sha).putString("updateName", name).apply()

    // step blackbox: the conversation ring lives in memory and is persisted on the Trace thread.
    // Same 200 turns, same text, same screen as before - just no disk on the main thread.
    private var ring: ArrayDeque<JSONObject>? = null
    private val hhmm = java.text.SimpleDateFormat("HH:mm", java.util.Locale.getDefault())

    /** Loaded once, on the Trace thread, before anyone asks for it. */
    fun warm(c: Context) { ring(c) }

    @Synchronized private fun ring(c: Context): ArrayDeque<JSONObject> {
        ring?.let { return it }
        val d = ArrayDeque<JSONObject>()
        try { val arr = JSONArray(p(c).getString("log", "[]")); for (i in 0 until arr.length()) d.addLast(arr.getJSONObject(i)) }
        catch (e: Exception) { Trace.e(Trace.Code.E_PREFS, "log:" + e.javaClass.simpleName) }
        ring = d; return d
    }
    @Synchronized private fun persist(c: Context) {
        val arr = JSONArray(); ring?.forEach { arr.put(it) }
        p(c).edit().putString("log", arr.toString()).apply()
    }

    @Synchronized fun log(c: Context, who: String, text: String) {
        val d = ring(c)
        d.addLast(JSONObject().put("who", who).put("text", text).put("ts", System.currentTimeMillis()))
        while (d.size > 200) d.removeFirst()
        Trace.post { persist(c) }
    }
    fun logText(c: Context): String {
        val snap = synchronized(this) { ring(c).toList() }
        val sb = StringBuilder()
        for (i in maxOf(0, snap.size - 60) until snap.size) {
            val o = snap[i]
            try { sb.append(if (o.getString("who") == "me") "🗣 " else "◉ ").append(hhmm.format(java.util.Date(o.getLong("ts")))).append("  ").append(o.getString("text")).append("\n\n") }
            catch (e: Exception) { Trace.e(Trace.Code.E_PREFS, "turn:" + e.javaClass.simpleName) }
        }
        return if (sb.isEmpty()) "עוד אין שיחה. לחץ על הבועה ודבר." else sb.toString()
    }
}
