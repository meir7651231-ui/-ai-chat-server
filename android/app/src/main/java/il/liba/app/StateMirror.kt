package il.liba.app

import android.content.Context
import org.json.JSONArray
import org.json.JSONObject
import java.io.File

/** step local-brain: the page's picture of the state, kept on the phone (filesDir/mirror.json, on the Trace thread) */
object StateMirror {
    @Volatile var now: Mirror? = null
    @Volatile private var loaded = false
    private fun f(c: Context) = File(c.filesDir, "mirror.json")
    private fun parse(s: String): Mirror = JSONObject(s).let { o ->
        val t = o.optJSONArray("tasks") ?: JSONArray(); val l = o.optJSONArray("openLoop") ?: JSONArray()
        Mirror(o.optLong("at"), List(t.length()) { i -> t.getJSONObject(i).let { x -> MTask(x.optString("title"), x.optString("status"), x.optString("question")) } },
            List(l.length()) { l.optString(it) }, o.optString("waitingOn"), o.optString("nextAction"), o.optString("brain"), o.optInt("live")) }
    /** the mirror as last kept - read from disk the first time (a few hundred bytes), so the first answer after a restart is not empty */
    @Synchronized fun get(c: Context): Mirror? { if (!loaded) { loaded = true; if (now == null) runCatching { now = parse(Vault.load(c, "mirror", f(c)) ?: return@runCatching) }.onFailure { il.liba.app.Trace.e(il.liba.app.Trace.Code.E_PREFS, "statemirror18:" + it.javaClass.simpleName) } }; return now }
    fun onMirror(c: Context, body: String) = Trace.post { runCatching { now = parse(body); Vault.put(c, "mirror", body) }
        .onFailure { Trace.e(Trace.Code.E_PREFS, "mirror:" + it.javaClass.simpleName) } }
}
