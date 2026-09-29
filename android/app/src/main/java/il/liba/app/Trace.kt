package il.liba.app

import android.content.Context
import android.os.Handler
import android.os.HandlerThread
import android.os.Process
import org.json.JSONObject
import java.io.File
import java.io.FileOutputStream
import java.util.concurrent.CountDownLatch
import java.util.concurrent.TimeUnit

/**
 * step blackbox: the fault log. Prefs.log is what Meir and ליבה SAID; this is what BROKE.
 *
 * Append-only JSONL in filesDir, written on one background thread, drained to the page in
 * batches of 200. Every failure that used to vanish into an empty catch gets a code from the
 * table below, a time and a count - so "מה נשבר היום" is a list and not a guess.
 *
 * ctx is machine text only (a mode, an http code, an exception class, a db path). Never an
 * utterance, never a note, never a url with a token: that is the privacy line between Trace
 * and Prefs.log, and it is the reason Trace may be uploaded and Prefs.log may not.
 */
object Trace {

    /** The one table. Call sites name an enum, never a string, so a typo cannot invent a code.
     *  cap = how many DISTINCT lines this code may write per 60s window; the rest are counted
     *  as dropped and reported as their own line, so a cap can never hide a storm. */
    enum class Code(val cap: Int) {
        E_OVERLAY_DENIED(5), E_OVERLAY_UPDATE(2),
        E_TTS_INIT(5), E_TTS_OP(5),
        E_SR_0(2), E_SR_1(2), E_SR_2(2), E_SR_3(2), E_SR_4(2), E_SR_5(2), E_SR_6(2), E_SR_7(2),
        E_SR_8(2), E_SR_9(2), E_SR_10(2), E_SR_11(2), E_SR_12(2), E_SR_13(2),
        E_SR_LIFECYCLE(5), E_SR_NONE(5),
        E_MIC_FGS(5), E_FGS_START(5), E_MIC_INIT(5), E_MIC_READ(5),
        E_HAPTIC(5), E_TONE(5), E_AUDIO_STREAM(5), E_MEDIA_SESSION(5),
        E_NET(5), E_SYS_CB(5),
        E_INSTALL_PERM(5), E_INSTALL_NET(5), E_INSTALL_SIG(5), E_INTENT_OPEN(5),
        E_PAGE_LOGIN(5), E_PAGE_LOAD(5), E_PAGE_TAP(5),
        E_CRASH_SAVE(Int.MAX_VALUE),           // happens once, as the process dies: never capped
        E_PREFS(5), E_SHADER(5),
        E_TRACE_ROTATE(5)                      // the box reporting what the box threw away
    }

    private const val FILE = "trace.jsonl"
    private const val OLD = "trace.1.jsonl"
    private const val ACKF = "trace.ack"
    private const val MAX_BYTES = 5L * 1024 * 1024
    private const val ACK_CAP = 2000
    private const val BATCH = 200
    private const val CTX_MAX = 120
    private const val WINDOW = 60_000L
    private const val INFLIGHT_MS = 30_000L

    @Volatile private var app: Context? = null
    private var thread: HandlerThread? = null
    @Volatile private var h: Handler? = null

    // ---- everything below this line is touched on the Trace thread only ----
    @Volatile private var ver: String? = null   // also read by crash(), from the dying thread
    private var winStart = 0L
    private val buf = LinkedHashMap<String, JSONObject>()   // "code|ctx" -> the line standing for it
    private val written = HashMap<String, Int>()            // per code: distinct lines this window
    private val dropped = HashMap<String, Int>()            // per code: refused this window
    private val skip = HashMap<String, Int>()               // file -> leading lines already acked
    private var ackSet: MutableSet<String>? = null
    private var inFlight: String? = null
    private var inFlightAt = 0L
    private val closer = Runnable { closeWindow() }

    /** Called once from App.onCreate. Starts the one background thread and warms the
     *  conversation ring on it, so nothing here ever reads disk on the main thread. */
    fun init(c: Context) { app = c.applicationContext; handler() }

    /** The only thing a caller ever pays: one clock read and one post. No I/O, no JSON, no prefs. */
    fun e(code: Code, ctx: String = "") {
        val t = System.currentTimeMillis()
        val cx = clean(ctx)
        post { record(t, code.name, code.cap, cx) }
    }

    /** SpeechRecognizer error ints map straight onto E_SR_<n>; anything unknown lands in E_SR_0. */
    fun sr(n: Int): Code = SR[n] ?: Code.E_SR_0
    private val SR: Map<Int, Code> by lazy { Code.values().filter { it.name.startsWith("E_SR_") && it.name[5].isDigit() }.associateBy { it.name.removePrefix("E_SR_").toInt() } }

    fun post(r: Runnable) { handler()?.post(r) }

