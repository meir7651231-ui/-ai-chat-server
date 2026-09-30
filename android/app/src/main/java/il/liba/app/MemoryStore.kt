package il.liba.app

import android.content.Context
import org.json.JSONArray
import org.json.JSONObject
import java.io.File

/**
 * step device-mem: MemCore on disk. One file (mem.json, written to a temp file and renamed - atomic), read and written
 * on the Trace thread only - never a disk touch on the main thread. The page sends memSync; offline "תזכור" waits in
 * core.pending and goes out as memAsk when the page says ready; memAck lets it go.
 */
object MemoryStore {
    val core = MemCore()
    @Volatile private var loaded = false
    private fun f(c: Context) = File(c.filesDir, "mem.json")

    /** on the Trace thread, before anyone asks */
    fun warm(c: Context) = Trace.post { load(c) }

    @Synchronized private fun load(c: Context) {
        if (loaded) return; loaded = true
        runCatching {
            val o = JSONObject(f(c).readText())
            applyJson(o, keepPending = false)
            val p = o.optJSONArray("pending") ?: JSONArray()
            for (i in 0 until p.length()) p.getJSONObject(i).let { x -> core.remember(x.optString("text"), x.optLong("at")) }
        }.onFailure { if (f(c).exists()) Trace.e(Trace.Code.E_PREFS, "mem:" + it.javaClass.simpleName) }
    }
    private fun list(a: JSONArray?) = if (a == null) emptyList() else List(a.length()) { a.optString(it) }
    @Synchronized private fun applyJson(o: JSONObject, keepPending: Boolean) {
        val fs = o.optJSONArray("facts") ?: JSONArray(); val ps = o.optJSONArray("people") ?: JSONArray()
        core.apply(List(fs.length()) { i -> fs.getJSONObject(i).let { x -> MFact(x.optString("key"), x.optString("raw"), x.optString("kind", "fact"), x.optInt("uses", 1), x.optLong("updatedAt"), x.optLong("expiresAt")) } },
            List(ps.length()) { i -> ps.getJSONObject(i).let { x -> MPerson(x.optString("key"), x.optString("name"), list(x.optJSONArray("aliases")), x.optString("relation"), x.optLong("updatedAt")) } },
            list(o.optJSONArray("rules")), o.optLong("at", System.currentTimeMillis()))
    }
    @Synchronized private fun save(c: Context) {
        val o = JSONObject().put("at", core.syncedAt)
            .put("facts", JSONArray(core.facts.values.filter { !it.local }.map { JSONObject().put("key", it.key).put("raw", it.raw).put("kind", it.kind).put("uses", it.uses).put("updatedAt", it.updatedAt).put("expiresAt", it.expiresAt) }))
            .put("people", JSONArray(core.people.values.map { JSONObject().put("key", it.key).put("name", it.name).put("aliases", JSONArray(it.aliases)).put("relation", it.relation).put("updatedAt", it.updatedAt) }))
            .put("rules", JSONArray(core.rules)).put("pending", pendingJson())
        runCatching { val t = File(c.filesDir, "mem.json.tmp"); t.writeText(o.toString()); t.renameTo(f(c)) }
            .onFailure { Trace.e(Trace.Code.E_PREFS, "mem-save:" + it.javaClass.simpleName) }
    }
    @Synchronized fun pendingJson(): JSONArray = JSONArray(core.pending.map { JSONObject().put("id", it.id).put("text", it.text).put("at", it.at) })

    fun onSync(c: Context, body: String) = Trace.post { runCatching { load(c); applyJson(JSONObject(body), keepPending = true); save(c) }.onFailure { Trace.e(Trace.Code.E_PREFS, "memSync:" + it.javaClass.simpleName) } }
    fun onAck(c: Context, ids: List<String>) = Trace.post { load(c); synchronized(this) { core.ack(ids) }; save(c) }
    /** offline "תזכור": the answer is immediate, the disk write is not on the caller's thread */
    fun remember(c: Context, text: String): String { val p = synchronized(this) { core.remember(text, System.currentTimeMillis()) }; Trace.post { save(c) }; return core.answerRemember(p) }
    fun about(q: String) = synchronized(this) { core.answerAbout(q, System.currentTimeMillis()) }
    fun who(q: String) = synchronized(this) { core.answerWho(q, System.currentTimeMillis()) }
    fun pendingCount() = synchronized(this) { core.pending.size }
}
