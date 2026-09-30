package il.liba.app

import android.animation.ObjectAnimator
import android.animation.ValueAnimator
import android.app.*
import android.content.Context
import android.content.Intent
import android.content.pm.ServiceInfo
import android.graphics.Color
import android.graphics.PixelFormat
import android.graphics.drawable.GradientDrawable
import android.media.AudioManager
import android.media.ToneGenerator
import android.net.ConnectivityManager
import android.net.Network
import android.os.*
import android.provider.Settings
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import android.speech.tts.TextToSpeech
import android.speech.tts.UtteranceProgressListener
import android.util.Log
import android.util.TypedValue
import android.view.*
import android.webkit.RenderProcessGoneDetail
import android.webkit.WebView
import android.widget.FrameLayout
import android.widget.TextView
import androidx.core.app.NotificationCompat
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL
import java.util.Locale
import kotlin.math.abs

class BubbleService : Service(), LibaWeb.Bridge {
    companion object {
        @Volatile var running = false
        @Volatile var instance: BubbleService? = null
        @Volatile var status = "מתחיל…"
        const val CH = "liba"
        @Volatile var tasksSummary = ""
        @Volatile var pageOk = false
        /** health-console: what the app's status screen shows - set by the running service */
        @Volatile var needsLogin = false
        @Volatile var lastSilence = ""
        val WAKE = listOf("ליבה", "ליבא", "ליבע", "לייבה", "היי ליבה", "הי ליבה")
    }

    private lateinit var wm: WindowManager
    private val main = Handler(Looper.getMainLooper())
    private var web: WebView? = null
    private var webHost: FrameLayout? = null
    private var webLp: WindowManager.LayoutParams? = null
    private var revealed = false
    private var bubble: FrameLayout? = null
    private var dot: OrbView? = null
    private var label: TextView? = null
    private var tts: TextToSpeech? = null
    private var sayId: String? = null   // id of the page utterance being spoken now
    // step clock: measured, not guessed. Wall clock on purpose - the page runs on the same device and reads the
    // same clock, so page and phone stamps line up; the page checks that in the hello handshake.
    private var voiceAt = 0L; private var heardAt = 0L; private var listenReadyAt = 0L
    private var sayStartAt = 0L; private var spokeCause = "done"; private var lastSpokeAt = 0L; private var sayMid = ""
    // heartbeat-diag: why this life began (opened/boot/updated/revive), the previous life's last gasp, and a login wall
    private var lifeWhy = "opened"; private var lastGasp = ""; private var loginWall = false
    // second-channel: since when the page has been dead (wall clock, 0 = alive), and when it was last alive
    private var pageDeadSince = System.currentTimeMillis(); private var pageAliveAt = 0L
    private fun stamps() = org.json.JSONObject().put("voice", if (voiceAt > 0) voiceAt else listenReadyAt).put("heard", heardAt).put("wall", System.currentTimeMillis()).toString()
    /** release the page's wait for the utterance, with what really happened */
    private fun releaseSay(cause: String) { val id = sayId ?: return; sayId = null
        // turn-engine: remembered before the page is told - if the page dies between the two, hello still carries it
        if ((cause == "done" || cause == "guard") && sayMid.isNotBlank()) Prefs.addSpokenMid(this, sayMid); sayMid = ""
        val end = System.currentTimeMillis(); val start = if (sayStartAt > 0) sayStartAt else end; sayStartAt = 0; lastSpokeAt = end
        web?.let { w -> LibaWeb.sendSpoke(w, id, start, end, cause) } }
    // step page-kernel: while a page utterance is being spoken, tell the page so every 2 s. Silence from
    // here means the voice died without onSpoken - the page stops waiting after 6 s instead of 120.
    private val speakingBeat = object : Runnable { override fun run() {
        val id = sayId ?: return
        web?.let { w -> LibaWeb.sendSpeaking(w, id) }
        main.postDelayed(this, 2000)
    } }
    private var ttsReady = false
    private var sr: SpeechRecognizer? = null
    private var srOnDevice = false          // step 21: which recognizer `sr` currently is
    private var onDeviceFailed = false      // on-device model has no Hebrew → fall back
    private var forceOnDevice = false       // the next listen goes to the on-device recognizer (a command lost to the network)
    private fun netValidated(): Boolean = runCatching { val cm = getSystemService(ConnectivityManager::class.java); cm.getNetworkCapabilities(cm.activeNetwork)?.hasCapability(android.net.NetworkCapabilities.NET_CAPABILITY_VALIDATED) == true }.getOrDefault(true)
    private var vad: VadGate? = null        // step 21: voice gate before the recognizer
    private var rate = 1.25f                 // step 23: speech rate, remembered
    private var night = false                // step 26: whisper mode – vibrate + text, no voice
    private var tones = true                 // step 28: short confirmation tones
    private val chunks = ArrayDeque<String>() // step 29: long texts read in parts
    private var paused = false
    private var speakGuard: Runnable? = null      // fix 1: one cancellable safety timer
    private val guardCore = GuardCore(); private var partStart = 0L; private var partLen = 0; @Volatile private var partStarted = false // faults: the guard learns this phone's voice
    private var pendingSayTimer: Runnable? = null  // faults: a reply held while the user talks is never lost
    private var pendingSay: String? = null        // fix 8: reply that arrived while the user was talking
    private var netCb: ConnectivityManager.NetworkCallback? = null
    private var screenCb: android.content.BroadcastReceiver? = null
    private var bargeIn = false              // step 24: interrupt me mid-sentence (echo-cancelled mic)
    private var bargeVad: VadGate? = null
    private var headsetBtn = false           // step 25: headset button = "דבר"
    private var mediaSession: android.media.session.MediaSession? = null
    private var carMode = false                // step 35
    private var curSpeaker = "ליבה"          // step 37: bubble colour per speaker
    private var menu: android.widget.LinearLayout? = null // step 31: long-press menu
    private var listening = false
    private var listenMode = "wake" // cmd | wake | follow
    private var lastUserAt = 0L      // when Meir himself last spoke to us
    private var followStreak = 0     // consecutive follow results, so a room conversation cannot chain
    private var pendingListenAfterSpeech = false
    private var pageReady = false
    private var heyOn = false
    private var convOn = true
    private var lastSaid = ""
    private var sentAt = 0L
    private var pageLoadedAt = 0L
    private var lastReloadAt = 0L
    private var loginWarnedAt = 0L
    private var systemMuted = false
    private var errStreak = 0
    private var speaking = false
    private var micFgs = false
    private var waitTimer: Runnable? = null
    private var taskSummary = ""
    private var taskBlocked = 0

