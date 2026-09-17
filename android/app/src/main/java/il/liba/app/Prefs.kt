package il.liba.app

import android.content.Context
import org.json.JSONArray
import org.json.JSONObject

/** Small persistent state: toggles, conversation log, update info. */
object Prefs {
    private fun p(c: Context) = c.getSharedPreferences("liba", Context.MODE_PRIVATE)
    fun hey(c: Context) = p(c).getBoolean("hey", false)
    fun setHey(c: Context, v: Boolean) = p(c).edit().putBoolean("hey", v).apply()
    fun style(c: Context) = p(c).getInt("style", 1)
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
    fun setUpdate(c: Context, url: String?, code: Int) = p(c).edit().putString("updateUrl", url).putInt("updateCode", code).apply()

    @Synchronized fun log(c: Context, who: String, text: String) {
        val arr = try { JSONArray(p(c).getString("log", "[]")) } catch (e: Exception) { JSONArray() }
        arr.put(JSONObject().put("who", who).put("text", text).put("ts", System.currentTimeMillis()))
        while (arr.length() > 200) arr.remove(0)
        p(c).edit().putString("log", arr.toString()).apply()
    }
    fun logText(c: Context): String {
        val arr = try { JSONArray(p(c).getString("log", "[]")) } catch (e: Exception) { JSONArray() }
        val sb = StringBuilder()
        for (i in maxOf(0, arr.length() - 60) until arr.length()) {
            val o = arr.getJSONObject(i); val t = java.text.SimpleDateFormat("HH:mm", java.util.Locale.getDefault()).format(java.util.Date(o.getLong("ts")))
            sb.append(if (o.getString("who") == "me") "🗣 " else "◉ ").append(t).append("  ").append(o.getString("text")).append("\n\n")
        }
        return if (sb.isEmpty()) "עוד אין שיחה. לחץ על הבועה ודבר." else sb.toString()
    }
}
