package il.liba.app

import android.content.Context
import org.json.JSONArray
import org.json.JSONObject
import java.io.File

/**
 * step words-offline: a sentence Meir says while the page is down used to get "אני לא מחובר לדף כרגע" and was gone.
 * Now it is kept in a file (write to a temp file, then rename - atomic, survives a force-stop and a restart) and sent
 * when the page is back, with the time it was said. At most CAP sentences: past that the oldest go, and the count of
 * what was dropped is said once - two days of talk must not come back as an avalanche.
 */
object WordQueue {
    const val CAP = 50
    private fun f(c: Context) = File(c.filesDir, "words.json")
    @Synchronized fun all(c: Context): MutableList<JSONObject> = runCatching {
        val a = JSONArray(Vault.load(c, "words", f(c)) ?: "[]"); MutableList(a.length()) { a.getJSONObject(it) }
    }.getOrDefault(mutableListOf())
    @Synchronized private fun save(c: Context, l: List<JSONObject>) {
        runCatching { Vault.put(c, "words", JSONArray(l).toString()) }
            .onFailure { Trace.e(Trace.Code.E_PREFS, "words:" + it.javaClass.simpleName) }
    }
    /** returns how many were dropped to make room (0 almost always) */
    @Synchronized fun add(c: Context, text: String, at: Long): Int {
        val l = all(c); l.add(JSONObject().put("t", text.take(600)).put("at", at).put("id", "w-" + at.toString(36)))
        var dropped = 0; while (l.size > CAP) { l.removeAt(0); dropped++ }
        save(c, l); return dropped
    }
    @Synchronized fun remove(c: Context, id: String) = save(c, all(c).filter { it.optString("id") != id })
    @Synchronized fun clear(c: Context) = save(c, emptyList())
    fun size(c: Context) = all(c).size
}