    private fun dp(v: Float) = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, v, resources.displayMetrics)
    override fun onBind(intent: Intent?): IBinder? = null

    override fun onCreate() {
        super.onCreate()
        running = true; instance = this
        // step sense-bus-ears: what the phone heard goes to the page when it is up; until then it waits on disk
        il.liba.app.sense.SenseBus.sink = { j -> main.post { if (pageReady) web?.let { LibaWeb.sendSense(it, j) } } }
        il.liba.app.sense.CalSense.sink = { j -> main.post { if (pageReady) web?.let { LibaWeb.sendCal(it, j) } } }
        il.liba.app.sense.CalSense.start(this)
        il.liba.app.sense.SenseFusion.sink = { j -> main.post { if (pageReady) web?.let { LibaWeb.sendCtx(it, j) } } }
        il.liba.app.sense.SenseFusion.start(this)
        wm = getSystemService(Context.WINDOW_SERVICE) as WindowManager
        val am0 = getSystemService(AUDIO_SERVICE) as AudioManager; intArrayOf(AudioManager.STREAM_SYSTEM, AudioManager.STREAM_MUSIC).forEach { try { am0.adjustStreamVolume(it, AudioManager.ADJUST_UNMUTE, 0) } catch (e: Exception) { Trace.e(Trace.Code.E_AUDIO_STREAM, "boot:" + e.javaClass.simpleName) } }
        if (!startForegroundNotif()) { stopSelf(); return }
        Prefs.setOn(this, true); il.liba.app.life.Life.arm(this)
        lastGasp = Prefs.gasp(this); Prefs.setGasp(this, ""); lastSilence = lastGasp.substringBefore('|')
        runCatching { applyPrefs() }.onFailure { Trace.e(Trace.Code.E_PREFS, "applyPrefs:" + it.javaClass.simpleName) }
        runCatching { setupTts() }.onFailure { Trace.e(Trace.Code.E_TTS_INIT, "setup:" + it.javaClass.simpleName) }
        runCatching { setupWeb() }.onFailure { Trace.e(Trace.Code.E_OVERLAY_DENIED, "web"); status = "WebView נכשל: $it" }
        runCatching { setupBubble() }.onFailure { Trace.e(Trace.Code.E_OVERLAY_DENIED, "bubble"); status = "בועה נכשלה: $it" }
        runCatching { watchNetwork() }.onFailure { Trace.e(Trace.Code.E_SYS_CB, "watch:" + it.javaClass.simpleName) }
        main.postDelayed(watchdog, 30000) // one-shot: the first beat of the pulse; the pulse re-arms itself from the gear
        runCatching { checkUpdate() }.onFailure { Trace.e(Trace.Code.E_NET, "check:" + it.javaClass.simpleName) }
    }
    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        intent?.getStringExtra("why")?.let { if (lifeWhy == "opened") lifeWhy = it; if (it == "remind") main.postDelayed({ sayReminders() }, 1500) }
        when (intent?.action) { // step 32: actions from the permanent notification
            "il.liba.TALK" -> main.post { stopSpeaking(); startListening("cmd") }
            "il.liba.QUIET" -> main.post { stopSpeaking(); heyOff(); setState(LibaState.IDLE); showLabel("שקט.", 2000) }
        }
        return START_STICKY
    }
    private fun notif(): Notification {
        val pi = PendingIntent.getActivity(this, 0, Intent(this, MainActivity::class.java), PendingIntent.FLAG_IMMUTABLE)
        val talk = PendingIntent.getService(this, 1, Intent(this, BubbleService::class.java).setAction("il.liba.TALK"), PendingIntent.FLAG_IMMUTABLE)
        val quiet = PendingIntent.getService(this, 2, Intent(this, BubbleService::class.java).setAction("il.liba.QUIET"), PendingIntent.FLAG_IMMUTABLE)
        return NotificationCompat.Builder(this, CH).setSmallIcon(R.drawable.ic_notif).setContentTitle("ליבה מאזינה").setContentText("לחץ על הבועה כדי לדבר")
            .setContentIntent(pi).setOngoing(true).setSilent(true).addAction(0, "🎙 דבר", talk).addAction(0, "שקט", quiet).build()
    }

    fun applyPrefs() { heyOn = Prefs.hey(this); convOn = Prefs.conv(this); rate = Prefs.rate(this); night = Prefs.night(this); tones = Prefs.tones(this); bargeIn = Prefs.barge(this); headsetBtn = Prefs.headset(this); tts?.setSpeechRate(rate); main.post { setupMediaSession() }; main.post { if (heyOn) wakeLoop() else heyOff() } }

    // ---------- notification ----------
    private fun startForegroundNotif(): Boolean {
        val nm = getSystemService(NotificationManager::class.java)
        nm.createNotificationChannel(NotificationChannel(CH, "ליבה", NotificationManager.IMPORTANCE_LOW))
        val pi = PendingIntent.getActivity(this, 0, Intent(this, MainActivity::class.java), PendingIntent.FLAG_IMMUTABLE)
        val n = notif()
        try {
            if (Build.VERSION.SDK_INT >= 34) startForeground(1, n, ServiceInfo.FOREGROUND_SERVICE_TYPE_SPECIAL_USE)
            else if (Build.VERSION.SDK_INT >= 29) startForeground(1, n, ServiceInfo.FOREGROUND_SERVICE_TYPE_MICROPHONE) else startForeground(1, n)
        } catch (e: Exception) {
            Trace.e(Trace.Code.E_FGS_START, e.javaClass.simpleName)
            // Android refused a background (re)start: leave a tappable notification instead of crash-looping.
            val nn = NotificationCompat.Builder(this, CH).setSmallIcon(R.drawable.ic_notif).setContentTitle("הבועה נסגרה").setContentText("לחץ כדי להפעיל מחדש").setContentIntent(pi).setAutoCancel(true).build()
            nm.notify(2, nn); return false
        }
        return true
    }
    /** Ask for microphone access on demand (allowed while our overlay is visible); falls back gracefully. */
    private fun ensureMicFgs(): Boolean {
        if (micFgs || Build.VERSION.SDK_INT < 34) return true
        return try {
            startForeground(1, notif(), ServiceInfo.FOREGROUND_SERVICE_TYPE_SPECIAL_USE or ServiceInfo.FOREGROUND_SERVICE_TYPE_MICROPHONE); micFgs = true; true
        } catch (e: Exception) { Trace.e(Trace.Code.E_MIC_FGS, e.javaClass.simpleName); showLabel("אנדרואיד לא נותן מיקרופון ברקע – פתח את ליבה ולחץ הפעל בועה", 6000); false }
    }

    // ---------- TTS ----------
    private fun setupTts() {
        tts = TextToSpeech(this) { st ->
            if (st != TextToSpeech.SUCCESS) Trace.e(Trace.Code.E_TTS_INIT, "status=" + st)
            if (st == TextToSpeech.SUCCESS) {
                val r = tts?.setLanguage(Locale("he", "IL"))
                ttsReady = r != TextToSpeech.LANG_MISSING_DATA && r != TextToSpeech.LANG_NOT_SUPPORTED
                tts?.setSpeechRate(rate)
                tts?.setAudioAttributes(android.media.AudioAttributes.Builder().setUsage(android.media.AudioAttributes.USAGE_ASSISTANT).setContentType(android.media.AudioAttributes.CONTENT_TYPE_SPEECH).build())
                tts?.setOnUtteranceProgressListener(object : UtteranceProgressListener() {
                    override fun onStart(id: String?) { partStarted = true; main.post { speakLock(true); if (sayId != null && sayStartAt == 0L) sayStartAt = System.currentTimeMillis() } }
                    override fun onError(id: String?) { if (id?.startsWith("seg-") == true) return; main.post { speakLock(false); speakGuard?.let { main.removeCallbacks(it) }; bargeVad?.stop(); bargeVad = null; spokeCause = "error"; onSpoken() } }
                    override fun onDone(id: String?) { if (id?.startsWith("seg-") == true) return; main.post { speakLock(false); speakGuard?.let { main.removeCallbacks(it) }; if (partStart > 0) guardCore.learn(partLen, System.currentTimeMillis() - partStart); partStart = 0; bargeVad?.stop(); bargeVad = null; if (chunks.isNotEmpty() && !paused) { main.postDelayed({ speakNextChunk(false) }, 350) } else onSpoken() } }
                })
                if (!ttsReady) { Trace.e(Trace.Code.E_TTS_INIT, "he-IL=" + r); main.post { showLabel("אין קול עברי בטלפון – התקן Google Text-to-Speech עברית", 6000) } }
            }
        }
    }
    /** fix 4: every path that silences the assistant resets the whole speech state. */
    private fun stopSpeaking() {
        try { tts?.stop() } catch (e: Exception) { Trace.e(Trace.Code.E_TTS_OP, "stop:" + e.javaClass.simpleName) }
        chunks.clear(); paused = false; speaking = false; pendingListenAfterSpeech = false
        releaseSay("stop") // skipped mid-sentence: don't leave the page waiting
        bargeVad?.stop(); bargeVad = null
        speakGuard?.let { main.removeCallbacks(it) }; speakGuard = null
    }
    private fun speak(text: String, urgent: Boolean = false) {
        if (shabbat) return // shabbat-engine: no voice at all
        if (listening && listenMode != "wake") { pendingSay = text // fix 8: don't cut the user off; flush after the recognizer ends
            pendingSayTimer?.let { main.removeCallbacks(it) }; pendingSayTimer = Runnable { pendingSay?.let { t -> pendingSay = null; Trace.e(Trace.Code.E_SR_LIFECYCLE, "pendingSay-timeout"); if (listening) { try { sr?.cancel() } catch (e: Exception) { Trace.e(Trace.Code.E_SR_LIFECYCLE, "cancel:" + e.javaClass.simpleName) }; listening = false }; speak(t) } }.also { main.postDelayed(it, 12_000L) }; return } // one-shot: a held reply is released once if the recognizer never returns
        lastSaid = text
        stopVad()
        if (listening) { try { sr?.cancel() } catch (e: Exception) { Trace.e(Trace.Code.E_SR_LIFECYCLE, "speak:" + e.javaClass.simpleName) }; listening = false; unmuteSystem() }
        if (isNight() && !urgent) { vibrate(longArrayOf(0, 120, 80, 120)); showLabel("🌙 " + text, 25000); onSpoken(); return } // step 26
        if (!ttsReady) { showLabel(text, 8000); onSpoken(); return }
        chunks.clear(); paused = false
        chunks.addAll(splitChunks(text))
        speakNextChunk(true)
    }
    private fun isNight(): Boolean = night // voice command only; no automatic hours (Meir decides)
    // step 29: ≤300 chars per part, cut at sentence ends
    private fun splitChunks(t: String): List<String> {
        if (t.length <= 320) return listOf(t)
        val out = ArrayList<String>(); var cur = StringBuilder()
        for (sent in t.split(Regex("(?<=[.!?:;])\\s+"))) { if (cur.length + sent.length > 300 && cur.isNotEmpty()) { out.add(cur.toString().trim()); cur = StringBuilder() }; cur.append(sent).append(' ') }
        if (cur.isNotBlank()) out.add(cur.toString().trim())
        return out
    }
    private fun speakNextChunk(first: Boolean) {
        if (listening) { chunks.clear(); return } // fix 4: the user is talking – never talk over the recognizer
        val part = chunks.removeFirstOrNull() ?: run { speaking = false; onSpoken(); return }
        unmuteSystem(); setState(LibaState.SPEAKING); speaking = true
        partStarted = false // before the text is queued: a fast onStart must not be wiped afterwards (3.36.2 said a spoken message was "lost", and the page said it again)
        speakSegments(part)
        if (bargeIn) { bargeVad?.stop(); var me: VadGate? = null; me = VadGate(sens = 6.0, minRms = 1800.0, comm = true, warm = true) { main.post { if (bargeVad !== me) return@post; bargeVad = null; if (speaking) { try { tts?.stop() } catch (e: Exception) { Trace.e(Trace.Code.E_TTS_OP, "barge:" + e.javaClass.simpleName) }; speaking = false; speakGuard?.let { main.removeCallbacks(it) }; showLabel("כן?", 3000); startListening("cmd") } } }; bargeVad = me; me.start() }
        speakGuard?.let { main.removeCallbacks(it) }
        // safety net if TTS never reports. step clock: it is no longer the measurement - when it fires, that is a fault
        partStart = System.currentTimeMillis(); partLen = part.length
        // the phone test: a voice that never even started is not "said" - the page tries it again (lost), instead of
        // counting a message Meir only saw flash on the screen. A voice that is still talking is not a fault: wait for it
        armGuard(part.length, 0)
    }
    private fun armGuard(len: Int, extended: Int) {
        speakGuard = Runnable { if (!speaking) return@Runnable
            val talking = runCatching { tts?.isSpeaking == true }.getOrDefault(false)
            if (talking && extended < 6) { armGuard(len, extended + 1); return@Runnable } // still speaking: give it more time, up to six more windows
            speaking = false; spokeCause = if (partStarted || talking) "guard" else "lost"; chunks.clear()
            Trace.e(Trace.Code.E_TTS_GUARD, "len:" + len + ":ms/c:" + guardCore.msPerChar.toInt() + ":started:" + partStarted + ":ext:" + extended); onSpoken() }.also { main.postDelayed(it, if (extended == 0) guardCore.guardMs(len) else 4000L) }
    }
    // step 30: Hebrew with English terms – Latin runs are spoken by the English voice
    private fun speakSegments(text: String) {
        val t = tts ?: return
        val segs = ArrayList<Pair<Boolean, String>>() // (latin, text)
        val m = Regex("[A-Za-z][A-Za-z0-9+#._/\\-]*(?:\\s+[A-Za-z][A-Za-z0-9+#._/\\-]*)*").findAll(text); var last = 0
        for (r in m) { if (r.range.first > last) segs.add(false to text.substring(last, r.range.first)); segs.add(true to r.value); last = r.range.last + 1 }
        if (last < text.length) segs.add(false to text.substring(last))
        val clean = segs.filter { it.second.isNotBlank() }
        if (clean.isEmpty()) { t.speak(text, TextToSpeech.QUEUE_FLUSH, null, "liba-" + System.currentTimeMillis()); return }
        clean.forEachIndexed { i, (latin, s) ->
            try { t.language = if (latin) Locale.US else Locale("he", "IL") } catch (e: Exception) { Trace.e(Trace.Code.E_TTS_OP, "segLang:" + e.javaClass.simpleName) }
            t.speak(s, if (i == 0) TextToSpeech.QUEUE_FLUSH else TextToSpeech.QUEUE_ADD, null, (if (i == clean.size - 1) "liba-" else "seg-") + System.currentTimeMillis() + "-" + i)
        }
        try { t.language = Locale("he", "IL") } catch (e: Exception) { Trace.e(Trace.Code.E_TTS_OP, "langReset:" + e.javaClass.simpleName) }
    }
    private fun vibrate(pattern: LongArray) { try { val v = getSystemService(Context.VIBRATOR_SERVICE) as Vibrator; if (Build.VERSION.SDK_INT >= 26) v.vibrate(VibrationEffect.createWaveform(pattern, -1)) else @Suppress("DEPRECATION") v.vibrate(pattern, -1) } catch (e: Exception) { Trace.e(Trace.Code.E_HAPTIC, "vibrate:" + e.javaClass.simpleName) } }
    // step 28: short tones – heard / sent / reply arrived
    private fun tone(kind: String) { if (!tones || isNight()) return
        val (t, ms) = when (kind) { "heard" -> ToneGenerator.TONE_PROP_BEEP to 90; "sent" -> ToneGenerator.TONE_PROP_ACK to 120; else -> ToneGenerator.TONE_PROP_PROMPT to 160 }
        try { ToneGenerator(AudioManager.STREAM_NOTIFICATION, 55).let { it.startTone(t, ms); main.postDelayed({ it.release() }, ms + 200L) } } catch (e: Exception) { Trace.e(Trace.Code.E_TONE, "tone:" + kind) } }
    private fun onSpoken() {
        speaking = false
        if (heldSaying.isNotEmpty()) { val done = heldSaying; heldSaying = emptyList(); val t = System.currentTimeMillis()
            done.forEach { h -> if (h.mid.isNotBlank()) Prefs.addSpokenMid(this, h.mid); if (h.id.isNotBlank()) web?.let { LibaWeb.sendSpoke(it, h.id, t, t, "done") } } }
        releaseSay(spokeCause); spokeCause = "done" // the page acks only once the phone finished speaking
        main.postDelayed({ afterSpeech() }, 600)
    }
    private fun afterSpeech() {
        when {
            pendingListenAfterSpeech -> { pendingListenAfterSpeech = false; followStreak = 0; startListening("cmd") }
            convOn && listenMode != "wake" && SystemClock.elapsedRealtime() - lastUserAt < 60_000L && followStreak < 2 -> startListening("follow")
            else -> idleOrWake()
        }
    }
    private fun idleOrWake() { setState(if (pageReady) LibaState.IDLE else LibaState.OFFLINE); if (heyOn) wakeLoop() }
    /** Step 7: never leave the user in silence after a send. */
    private fun armWaitReminders() {
        waitTimer?.let { main.removeCallbacks(it) }
        waitTimer = Runnable { if (sentAt > 0) { speak("עוד רגע, ליבה עובדת על זה."); main.postDelayed({ if (sentAt > 0) showLabel("עדיין מחכה לתשובה של ליבה…", 20000) }, 80000) } }.also { main.postDelayed(it, 40000) } // one-shot: once per send, cancelled by the answer
    }

    // ---------- hidden WebView ----------
    private fun setupWeb() {
        if (!Settings.canDrawOverlays(this)) { Trace.e(Trace.Code.E_OVERLAY_DENIED, "web"); status = "אין הרשאת הצגה מעל אפליקציות – פתח את ליבה ואשר"; return }
        val host = FrameLayout(this).apply { clipChildren = true; clipToPadding = true }
        val w = WebView(this)
        LibaWeb.setup(w, this)
        w.webViewClient = object : android.webkit.WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView, request: android.webkit.WebResourceRequest) = false
            override fun onPageFinished(view: WebView, url: String?) { LibaWeb.injectTop(view); onPage(url ?: "") }
            override fun onRenderProcessGone(view: WebView, detail: RenderProcessGoneDetail): Boolean { main.post { rebuildWeb() }; return true }
        }
        val dm = resources.displayMetrics
        host.addView(w, FrameLayout.LayoutParams(dm.widthPixels.coerceAtLeast(720), dm.heightPixels.coerceAtLeast(1280)))
        val lp = WindowManager.LayoutParams(dp(1f).toInt(), dp(1f).toInt(), WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE, PixelFormat.TRANSLUCENT)
        lp.gravity = Gravity.TOP or Gravity.START; lp.alpha = 0.01f
        wm.addView(host, lp)
        w.loadUrl(getString(R.string.artifact_url))
        web = w; webHost = host; webLp = lp; pageLoadedAt = SystemClock.elapsedRealtime()
    }
    /** Step 9: show the live page for a minute (consent dialogs, checks), then hide it again. */
    private var pageShown = false
    fun revealPage(show: Boolean) {
        pageShown = show
        val host = webHost ?: return; val lp = webLp ?: return; val w = web ?: return
        val dm = resources.displayMetrics
        if (show) {
            lp.width = WindowManager.LayoutParams.MATCH_PARENT; lp.height = WindowManager.LayoutParams.MATCH_PARENT; lp.alpha = 1f
            lp.flags = WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN
            (w.layoutParams as FrameLayout.LayoutParams).let { it.width = FrameLayout.LayoutParams.MATCH_PARENT; it.height = FrameLayout.LayoutParams.MATCH_PARENT; w.layoutParams = it }
            revealed = true; main.postDelayed({ if (revealed) revealPage(false) }, 90000)
        } else {
            lp.width = dp(1f).toInt(); lp.height = dp(1f).toInt(); lp.alpha = 0.01f
            lp.flags = WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE
            (w.layoutParams as FrameLayout.LayoutParams).let { it.width = dm.widthPixels.coerceAtLeast(720); it.height = dm.heightPixels.coerceAtLeast(1280); w.layoutParams = it }
            revealed = false
        }
        runCatching { wm.updateViewLayout(host, lp) }.onFailure { Trace.e(Trace.Code.E_OVERLAY_UPDATE, "reveal:" + it.javaClass.simpleName) }
        bubble?.bringToFront()
        bubble?.let { runCatching { wm.removeView(it); wm.addView(it, it.layoutParams) }.onFailure { x -> Trace.e(Trace.Code.E_OVERLAY_UPDATE, "reveal:bubble:" + x.javaClass.simpleName) } }
        handle?.let { runCatching { wm.removeView(it); wm.addView(it, it.layoutParams) }.onFailure { x -> Trace.e(Trace.Code.E_OVERLAY_UPDATE, "reveal:handle:" + x.javaClass.simpleName) } }
    }
    private fun rebuildWeb() {
        Trace.e(Trace.Code.E_PAGE_LOAD, "gone")
        webHost?.let { runCatching { wm.removeView(it) }.onFailure { x -> Trace.e(Trace.Code.E_OVERLAY_UPDATE, "rebuild:" + x.javaClass.simpleName) } }; web?.destroy(); web = null; pageReady = false; pageOk = false
        setupWeb(); showLabel("הדף קרס – טוען מחדש", 4000)
    }
    /** step fixed-cardinality-telemetry: what the page needs to answer "why were you silent" - sent on change or every five minutes */
    private fun pulse(w: WebView) {
        val mic = checkSelfPermission(android.Manifest.permission.RECORD_AUDIO) == android.content.pm.PackageManager.PERMISSION_GRANTED
        val bm = getSystemService(BatteryManager::class.java)
        val battery = runCatching { bm.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY) }.getOrDefault(-1)
        val charging = runCatching { bm.isCharging }.getOrDefault(false)
        val net = runCatching { val cm = getSystemService(ConnectivityManager::class.java); cm.getNetworkCapabilities(cm.activeNetwork)?.hasCapability(android.net.NetworkCapabilities.NET_CAPABILITY_VALIDATED) == true }.getOrDefault(false)
        val ver = runCatching { packageManager.getPackageInfo(packageName, 0).versionName ?: "?" }.getOrDefault("?")
        val body = Pulse.due(Pulse.State(mic, Settings.canDrawOverlays(this), battery, charging, net, heyOn, ttsReady, pageReady, ver, getSystemService(PowerManager::class.java)?.isIgnoringBatteryOptimizations(packageName) != false,
            getSystemService(PowerManager::class.java)?.isDeviceIdleMode == true, loginWall, lifeWhy, lastGasp), heardAt, lastSpokeAt, System.currentTimeMillis()) ?: return
        LibaWeb.sendPulse(w, Pulse.devId(this), Pulse.name(), body)
    }
    /** one-life: WAKE_LOCK was declared and never used. A partial lock only while speaking, with a 90 s ceiling, so a
     *  sentence is not cut when the screen sleeps - and a lock that is never released cannot drain the battery. */
    private var wake: PowerManager.WakeLock? = null
    private fun speakLock(on: Boolean) {
        runCatching {
            if (on) { if (wake == null) wake = getSystemService(PowerManager::class.java).newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "liba:speak").apply { setReferenceCounted(false) }; wake?.acquire(90_000) }
            else if (wake?.isHeld == true) wake?.release()
            Unit
        }.onFailure { il.liba.app.Trace.e(il.liba.app.Trace.Code.E_PREFS, "bubbleservice359:" + it.javaClass.simpleName) }
    }
    /** login-health: a claude.ai session that died must not die in silence. Every ten minutes: cookies flushed to disk
     *  (a killed WebView otherwise loses a fresh login), and no claude.ai cookie at all means logged out for certain -
     *  said once an hour, and a tap on the bubble opens the page to log in. Whether the session cookie by name is there
     *  only goes to the black box: the name is claude.ai's to change, and a wrong guess would cry wolf every hour. */
    private var loginCheckedAt = 0L; private var loginLost = false
    private fun loginCheck() {
        val cm = android.webkit.CookieManager.getInstance(); runCatching { cm.flush() }.onFailure { il.liba.app.Trace.e(il.liba.app.Trace.Code.E_PREFS, "bubbleservice371:" + it.javaClass.simpleName) }
        val ck = runCatching { cm.getCookie("https://claude.ai") ?: "" }.getOrDefault("")
        if (ck.isNotEmpty() && !ck.contains("sessionKey")) Trace.e(Trace.Code.E_PAGE_LOGIN, "cookie-name")
        if (ck.isEmpty() && !loginLost) {
            loginLost = true; loginWall = true; needsLogin = true; Trace.e(Trace.Code.E_PAGE_LOGIN, "no-cookie")
            val now = SystemClock.elapsedRealtime(); if (now - loginWarnedAt > 3600000) { loginWarnedAt = now; speak("ליבה מנותקת מ-claude. לחץ עליי ואפתח לך את הדף כדי להתחבר.") }
        }
    }
    fun repairReload() { lastReloadAt = 0L; reloadPage("תיקון") }
    private fun loginRestored() { if (!loginLost && !loginWall) return; val was = loginLost; loginLost = false; loginWall = false; needsLogin = false; if (was) speak("התחברתי, הערוץ חי.") }
    private fun reloadPage(why: String) {
        if (shabbat) return
        val now = SystemClock.elapsedRealtime(); if (now - lastReloadAt < 90000) return
        lastReloadAt = now; pageReady = false; pageOk = false; pageLoadedAt = now; status = "טוען מחדש ($why)"
        web?.reload()
    }
    private val watchdog = object : Runnable { override fun run() {
        holyCheck(); if (shabbat) { main.postDelayed(this, SHABBAT_BEAT_MS); return } // Shabbat: the beat only watches the clock
        if (!pageReady && SystemClock.elapsedRealtime() - pageLoadedAt > 90000) { Trace.e(Trace.Code.E_PAGE_LOAD, "timeout"); reloadPage("אין תגובה מהדף") }
        if (pageReady) web?.let { LibaWeb.hello(it); drainTrace(); pulse(it) }
        else if (pageDeadSince == 0L) pageDeadSince = System.currentTimeMillis()
        powerSync()
        UrgentPoller.maybe(this@BubbleService, main, pageDeadSince, pageAliveAt) { speak("הודעה דחופה, בלי הדף: " + it.text, true) }
        if (SystemClock.elapsedRealtime() - loginCheckedAt > 10 * 60_000L) { loginCheckedAt = SystemClock.elapsedRealtime(); loginCheck() }
        if ("update" in pulseJobs.due(System.currentTimeMillis())) { if (il.liba.app.power.Governor.admit(il.liba.app.power.Job("update", 0))) checkUpdate() else pulseJobs.touch("update", System.currentTimeMillis() - 2 * 3600_000L) } // refused by the gear: again in an hour
        main.postDelayed(this, if (pageReady) il.liba.app.power.Governor.tier.beatMs else 30000L) // duty-governor: the pulse from the gear; a dead page is still watched every 30 s
    } }
    private fun watchNetwork() {
        try {
            val cm = getSystemService(ConnectivityManager::class.java)
            val cb = object : ConnectivityManager.NetworkCallback() {
                override fun onAvailable(n: Network) { main.post { if (running && !pageReady) reloadPage("רשת חזרה") } }
            }
            cm.registerDefaultNetworkCallback(cb); netCb = cb
        } catch (e: Exception) { Trace.e(Trace.Code.E_SYS_CB, "net:" + e.javaClass.simpleName) }
        runCatching { // fix: the overlay never gets onVisibilityChanged, so the shader would keep drawing with the screen off
            val sc = object : android.content.BroadcastReceiver() {
                override fun onReceive(c: Context?, i: Intent?) { main.post { dot?.visibility = if (i?.action == Intent.ACTION_SCREEN_OFF) View.INVISIBLE else View.VISIBLE
                    il.liba.app.sense.SenseFusion.onScreen(this@BubbleService, i?.action == Intent.ACTION_SCREEN_ON) } }
            }
            registerReceiver(sc, android.content.IntentFilter().apply { addAction(Intent.ACTION_SCREEN_OFF); addAction(Intent.ACTION_SCREEN_ON) }); screenCb = sc
        }.onFailure { Trace.e(Trace.Code.E_SYS_CB, "screen:" + it.javaClass.simpleName) }
    }

    // ---------- update check ----------
    /** step 92: download the new APK and hand it to the package installer – no browser, no file manager. */
    /** SHA-256 of each signing certificate - of the running app, or of an APK file on disk. */
    @Suppress("DEPRECATION")
    private fun signers(pi: android.content.pm.PackageInfo?): Set<String> {
        if (pi == null) return emptySet()
        val sigs = if (Build.VERSION.SDK_INT >= 28) pi.signingInfo?.let { if (it.hasMultipleSigners()) it.apkContentsSigners else it.signingCertificateHistory } else pi.signatures
        return (sigs ?: emptyArray()).map { s -> java.security.MessageDigest.getInstance("SHA-256").digest(s.toByteArray()).joinToString("") { "%02x".format(it) } }.toSet()
    }
    @Suppress("DEPRECATION")
    private fun sameSigner(apkPath: String): Boolean {
        val flag = if (Build.VERSION.SDK_INT >= 28) android.content.pm.PackageManager.GET_SIGNING_CERTIFICATES else android.content.pm.PackageManager.GET_SIGNATURES
        val mine = signers(packageManager.getPackageInfo(packageName, flag))
        val file = signers(packageManager.getPackageArchiveInfo(apkPath, flag))
        return mine.isNotEmpty() && file.isNotEmpty() && mine.intersect(file).isNotEmpty()
    }
    fun installUpdate() {
        if (shabbat) return
        val url = Prefs.updateUrl(this) ?: run { speak("אין עדכון ממתין."); return }
        if (!packageManager.canRequestPackageInstalls()) { // the installer silently drops our intent without this
            Trace.e(Trace.Code.E_INSTALL_PERM, "canRequestPackageInstalls")
            showLabel("צריך הרשאה להתקין אפליקציות – פתח את ליבה ואשר", 8000)
            speak("אין לי הרשאה להתקין. פתח את ליבה, אשר התקנת אפליקציות ממקור לא ידוע, ותגיד תתקין שוב.")
            notifyIntent("ליבה – הרשאת התקנה", "לחץ כדי לאשר התקנת אפליקציות", Intent(android.provider.Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES, android.net.Uri.parse("package:" + packageName)).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK))
            return
        }
        showLabel("מורידה עדכון…", 20000)
        Thread { il.liba.app.power.PowerLedger.pulse(this, "net.update", 60_000L)
            var fail = "net" // which stage threw, so the single catch below can name the right code
            try {
                val dir = java.io.File(cacheDir, "apk").apply { mkdirs() }; val f = java.io.File(dir, "liba.apk")
                val c = URL(url).openConnection() as HttpURLConnection; c.connectTimeout = 15000; c.readTimeout = 60000; c.instanceFollowRedirects = true
                // step verified-install: 404, an error page, no room - each with its own sentence, before a byte is written
                UpdateTrust.before(true, c.responseCode, c.contentType ?: "", c.contentLengthLong, dir.usableSpace)?.let { why -> fail = "pre:" + c.responseCode; throw java.io.IOException(why) }
                val want = c.contentLengthLong
                val got = c.inputStream.use { i -> f.outputStream().use { o -> i.copyTo(o) } }
                // a half-downloaded or wrong file installs as "האפליקציה לא הותקנה" with no reason: check it here instead
                if (want > 0 && got != want) { fail = "truncated"; throw java.io.IOException("ההורדה נקטעה (" + got / 1024 + " מתוך " + want / 1024 + " קילובייט)") }
                val head = ByteArray(2); java.io.FileInputStream(f).use { it.read(head) }
                if (got < 100000 || head[0] != 'P'.code.toByte() || head[1] != 'K'.code.toByte()) { fail = "notapk"; throw java.io.IOException("הקובץ שהתקבל אינו אפליקציה") }
                // step 1: three proofs before the installer ever sees the file.
                // (a) the bytes are the ones ship/release.mjs measured
                val want256 = Prefs.updateSha(this)
                if (want256.isNullOrBlank()) { fail = "sha"; throw java.io.IOException("אין טביעה לגרסה, ולכן לא מתקינה") } // update-trust: never without it
                run {
                    val md = java.security.MessageDigest.getInstance("SHA-256")
                    java.io.FileInputStream(f).use { i -> val b = ByteArray(65536); while (true) { val n = i.read(b); if (n <= 0) break; md.update(b, 0, n) } }
                    val got256 = md.digest().joinToString("") { "%02x".format(it) }
                    if (got256 != want256) { fail = "sha"; throw java.io.IOException("הקובץ שהתקבל אינו הגרסה שנשלחה") }
                }
                // (b) it really is an APK, and (c) it is really newer than what is running
                val info = packageManager.getPackageArchiveInfo(f.absolutePath, 0)
                    ?: run { fail = "notapk"; throw java.io.IOException("הקובץ שהתקבל אינו אפליקציה") }
                if (info.packageName != packageName) { fail = "pkg"; throw java.io.IOException("הקובץ שהתקבל הוא אפליקציה אחרת") }
                // (d) step release-drift: signed by the key of what is running. Android would refuse a foreign signer too,
                // but only as "האפליקציה לא הותקנה" with no reason. Compared with the installed app rather than a
                // constant baked into the code, so a v3 key rotation (lineage) stays possible.
                if (!sameSigner(f.absolutePath)) { fail = "signer"; throw java.io.IOException("הקובץ חתום במפתח אחר ממה שמותקן, ולכן לא מתקינה אותו") }
                val fileCode = if (Build.VERSION.SDK_INT >= 28) info.longVersionCode.toInt() else @Suppress("DEPRECATION") info.versionCode
                val mine = packageManager.getPackageInfo(packageName, 0).let { if (Build.VERSION.SDK_INT >= 28) it.longVersionCode.toInt() else @Suppress("DEPRECATION") it.versionCode }
                if (fileCode <= mine) { fail = "older"; throw java.io.IOException("זו אותה גרסה שכבר מותקנת (" + fileCode + ")") }
                val newName = info.versionName ?: Prefs.updateName(this)
                keepRollback() // verified-install: the running version is kept before it is replaced
                val viaSession = runCatching { installSession(f) }.onFailure { Trace.e(Trace.Code.E_INTENT_OPEN, "session:" + it.javaClass.simpleName) }.isSuccess
                if (viaSession) { main.post { showLabel("מתקינה $newName… אשר בחלון", 8000); hideBubble(45000); speak("מתקינה גרסה " + newName.replace(".", " נקודה ")) }; return@Thread }
                val uri = androidx.core.content.FileProvider.getUriForFile(this, "il.liba.app.files", f)
                val i = Intent(Intent.ACTION_VIEW).setDataAndType(uri, "application/vnd.android.package-archive").addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_GRANT_READ_URI_PERMISSION)
                main.post { showLabel("מתקינה $newName… אשר בחלון", 8000); hideBubble(45000)
                    speak("מתקינה גרסה " + newName.replace(".", " נקודה "))
                    try { startActivity(i) } catch (e: Exception) { Trace.e(Trace.Code.E_INTENT_OPEN, "installer:" + e.javaClass.simpleName) }
                    notifyIntent("התקנת ליבה", "לחץ כדי להתקין את הגרסה החדשה", i) } // a background start can be dropped silently: always leave a tappable notification
            } catch (e: Exception) { val why = e.message ?: e.toString()
                if (fail == "sha" || fail == "notapk" || fail == "pkg" || fail == "older" || fail == "signer") Trace.e(Trace.Code.E_INSTALL_SIG, fail)
                else Trace.e(Trace.Code.E_INSTALL_NET, if (fail == "net") e.javaClass.simpleName else fail)
                main.post { showLabel("הורדה נכשלה: $why", 10000); speak("ההורדה נכשלה. " + why + ". אפשר לנסות שוב מהמסך הראשי.") } }
        }.start()
    }
    /** verified-install: the PackageInstaller session - Android's answer comes back to InstallResultReceiver */
    private fun installSession(f: java.io.File) {
        val pi = packageManager.packageInstaller
        val sid = pi.createSession(android.content.pm.PackageInstaller.SessionParams(android.content.pm.PackageInstaller.SessionParams.MODE_FULL_INSTALL))
        pi.openSession(sid).use { s ->
            s.openWrite("liba.apk", 0, f.length()).use { o -> f.inputStream().use { it.copyTo(o) }; s.fsync(o) }
            val flags = PendingIntent.FLAG_UPDATE_CURRENT or (if (Build.VERSION.SDK_INT >= 31) PendingIntent.FLAG_MUTABLE else 0)
            s.commit(PendingIntent.getBroadcast(this, sid, Intent(this, InstallResultReceiver::class.java), flags).intentSender) }
    }
    fun installSaid(t: String) { main.post { showLabel(t, 10000); speak(t) } }
    /** keep the APK that is running now (filesDir/rollback), the last two */
    private fun keepRollback() { runCatching {
        val code = packageManager.getPackageInfo(packageName, 0).let { if (Build.VERSION.SDK_INT >= 28) it.longVersionCode.toInt() else @Suppress("DEPRECATION") it.versionCode }
        val dir = java.io.File(filesDir, "rollback").apply { mkdirs() }; val out = java.io.File(dir, "liba-$code.apk")
        if (!out.exists()) java.io.File(applicationInfo.sourceDir).copyTo(out) // vault-ok: the app's own public APK, no words
        dir.listFiles()?.sortedByDescending { it.lastModified() }?.drop(2)?.forEach { it.delete() } }.onFailure { Trace.e(Trace.Code.E_PREFS, "rollback:" + it.javaClass.simpleName) } }
    private fun rollbackSay() { val prev = java.io.File(filesDir, "rollback").listFiles()?.map { it.name.removePrefix("liba-").removeSuffix(".apk") }?.sortedDescending()?.getOrNull(1)
        speak(UpdateTrust.rollbackWords(prev?.let { "הגרסה הקודמת, מספר $it" })) }
    // duty-governor: the 3-hour update check rides the pulse (it used to be its own timer chain, and a refused one re-armed hourly)
    private val pulseJobs = il.liba.app.power.PulseCore().apply { every("update", 3 * 3600_000L, now = System.currentTimeMillis()) }
    private val SHABBAT_BEAT_MS = 30_000L
    /**
     * step 1 (one-tree-one-version): a version check that cannot fail quietly.
     * Two things were wrong before. The request went through whatever the CDN had cached, so the
     * answer could be minutes or hours old; and every failure ended in Log.d, which means Meir said
     * "תתקין", nothing happened, and nothing said why.
     */
    private var updateFailSpoken = false
    private fun checkUpdate(onDone: (() -> Unit)? = null) {
        if (shabbat) { onDone?.invoke(); return }
        Thread { il.liba.app.power.PowerLedger.pulse(this, "net.update", 60_000L)
            var http = 0
            try {
                val c = URL(getString(R.string.update_json)).openConnection() as HttpURLConnection
                c.connectTimeout = 8000; c.readTimeout = 8000
                c.setRequestProperty("Cache-Control", "no-cache")
                c.setRequestProperty("Pragma", "no-cache")
                http = c.responseCode
                if (http != 200) throw java.io.IOException("שרת הגרסאות ענה " + http)
                val j = JSONObject(c.inputStream.bufferedReader().readText())
                val mine = packageManager.getPackageInfo(packageName, 0).let { if (Build.VERSION.SDK_INT >= 28) it.longVersionCode.toInt() else @Suppress("DEPRECATION") it.versionCode }
                if (j.getInt("versionCode") > mine) {
                    // step update-trust: an unsigned or altered manifest is not an update - nothing is downloaded
                    UpdateTrust.manifest(j.getInt("versionCode"), j.optString("sha256"), j.optString("url"), j.optString("sig"))?.let { why ->
                        Trace.e(Trace.Code.E_INSTALL_SIG, "manifest"); Prefs.setUpdate(this, null, mine); main.post { showLabel("לא מתקינה: $why", 8000) }; onDone?.let { main.post(it) }; return@Thread }
                    Prefs.setUpdate(this, j.getString("url"), j.getInt("versionCode"), j.optString("sha256", null), j.optString("versionName"))
                    main.post { showLabel("יש גרסה חדשה (${j.optString("versionName")}) – לחיצה ארוכה עליי להתקנה", 8000) }
                } else Prefs.setUpdate(this, null, mine)
                updateFailSpoken = false
            } catch (e: Exception) {
                val why = e.message ?: e.toString()
                Trace.e(Trace.Code.E_NET, if (http != 0 && http != 200) "http=" + http else e.javaClass.simpleName)
                main.post {
                    showLabel("בדיקת גרסה נכשלה: $why", 6000)
                    // said once per failure streak, so a week offline is not a week of complaining
                    if (!updateFailSpoken) { updateFailSpoken = true; speak("לא הצלחתי לבדוק אם יש גרסה חדשה. " + why + ".") }
                }
            }
            main.post { onDone?.invoke() }
        }.start()
        pulseJobs.touch("update", System.currentTimeMillis()) // always-updatable: every 3 h on the pulse, and on every start (boot, update, revive)
    }

    // ---------- bubble ----------
    // step core-machine: the state enum is generated from protocol/protocol.json (LibaState) and shared with the
    // page. A move the table does not allow is recorded as a fault and still applied - never break the bubble.
    private var appState = LibaState.INITIAL
    private var pageState = ""
    // power-ledger: which subsystems are on right now - called on every state change and by the watchdog
    private var powerSentAt = 0L
    private fun powerSync() { runCatching {
        val on = HashSet<String>()
        if (vad != null) on.add("mic.vad"); if (listening) on.add(if (srOnDevice) "asr.ondevice" else "asr.cloud"); if (speaking) on.add("tts")
        if (dot?.animating == true) on.add(if (dot?.idleSlow == true) "ui.shader.idle" else "ui.shader"); if (web != null) on.add(if (pageReady) "web.idle" else "web.load")
        il.liba.app.power.PowerLedger.sync(this, on)
        val now = SystemClock.elapsedRealtime()
        if (now - powerSentAt > 5 * 60_000L) { powerSentAt = now; val j = il.liba.app.power.PowerLedger.report(this)
            governorTick()
            if (pageReady) web?.let { LibaWeb.sendPower(it, j.dropLast(1) + ",\"tier\":\"" + il.liba.app.power.Governor.tier.name + "\",\"miss\":" + il.liba.app.power.GovernorCore.missEstimate(il.liba.app.power.Governor.tier, vad?.voiceFrac ?: 0.0) + "}") } }
    }.onFailure { Trace.e(Trace.Code.E_PREFS, "power:" + it.javaClass.simpleName) } }
    // duty-governor: the gear from the ledger's projection; a change is applied to the mic and said once
    private fun governorTick() {
        val ch = il.liba.app.power.Governor.tick(this, il.liba.app.power.PowerLedger.last?.projPct) ?: return
        val t = ch.second
        vad?.duty(t.onMs, t.offMs)
        if (t == il.liba.app.power.Tier.COLD) stopVad() else if (heyOn && vad == null && !listening && !speaking) wakeLoop()
        if (!isNight()) speak(il.liba.app.power.GovernorCore.words(ch.first, t, ch.third))
    }
    private fun setState(s: LibaState) {
        powerSync()
        if (!LibaState.canMove(appState, s)) Trace.e(Trace.Code.E_STATE_ILLEGAL, appState.name + ">" + s.name)
        appState = s
        web?.evaluateJavascript("window.__libaState='" + s.name + "'", null)
        val d = dot ?: return
        if (s == LibaState.IDLE || s == LibaState.WAKE || s == LibaState.OFFLINE) schedulePeek() else unpeek()
        if (s == LibaState.LISTENING && d.mode != OrbView.Mode.LISTENING) haptic()
        val lc = when (s) { LibaState.LISTENING -> OrbView.ROSE; LibaState.RINGING -> OrbView.AMBER; LibaState.OFFLINE -> OrbView.GRAY; LibaState.SPEAKING -> when { curSpeaker.contains("מנהל") -> OrbView.VIOLET; curSpeaker.contains("אדריכל") || curSpeaker.contains("עובד") || curSpeaker.contains("סוכן") -> OrbView.MINT; else -> OrbView.CYAN }; else -> OrbView.CYAN }
        (label?.background as? GradientDrawable)?.setStroke(dp(1f).toInt(), OrbView.withA(lc, 130))
        val speakerColor = when { curSpeaker.contains("מנהל") -> OrbView.VIOLET; curSpeaker.contains("אדריכל") || curSpeaker.contains("עובד") || curSpeaker.contains("סוכן") -> OrbView.MINT; else -> OrbView.CYAN }
        when (s) {
            LibaState.IDLE -> d.set(OrbView.Mode.IDLE, OrbView.CYAN)
            LibaState.WAKE -> d.set(OrbView.Mode.WAKE, OrbView.CYAN)
            LibaState.OFFLINE -> d.set(OrbView.Mode.OFFLINE, OrbView.GRAY)
            LibaState.LISTENING -> d.set(OrbView.Mode.LISTENING, OrbView.ROSE)
            LibaState.SPEAKING -> d.set(OrbView.Mode.SPEAKING, speakerColor)
            LibaState.RINGING -> d.set(OrbView.Mode.RINGING, OrbView.AMBER)
            LibaState.SENDING -> d.set(OrbView.Mode.SENDING, OrbView.CYAN)
            // no else: a new state in the contract must get a look here, or the build fails
            LibaState.THINKING -> d.set(OrbView.Mode.SENDING, OrbView.CYAN)
            LibaState.QUIET -> d.set(OrbView.Mode.IDLE, OrbView.GRAY)
            LibaState.DEGRADED -> d.set(OrbView.Mode.IDLE, OrbView.AMBER)
        }
    }
    // two windows, both small: an untouchable canvas (2.8x the body) that follows the creature as it roams the screen,
    // and an invisible handle over the body that takes taps, long-presses and drags. Nothing covers the rest of the screen,
    // so installers, permission dialogs and every other app keep working underneath.
    private var handle: View? = null; private var rootLp: WindowManager.LayoutParams? = null; private var bigSize = 0
    private var dragging = false
    private var rootW = 0
    private fun syncWindows() { val root = bubble ?: return; val h = handle ?: return; val lp = rootLp ?: return; val lpH = bubbleLp ?: return; val d = dot ?: return; if (d.pos.x < 0) return
        lp.x = (d.pos.x - rootW / 2).toInt(); lp.y = (d.pos.y - bigSize / 2).toInt(); lpH.x = (d.pos.x - bubbleSize / 2).toInt(); lpH.y = (d.pos.y - bubbleSize / 2).toInt()
        runCatching { wm.updateViewLayout(root, lp) }.onFailure { Trace.e(Trace.Code.E_OVERLAY_UPDATE, "sync:root:" + it.javaClass.simpleName) }
        runCatching { wm.updateViewLayout(h, lpH) }.onFailure { Trace.e(Trace.Code.E_OVERLAY_UPDATE, "sync:handle:" + it.javaClass.simpleName) } }
    private fun syncHandle() = syncWindows()
    /** label and menu are laid out by the FrameLayout itself (centred under the body), so nothing needs moving */
    private fun positionAttachments() {}
    private fun syncRoot() = syncWindows()
    private fun arena() { val d = dot ?: return; val dm = resources.displayMetrics; d.arenaW = dm.widthPixels.toFloat(); d.arenaH = dm.heightPixels.toFloat() }
    /** hide both windows while the package installer (or another secure dialog) needs the screen */
    private var hideToken = 0
    fun hideBubble(ms: Long) { hideToken++; val t = hideToken; bubble?.visibility = View.GONE; handle?.visibility = View.GONE
        main.postDelayed({ if (t == hideToken) { bubble?.visibility = View.VISIBLE; handle?.visibility = View.VISIBLE } }, ms) } // an overlapping hide must not un-hide the newer one
    private fun setupBubble() {
        if (!Settings.canDrawOverlays(this)) { // without this permission wm.addView throws and the bubble just never appears
            Trace.e(Trace.Code.E_OVERLAY_DENIED, "bubble"); status = "אין הרשאת הצגה מעל אפליקציות אחרות"
            notifyIntent("ליבה לא יכולה להופיע", "צריך הרשאה להצגה מעל אפליקציות אחרות – לחץ כדי לאשר", Intent(this, MainActivity::class.java).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK))
            return
        }
        val root = FrameLayout(this); val sw = resources.configuration.smallestScreenWidthDp; val size = dp(if (sw >= 600) 78f else 62f).toInt() // step 40: bigger on tablets / unfolded
        val big = (size * 2.8f).toInt(); val touchSize = (size * 1.5f).toInt()
        val d = OrbView(this).apply { bodyFrac = size.toFloat() / big; roam = true; boxPx = big.toFloat(); importantForAccessibility = View.IMPORTANT_FOR_ACCESSIBILITY_NO }
        val l = TextView(this).apply {
            setTextColor(Color.parseColor("#F3F5FF")); textSize = 14f; setPadding(dp(14f).toInt(), dp(8f).toInt(), dp(14f).toInt(), dp(8f).toInt()); maxWidth = dp(240f).toInt()
            typeface = android.graphics.Typeface.create("sans-serif-medium", android.graphics.Typeface.NORMAL); setLineSpacing(0f, 1.15f)
            background = GradientDrawable().apply { cornerRadius = dp(18f); setColor(Color.parseColor("#F2121628")); setStroke(dp(1f).toInt(), Color.parseColor("#2EFFFFFF")) }
            elevation = dp(4f); visibility = View.GONE; textDirection = View.TEXT_DIRECTION_RTL
        }
        val rw = maxOf(big, dp(300f).toInt()); val rh = big / 2 + dp(460f).toInt(); rootW = rw
        root.addView(d, FrameLayout.LayoutParams(big, big).apply { gravity = Gravity.TOP or Gravity.CENTER_HORIZONTAL })
        root.addView(l, FrameLayout.LayoutParams(FrameLayout.LayoutParams.WRAP_CONTENT, FrameLayout.LayoutParams.WRAP_CONTENT).apply { gravity = Gravity.TOP or Gravity.CENTER_HORIZONTAL; topMargin = big / 2 + size / 2 + dp(8f).toInt() })
        val lp = WindowManager.LayoutParams(rw, rh, WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS or WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED or WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE or WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN, PixelFormat.TRANSLUCENT)
        lp.gravity = Gravity.TOP or Gravity.START
        val h = View(this).apply { contentDescription = "ליבה. לחיצה: דבר. לחיצה ארוכה: תפריט"; importantForAccessibility = View.IMPORTANT_FOR_ACCESSIBILITY_YES }
        val lpH = WindowManager.LayoutParams(touchSize, touchSize, WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS or WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN, PixelFormat.TRANSLUCENT)
        lpH.gravity = Gravity.TOP or Gravity.START
        bubbleLp = lpH; bubbleSize = touchSize; bigSize = big; rootLp = lp
        bubble = root; dot = d; label = l; handle = h; d.style = Prefs.style(this)
        arena(); val dm = resources.displayMetrics; d.setPos(dm.widthPixels - big / 2f - dp(8f), dm.heightPixels * 0.3f)
        lp.x = (d.pos.x - big / 2).toInt(); lp.y = (d.pos.y - big / 2).toInt(); lpH.x = (d.pos.x - size / 2).toInt(); lpH.y = (d.pos.y - size / 2).toInt()
        wm.addView(root, lp); wm.addView(h, lpH)
        d.onMoved = { _, _ -> main.post { syncWindows() } }
        setState(LibaState.OFFLINE)
        var sx = 0f; var sy = 0f; var ox = 0f; var oy = 0f; var moved = false; var downAt = 0L
        val longPress = Runnable { if (!moved) { moved = true; toggleMenu(root, size) } }
        val emergencyPress = Runnable { if (!moved) { moved = true; emergencyMode() } }
        h.setOnTouchListener { _, ev ->
            when (ev.actionMasked) {
                MotionEvent.ACTION_DOWN -> { snapAnim?.cancel(); unpeek(); sx = ev.rawX; sy = ev.rawY; ox = d.pos.x; oy = d.pos.y; moved = false; dragging = true; d.hold(true); downAt = SystemClock.uptimeMillis(); d.press(true); main.postDelayed(if (shabbat) emergencyPress else longPress, if (shabbat) 3000L else 600L); true }
                MotionEvent.ACTION_MOVE -> { val dx = ev.rawX - sx; val dy = ev.rawY - sy
                    if (abs(dx) > dp(6f) || abs(dy) > dp(6f)) { moved = true; main.removeCallbacks(longPress) }
                    d.setPos(ox + dx, oy + dy); true }
                MotionEvent.ACTION_UP, MotionEvent.ACTION_CANCEL -> { main.removeCallbacks(longPress); main.removeCallbacks(emergencyPress); d.press(false); dragging = false; d.hold(false); if (!moved && !shabbat && SystemClock.uptimeMillis() - downAt < 600) onTap(); true }
                else -> false
            }
        }
    }
    private fun clampBubble(lp: WindowManager.LayoutParams, size: Int) {
        val dm = resources.displayMetrics
        lp.x = lp.x.coerceIn(0, (dm.widthPixels - size).coerceAtLeast(0)); lp.y = lp.y.coerceIn(0, (dm.heightPixels - size - dp(40f).toInt()).coerceAtLeast(0))
    }
    // premium feel: the orb docks to the nearest edge with a spring, then tucks itself a little when nobody is using it
    private var bubbleLp: WindowManager.LayoutParams? = null; private var bubbleSize = 0
    private var snapAnim: ValueAnimator? = null; private var peeked = false
    private val peekRun = Runnable { peek() }
    private fun snapToEdge() {
        if (dot?.roam == true) return
        val root = bubble ?: return; val lp = bubbleLp ?: return; val w = resources.displayMetrics.widthPixels
        val target = if (lp.x + bubbleSize / 2 < w / 2) 0 else (w - bubbleSize).coerceAtLeast(0)
        snapAnim?.cancel()
        val h = handle ?: return
        snapAnim = ValueAnimator.ofInt(lp.x, target).apply { duration = 340; interpolator = android.view.animation.OvershootInterpolator(1.1f)
            addUpdateListener { lp.x = it.animatedValue as Int; runCatching { wm.updateViewLayout(h, lp) }.onFailure { x -> Trace.e(Trace.Code.E_OVERLAY_UPDATE, "snap:" + x.javaClass.simpleName) }; syncRoot() }; start() }
    }
    private fun schedulePeek() { main.removeCallbacks(peekRun); if (il.liba.app.power.Governor.admit(il.liba.app.power.Job("peek", 1))) main.postDelayed(peekRun, 9000) } // one-shot: tuck the bubble aside after 9 s untouched; re-armed only by a touch
    private fun peek() {
        if (dot?.roam == true) return
        val root = bubble ?: return; val lp = bubbleLp ?: return
        if (menu != null || label?.visibility == View.VISIBLE || listening || speaking || tts?.isSpeaking == true) { schedulePeek(); return }
        val w = resources.displayMetrics.widthPixels; val dockedRight = lp.x < w / 2
        peeked = true; root.animate().translationX(if (dockedRight) bubbleSize * 0.28f else -bubbleSize * 0.28f).alpha(0.86f).setDuration(420).setInterpolator(android.view.animation.DecelerateInterpolator()).start()
    }
    private fun unpeek() { main.removeCallbacks(peekRun); if (!peeked) return; peeked = false; bubble?.animate()?.translationX(0f)?.alpha(1f)?.setDuration(220)?.start() }
    private fun haptic() { try { val v = getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
        if (Build.VERSION.SDK_INT >= 29) v.vibrate(VibrationEffect.createPredefined(VibrationEffect.EFFECT_TICK)) else @Suppress("DEPRECATION") v.vibrate(12) } catch (e: Exception) { Trace.e(Trace.Code.E_HAPTIC, "haptic:" + e.javaClass.simpleName) } }
    override fun onConfigurationChanged(newConfig: android.content.res.Configuration) {
        super.onConfigurationChanged(newConfig) // fix 9: fold / unfold / rotate – keep the bubble on the visible screen
        val d = dot ?: return; arena(); if (d.roam) { val dm = resources.displayMetrics
            val hx = (bigSize / 2f).coerceAtMost(dm.widthPixels / 2f); val hy = (bigSize / 2f).coerceAtMost(dm.heightPixels / 2f)
            d.setPos(d.pos.x.coerceIn(hx, (dm.widthPixels - hx).coerceAtLeast(hx)), d.pos.y.coerceIn(hy, (dm.heightPixels - hy).coerceAtLeast(hy))); syncWindows(); return }
        val h = handle ?: return; val lp = bubbleLp ?: return
        clampBubble(lp, bubbleSize); runCatching { wm.updateViewLayout(h, lp) }.onFailure { Trace.e(Trace.Code.E_OVERLAY_UPDATE, "config:" + it.javaClass.simpleName) }; syncRoot()
    }
    private fun openMain() { startActivity(Intent(this, MainActivity::class.java).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)) }
    // step 31: long-press menu on the bubble – no screen to open
    private fun toggleMenu(root: FrameLayout, size: Int) {
        menu?.let { closeMenu(root); return }
        val m = android.widget.LinearLayout(this).apply { orientation = android.widget.LinearLayout.VERTICAL; layoutDirection = View.LAYOUT_DIRECTION_RTL
            background = GradientDrawable().apply { cornerRadius = dp(20f); setColor(Color.parseColor("#F5121628")); setStroke(dp(1f).toInt(), Color.parseColor("#2EFFFFFF")) }; elevation = dp(10f); setPadding(dp(8f).toInt(), dp(8f).toInt(), dp(8f).toInt(), dp(8f).toInt()); minimumWidth = dp(200f).toInt() }
        fun item(t: String, act: () -> Unit) { m.addView(TextView(this).apply { text = t; setTextColor(Color.parseColor("#F3F5FF")); textSize = 15f; typeface = android.graphics.Typeface.create("sans-serif-medium", android.graphics.Typeface.NORMAL); setPadding(dp(16f).toInt(), dp(11f).toInt(), dp(16f).toInt(), dp(11f).toInt())
            background = android.graphics.drawable.RippleDrawable(android.content.res.ColorStateList.valueOf(Color.parseColor("#337DF9FF")), null, GradientDrawable().apply { cornerRadius = dp(12f); setColor(Color.WHITE) }); setOnClickListener { toggleMenu(root, size); act() } }) }
        item("🎙 דבר") { startListening("cmd") }
        item(if (heyOn) "🔇 שקט (כבה מילת הפעלה)" else "🔔 הפעל מילת הפעלה") { if (heyOn) { tts?.stop(); heyOff() } else { heyOn = true; Prefs.setHey(this, true); wakeLoop() } }
        item("📋 סטטוס") { speak(localStatus()) }
        item("⏸ עצור את הצי") { if (pageReady) web?.let { LibaWeb.sendInput(it, "תעצור הכול", "menu") } else speak("הדף לא מחובר - אי אפשר לעצור את הצי מכאן כרגע.") } // fleet-control
        item(if (night) "🔊 בטל מצב לילה" else "🌙 מצב לילה") { night = !night; Prefs.setNight(this, night); showLabel(if (night) "🌙 מצב לילה" else "חזרתי לדבר", 2500) }
        item("🕘 יומן והגדרות") { openMain() }
        item("🖥 הצג/הסתר דף") { revealPage(!pageShown) }
        if (Prefs.updateUrl(this) != null) item("⬇ התקן גרסה חדשה") { installUpdate() }
        item("⏻ כבה בועה") { Prefs.setOn(this, false); stopSelf() }
        root.addView(m, FrameLayout.LayoutParams(FrameLayout.LayoutParams.WRAP_CONTENT, FrameLayout.LayoutParams.WRAP_CONTENT).apply { gravity = Gravity.TOP or Gravity.CENTER_HORIZONTAL; topMargin = bigSize / 2 + bubbleSize / 2 + dp(8f).toInt() })
        m.visibility = View.VISIBLE
        rootLp?.let { it.flags = it.flags and WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE.inv(); runCatching { wm.updateViewLayout(root, it) }.onFailure { x -> Trace.e(Trace.Code.E_OVERLAY_UPDATE, "menu:open:" + x.javaClass.simpleName) } }
        menu = m; main.postDelayed({ if (menu === m) closeMenu(root) }, 8000)
    }
    private fun closeMenu(root: FrameLayout) { menu?.let { root.removeView(it) }; menu = null; rootLp?.let { it.flags = it.flags or WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE; runCatching { wm.updateViewLayout(root, it) }.onFailure { x -> Trace.e(Trace.Code.E_OVERLAY_UPDATE, "menu:close:" + x.javaClass.simpleName) } } }
    // step 25: headset / car button = "דבר" (opt-in – would otherwise steal the button from music apps)
    private fun setupMediaSession() {
        if (!headsetBtn) { mediaSession?.let { it.isActive = false; it.release() }; mediaSession = null; return }
        if (mediaSession != null) return
        try {
            val ms = android.media.session.MediaSession(this, "liba")
            ms.setCallback(object : android.media.session.MediaSession.Callback() {
                override fun onMediaButtonEvent(i: Intent): Boolean { val ev = i.getParcelableExtra<KeyEvent>(Intent.EXTRA_KEY_EVENT) ?: return false
                    if (ev.action == KeyEvent.ACTION_DOWN && (ev.keyCode == KeyEvent.KEYCODE_HEADSETHOOK || ev.keyCode == KeyEvent.KEYCODE_MEDIA_PLAY_PAUSE || ev.keyCode == KeyEvent.KEYCODE_MEDIA_PLAY)) { main.post { onTap() }; return true }
                    return false }
                override fun onPlay() { main.post { onTap() } }
                override fun onPause() { main.post { onTap() } }
            })
            ms.setPlaybackState(android.media.session.PlaybackState.Builder().setActions(android.media.session.PlaybackState.ACTION_PLAY or android.media.session.PlaybackState.ACTION_PAUSE or android.media.session.PlaybackState.ACTION_PLAY_PAUSE).setState(android.media.session.PlaybackState.STATE_PLAYING, 0, 1f).build())
            ms.isActive = true; mediaSession = ms
        } catch (e: Exception) { Trace.e(Trace.Code.E_MEDIA_SESSION, e.javaClass.simpleName) }
    }
    private var labelHide: Runnable? = null
    private fun showLabel(text: String, ms: Long) {
        val l = label ?: return; l.text = text; unpeek()
        if (l.visibility != View.VISIBLE) { l.alpha = 0f; l.visibility = View.VISIBLE; l.animate().alpha(1f).setDuration(180).start() }
        labelHide?.let { main.removeCallbacks(it) }; labelHide = Runnable { l.animate().alpha(0f).setDuration(160).withEndAction { l.visibility = View.GONE; schedulePeek() }.start() }.also { main.postDelayed(it, ms) }
    }
    private fun onTap() {
        when {
            listening && listenMode != "wake" -> sr?.stopListening()
            speaking || tts?.isSpeaking == true -> { stopSpeaking(); idleOrWake() }
            !pageReady && loginWall -> { revealPage(true); showLabel("התחבר ל-claude בדף שנפתח", 6000) }
            !pageReady -> { showLabel(status, 6000); web?.let { LibaWeb.hello(it) }; if (status.startsWith("הדף לא")) reloadPage("לחיצה") }
            else -> startListening("cmd")
        }
    }

    // ---------- speech in ----------
    private val muteStreams = intArrayOf(AudioManager.STREAM_SYSTEM)
    private fun muteSystem() { if (systemMuted) return; val am = getSystemService(AUDIO_SERVICE) as AudioManager; if (am.isMusicActive) return; muteStreams.forEach { try { am.adjustStreamVolume(it, AudioManager.ADJUST_MUTE, 0) } catch (e: Exception) { Trace.e(Trace.Code.E_AUDIO_STREAM, "mute:" + e.javaClass.simpleName) } }; systemMuted = true }
    private fun unmuteSystem() { if (!systemMuted) return; val am = getSystemService(AUDIO_SERVICE) as AudioManager; muteStreams.forEach { try { am.adjustStreamVolume(it, AudioManager.ADJUST_UNMUTE, 0) } catch (e: Exception) { Trace.e(Trace.Code.E_AUDIO_STREAM, "unmute:" + e.javaClass.simpleName) } }; systemMuted = false }
    private fun wakeLoop() { if (!running || shabbat || !heyOn || listening || speaking || tts?.isSpeaking == true) return; startVad() }
    // step 21: hold the mic with a cheap energy gate; only when speech is heard start the real recognizer (no chime loop, no network idle)
    private fun startVad() {
        if (vad?.active == true || listening) return
        if (!ensureMicFgs()) return
        unmuteSystem(); setState(LibaState.WAKE)
        var me: VadGate? = null
        if (il.liba.app.power.Governor.tier == il.liba.app.power.Tier.COLD) return // duty-governor: no mic in the cold gear
        me = VadGate { main.post { if (vad !== me || !running) return@post; vad = null; if (heyOn && !listening && !speaking) startListening("wake") else wakeLoop() } }
        il.liba.app.power.Governor.tier.let { me.duty(it.onMs, it.offMs) }
        vad = me; me.start()
    }
    private fun stopVad() { vad?.stop(); vad = null }
    private fun startListening(mode: String) {
        if (!running || shabbat) return
        if (listening && listenMode == "wake" && mode == "cmd") { try { sr?.cancel() } catch (e: Exception) { Trace.e(Trace.Code.E_SR_LIFECYCLE, "tapWins:" + e.javaClass.simpleName) }; listening = false; unmuteSystem() } // fix 7: a tap wins over a noise-triggered wake window
        else if (listening) return
        if (speaking && mode != "cmd") return
        if (!ensureMicFgs()) return
        if (!SpeechRecognizer.isRecognitionAvailable(this)) { Trace.e(Trace.Code.E_SR_NONE, mode); showLabel("אין זיהוי דיבור בטלפון (צריך את אפליקציית Google)", 5000); return }
        if (mode != "wake") tts?.stop()
        stopVad()
        // offline (airplane mode, no signal): the network recognizer can only answer "no internet", so a command goes to the on-device one
        val offline = !netValidated()
        val wantOnDevice = (mode == "wake" || offline || forceOnDevice) && !onDeviceFailed && Build.VERSION.SDK_INT >= 31 && runCatching { SpeechRecognizer.isOnDeviceRecognitionAvailable(this) }.getOrDefault(false)
        forceOnDevice = false
        if (sr != null && srOnDevice != wantOnDevice) { try { sr?.destroy() } catch (e: Exception) { Trace.e(Trace.Code.E_SR_LIFECYCLE, "swap:" + e.javaClass.simpleName) }; sr = null }
        if (sr == null) { sr = (if (wantOnDevice) SpeechRecognizer.createOnDeviceSpeechRecognizer(this) else SpeechRecognizer.createSpeechRecognizer(this)).also { it.setRecognitionListener(recListener) }; srOnDevice = wantOnDevice }
        val i = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
            putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
            putExtra(RecognizerIntent.EXTRA_LANGUAGE, "he-IL"); putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true); putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 3)
            putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS, if (mode == "wake") 1200L else 1500L)
            if (mode == "wake") { putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_MINIMUM_LENGTH_MILLIS, 4000L); putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_POSSIBLY_COMPLETE_SILENCE_LENGTH_MILLIS, 2000L); putExtra(RecognizerIntent.EXTRA_PREFER_OFFLINE, true) }
            else if (offline) putExtra(RecognizerIntent.EXTRA_PREFER_OFFLINE, true)
        }
        listening = true; listenMode = mode
        if (mode == "wake") { muteSystem(); setState(LibaState.WAKE); main.postDelayed({ if (listenMode == "wake") unmuteSystem() }, 6000) } else { unmuteSystem(); setState(LibaState.LISTENING); showLabel(if (mode == "follow") "…" else "מקשיב…", 15000) }
        sr?.startListening(i)
    }
    private fun stripWake(t: String): Pair<Boolean, String> {
        val low = t.trim()
        for (w in WAKE.sortedByDescending { it.length }) { val i = low.indexOf(w); if (i >= 0) return true to (low.substring(0, i) + low.substring(i + w.length)).trim().trim(',', '.', '،') }
        return false to low
    }
    private val recListener = object : RecognitionListener {
        override fun onReadyForSpeech(p: Bundle?) { listenReadyAt = System.currentTimeMillis(); voiceAt = 0L }
        override fun onBeginningOfSpeech() { voiceAt = System.currentTimeMillis(); if (listenMode == "wake") main.post { unmuteSystem() } }
        override fun onRmsChanged(v: Float) { dot?.level = ((v + 2f) / 12f).coerceIn(0f, 1f) }
        override fun onBufferReceived(b: ByteArray?) {}
        override fun onEndOfSpeech() { main.post { unmuteSystem() } }
        override fun onEvent(t: Int, p: Bundle?) {}
        override fun onPartialResults(p: Bundle?) {
            val t = p?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)?.firstOrNull() ?: return
            if (listenMode == "wake") { if (WAKE.any { t.contains(it) }) { showLabel("כן?", 3000) } } else if (t.isNotBlank()) showLabel(t, 15000)
        }
        override fun onError(e: Int) { listening = false; if (listenMode == "wake") unmuteSystem()
            Trace.e(Trace.sr(e), listenMode + "|onDevice=" + srOnDevice) // one emit point: no per-branch strings
            pendingSay?.let { t -> pendingSay = null; main.postDelayed({ speak(t) }, 300); return }
            if (listenMode == "wake") { errStreak++; if (e == SpeechRecognizer.ERROR_RECOGNIZER_BUSY || e == SpeechRecognizer.ERROR_CLIENT) { sr?.destroy(); sr = null }
                if (srOnDevice && (e == 12 || e == 13 || e == SpeechRecognizer.ERROR_SERVER)) { onDeviceFailed = true; try { sr?.destroy() } catch (x: Exception) { Trace.e(Trace.Code.E_SR_LIFECYCLE, "onDeviceDestroy:" + x.javaClass.simpleName) }; sr = null; Trace.e(Trace.sr(e), listenMode + "|onDevice=" + srOnDevice + "|fallback") }
                main.postDelayed({ wakeLoop() }, if (speaking) 1500 else if (errStreak > 5) 5000 else 400); return }
            errStreak = 0
            if (listenMode == "follow" && (e == SpeechRecognizer.ERROR_NO_MATCH || e == SpeechRecognizer.ERROR_SPEECH_TIMEOUT)) { idleOrWake(); return }
            // a command that failed for want of a network: once more on the phone's own recognizer, if it has one
            if (!srOnDevice && (e == SpeechRecognizer.ERROR_NETWORK || e == SpeechRecognizer.ERROR_NETWORK_TIMEOUT) && !onDeviceFailed && Build.VERSION.SDK_INT >= 31 && runCatching { SpeechRecognizer.isOnDeviceRecognitionAvailable(this@BubbleService) }.getOrDefault(false)) {
                val m = listenMode; forceOnDevice = true; main.postDelayed({ startListening(m) }, 300); return }
            if (srOnDevice && (e == 12 || e == 13 || e == SpeechRecognizer.ERROR_SERVER)) { onDeviceFailed = true; try { sr?.destroy() } catch (x: Exception) { Trace.e(Trace.Code.E_SR_LIFECYCLE, "onDeviceDestroy:" + x.javaClass.simpleName) }; sr = null }
            // no network and nothing on the phone that understands Hebrew: say it, a label for a second is not an answer
            if (e == SpeechRecognizer.ERROR_NETWORK || e == SpeechRecognizer.ERROR_NETWORK_TIMEOUT || (srOnDevice && (e == 12 || e == 13)) || (!netValidated() && e != SpeechRecognizer.ERROR_NO_MATCH && e != SpeechRecognizer.ERROR_SPEECH_TIMEOUT)) {
                showLabel("אין אינטרנט לזיהוי", 5000); speak(SrOffline.say(e, srOnDevice)); idleOrWake(); return }
            showLabel(when (e) { SpeechRecognizer.ERROR_NO_MATCH, SpeechRecognizer.ERROR_SPEECH_TIMEOUT -> "לא שמעתי כלום"; SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS -> "אין הרשאת מיקרופון"; SpeechRecognizer.ERROR_NETWORK -> "אין אינטרנט לזיהוי"; else -> "שגיאת מיקרופון ($e)" }, 3000)
            idleOrWake() }
        override fun onResults(r: Bundle?) { heardAt = System.currentTimeMillis(); listening = false; errStreak = 0; if (listenMode == "wake") unmuteSystem()
            val flush = pendingSay; pendingSay = null
            if (flush != null) main.postDelayed({ speak(flush) }, 1200)
            val alts = r?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION).orEmpty()
            var t = alts.firstOrNull()?.trim().orEmpty()
            // nbest: after the wake word the first guess is kept as heard; a command among the top three wins over noise
            if (listenMode != "wake" && alts.size > 1) { val p = NBest.pick(alts, LibaIntents::known); if (p.index > 0) t = p.text }
            if (listenMode == "wake") {
                val (hit, rest) = stripWake(t)
                val words = t.split(Regex("\\s+")).filter { it.isNotBlank() }
                val early = words.take(4).any { w -> WAKE.any { w.contains(it) } }
                if (!hit || !early || words.size > 25) { main.postDelayed({ wakeLoop() }, 250); return } // TV / other people: ignore
                if (rest.length < 2) { lastUserAt = SystemClock.elapsedRealtime(); followStreak = 0; pendingListenAfterSpeech = true; speak("כן?"); return }
                t = rest; lastUserAt = SystemClock.elapsedRealtime(); followStreak = 0
            }
            if (t.isEmpty()) { if (listenMode == "follow") idleOrWake() else { showLabel("לא שמעתי כלום", 3000); idleOrWake() }; return }
            if (listenMode == "follow") followStreak++ else { lastUserAt = SystemClock.elapsedRealtime(); followStreak = 0 }
            handleUtterance(t) }
    }

    /** step 63: text shared from another app – sent as-is; a following "תטפל בזה" refers to it. */
    fun sendShared(msg: String) { main.post { lastShared = msg; showLabel("שיתוף → ליבה", 3000); tone("heard"); if (pageReady) { Prefs.log(this, "me", msg); sentAt = SystemClock.elapsedRealtime(); setState(LibaState.SENDING); web?.let { LibaWeb.sendInput(it, msg, "share") } } else Prefs.setPendingShare(this, msg) } }
    private var lastShared = ""
    // ---------- local commands, then send ----------
    /** reflex-core: answered here in milliseconds; the page gets the question and the answer for the turn log when it is up */
    private fun reflexSay(id: String, q: String) {
        val bm = getSystemService(android.os.BatteryManager::class.java)
        val pct = runCatching { bm.getIntProperty(android.os.BatteryManager.BATTERY_PROPERTY_CAPACITY) }.getOrDefault(-1).let { if (it in 0..100) it else -1 }
        val charging = runCatching { bm.isCharging }.getOrDefault(false)
        val caps = runCatching { val cm = getSystemService(ConnectivityManager::class.java); cm.getNetworkCapabilities(cm.activeNetwork) }.getOrNull()
        val validated = caps?.hasCapability(android.net.NetworkCapabilities.NET_CAPABILITY_VALIDATED) == true
        val wifi = caps?.hasTransport(android.net.NetworkCapabilities.TRANSPORT_WIFI) == true
        val cell = caps?.hasTransport(android.net.NetworkCapabilities.TRANSPORT_CELLULAR) == true
        val a = Reflex.answer(id, System.currentTimeMillis(), pct, charging, validated, wifi, cell) ?: return
        speak(a)
        if (pageReady) web?.let { LibaWeb.sendReflex(it, q, a, id) }
    }
    private fun handleUtterance(t: String) {
        val n = t.replace("?", "").trim()
        val id = LibaIntents.match(t) // intent-kernel: the phrases live in liba/intents/registry.json, not here
        when {
            id == "reflex.time" || id == "reflex.date" || id == "reflex.battery" || id == "reflex.net" -> { reflexSay(id, t); return } // reflex-core: the phone knows this itself
            id == "app.repeat" && lastSaid.isNotEmpty() -> { speak(lastSaid); return }
            id == "app.readPrivate" -> { readHeld(); return }
            id == "app.rollback" -> { rollbackSay(); return }
            id == "app.audioMine" -> { val d = AudioRoute.bt(this); val n = d?.productName?.toString() ?: ""; if (n.isBlank()) speak("לא מחוברות עכשיו אוזניות בלוטות'.") else { Prefs.addTrustedAudio(this, n); speak("זכרתי: $n הן האוזניות שלך. דרכן אקריא הכול.") }; return }
            id == "app.status" -> { speak(localStatus()); return }
            id == "app.slower" -> { rate = (rate - 0.15f).coerceIn(0.6f, 2.2f); Prefs.setRate(this, rate); tts?.setSpeechRate(rate); speak("ככה, לאט יותר."); return }
            id == "app.faster" -> { rate = (rate + 0.15f).coerceIn(0.6f, 2.2f); Prefs.setRate(this, rate); tts?.setSpeechRate(rate); speak("ככה, מהר יותר."); return }
            id == "app.night.on" -> { night = true; Prefs.setNight(this, true); vibrate(longArrayOf(0, 200)); showLabel("🌙 מצב לילה: רטט וטקסט, בלי קול. תגיד 'בטל מצב לילה'.", 8000); return }
            id == "app.night.off" -> { night = false; Prefs.setNight(this, false); speak("חזרתי לדבר."); return }
            id == "app.barge.on" -> { bargeIn = true; Prefs.setBarge(this, true); speak("בסדר, אפשר להפריע לי באמצע."); return }
            id == "app.barge.off" -> { bargeIn = false; Prefs.setBarge(this, false); bargeVad?.stop(); bargeVad = null; speak("בסדר, בלי הפרעות באמצע."); return }
            id == "app.car.on" -> { headsetBtn = true; Prefs.setHeadset(this, true); setupMediaSession(); night = false; Prefs.setNight(this, false); carMode = true; label?.textSize = 22f; speak("מצב רכב. קול בלבד, כפתור האוזניה אומר דבר. תגיד בטל מצב רכב כשתגיע."); return }
            id == "app.car.off" -> { carMode = false; label?.textSize = 15f; speak("יצאתי ממצב רכב."); return }
            id == "app.headset.on" -> { headsetBtn = true; Prefs.setHeadset(this, true); setupMediaSession(); speak("כפתור האוזניה עכשיו אומר דבר."); return }
            id == "app.headset.off" -> { headsetBtn = false; Prefs.setHeadset(this, false); setupMediaSession(); speak("כפתור האוזניה חזר למוזיקה."); return }
            id == "app.reports.off" -> { Prefs.setReports(this, false); speak("בסדר, בלי דוחות קריסה."); return }
            id == "app.reports.on" -> { Prefs.setReports(this, true); speak("דוחות קריסה פועלים."); return }
            id == "app.install" -> { installUpdate(); return }
            id == "app.tones.off" -> { tones = false; Prefs.setTones(this, false); speak("בלי צלילים."); return }
            id == "app.tones.on" -> { tones = true; Prefs.setTones(this, true); speak("עם צלילים."); return }
            id == "app.skip" && (chunks.isNotEmpty() || speaking) -> { stopSpeaking(); showLabel("דילגתי.", 2000); onSpoken(); return }
            id == "app.resume" && chunks.isNotEmpty() -> { paused = false; speakNextChunk(false); return }
            id == "app.pause" && (chunks.isNotEmpty() || speaking) -> { val keep = ArrayList(chunks); stopSpeaking(); chunks.addAll(keep); paused = true; showLabel("עצרתי. תגיד תמשיך.", 8000); return }
            id == "app.stop" -> { stopSpeaking(); sentAt = 0; lastSaid = ""; heyOff(); setState(LibaState.IDLE); showLabel("שקט. מילת ההפעלה כבויה.", 3000); return }
            id == "app.words.list" -> { val w = WordQueue.all(this); speak(if (w.isEmpty()) "אין משפטים שמורים." else "שמרתי ${w.size}: " + w.takeLast(3).joinToString("; ") { it.optString("t") }); return }
            id == "app.words.clear" -> { WordQueue.clear(this); speak("מחקתי את מה ששמרתי."); return }
            !pageReady && LibaIntents.offline(t) != null -> { val (oid, rest) = LibaIntents.offline(t)!!  // device-mem: the memory answers without the page
                speak(when (oid) { "brain.where", "brain.open", "brain.who", "tasks.stuck", "proof.where" -> LocalBrain.answer(oid, StateMirror.get(this), System.currentTimeMillis()) ?: ""; "people.who" -> MemoryStore.who(rest); "memory.remember" -> MemoryStore.remember(this, rest); else -> MemoryStore.about(rest) }); return }
            !pageReady -> { val dropped = WordQueue.add(this, t, System.currentTimeMillis()); tone("heard")
                val now = SystemClock.elapsedRealtime(); if (now - wordsSaidAt > 10 * 60_000L) { wordsSaidAt = now; speak("שמרתי, אשלח כשאחזור. אני לא מחוברת כי " + silentWhy() + ".") } else showLabel("נשמר (" + WordQueue.size(this) + ")", 3000)
                if (dropped > 0) Trace.e(Trace.Code.E_PREFS, "words-cap"); return }
        }
        Prefs.log(this, "me", t); sentAt = SystemClock.elapsedRealtime()
        setState(LibaState.SENDING); showLabel("→ $t", 6000)
        tone("heard")
        web?.let { LibaWeb.sendInput(it, t, "voice", stamps()) }
    }
    /** words-offline: the page is back - send what was said while it was down, oldest first, with when it was said.
     *  An item leaves the file only when the page reports it sent (onSent); anything left goes on the next ready. */
    private var wordsSaidAt = 0L; private val wordsInFlight = mutableMapOf<String, String>()
    /** silent-why: the real reason the page is not there, in words - not "the channel is closed" */
    private fun silentWhy(): String {
        val net = runCatching { val cm = getSystemService(ConnectivityManager::class.java); cm.getNetworkCapabilities(cm.activeNetwork)?.hasCapability(android.net.NetworkCapabilities.NET_CAPABILITY_VALIDATED) == true }.getOrDefault(true)
        return when { !net -> "אין רשת"; loginWall -> "הדף התנתק מ-claude"; web == null -> "הדף לא עלה"; SystemClock.elapsedRealtime() - pageLoadedAt < 90_000 -> "הדף עוד נטען"; else -> "הדף לא עונה" }
    }
    private fun drainWords() {
        val w = WordQueue.all(this); if (w.isEmpty() || !pageReady) return
        // silent-why: a sentence kept for more than an hour is announced before it goes, so it never arrives looking new
        val oldest = w.minOf { it.optLong("at") }
        if (System.currentTimeMillis() - oldest > 3_600_000L) speak("יש " + w.size + " משפטים ששמרתי כשהייתי מנותקת, הישן מלפני " + ((System.currentTimeMillis() - oldest) / 3_600_000L) + " שעות. שולחת אותם עם השעה שבה אמרת.")
        val fmt = java.text.SimpleDateFormat("HH:mm", Locale("he"))
        w.forEachIndexed { i, o -> main.postDelayed({
            if (!pageReady) return@postDelayed
            val text = "(נאמר ב-" + fmt.format(java.util.Date(o.optLong("at"))) + " כשהערוץ היה סגור) " + o.optString("t")
            wordsInFlight[o.optString("id")] = o.optString("t"); web?.let { LibaWeb.sendInput(it, text, "offline") }
        }, 2500L + i * 2200L) }
    }
    private fun localStatus(): String {
        val today = LocalBrain.todayLine(StateMirror.get(this)).let { if (it.isEmpty()) "" else " $it" } // work-book: also with the page dead
        if (!pageReady) return "לא מחובר לדף. $status$today"
        val t = (if (taskSummary.isNotBlank()) taskSummary else "אין משימות פתוחות") + today
        if (sentAt > 0) { val s = (SystemClock.elapsedRealtime() - sentAt) / 1000; return "$t. ושלחתי לפני $s שניות ומחכה לתשובה." }
        return t
    }

    // ---------- bridge (from the page) ----------
    override fun onPage(url: String) { main.post {
        pageLoadedAt = SystemClock.elapsedRealtime()
        status = when {
            url.startsWith("error:") -> { Trace.e(Trace.Code.E_PAGE_LOAD, "error"); "הדף לא נטען: " + url.removePrefix("error:") }
            url.contains("/login") || url.contains("auth") -> { loginWall = true; needsLogin = true; Trace.e(Trace.Code.E_PAGE_LOGIN, if (url.contains("/login")) "login" else "auth"); val now = SystemClock.elapsedRealtime(); if (now - loginWarnedAt > 3600000) { loginWarnedAt = now; speak("צריך להתחבר ל‑claude.ai. לחיצה ארוכה עליי, כבה בועה, התחבר, והפעל שוב.") }; "צריך להתחבר ל‑claude.ai" }
            url.contains("/artifact/") -> { loginWall = false; needsLogin = false; "הדף נטען, מחכה שהוא יתחבר…" }
            else -> "נטען: " + url.take(60)
        }
        if (!pageReady) showLabel(status, 5000)
        web?.let { LibaWeb.hello(it) }
    } }
    override fun onReady() { main.post { Prefs.pendingShare(this)?.let { p -> Prefs.setPendingShare(this, null); main.postDelayed({ sendShared(p) }, 1500) }; if (!pageReady) { pageReady = true; pageOk = true; loginRestored(); drainWords(); pageDeadSince = 0L; pageAliveAt = System.currentTimeMillis(); Pulse.resend(); main.postDelayed({ web?.let { pulse(it) } }, 3000); status = "מחובר. לחץ על הבועה ודבר."; idleOrWake(); showLabel("ליבה מחוברת.", 3000)
        if (Prefs.reports(this)) Prefs.crash(this)?.let { c -> web?.let { LibaWeb.sendCrash(it, "c-" + System.currentTimeMillis(), packageManager.getPackageInfo(packageName, 0).versionName ?: "?", c) } }
        main.postDelayed({ drainTrace() }, 2000); main.postDelayed({ drainMem() }, 3000); main.postDelayed({ il.liba.app.sense.SenseBus.flush(this); il.liba.app.sense.CalSense.last?.let { j -> web?.let { LibaWeb.sendCal(it, j) } }; il.liba.app.sense.SenseFusion.publish(this, force = true) }, 3500) } } }
    fun heyOff() { heyOn = false; Prefs.setHey(this, false); stopVad(); if (listening && listenMode == "wake") { try { sr?.cancel() } catch (e: Exception) { Trace.e(Trace.Code.E_SR_LIFECYCLE, "heyOff:" + e.javaClass.simpleName) }; listening = false }; unmuteSystem() }
    /** step signed-commands: the phone checks again - a page that was broken into still cannot make it act */
    private val nonceFile by lazy { java.io.File(filesDir, "nonces.txt") }
    override fun onCmd(cmd: String, nonce: String, exp: Long, sig: String) { main.post {
        val seen = runCatching { nonceFile.readLines().toMutableList() }.getOrDefault(mutableListOf())
        val why = Signed.check(cmd, nonce, exp, sig, seen, System.currentTimeMillis())
        if (why != null) {
            if (cmd.startsWith("open ")) { val u = cmd.removePrefix("open ").trim(); notifyIntent("ליבה רוצה לפתוח קישור", u, Intent(Intent.ACTION_VIEW, android.net.Uri.parse(u)).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)); return@post }
            Trace.e(Trace.Code.E_CMD_REFUSED, why + ":" + cmd.substringBefore(' ').take(20)); showLabel("פקודה נדחתה: $why", 5000); return@post
        }
        if (sig.isNotEmpty()) runCatching { nonceFile.writeText(seen.joinToString("\n")) }.onFailure { il.liba.app.Trace.e(il.liba.app.Trace.Code.E_PREFS, "bubbleservice916:" + it.javaClass.simpleName) } // vault-ok: random nonces, no words
        when (cmd) { "sense_open" -> openSenseAccess(); "update_check" -> checkUpdate(); "cal_on" -> askCalendar(); "cal_off" -> il.liba.app.sense.CalSense.stop(this); "hey_off" -> { heyOff(); speak("מילת ההפעלה כובתה מרחוק."); showLabel("מילת ההפעלה כובתה מרחוק", 4000) }; "hey_on" -> { heyOn = true; Prefs.setHey(this, true); wakeLoop() }; "style 0", "style 1", "style 2" -> { val st = cmd.removePrefix("style ").trim().toIntOrNull() ?: 2; Prefs.setStyle(this, st); dot?.style = st; showLabel("עיצוב " + (when (st) { 2 -> "יצור חי"; 1 -> "משולב"; else -> "אורורה" }), 3000) }; "update" -> { showLabel("בודקת גרסה חדשה…", 4000); checkUpdate { if (Prefs.updateUrl(this) != null) installUpdate() else showLabel("אין גרסה חדשה", 3000) } }; "reload" -> { pageReady = false; pageOk = false; main.postDelayed({ web?.reload() }, 1500) }
        else -> if (cmd.startsWith("open ")) { val u = cmd.removePrefix("open ").trim(); val i = Intent(Intent.ACTION_VIEW, android.net.Uri.parse(u)).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            if (!EgressCore.urlClean(u)) { Trace.e(Trace.Code.E_CMD_REFUSED, "url-content"); showLabel("לא פותחת קישור שנושא תוכן", 5000); return@post } // kotlin-egress
            if (!Signed.openHostOk(u)) { notifyIntent("ליבה רוצה לפתוח קישור", u, i); return@post } // signed or not: outside the short list, only by Meir's own tap
            try { startActivity(i) } catch (e: Exception) { Trace.e(Trace.Code.E_INTENT_OPEN, "open:" + e.javaClass.simpleName); notifyIntent("ליבה – קישור", u, i) } } } } }
    /** fix 10: when Android refuses an activity start from the background, hand the intent to the user as a tappable notification. */
    private fun notifyIntent(title: String, text: String, i: Intent) {
        try { val pi = PendingIntent.getActivity(this, (System.currentTimeMillis() % 10000).toInt(), i, PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT)
            getSystemService(NotificationManager::class.java).notify(3, NotificationCompat.Builder(this, CH).setSmallIcon(R.drawable.ic_notif).setContentTitle(title).setContentText(text).setContentIntent(pi).setAutoCancel(true).setPriority(NotificationCompat.PRIORITY_HIGH).build())
            showLabel("פתח מההתראה למעלה", 6000) } catch (e: Exception) { Trace.e(Trace.Code.E_INTENT_OPEN, "notify:" + e.javaClass.simpleName); showLabel("לא הצלחתי לפתוח: $text", 6000) }
    }
    /** step blackbox: hand the page one batch of fault lines. When the page is not connected
     *  nothing is read and nothing is marked - the lines wait in trace.jsonl for the next drain. */
    private fun drainTrace() {
        Trace.drain(pageReady && web != null) { batch, json -> main.post { web?.let { LibaWeb.sendTrace(it, batch, json) } } }
    }
    override fun onTraceAck(batch: String, ids: List<String>) { Trace.acked(ids) }
    override fun onPageState(state: String) { pageState = state }
    // step device-mem: the page's memory, kept on the phone; what was remembered offline goes back when the page is up
    override fun onMemSync(body: String) { MemoryStore.onSync(this, body) }
    override fun onMemAck(ids: List<String>) { MemoryStore.onAck(this, ids) }
    /** step proactive: an alarm rang - say what is due, unless night mode or the car say not now (they are held to later) */
    private fun sayReminders() { val due = Reminders.due(this, night || carMode); if (due.isNotEmpty()) speak(due.joinToString(" ") { it.text }) }
    override fun onRemind(items: String) { Reminders.onRemind(this, items) }
    override fun onPowerCfg(body: String) { runCatching { il.liba.app.power.Governor.budgetPct = org.json.JSONObject(body).optDouble("dailyPct", 0.0) }.onFailure { il.liba.app.Trace.e(il.liba.app.Trace.Code.E_PREFS, "bubbleservice941:" + it.javaClass.simpleName) } }
    override fun onPlace(body: String) { runCatching { val o = org.json.JSONObject(body); Prefs.setPlace(this, Place(o.getDouble("lat"), o.getDouble("lon"), o.optInt("b", 20))) }.onFailure { il.liba.app.Trace.e(il.liba.app.Trace.Code.E_PREFS, "bubbleservice942:" + it.javaClass.simpleName) }; holyCheck() }
    // step shabbat-engine: from candle lighting until nightfall - no voice, no microphone, no page, no network
    @Volatile var shabbat = false
    private var emergencyUntil = 0L
    private val moadim: Map<String, String> by lazy { runCatching { val o = org.json.JSONObject(resources.openRawResource(R.raw.moadim).bufferedReader().readText()).getJSONObject("days")
        o.keys().asSequence().associateWith { o.getString(it) } }.getOrDefault(emptyMap()) }
    private fun holyCheck() {
        val now = System.currentTimeMillis(); val w = Holy.now(now, Prefs.place(this), moadim)
        val holy = w != null && emergencyUntil < now
        if (holy && !shabbat) enterShabbat() else if (!holy && shabbat) exitShabbat()
    }
    private fun enterShabbat() {
        stopSpeaking(); if (listening) { try { sr?.cancel() } catch (e: Exception) { Trace.e(Trace.Code.E_SR_LIFECYCLE, "shabbat:" + e.javaClass.simpleName) }; listening = false }
        stopVad(); shabbat = true; setState(LibaState.IDLE)
        pageReady = false; pageOk = false; web?.loadUrl("about:blank")
        showLabel("שבת שלום", 5000)
    }
    private fun exitShabbat() {
        shabbat = false; lastReloadAt = 0L; pageReady = false; pageLoadedAt = SystemClock.elapsedRealtime()
        web?.loadUrl(getString(R.string.artifact_url)); applyPrefs(); wakeLoop()
    }
    /** pikuach nefesh: three seconds on the bubble - half an hour open, said aloud, told to the page */
    private fun emergencyMode() {
        emergencyUntil = System.currentTimeMillis() + 30 * 60_000L; il.liba.app.sense.SenseFusion.emergencyUntil = emergencyUntil
        exitShabbat(); main.postDelayed({ speak("מצב חירום. אני פתוחה לחצי שעה.", true) }, 800)
    }
    override fun onSenseAck(ids: List<String>) { il.liba.app.sense.SenseBus.ack(this, ids) }
    override fun onMirror(body: String) { StateMirror.onMirror(this, body) }
    override fun onSenseCfg(apps: List<String>) { il.liba.app.sense.SenseBus.setApps(this, apps) }
    /** step calendar-sense: the runtime permission needs an activity - MainActivity asks, and starts CalSense when allowed */
    private fun askCalendar() {
        if (il.liba.app.sense.CalSense.granted(this)) { il.liba.app.sense.CalSense.start(this); return }
        val i = Intent(this, MainActivity::class.java).putExtra("askCal", true).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        try { startActivity(i) } catch (e: Exception) { notifyIntent("ליבה מבקשת לקרוא את היומן", "לחץ כדי לאשר", i) }
    }
    /** Android asks Meir itself before any app reads notifications: open that screen only if the access is not there yet */
    private fun openSenseAccess() {
        if (androidx.core.app.NotificationManagerCompat.getEnabledListenerPackages(this).contains(packageName)) return
        val i = Intent(android.provider.Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        try { startActivity(i) } catch (e: Exception) { notifyIntent("ליבה צריכה גישה להתראות", "לחץ כדי לאשר", i) }
    }
    private fun drainMem() { if (MemoryStore.pendingCount() == 0) return; web?.let { LibaWeb.sendMemAsk(it, MemoryStore.pendingJson().toString()) } }
    // step protocol-contract: these two used to be posted by the page and dropped here in silence
    override fun onQueued(text: String) { main.post { showLabel("ממתין שאסיים לדבר…", 4000) } }
    override fun onOutbox(text: String, n: Int, reason: String) { main.post { showLabel(if (n > 1) "אין רשת · $n משפטים שמורים" else "אין רשת · שמרתי, אשלח כשתחזור", 6000) } }
    override fun onCrashSaved(id: String) { main.post { Prefs.clearCrash(this); showLabel("דוח הקריסה נשלח לליבה", 4000) } }
    override fun onTasks(summary: String, n: Int, blocked: Int) { tasksSummary = summary; main.post { taskSummary = summary; taskBlocked = blocked; if (n > 0) status = "מחובר · $n משימות" + (if (blocked > 0) " · $blocked מחכות לך" else "") } }
    override fun onPageTap() { main.post { web?.let { LibaWeb.simulateTap(it) } } }
    override fun onSent(text: String) { main.post { wordsInFlight.entries.firstOrNull { text.contains(it.value) }?.let { e -> WordQueue.remove(this, e.key); wordsInFlight.remove(e.key) }; tone("sent"); status = "נשלח, מחכה לתשובה…"; setState(LibaState.IDLE); showLabel("נשלח. מחכה…", 30000); armWaitReminders(); if (heyOn) wakeLoop() } }
    override fun onError(text: String, reason: String) { main.post { sentAt = 0
        val why = when {
            reason.contains("consent") -> "הדף צריך אישור חד פעמי. לחיצה ארוכה עליי, כבה בועה, שלח הודעה אחת מהדף ואשר."
            reason.contains("no_session") -> "אין סשן של קלוד שמאזין עכשיו."
            reason.contains("writers_only") || reason.contains("forbidden") || reason.contains("not_granted") -> "אין הרשאה לשלוח מהחשבון הזה."
            reason.contains("rate") -> "יותר מדי מהר. חכה רגע."
            reason.isBlank() -> "" else -> "סיבה: $reason" }
        showLabel("לא נשלח" + (if (reason.isNotBlank()) " · $reason" else ""), 8000); speak("לא הצלחתי לשלוח. $why") } }
    // kotlin-egress: what was held because of where the sound would go - said on "תקריאי", each closed with the page then
    private data class Held(val text: String, val id: String, val mid: String)
    private val held = ArrayList<Held>(); private var heldSaying: List<Held> = emptyList()
    private fun readHeld() { if (held.isEmpty()) { speak("אין הודעה אישית שמחכה."); return }
        heldSaying = held.toList(); held.clear(); speak(heldSaying.joinToString(". ") { it.text }, true) }
    override fun onSay(text: String, kind: String, options: List<String>, speaker: String, id: String, mid: String, sens: Int, force: Int) { main.post {
        releaseSay("stop") // a new utterance arrived before the old one reported: release the page
        val route = AudioRoute.current(this); val v = EgressCore.decide(route, sens, force == 1)
        if (!v.speak) { val first = held.none { it.mid.isNotBlank() && it.mid == mid }; if (first) held.add(Held(text, id, mid)); while (held.size > 20) held.removeAt(0)
            Trace.e(Trace.Code.E_CMD_REFUSED, "held:" + route.name + ":" + sens)
            if (id.isNotBlank()) web?.let { w -> val t = System.currentTimeMillis(); LibaWeb.sendSpoke(w, id, t, t, "held") }
            if (first) speak(v.hold ?: "יש הודעה אישית."); return@post }
        // a message this phone already said to the end (the page gave up waiting and tried again): report it, never say it twice
        if (mid.isNotBlank() && id.isNotBlank() && Prefs.spokenMids(this).contains(mid)) { web?.let { w -> val t = System.currentTimeMillis(); LibaWeb.sendSpoke(w, id, t, t, "done") }; return@post }
        sayId = id.ifBlank { null }; sayMid = mid
        main.removeCallbacks(speakingBeat); if (sayId != null) main.postDelayed(speakingBeat, 2000)
        sentAt = 0; status = "מחובר."; waitTimer?.let { main.removeCallbacks(it) }
        curSpeaker = if (speaker.isBlank()) "ליבה" else speaker
        // step 14: a different voice per speaker – ליבה neutral, המנהל lower, האדריכל higher, others slightly low
        val pitch = when { speaker.isBlank() || speaker.contains("ליבה") -> 1.0f; speaker.contains("מנהל") -> 0.8f; speaker.contains("אדריכל") -> 1.2f; else -> 0.9f }
        try { tts?.setPitch(pitch) } catch (e: Exception) { Trace.e(Trace.Code.E_TTS_OP, "setPitch:" + e.javaClass.simpleName) }
        Prefs.log(this, "liba", text)
        val ask = options.isNotEmpty() || kind == "stuck" || kind == "call" || kind == "ask"
        val spoken = text + if (options.isNotEmpty()) ". " + options.joinToString(", או ") + "?" else ""
        showLabel(text, 20000)
        if (kind == "call" || kind == "stuck") { setState(LibaState.RINGING); ring(); main.postDelayed({ pendingListenAfterSpeech = ask; speak(spoken, urgent = true) }, 2200) }
        else { tone("reply"); pendingListenAfterSpeech = ask; main.postDelayed({ speak(spoken) }, 250) }
    } }
    private fun ring() {
        unmuteSystem()
        try { val tg = ToneGenerator(AudioManager.STREAM_NOTIFICATION, 90); tg.startTone(ToneGenerator.TONE_SUP_RINGTONE, 1800); main.postDelayed({ tg.release() }, 2000) } catch (e: Exception) { Trace.e(Trace.Code.E_TONE, "ring:" + e.javaClass.simpleName) }
        val v = getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
        v.vibrate(VibrationEffect.createWaveform(longArrayOf(0, 300, 150, 300, 150, 300), -1))
    }

    override fun onDestroy() { speakLock(false); Prefs.setGasp(this, (if (Prefs.on(this)) "app-killed" else "turned-off") + "|" + System.currentTimeMillis())
        running = false; instance = null; main.removeCallbacksAndMessages(null); stopVad(); bargeVad?.stop(); screenCb?.let { r -> runCatching { unregisterReceiver(r) }.onFailure { Trace.e(Trace.Code.E_SYS_CB, "unScreen:" + it.javaClass.simpleName) } }; screenCb = null; netCb?.let { n -> runCatching { getSystemService(ConnectivityManager::class.java).unregisterNetworkCallback(n) }.onFailure { Trace.e(Trace.Code.E_SYS_CB, "unNet:" + it.javaClass.simpleName) } }; mediaSession?.let { it.isActive = false; it.release() }; unmuteSystem()
        try { sr?.destroy() } catch (e: Exception) { Trace.e(Trace.Code.E_SR_LIFECYCLE, "destroy:" + e.javaClass.simpleName) }
        tts?.stop(); tts?.shutdown()
        bubble?.let { v -> runCatching { wm.removeView(v) }.onFailure { Trace.e(Trace.Code.E_OVERLAY_UPDATE, "destroy:bubble:" + it.javaClass.simpleName) } }
        handle?.let { v -> runCatching { wm.removeView(v) }.onFailure { Trace.e(Trace.Code.E_OVERLAY_UPDATE, "destroy:handle:" + it.javaClass.simpleName) } }
        webHost?.let { v -> runCatching { wm.removeView(v) }.onFailure { Trace.e(Trace.Code.E_OVERLAY_UPDATE, "destroy:web:" + it.javaClass.simpleName) } }
        web?.destroy()
        Trace.flush() // a window cut short by death still writes its drop lines
        super.onDestroy()
    }
}