    @Synchronized private fun handler(): Handler? {
        h?.let { return it }
        if (app == null) return null
        val t = HandlerThread("liba-trace", Process.THREAD_PRIORITY_BACKGROUND).apply { start() }
        thread = t; val hh = Handler(t.looper); h = hh
        hh.post { app?.let { Prefs.warm(it) } }   // load the conversation ring off the main thread, once
        return hh
    }

    /** Closes the open window on the Trace thread and waits briefly, so a dying service still
     *  writes its drop lines. Called from BubbleService.onDestroy. */
    fun flush() {
        val hh = h ?: return
        val latch = CountDownLatch(1)
        hh.post { closeWindow(); latch.countDown() }
        try { latch.await(500, TimeUnit.MILLISECONDS) } catch (x: InterruptedException) { Thread.currentThread().interrupt() }
    }

    /** The one event written from the dying thread, with no HandlerThread hop - same contract as
     *  the .commit() in App.kt, for the same reason: there is no later. */
    fun crash(ctx: String) {
        val c = app ?: return
        // written straight out, with no rotation check: rotation touches state the Trace thread
        // owns, and racing it from a dying thread would be a worse bug than a file one line over.
        io { FileOutputStream(File(c.filesDir, FILE), true).use {
            it.write((line(System.currentTimeMillis(), Code.E_CRASH_SAVE.name, 1, clean(ctx), 0).toString() + "\n").toByteArray(Charsets.UTF_8)) } }
    }

    // ---------- window ----------
    private fun record(t: Long, code: String, cap: Int, ctx: String) {
        val w = t - t % WINDOW                       // wall-clock minute: the dedup bucket and the window are the same thing
        if (winStart != 0L && w != winStart) closeWindow()
        if (winStart == 0L) { winStart = w; h?.postDelayed(closer, WINDOW + 200L) }
        val key = "$code|$ctx"
        buf[key]?.let { o -> o.put("n", o.optInt("n", 1) + 1); return }   // dedup first: a hot loop is one line with n=900
        val used = written[code] ?: 0
        if (used >= cap) { dropped[code] = (dropped[code] ?: 0) + 1; return }
        written[code] = used + 1
        buf[key] = line(t, code, 1, ctx, 0)
    }
    private fun closeWindow() {
        if (winStart == 0L) return
        h?.removeCallbacks(closer)
        val out = ArrayList<String>(buf.size + dropped.size)
        for (o in buf.values) out.add(o.toString())
        // the dropped counter is itself an event: same file, same bridge, same collection, same reader
        for ((code, d) in dropped) if (d > 0) out.add(line(winStart, code, 0, "dropped", d).toString())
        buf.clear(); written.clear(); dropped.clear(); winStart = 0L
        if (out.isNotEmpty()) append(out)
    }

    private fun line(t: Long, code: String, n: Int, ctx: String, d: Int): JSONObject {
        val o = JSONObject()
        o.put("id", id(t, code, ctx)).put("t", t).put("c", code).put("n", n)
        if (ctx.isNotEmpty()) o.put("ctx", ctx)
        o.put("v", ver()).put("s", "k")
        if (d > 0) o.put("d", d)
        return o
    }
    /** base36(t) + 3-char hash of (code|ctx): stable, 12 chars, and it is the telemetry doc id,
     *  so the same event landing twice overwrites one row instead of creating two. */
    private fun id(t: Long, code: String, ctx: String): String {
        var x = 5381
        for (ch in "$code|$ctx") x = x * 33 + ch.code
        val hh = ((x and 0x7fffffff) % 46656)
        return java.lang.Long.toString(t, 36) + "-" + java.lang.Integer.toString(hh, 36).padStart(3, '0')
    }
    private fun ver(): String {
        ver?.let { return it }
        val c = app
        val v = if (c == null) "?" else try { c.packageManager.getPackageInfo(c.packageName, 0).versionName ?: "?" } catch (x: Exception) { "?" }
        ver = v; return v
    }
    private fun clean(s: String) = s.replace('\n', ' ').replace('\r', ' ').replace('\t', ' ').take(CTX_MAX)

    // ---------- file ----------
    /** The one silent catch in the tree, and the only one that has to be: a failure to write the
     *  fault log has nowhere left to be written. Every Trace I/O goes through here. */
    private inline fun io(b: () -> Unit) { try { b() } catch (x: Exception) {} }

