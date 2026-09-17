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
    private var ttsReady = false
    private var sr: SpeechRecognizer? = null
    private var srOnDevice = false          // step 21: which recognizer `sr` currently is
    private var onDeviceFailed = false      // on-device model has no Hebrew → fall back
    private var vad: VadGate? = null        // step 21: voice gate before the recognizer
    private var rate = 1.25f                 // step 23: speech rate, remembered
    private var night = false                // step 26: whisper mode – vibrate + text, no voice
    private var tones = true                 // step 28: short confirmation tones
    private val chunks = ArrayDeque<String>() // step 29: long texts read in parts
    private var paused = false
    private var speakGuard: Runnable? = null      // fix 1: one cancellable safety timer
    private var pendingSay: String? = null        // fix 8: reply that arrived while the user was talking
    private var netCb: ConnectivityManager.NetworkCallback? = null
    private var bargeIn = false              // step 24: interrupt me mid-sentence (echo-cancelled mic)
    private var bargeVad: VadGate? = null
    private var headsetBtn = false           // step 25: headset button = "דבר"
    private var mediaSession: android.media.session.MediaSession? = null
    private var carMode = false                // step 35
    private var curSpeaker = "ליבה"          // step 37: bubble colour per speaker
    private var menu: android.widget.LinearLayout? = null // step 31: long-press menu
    private var listening = false
    private var listenMode = "cmd" // cmd | wake | follow
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
        wm = getSystemService(Context.WINDOW_SERVICE) as WindowManager
        val am0 = getSystemService(AUDIO_SERVICE) as AudioManager; intArrayOf(AudioManager.STREAM_SYSTEM, AudioManager.STREAM_MUSIC).forEach { try { am0.adjustStreamVolume(it, AudioManager.ADJUST_UNMUTE, 0) } catch (e: Exception) {} }
        if (!startForegroundNotif()) { stopSelf(); return }
        runCatching { applyPrefs() }
        runCatching { setupTts() }
        runCatching { setupWeb() }.onFailure { status = "WebView נכשל: $it" }
        runCatching { setupBubble() }.onFailure { status = "בועה נכשלה: $it" }
        runCatching { watchNetwork() }
        main.postDelayed(watchdog, 30000)
        runCatching { checkUpdate() }
    }
    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        when (intent?.action) { // step 32: actions from the permanent notification
            "il.liba.TALK" -> main.post { stopSpeaking(); startListening("cmd") }
            "il.liba.QUIET" -> main.post { stopSpeaking(); heyOff(); setState(State.IDLE); showLabel("שקט.", 2000) }
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
        } catch (e: Exception) { showLabel("אנדרואיד לא נותן מיקרופון ברקע – פתח את ליבה ולחץ הפעל בועה", 6000); false }
    }

    // ---------- TTS ----------
    private fun setupTts() {
        tts = TextToSpeech(this) { st ->
            if (st == TextToSpeech.SUCCESS) {
                val r = tts?.setLanguage(Locale("he", "IL"))
                ttsReady = r != TextToSpeech.LANG_MISSING_DATA && r != TextToSpeech.LANG_NOT_SUPPORTED
                tts?.setSpeechRate(rate)
                tts?.setAudioAttributes(android.media.AudioAttributes.Builder().setUsage(android.media.AudioAttributes.USAGE_ASSISTANT).setContentType(android.media.AudioAttributes.CONTENT_TYPE_SPEECH).build())
                tts?.setOnUtteranceProgressListener(object : UtteranceProgressListener() {
                    override fun onStart(id: String?) {}
                    override fun onError(id: String?) { if (id?.startsWith("seg-") == true) return; main.post { speakGuard?.let { main.removeCallbacks(it) }; bargeVad?.stop(); bargeVad = null; onSpoken() } }
                    override fun onDone(id: String?) { if (id?.startsWith("seg-") == true) return; main.post { speakGuard?.let { main.removeCallbacks(it) }; bargeVad?.stop(); bargeVad = null; if (chunks.isNotEmpty() && !paused) { main.postDelayed({ speakNextChunk(false) }, 350) } else onSpoken() } }
                })
                if (!ttsReady) main.post { showLabel("אין קול עברי בטלפון – התקן Google Text-to-Speech עברית", 6000) }
            }
        }
    }
    /** fix 4: every path that silences the assistant resets the whole speech state. */
    private fun stopSpeaking() {
        try { tts?.stop() } catch (e: Exception) {}
        chunks.clear(); paused = false; speaking = false; pendingListenAfterSpeech = false
        bargeVad?.stop(); bargeVad = null
        speakGuard?.let { main.removeCallbacks(it) }; speakGuard = null
    }
    private fun speak(text: String, urgent: Boolean = false) {
        if (listening && listenMode != "wake") { pendingSay = text; return } // fix 8: don't cut the user off; flush after the recognizer ends
        lastSaid = text
        stopVad()
        if (listening) { try { sr?.cancel() } catch (e: Exception) {}; listening = false; unmuteSystem() }
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
        unmuteSystem(); setState(State.SPEAKING); speaking = true
        speakSegments(part)
        if (bargeIn) { bargeVad?.stop(); var me: VadGate? = null; me = VadGate(sens = 6.0, minRms = 1800.0, comm = true, warm = true) { main.post { if (bargeVad !== me) return@post; bargeVad = null; if (speaking) { try { tts?.stop() } catch (e: Exception) {}; speaking = false; speakGuard?.let { main.removeCallbacks(it) }; showLabel("כן?", 3000); startListening("cmd") } } }; bargeVad = me; me.start() }
        speakGuard?.let { main.removeCallbacks(it) }
        speakGuard = Runnable { if (speaking) { speaking = false; onSpoken() } }.also { main.postDelayed(it, 4000L + part.length * 120L) } // safety net if TTS never reports
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
            try { t.language = if (latin) Locale.US else Locale("he", "IL") } catch (e: Exception) {}
            t.speak(s, if (i == 0) TextToSpeech.QUEUE_FLUSH else TextToSpeech.QUEUE_ADD, null, (if (i == clean.size - 1) "liba-" else "seg-") + System.currentTimeMillis() + "-" + i)
        }
        try { t.language = Locale("he", "IL") } catch (e: Exception) {}
    }
    private fun vibrate(pattern: LongArray) { try { val v = getSystemService(Context.VIBRATOR_SERVICE) as Vibrator; if (Build.VERSION.SDK_INT >= 26) v.vibrate(VibrationEffect.createWaveform(pattern, -1)) else @Suppress("DEPRECATION") v.vibrate(pattern, -1) } catch (e: Exception) {} }
    // step 28: short tones – heard / sent / reply arrived
    private fun tone(kind: String) { if (!tones || isNight()) return
        val (t, ms) = when (kind) { "heard" -> ToneGenerator.TONE_PROP_BEEP to 90; "sent" -> ToneGenerator.TONE_PROP_ACK to 120; else -> ToneGenerator.TONE_PROP_PROMPT to 160 }
        try { ToneGenerator(AudioManager.STREAM_NOTIFICATION, 55).let { it.startTone(t, ms); main.postDelayed({ it.release() }, ms + 200L) } } catch (e: Exception) {} }
    private fun onSpoken() {
        speaking = false
        main.postDelayed({ afterSpeech() }, 600)
    }
    private fun afterSpeech() {
        when {
            pendingListenAfterSpeech -> { pendingListenAfterSpeech = false; startListening("cmd") }
            convOn && listenMode != "wake" && (sentAt > 0 || lastSaid.isNotEmpty()) -> startListening("follow")
            else -> idleOrWake()
        }
    }
    private fun idleOrWake() { setState(if (pageReady) State.IDLE else State.OFFLINE); if (heyOn) wakeLoop() }
    /** Step 7: never leave the user in silence after a send. */
    private fun armWaitReminders() {
        waitTimer?.let { main.removeCallbacks(it) }
        waitTimer = Runnable { if (sentAt > 0) { speak("עוד רגע, ליבה עובדת על זה."); main.postDelayed({ if (sentAt > 0) showLabel("עדיין מחכה לתשובה של ליבה…", 20000) }, 80000) } }.also { main.postDelayed(it, 40000) }
    }

    // ---------- hidden WebView ----------
    private fun setupWeb() {
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
        runCatching { wm.updateViewLayout(host, lp) }
        bubble?.bringToFront(); bubble?.let { runCatching { wm.removeView(it); wm.addView(it, it.layoutParams) } }
    }
    private fun rebuildWeb() {
        webHost?.let { runCatching { wm.removeView(it) } }; web?.destroy(); web = null; pageReady = false; pageOk = false
        setupWeb(); showLabel("הדף קרס – טוען מחדש", 4000)
    }
    private fun reloadPage(why: String) {
        val now = SystemClock.elapsedRealtime(); if (now - lastReloadAt < 90000) return
        lastReloadAt = now; pageReady = false; pageOk = false; pageLoadedAt = now; status = "טוען מחדש ($why)"
        web?.reload()
    }
    private val watchdog = object : Runnable { override fun run() {
        if (!pageReady && SystemClock.elapsedRealtime() - pageLoadedAt > 90000) reloadPage("אין תגובה מהדף")
        if (pageReady) web?.let { LibaWeb.hello(it) }
        main.postDelayed(this, 30000)
    } }
    private fun watchNetwork() {
        try {
            val cm = getSystemService(ConnectivityManager::class.java)
            val cb = object : ConnectivityManager.NetworkCallback() {
                override fun onAvailable(n: Network) { main.post { if (running && !pageReady) reloadPage("רשת חזרה") } }
            }
            cm.registerDefaultNetworkCallback(cb); netCb = cb
        } catch (e: Exception) { Log.w(LibaWeb.TAG, "network watch: $e") }
    }

    // ---------- update check ----------
    /** step 92: download the new APK and hand it to the package installer – no browser, no file manager. */
    fun installUpdate() {
        val url = Prefs.updateUrl(this) ?: run { speak("אין עדכון ממתין."); return }
        showLabel("מורידה עדכון…", 20000)
        Thread {
            try {
                val dir = java.io.File(cacheDir, "apk").apply { mkdirs() }; val f = java.io.File(dir, "liba.apk")
                val c = URL(url).openConnection() as HttpURLConnection; c.connectTimeout = 15000; c.readTimeout = 60000
                c.inputStream.use { i -> f.outputStream().use { o -> i.copyTo(o) } }
                val uri = androidx.core.content.FileProvider.getUriForFile(this, "il.liba.app.files", f)
                val i = Intent(Intent.ACTION_VIEW).setDataAndType(uri, "application/vnd.android.package-archive").addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_GRANT_READ_URI_PERMISSION)
                main.post { showLabel("מתקינה… אשר בחלון", 8000); try { startActivity(i) } catch (e: Exception) { notifyIntent("התקנת ליבה", "לחץ כדי להתקין את הגרסה החדשה", i) } }
            } catch (e: Exception) { main.post { showLabel("הורדה נכשלה: $e", 8000); speak("ההורדה נכשלה. נסה מהמסך הראשי.") } }
        }.start()
    }
    private fun checkUpdate() {
        Thread {
            try {
                val c = URL(getString(R.string.update_json)).openConnection() as HttpURLConnection; c.connectTimeout = 8000; c.readTimeout = 8000
                val j = JSONObject(c.inputStream.bufferedReader().readText())
                val mine = packageManager.getPackageInfo(packageName, 0).let { if (Build.VERSION.SDK_INT >= 28) it.longVersionCode.toInt() else @Suppress("DEPRECATION") it.versionCode }
                if (j.getInt("versionCode") > mine) { Prefs.setUpdate(this, j.getString("url"), j.getInt("versionCode")); main.post { showLabel("יש גרסה חדשה (${j.optString("versionName")}) – לחיצה ארוכה עליי להתקנה", 8000) } }
                else Prefs.setUpdate(this, null, mine)
            } catch (e: Exception) { Log.d(LibaWeb.TAG, "update: $e") }
        }.start()
        main.postDelayed({ checkUpdate() }, 6 * 3600 * 1000L)
    }

    // ---------- bubble ----------
    private enum class State { IDLE, LISTENING, WAKE, SPEAKING, RINGING, SENDING, OFFLINE }
    private fun setState(s: State) {
        val d = dot ?: return
        val speakerColor = when { curSpeaker.contains("מנהל") -> OrbView.VIOLET; curSpeaker.contains("אדריכל") || curSpeaker.contains("עובד") || curSpeaker.contains("סוכן") -> OrbView.MINT; else -> OrbView.CYAN }
        when (s) {
            State.IDLE -> d.set(OrbView.Mode.IDLE, OrbView.CYAN)
            State.WAKE -> d.set(OrbView.Mode.WAKE, OrbView.CYAN)
            State.OFFLINE -> d.set(OrbView.Mode.OFFLINE, OrbView.GRAY)
            State.LISTENING -> d.set(OrbView.Mode.LISTENING, OrbView.ROSE)
            State.SPEAKING -> d.set(OrbView.Mode.SPEAKING, speakerColor)
            State.RINGING -> d.set(OrbView.Mode.RINGING, OrbView.AMBER)
            State.SENDING -> d.set(OrbView.Mode.SENDING, OrbView.CYAN)
        }
    }
    private fun setupBubble() {
        val root = FrameLayout(this); val sw = resources.configuration.smallestScreenWidthDp; val size = dp(if (sw >= 600) 78f else 62f).toInt() // step 40: bigger on tablets / unfolded
        val d = OrbView(this).apply {
            elevation = dp(6f); contentDescription = "ליבה. לחיצה: דבר. לחיצה ארוכה: תפריט"; importantForAccessibility = View.IMPORTANT_FOR_ACCESSIBILITY_YES
        }
        val l = TextView(this).apply {
            setTextColor(Color.parseColor("#F3F5FF")); textSize = 14f; setPadding(dp(14f).toInt(), dp(8f).toInt(), dp(14f).toInt(), dp(8f).toInt()); maxWidth = dp(240f).toInt()
            typeface = android.graphics.Typeface.create("sans-serif-medium", android.graphics.Typeface.NORMAL); setLineSpacing(0f, 1.15f)
            background = GradientDrawable().apply { cornerRadius = dp(18f); setColor(Color.parseColor("#F2121628")); setStroke(dp(1f).toInt(), Color.parseColor("#2EFFFFFF")) }
            elevation = dp(4f); visibility = View.GONE; textDirection = View.TEXT_DIRECTION_RTL
        }
        root.addView(d, FrameLayout.LayoutParams(size, size).apply { gravity = Gravity.TOP or Gravity.END })
        root.addView(l, FrameLayout.LayoutParams(FrameLayout.LayoutParams.WRAP_CONTENT, FrameLayout.LayoutParams.WRAP_CONTENT).apply { gravity = Gravity.TOP or Gravity.END; topMargin = size + dp(6f).toInt() })
        val lp = WindowManager.LayoutParams(WindowManager.LayoutParams.WRAP_CONTENT, WindowManager.LayoutParams.WRAP_CONTENT, WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS, PixelFormat.TRANSLUCENT)
        lp.gravity = Gravity.TOP or Gravity.END; lp.x = dp(12f).toInt(); lp.y = dp(160f).toInt()
        wm.addView(root, lp)
        bubble = root; dot = d; label = l
        setState(State.OFFLINE)
        var sx = 0f; var sy = 0f; var ox = 0; var oy = 0; var moved = false; var downAt = 0L
        val longPress = Runnable { if (!moved) { moved = true; toggleMenu(root, size) } }
        d.setOnTouchListener { _, ev ->
            when (ev.actionMasked) {
                MotionEvent.ACTION_DOWN -> { sx = ev.rawX; sy = ev.rawY; ox = lp.x; oy = lp.y; moved = false; downAt = SystemClock.uptimeMillis(); d.press(true); main.postDelayed(longPress, 600); true }
                MotionEvent.ACTION_MOVE -> { val dx = sx - ev.rawX; val dy = ev.rawY - sy
                    if (abs(dx) > dp(6f) || abs(dy) > dp(6f)) { moved = true; main.removeCallbacks(longPress) }
                    lp.x = (ox + dx).toInt(); lp.y = (oy + dy).toInt(); clampBubble(lp, size); wm.updateViewLayout(root, lp); true }
                MotionEvent.ACTION_UP, MotionEvent.ACTION_CANCEL -> { main.removeCallbacks(longPress); d.press(false); if (!moved && SystemClock.uptimeMillis() - downAt < 600) onTap(); true }
                else -> false
            }
        }
    }
    private fun clampBubble(lp: WindowManager.LayoutParams, size: Int) {
        val dm = resources.displayMetrics
        lp.x = lp.x.coerceIn(0, (dm.widthPixels - size).coerceAtLeast(0)); lp.y = lp.y.coerceIn(0, (dm.heightPixels - size - dp(40f).toInt()).coerceAtLeast(0))
    }
    override fun onConfigurationChanged(newConfig: android.content.res.Configuration) {
        super.onConfigurationChanged(newConfig) // fix 9: fold / unfold / rotate – keep the bubble on the visible screen
        val root = bubble ?: return; val lp = root.layoutParams as? WindowManager.LayoutParams ?: return
        clampBubble(lp, dp(62f).toInt()); runCatching { wm.updateViewLayout(root, lp) }
    }
    private fun openMain() { startActivity(Intent(this, MainActivity::class.java).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)) }
    // step 31: long-press menu on the bubble – no screen to open
    private fun toggleMenu(root: FrameLayout, size: Int) {
        menu?.let { root.removeView(it); menu = null; return }
        val m = android.widget.LinearLayout(this).apply { orientation = android.widget.LinearLayout.VERTICAL; layoutDirection = View.LAYOUT_DIRECTION_RTL
            background = GradientDrawable().apply { cornerRadius = dp(20f); setColor(Color.parseColor("#F5121628")); setStroke(dp(1f).toInt(), Color.parseColor("#2EFFFFFF")) }; elevation = dp(10f); setPadding(dp(8f).toInt(), dp(8f).toInt(), dp(8f).toInt(), dp(8f).toInt()); minimumWidth = dp(200f).toInt() }
        fun item(t: String, act: () -> Unit) { m.addView(TextView(this).apply { text = t; setTextColor(Color.parseColor("#F3F5FF")); textSize = 15f; typeface = android.graphics.Typeface.create("sans-serif-medium", android.graphics.Typeface.NORMAL); setPadding(dp(16f).toInt(), dp(11f).toInt(), dp(16f).toInt(), dp(11f).toInt())
            background = android.graphics.drawable.RippleDrawable(android.content.res.ColorStateList.valueOf(Color.parseColor("#337DF9FF")), null, GradientDrawable().apply { cornerRadius = dp(12f); setColor(Color.WHITE) }); setOnClickListener { toggleMenu(root, size); act() } }) }
        item("🎙 דבר") { startListening("cmd") }
        item(if (heyOn) "🔇 שקט (כבה מילת הפעלה)" else "🔔 הפעל מילת הפעלה") { if (heyOn) { tts?.stop(); heyOff() } else { heyOn = true; Prefs.setHey(this, true); wakeLoop() } }
        item("📋 סטטוס") { speak(localStatus()) }
        item(if (night) "🔊 בטל מצב לילה" else "🌙 מצב לילה") { night = !night; Prefs.setNight(this, night); showLabel(if (night) "🌙 מצב לילה" else "חזרתי לדבר", 2500) }
        item("🕘 יומן והגדרות") { openMain() }
        item("🖥 הצג/הסתר דף") { revealPage(!pageShown) }
        if (Prefs.updateUrl(this) != null) item("⬇ התקן גרסה חדשה") { installUpdate() }
        item("⏻ כבה בועה") { stopSelf() }
        root.addView(m, FrameLayout.LayoutParams(FrameLayout.LayoutParams.WRAP_CONTENT, FrameLayout.LayoutParams.WRAP_CONTENT).apply { gravity = Gravity.TOP or Gravity.END; topMargin = size + dp(6f).toInt() })
        menu = m; main.postDelayed({ if (menu === m) { root.removeView(m); menu = null } }, 8000)
    }
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
        } catch (e: Exception) { Log.w("liba", "media session: $e") }
    }
    private var labelHide: Runnable? = null
    private fun showLabel(text: String, ms: Long) {
        val l = label ?: return; l.text = text; l.visibility = View.VISIBLE
        labelHide?.let { main.removeCallbacks(it) }; labelHide = Runnable { l.visibility = View.GONE }.also { main.postDelayed(it, ms) }
    }
    private fun onTap() {
        when {
            listening && listenMode != "wake" -> sr?.stopListening()
            speaking || tts?.isSpeaking == true -> { stopSpeaking(); idleOrWake() }
            !pageReady -> { showLabel(status, 6000); web?.let { LibaWeb.hello(it) }; if (status.startsWith("הדף לא")) reloadPage("לחיצה") }
            else -> startListening("cmd")
        }
    }

    // ---------- speech in ----------
    private val muteStreams = intArrayOf(AudioManager.STREAM_SYSTEM)
    private fun muteSystem() { if (systemMuted) return; val am = getSystemService(AUDIO_SERVICE) as AudioManager; if (am.isMusicActive) return; muteStreams.forEach { try { am.adjustStreamVolume(it, AudioManager.ADJUST_MUTE, 0) } catch (e: Exception) {} }; systemMuted = true }
    private fun unmuteSystem() { if (!systemMuted) return; val am = getSystemService(AUDIO_SERVICE) as AudioManager; muteStreams.forEach { try { am.adjustStreamVolume(it, AudioManager.ADJUST_UNMUTE, 0) } catch (e: Exception) {} }; systemMuted = false }
    private fun wakeLoop() { if (!running || !heyOn || listening || speaking || tts?.isSpeaking == true) return; startVad() }
    // step 21: hold the mic with a cheap energy gate; only when speech is heard start the real recognizer (no chime loop, no network idle)
    private fun startVad() {
        if (vad?.active == true || listening) return
        if (!ensureMicFgs()) return
        unmuteSystem(); setState(State.WAKE)
        var me: VadGate? = null
        me = VadGate { main.post { if (vad !== me || !running) return@post; vad = null; if (heyOn && !listening && !speaking) startListening("wake") else wakeLoop() } }
        vad = me; me.start()
    }
    private fun stopVad() { vad?.stop(); vad = null }
    private fun startListening(mode: String) {
        if (!running) return
        if (listening && listenMode == "wake" && mode == "cmd") { try { sr?.cancel() } catch (e: Exception) {}; listening = false; unmuteSystem() } // fix 7: a tap wins over a noise-triggered wake window
        else if (listening) return
        if (speaking && mode != "cmd") return
        if (!ensureMicFgs()) return
        if (!SpeechRecognizer.isRecognitionAvailable(this)) { showLabel("אין זיהוי דיבור בטלפון (צריך את אפליקציית Google)", 5000); return }
        if (mode != "wake") tts?.stop()
        stopVad()
        val wantOnDevice = mode == "wake" && !onDeviceFailed && Build.VERSION.SDK_INT >= 31 && runCatching { SpeechRecognizer.isOnDeviceRecognitionAvailable(this) }.getOrDefault(false)
        if (sr != null && srOnDevice != wantOnDevice) { try { sr?.destroy() } catch (e: Exception) {}; sr = null }
        if (sr == null) { sr = (if (wantOnDevice) SpeechRecognizer.createOnDeviceSpeechRecognizer(this) else SpeechRecognizer.createSpeechRecognizer(this)).also { it.setRecognitionListener(recListener) }; srOnDevice = wantOnDevice }
        val i = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
            putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
            putExtra(RecognizerIntent.EXTRA_LANGUAGE, "he-IL"); putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true)
            putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS, if (mode == "wake") 1200L else 1500L)
            if (mode == "wake") { putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_MINIMUM_LENGTH_MILLIS, 4000L); putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_POSSIBLY_COMPLETE_SILENCE_LENGTH_MILLIS, 2000L); putExtra(RecognizerIntent.EXTRA_PREFER_OFFLINE, true) }
        }
        listening = true; listenMode = mode
        if (mode == "wake") { muteSystem(); setState(State.WAKE); main.postDelayed({ if (listenMode == "wake") unmuteSystem() }, 6000) } else { unmuteSystem(); setState(State.LISTENING); showLabel(if (mode == "follow") "…" else "מקשיב…", 15000) }
        sr?.startListening(i)
    }
    private fun stripWake(t: String): Pair<Boolean, String> {
        val low = t.trim()
        for (w in WAKE.sortedByDescending { it.length }) { val i = low.indexOf(w); if (i >= 0) return true to (low.substring(0, i) + low.substring(i + w.length)).trim().trim(',', '.', '،') }
        return false to low
    }
    private val recListener = object : RecognitionListener {
        override fun onReadyForSpeech(p: Bundle?) {}
        override fun onBeginningOfSpeech() { if (listenMode == "wake") main.post { unmuteSystem() } }
        override fun onRmsChanged(v: Float) { dot?.level = ((v + 2f) / 12f).coerceIn(0f, 1f) }
        override fun onBufferReceived(b: ByteArray?) {}
        override fun onEndOfSpeech() { main.post { unmuteSystem() } }
        override fun onEvent(t: Int, p: Bundle?) {}
        override fun onPartialResults(p: Bundle?) {
            val t = p?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)?.firstOrNull() ?: return
            if (listenMode == "wake") { if (WAKE.any { t.contains(it) }) { showLabel("כן?", 3000) } } else if (t.isNotBlank()) showLabel(t, 15000)
        }
        override fun onError(e: Int) { listening = false; if (listenMode == "wake") unmuteSystem()
            pendingSay?.let { t -> pendingSay = null; main.postDelayed({ speak(t) }, 300); return }
            if (listenMode == "wake") { errStreak++; if (e == SpeechRecognizer.ERROR_RECOGNIZER_BUSY || e == SpeechRecognizer.ERROR_CLIENT) { sr?.destroy(); sr = null }
                if (srOnDevice && (e == 12 || e == 13 || e == SpeechRecognizer.ERROR_SERVER)) { onDeviceFailed = true; try { sr?.destroy() } catch (x: Exception) {}; sr = null; Log.i("liba", "on-device recognizer has no Hebrew – falling back") }
                main.postDelayed({ wakeLoop() }, if (speaking) 1500 else if (errStreak > 5) 5000 else 400); return }
            errStreak = 0
            if (listenMode == "follow" && (e == SpeechRecognizer.ERROR_NO_MATCH || e == SpeechRecognizer.ERROR_SPEECH_TIMEOUT)) { idleOrWake(); return }
            showLabel(when (e) { SpeechRecognizer.ERROR_NO_MATCH, SpeechRecognizer.ERROR_SPEECH_TIMEOUT -> "לא שמעתי כלום"; SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS -> "אין הרשאת מיקרופון"; SpeechRecognizer.ERROR_NETWORK -> "אין אינטרנט לזיהוי"; else -> "שגיאת מיקרופון ($e)" }, 3000)
            idleOrWake() }
        override fun onResults(r: Bundle?) { listening = false; errStreak = 0; if (listenMode == "wake") unmuteSystem()
            val flush = pendingSay; pendingSay = null
            if (flush != null) main.postDelayed({ speak(flush) }, 1200)
            var t = r?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)?.firstOrNull()?.trim().orEmpty()
            if (listenMode == "wake") {
                val (hit, rest) = stripWake(t)
                val words = t.split(Regex("\\s+")).filter { it.isNotBlank() }
                val early = words.take(4).any { w -> WAKE.any { w.contains(it) } }
                if (!hit || !early || words.size > 25) { main.postDelayed({ wakeLoop() }, 250); return } // TV / other people: ignore
                if (rest.length < 2) { pendingListenAfterSpeech = true; speak("כן?"); return }
                t = rest
            }
            if (t.isEmpty()) { if (listenMode == "follow") idleOrWake() else { showLabel("לא שמעתי כלום", 3000); idleOrWake() }; return }
            handleUtterance(t) }
    }

    /** step 63: text shared from another app – sent as-is; a following "תטפל בזה" refers to it. */
    fun sendShared(msg: String) { main.post { lastShared = msg; showLabel("שיתוף → ליבה", 3000); tone("heard"); if (pageReady) { Prefs.log(this, "me", msg); sentAt = SystemClock.elapsedRealtime(); setState(State.SENDING); web?.let { LibaWeb.sendInput(it, msg) } } else Prefs.setPendingShare(this, msg) } }
    private var lastShared = ""
    // ---------- local commands, then send ----------
    private fun handleUtterance(t: String) {
        val n = t.replace("?", "").trim()
        when {
            n in listOf("חזור", "תחזור", "תחזור על זה", "עוד פעם", "מה אמרת", "מה") && lastSaid.isNotEmpty() -> { speak(lastSaid); return }
            n in listOf("מה הסטטוס", "סטטוס", "מה קורה", "מה המצב", "מה עם המשימות", "משימות") -> { speak(localStatus()); return }
            n in listOf("לאט יותר", "יותר לאט", "לאט", "תדבר לאט") -> { rate = (rate - 0.15f).coerceIn(0.6f, 2.2f); Prefs.setRate(this, rate); tts?.setSpeechRate(rate); speak("ככה, לאט יותר."); return }
            n in listOf("מהר יותר", "יותר מהר", "מהר", "תדבר מהר") -> { rate = (rate + 0.15f).coerceIn(0.6f, 2.2f); Prefs.setRate(this, rate); tts?.setSpeechRate(rate); speak("ככה, מהר יותר."); return }
            n in listOf("מצב לילה", "לחישה", "מצב לחישה", "בלי קול") -> { night = true; Prefs.setNight(this, true); vibrate(longArrayOf(0, 200)); showLabel("🌙 מצב לילה: רטט וטקסט, בלי קול. תגיד 'בטל מצב לילה'.", 8000); return }
            n in listOf("בטל מצב לילה", "סיים מצב לילה", "עם קול", "תדברי", "תדבר") -> { night = false; Prefs.setNight(this, false); speak("חזרתי לדבר."); return }
            n in listOf("תני להפריע", "תן להפריע", "אפשר להפריע לך") -> { bargeIn = true; Prefs.setBarge(this, true); speak("בסדר, אפשר להפריע לי באמצע."); return }
            n in listOf("אל תני להפריע", "אל תן להפריע", "בלי הפרעות באמצע") -> { bargeIn = false; Prefs.setBarge(this, false); bargeVad?.stop(); bargeVad = null; speak("בסדר, בלי הפרעות באמצע."); return }
            n in listOf("מצב רכב", "אני נוהג", "נוהג") -> { headsetBtn = true; Prefs.setHeadset(this, true); setupMediaSession(); night = false; Prefs.setNight(this, false); carMode = true; label?.textSize = 22f; speak("מצב רכב. קול בלבד, כפתור האוזניה אומר דבר. תגיד בטל מצב רכב כשתגיע."); return }
            n in listOf("בטל מצב רכב", "הגעתי", "סיימתי לנהוג") -> { carMode = false; label?.textSize = 15f; speak("יצאתי ממצב רכב."); return }
            n in listOf("אוזניות", "כפתור אוזניה", "מצב אוזניות") -> { headsetBtn = true; Prefs.setHeadset(this, true); setupMediaSession(); speak("כפתור האוזניה עכשיו אומר דבר."); return }
            n in listOf("בלי אוזניות", "בטל אוזניות", "בטל מצב רכב") -> { headsetBtn = false; Prefs.setHeadset(this, false); setupMediaSession(); speak("כפתור האוזניה חזר למוזיקה."); return }
            n in listOf("בלי דוחות", "בטל דוחות", "אל תשלח דוחות") -> { Prefs.setReports(this, false); speak("בסדר, בלי דוחות קריסה."); return }
            n in listOf("עם דוחות", "תשלח דוחות") -> { Prefs.setReports(this, true); speak("דוחות קריסה פועלים."); return }
            n in listOf("תתקין", "התקן", "תתקין את העדכון", "עדכן", "תעדכן") -> { installUpdate(); return }
            n in listOf("בלי צלילים", "בטל צלילים") -> { tones = false; Prefs.setTones(this, false); speak("בלי צלילים."); return }
            n in listOf("עם צלילים", "החזר צלילים") -> { tones = true; Prefs.setTones(this, true); speak("עם צלילים."); return }
            n in listOf("דלג", "תדלג", "הלאה", "מספיק") && (chunks.isNotEmpty() || speaking) -> { stopSpeaking(); showLabel("דילגתי.", 2000); onSpoken(); return }
            n in listOf("תמשיך", "המשך", "תמשיכי") && chunks.isNotEmpty() -> { paused = false; speakNextChunk(false); return }
            n in listOf("רגע", "חכה", "עצור רגע") && (chunks.isNotEmpty() || speaking) -> { val keep = ArrayList(chunks); stopSpeaking(); chunks.addAll(keep); paused = true; showLabel("עצרתי. תגיד תמשיך.", 8000); return }
            n in listOf("שקט", "תשתוק", "עצור", "די", "ביטול", "בטל") -> { stopSpeaking(); sentAt = 0; lastSaid = ""; heyOff(); setState(State.IDLE); showLabel("שקט. מילת ההפעלה כבויה.", 3000); return }
            !pageReady -> { speak("אני לא מחובר לדף כרגע. $status"); return }
        }
        Prefs.log(this, "me", t); sentAt = SystemClock.elapsedRealtime()
        setState(State.SENDING); showLabel("→ $t", 6000)
        tone("heard")
        web?.let { LibaWeb.sendInput(it, t) }
    }
    private fun localStatus(): String {
        if (!pageReady) return "לא מחובר לדף. $status"
        val t = if (taskSummary.isNotBlank()) taskSummary else "אין משימות פתוחות"
        if (sentAt > 0) { val s = (SystemClock.elapsedRealtime() - sentAt) / 1000; return "$t. ושלחתי לפני $s שניות ומחכה לתשובה." }
        return t
    }

    // ---------- bridge (from the page) ----------
    override fun onPage(url: String) { main.post {
        pageLoadedAt = SystemClock.elapsedRealtime()
        status = when {
            url.startsWith("error:") -> "הדף לא נטען: " + url.removePrefix("error:")
            url.contains("/login") || url.contains("auth") -> { val now = SystemClock.elapsedRealtime(); if (now - loginWarnedAt > 3600000) { loginWarnedAt = now; speak("צריך להתחבר ל‑claude.ai. לחיצה ארוכה עליי, כבה בועה, התחבר, והפעל שוב.") }; "צריך להתחבר ל‑claude.ai" }
            url.contains("/artifact/") -> "הדף נטען, מחכה שהוא יתחבר…"
            else -> "נטען: " + url.take(60)
        }
        if (!pageReady) showLabel(status, 5000)
        web?.let { LibaWeb.hello(it) }
    } }
    override fun onReady() { main.post { Prefs.pendingShare(this)?.let { p -> Prefs.setPendingShare(this, null); main.postDelayed({ sendShared(p) }, 1500) }; if (!pageReady) { pageReady = true; pageOk = true; status = "מחובר. לחץ על הבועה ודבר."; idleOrWake(); showLabel("ליבה מחוברת.", 3000)
        if (Prefs.reports(this)) Prefs.crash(this)?.let { c -> web?.let { LibaWeb.sendCrash(it, "c-" + System.currentTimeMillis(), packageManager.getPackageInfo(packageName, 0).versionName ?: "?", c) } } } } }
    fun heyOff() { heyOn = false; Prefs.setHey(this, false); stopVad(); if (listening && listenMode == "wake") { try { sr?.cancel() } catch (e: Exception) {}; listening = false }; unmuteSystem() }
    override fun onCmd(cmd: String) { main.post { when (cmd) { "hey_off" -> { heyOff(); showLabel("מילת ההפעלה כובתה מרחוק", 4000) }; "hey_on" -> { heyOn = true; Prefs.setHey(this, true); wakeLoop() }; "reload" -> { pageReady = false; pageOk = false; main.postDelayed({ web?.reload() }, 1500) }
        else -> if (cmd.startsWith("open ")) { val u = cmd.removePrefix("open ").trim(); val i = Intent(Intent.ACTION_VIEW, android.net.Uri.parse(u)).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK); try { startActivity(i) } catch (e: Exception) { notifyIntent("ליבה – קישור", u, i) } } } } }
    /** fix 10: when Android refuses an activity start from the background, hand the intent to the user as a tappable notification. */
    private fun notifyIntent(title: String, text: String, i: Intent) {
        try { val pi = PendingIntent.getActivity(this, (System.currentTimeMillis() % 10000).toInt(), i, PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT)
            getSystemService(NotificationManager::class.java).notify(3, NotificationCompat.Builder(this, CH).setSmallIcon(R.drawable.ic_notif).setContentTitle(title).setContentText(text).setContentIntent(pi).setAutoCancel(true).setPriority(NotificationCompat.PRIORITY_HIGH).build())
            showLabel("פתח מההתראה למעלה", 6000) } catch (e: Exception) { showLabel("לא הצלחתי לפתוח: $text", 6000) }
    }
    override fun onCrashSaved(id: String) { main.post { Prefs.clearCrash(this); showLabel("דוח הקריסה נשלח לליבה", 4000) } }
    override fun onTasks(summary: String, n: Int, blocked: Int) { tasksSummary = summary; main.post { taskSummary = summary; taskBlocked = blocked; if (n > 0) status = "מחובר · $n משימות" + (if (blocked > 0) " · $blocked מחכות לך" else "") } }
    override fun onPageTap() { main.post { web?.let { LibaWeb.simulateTap(it) } } }
    override fun onSent(text: String) { main.post { tone("sent"); status = "נשלח, מחכה לתשובה…"; setState(State.IDLE); showLabel("נשלח. מחכה…", 30000); armWaitReminders(); if (heyOn) wakeLoop() } }
    override fun onError(text: String, reason: String) { main.post { sentAt = 0
        val why = when {
            reason.contains("consent") -> "הדף צריך אישור חד פעמי. לחיצה ארוכה עליי, כבה בועה, שלח הודעה אחת מהדף ואשר."
            reason.contains("no_session") -> "אין סשן של קלוד שמאזין עכשיו."
            reason.contains("writers_only") || reason.contains("forbidden") || reason.contains("not_granted") -> "אין הרשאה לשלוח מהחשבון הזה."
            reason.contains("rate") -> "יותר מדי מהר. חכה רגע."
            reason.isBlank() -> "" else -> "סיבה: $reason" }
        showLabel("לא נשלח" + (if (reason.isNotBlank()) " · $reason" else ""), 8000); speak("לא הצלחתי לשלוח. $why") } }
    override fun onSay(text: String, kind: String, options: List<String>, speaker: String) { main.post {
        sentAt = 0; status = "מחובר."; waitTimer?.let { main.removeCallbacks(it) }
        curSpeaker = if (speaker.isBlank()) "ליבה" else speaker
        // step 14: a different voice per speaker – ליבה neutral, המנהל lower, האדריכל higher, others slightly low
        val pitch = when { speaker.isBlank() || speaker.contains("ליבה") -> 1.0f; speaker.contains("מנהל") -> 0.8f; speaker.contains("אדריכל") -> 1.2f; else -> 0.9f }
        try { tts?.setPitch(pitch) } catch (e: Exception) {}
        Prefs.log(this, "liba", text)
        val ask = options.isNotEmpty() || kind == "stuck" || kind == "call" || kind == "ask"
        val spoken = text + if (options.isNotEmpty()) ". " + options.joinToString(", או ") + "?" else ""
        showLabel(text, 20000)
        if (kind == "call" || kind == "stuck") { setState(State.RINGING); ring(); main.postDelayed({ pendingListenAfterSpeech = ask; speak(spoken, urgent = true) }, 2200) }
        else { tone("reply"); pendingListenAfterSpeech = ask; main.postDelayed({ speak(spoken) }, 250) }
    } }
    private fun ring() {
        unmuteSystem()
        try { val tg = ToneGenerator(AudioManager.STREAM_NOTIFICATION, 90); tg.startTone(ToneGenerator.TONE_SUP_RINGTONE, 1800); main.postDelayed({ tg.release() }, 2000) } catch (e: Exception) {}
        val v = getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
        v.vibrate(VibrationEffect.createWaveform(longArrayOf(0, 300, 150, 300, 150, 300), -1))
    }

    override fun onDestroy() {
        running = false; instance = null; main.removeCallbacksAndMessages(null); stopVad(); bargeVad?.stop(); netCb?.let { runCatching { getSystemService(ConnectivityManager::class.java).unregisterNetworkCallback(it) } }; mediaSession?.let { it.isActive = false; it.release() }; unmuteSystem()
        try { sr?.destroy() } catch (e: Exception) {}
        tts?.stop(); tts?.shutdown()
        bubble?.let { runCatching { wm.removeView(it) } }; webHost?.let { runCatching { wm.removeView(it) } }; web?.destroy()
        super.onDestroy()
    }
}
