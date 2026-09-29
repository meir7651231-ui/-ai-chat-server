package il.liba.app

import android.content.Context
import android.os.Handler
import android.util.Base64
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL
import java.security.KeyFactory
import java.security.Signature
import java.security.spec.X509EncodedKeySpec

/**
 * step second-channel: a path to Meir's ear that needs no page, no WebView and no claude.ai login.
 * When the page has been dead for 20 minutes, the bubble polls urgent.json straight from the repo (ETag, at most every
 * two minutes) and speaks new items itself. The repo is public, so every byte is signed: the signature is checked over
 * the exact payload before anything is parsed, with the public key below; where Ed25519 is not available the channel
 * stays shut (fail closed). At most five items an hour. Spoken ids go back to the page in hello, so it never says
 * them again.
 */
object UrgentPoller {
    private const val SRC = "https://raw.githubusercontent.com/meir7651231-ui/-ai-chat-server/liba-android/urgent.json"
    const val PUB = "MCowBQYDK2VwAyEAtFWr3mV/a2WhQKSUO4cd9GG88K59MLEbF9goVCafccs="
    const val DEAD_MS = 20 * 60_000L
    private const val EVERY_MS = 2 * 60_000L
    private const val MAX_PER_HOUR = 5
    private var lastPoll = 0L
    private var etag: String? = null
    private val spokenAt = ArrayDeque<Long>()

    data class Item(val id: String, val ts: Long, val ttl: Long, val text: String)

    fun verify(payload: String, sigB64: String): Boolean = runCatching {
        val pk = KeyFactory.getInstance("Ed25519").generatePublic(X509EncodedKeySpec(Base64.decode(PUB, Base64.NO_WRAP)))
        Signature.getInstance("Ed25519").run { initVerify(pk); update(payload.toByteArray(Charsets.UTF_8)); verify(Base64.decode(sigB64, Base64.NO_WRAP)) }
    }.getOrElse { Trace.e(Trace.Code.E_INSTALL_SIG, "urgent:" + it.javaClass.simpleName); false }

    /** null when the signature does not hold - nothing unsigned is ever read */
    fun parse(body: String): List<Item>? {
        val o = JSONObject(body); val payload = o.getString("payload")
        if (!verify(payload, o.getString("sig"))) return null
        val arr = JSONObject(payload).getJSONArray("items")
        return (0 until arr.length()).map { arr.getJSONObject(it) }.map { Item(it.getString("id"), it.getLong("ts"), it.getLong("ttl"), it.getString("text").take(600)) }
    }

    /** from the watchdog, every 30 s: does nothing while the page lives */
    fun maybe(ctx: Context, main: Handler, pageDeadSince: Long, pageAliveAt: Long, say: (Item) -> Unit) {
        val now = System.currentTimeMillis()
        if (pageDeadSince == 0L || now - pageDeadSince < DEAD_MS || now - lastPoll < EVERY_MS) return
        lastPoll = now
        Thread {
            runCatching {
                val c = URL(SRC).openConnection() as HttpURLConnection
                c.connectTimeout = 10_000; c.readTimeout = 10_000; etag?.let { c.setRequestProperty("If-None-Match", it) }
                if (c.responseCode == 304) return@Thread
                if (c.responseCode != 200) { Trace.e(Trace.Code.E_NET, "urgent:" + c.responseCode); return@Thread }
                etag = c.getHeaderField("ETag")
                val items = parse(c.inputStream.bufferedReader().readText()) ?: run { Trace.e(Trace.Code.E_INSTALL_SIG, "urgent:bad-signature"); return@Thread }
                val done = Prefs.urgentDone(ctx)
                val fresh = items.filter { it.id !in done && now < it.ts + it.ttl && it.ts > pageAliveAt - 60_000 }.sortedBy { it.ts }
                main.post {
                    for (it in fresh) {
                        val t = System.currentTimeMillis(); while (spokenAt.isNotEmpty() && t - spokenAt.first() > 3_600_000) spokenAt.removeFirst()
                        if (spokenAt.size >= MAX_PER_HOUR) break
                        spokenAt.addLast(t); Prefs.addUrgentDone(ctx, it.id); say(it)
                    }
                }
            }.onFailure { Trace.e(Trace.Code.E_NET, "urgent:" + it.javaClass.simpleName) }
        }.start()
    }
}