    private fun append(lines: List<String>) {
        val c = app ?: return
        io {
            val f = File(c.filesDir, FILE)
            if (f.length() >= MAX_BYTES) rotate(c)
            val sb = StringBuilder(); for (l in lines) sb.append(l).append('\n')
            FileOutputStream(File(c.filesDir, FILE), true).use { it.write(sb.toString().toByteArray(Charsets.UTF_8)) }
        }
    }
    /** One generation kept, 10 MB ceiling. Whatever un-acked lines the discarded generation held
     *  are reported as one E_TRACE_ROTATE line, so the loss is visible instead of silent. */
    private fun rotate(c: Context) {
        val f = File(c.filesDir, FILE); val old = File(c.filesDir, OLD)
        var lost = 0
        if (old.exists()) {
            val ack = ack(c)
            io { old.forEachLine { ln -> idOf(ln)?.let { if (!ack.contains(it)) lost++ } } }
            old.delete()
        }
        f.renameTo(old)
        skip[OLD] = skip[FILE] ?: 0; skip[FILE] = 0
        if (lost > 0) io {
            FileOutputStream(File(c.filesDir, FILE), true).use {
                it.write((line(System.currentTimeMillis(), Code.E_TRACE_ROTATE.name, 0, "dropped", lost).toString() + "\n").toByteArray(Charsets.UTF_8))
            }
        }
    }
    private fun idOf(ln: String): String? = try { JSONObject(ln).optString("id").ifEmpty { null } } catch (x: Exception) { null }

    private fun ack(c: Context): MutableSet<String> {
        ackSet?.let { return it }
        val s = HashSet<String>()
        io { val f = File(c.filesDir, ACKF); if (f.exists()) f.forEachLine { if (it.isNotBlank()) s.add(it.trim()) } }
        ackSet = s; return s
    }

    // ---------- bridge ----------
    /**
     * Kotlin -> page. `ready` is the caller's pageReady && web != null: when the page is not
     * connected drain returns without touching the file and without marking anything, so the
     * lines simply wait in trace.jsonl - which is the whole reason it is a file and not a queue.
     * `send` is invoked on the Trace thread; the caller posts it to main to touch the WebView.
     */
    fun drain(ready: Boolean, send: (batch: String, json: String) -> Unit) {
        if (!ready) return
        post { drainOn(send) }
    }
    private fun drainOn(send: (String, String) -> Unit) {
        val c = app ?: return
        val now = System.currentTimeMillis()
        if (inFlight != null) { if (now - inFlightAt < INFLIGHT_MS) return; inFlight = null }  // a lost ack costs one redundant .set(), never a duplicate row
        closeWindow()
        val ack = ack(c)
        val out = ArrayList<String>(BATCH)
        for (name in listOf(OLD, FILE)) {                 // oldest generation first
            if (out.size >= BATCH) break
            val f = File(c.filesDir, name); if (!f.exists()) continue
            val lead = skip[name] ?: 0
            var newLead = lead; var leading = true; var i = 0
            io {
                f.forEachLine { ln ->
                    if (i >= lead && out.size < BATCH && ln.isNotBlank()) {
                        val id = idOf(ln)
                        if (id == null || ack.contains(id)) { if (leading) newLead = i + 1 }
                        else { leading = false; out.add(ln) }
                    }
                    i++
                }
            }
            skip[name] = newLead
        }
        if (out.isEmpty()) return
        val b = ("b" + java.lang.Long.toString(now, 36) + java.lang.Long.toString((Math.random() * 1.0e9).toLong(), 36)).take(17).padEnd(17, '0')
        inFlight = b; inFlightAt = now
        send(b, "[" + out.joinToString(",") + "]")
    }
    /** Ids the page actually wrote. Anything left out is not acked and comes back next batch. */
    fun acked(ids: List<String>) {
        post {
            val c = app ?: return@post
            inFlight = null
            if (ids.isEmpty()) return@post
            val s = ack(c); s.addAll(ids)
            io {
                val f = File(c.filesDir, ACKF)
                FileOutputStream(f, true).use { o -> o.write(ids.joinToString("\n", postfix = "\n").toByteArray(Charsets.UTF_8)) }
                if (s.size > ACK_CAP) {
                    val keep = f.readLines().filter { it.isNotBlank() }.takeLast(ACK_CAP)
                    f.writeText(keep.joinToString("\n", postfix = "\n"))
                    ackSet = HashSet(keep)
                }
            }
        }
    }

    /** "מה נשבר היום": total = written + dropped, so a cap changes what is stored, never what is counted. */
    fun top(n: Int = 10, cb: (List<Pair<String, Int>>) -> Unit) {
        post {
            val c = app ?: return@post
            val m = HashMap<String, Int>()
            for (name in listOf(OLD, FILE)) {
                val f = File(c.filesDir, name); if (!f.exists()) continue
                io { f.forEachLine { ln -> io { val o = JSONObject(ln); val code = o.optString("c"); if (code.isNotEmpty()) m[code] = (m[code] ?: 0) + o.optInt("n", 0) + o.optInt("d", 0) } } }
            }
            cb(m.entries.sortedByDescending { it.value }.take(n).map { it.key to it.value })
        }
    }
}
