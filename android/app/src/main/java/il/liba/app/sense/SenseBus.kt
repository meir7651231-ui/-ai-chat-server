package il.liba.app.sense

import android.content.Context
import il.liba.app.Trace
import org.json.JSONArray
import org.json.JSONObject
import java.io.File

/**
 * step sense-bus-ears: SenseCore on disk (filesDir/sense.jsonl, one item per line, rewritten atomically on the Trace
 * thread - never SharedPreferences, never the main thread). The page is told what is waiting when it is up (flush), and
 * acks what it stored. The list of apps comes from the page (senseCfg), from memory/settings.senses.apps.
 */
object SenseBus {
    val core = SenseCore()
    @Volatile private var loaded = false
    @Volatile var sink: ((String) -> Unit)? = null   // set by the bubble while the page is up
    private fun f(c: Context) = File(c.filesDir, "sense.jsonl")
    private fun apps(c: Context) = File(c.filesDir, "sense-apps.json")

    @Synchronized fun load(c: Context) {
        if (loaded) return; loaded = true
        runCatching { val a = JSONArray(apps(c).readText()); for (i in 0 until a.length()) core.apps.add(a.getString(i)) }
        runCatching { core.restore((il.liba.app.Vault.load(c, "sense", f(c)) ?: "").lines().filter { it.isNotBlank() }.map { JSONObject(it).let { x ->
            SenseItem(x.optString("id"), x.optString("kind"), x.optString("key"), x.optString("app"), x.optString("title"), x.optString("text"), x.optLong("at"), x.optInt("importance"), x.optLong("ttl")) } }) }
            .onFailure { Trace.e(Trace.Code.E_PREFS, "sense:" + it.javaClass.simpleName) }
    }
    private fun json(it: SenseItem) = JSONObject().put("id", it.id).put("kind", it.kind).put("key", it.key).put("app", it.app).put("title", it.title)
        .put("text", it.text).put("at", it.at).put("importance", it.importance).put("ttl", it.ttl)
    @Synchronized private fun save(c: Context) {
        runCatching { il.liba.app.Vault.put(c, "sense", core.ring.joinToString("\n") { json(it).toString() }) }
            .onFailure { Trace.e(Trace.Code.E_PREFS, "sense-save:" + it.javaClass.simpleName) }
    }
    fun emit(c: Context, kind: String, key: String, app: String, title: String, text: String) = Trace.post {
        load(c); val it = synchronized(this) { core.emit(kind, key, app, title, text, System.currentTimeMillis()) } ?: return@post
        save(c); if (sink != null) flush(c) }
    fun flush(c: Context) = Trace.post { load(c); val s = sink ?: return@post
        val b = synchronized(this) { core.batch(50, System.currentTimeMillis()) }; if (b.isNotEmpty()) s(JSONArray(b.map { json(it) }).toString()) }
    fun ack(c: Context, ids: List<String>) = Trace.post { load(c); synchronized(this) { core.ack(ids) }; save(c); if (synchronized(this) { core.ring.isNotEmpty() }) flush(c) }
    fun setApps(c: Context, list: List<String>) = Trace.post { load(c); synchronized(this) { core.apps.clear(); core.apps.addAll(list) }
        runCatching { apps(c).writeText(JSONArray(list).toString()) } }
}
