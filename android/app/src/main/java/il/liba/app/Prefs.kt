package il.liba.app

import android.content.Context
import org.json.JSONArray
import org.json.JSONObject

/** Small persistent state: toggles, conversation log, update info. */
object Prefs {
    private fun p(c: Context) = c.getSharedPreferences("liba", Context.MODE_PRIVATE)
    fun hey(c: Context) = p(c).getBoolean("hey", false)
    fun setHey(c: Context, v: Boolean) = p(c).edit().putBoolean("hey", v).apply()
    fun conv(c: Context) = p(c).getBoolean("conv", true)
    fun setConv(c: Context, v: Boolean) = p(c).edit().putBoolean("conv", v).apply()
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
