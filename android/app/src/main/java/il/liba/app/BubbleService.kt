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
        val WAKE = listOf("ליבה", "ליבא", "ליבע", "לייבה", "היי ליבה", "הי ליבה")
    }

    private lateinit var wm: WindowManager
    private val main = Handler(Looper.getMainLooper())
    private var web: WebView? = null
    private var webHost: FrameLayout? = null
    private var webLp: WindowManager.LayoutParams? = null
    private var revealed = false
    private var bubble: FrameLayout? = null
    private var dot: TextView? = null
    private var label: TextView? = null
    private var tts: TextToSpeech? = null
    private var ttsReady = false
    private var sr: SpeechRecognizer? = null
    private var listening = false
    private var listenMode = "cmd" // cmd | wake | follow
    private var pulse: ObjectAnimator? = null
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
        startForegroundNotif()
        runCatching { applyPrefs() }
        runCatching { setupTts() }
        runCatching { setupWeb() }.onFailure { status = "WebView נכשל: $it" }
        runCatching { setupBubble() }.onFailure { status = "בועה נכשלה: $it" }
        runCatching { watchNetwork() }
        main.postDelayed(watchdog, 30000)
        runCatching { checkUpdate() }
    }
    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int = START_STICKY

    fun applyPrefs() { heyOn = Prefs.hey(this); convOn = Prefs.conv(this); main.post { if (heyOn) wakeLoop() else if (listenMode == "wake" && listening) sr?.cancel() } }

    // ---------- notification ----------
    private fun startForegroundNotif() {
        val nm = getSystemService(NotificationManager::class.java)
        nm.createNotificationChannel(NotificationChannel(CH, "ליבה", NotificationManager.IMPORTANCE_LOW))
        val pi = PendingIntent.getActivity(this, 0, Intent(this, MainActivity::class.java), PendingIntent.FLAG_IMMUTABLE)
        val n = NotificationCompat.Builder(this, CH).setSmallIcon(R.drawable.ic_notif).setContentTitle("ליבה מאזינה")
            .setContentText("לחץ על הבועה כדי לדבר").setContentIntent(pi).setOngoing(true).setSilent(true).build()
        try {
            if (Build.VERSION.SDK_INT >= 34) startForeground(1, n, ServiceInfo.FOREGROUND_SERVICE_TYPE_SPECIAL_USE)
            else if (Build.VERSION.SDK_INT >= 29) startForeground(1, n, ServiceInfo.FOREGROUND_SERVICE_TYPE_MICROPHONE) else startForeground(1, n)
        } catch (e: Exception) {
            // Android refused a background (re)start: leave a tappable notification instead of crash-looping.
            val nn = NotificationCompat.Builder(this, CH).setSmallIcon(R.drawable.ic_notif).setContentTitle("הבועה נסגרה").setContentText("לחץ כדי להפעיל מחדש").setContentIntent(pi).setAutoCancel(true).build()
            nm.notify(2, nn); stopSelf(); throw e
        }
    }
    /** Ask for microphone access on demand (allowed while our overlay is visible); falls back gracefully. */
    private fun ensureMicFgs(): Boolean {
        if (micFgs || Build.VERSION.SDK_INT < 34) return true
        return try {
            val pi = PendingIntent.getActivity(this, 0, Intent(this, MainActivity::class.java), PendingIntent.FLAG_IMMUTABLE)
            val n = NotificationCompat.Builder(this, CH).setSmallIcon(R.drawable.ic_notif).setContentTitle("ליבה מאזינה").setContentText("לחץ על הבועה כדי לדבר").setContentIntent(pi).setOngoing(true).setSilent(true).build()
            startForeground(1, n, ServiceInfo.FOREGROUND_SERVICE_TYPE_SPECIAL_USE or ServiceInfo.FOREGROUND_SERVICE_TYPE_MICROPHONE); micFgs = true; true
        } catch (e: Exception) { showLabel("אנדרואיד לא נותן מיקרופון ברקע – פתח את ליבה ולחץ הפעל בועה", 6000); false }
    }

    // ---------- TTS ----------
    private fun setupTts() {
        tts = TextToSpeech(this) { st ->
            if (st == TextToSpeech.SUCCESS) {
                val r = tts?.setLanguage(Locale("he", "IL"))
                ttsReady = r != TextToSpeech.LANG_MISSING_DATA && r != TextToSpeech.LANG_NOT_SUPPORTED
                tts?.setSpeechRate(1.25f)
                tts?.setAudioAttributes(android.media.AudioAttributes.Builder().setUsage(android.media.AudioAttributes.USAGE_NOTIFICATION_EVENT).setContentType(android.media.AudioAttributes.CONTENT_TYPE_SPEECH).build())
                tts?.setOnUtteranceProgressListener(object : UtteranceProgressListener() {
                    override fun onStart(id: String?) {}
                    override fun onError(id: String?) { main.post { onSpoken() } }
                    override fun onDone(id: String?) { main.post { onSpoken() } }
                })
                if (!ttsReady) main.post { showLabel("אין קול עברי בטלפון – התקן Google Text-to-Speech עברית", 6000) }
            }
        }
    }
    private fun speak(text: String) {
        lastSaid = text
        if (listening) { try { sr?.cancel() } catch (e: Exception) {}; listening = false }
        if (!ttsReady) { showLabel(text, 8000); onSpoken(); return }
        unmuteSystem(); setState(State.SPEAKING); speaking = true
        tts?.speak(text, TextToSpeech.QUEUE_FLUSH, null, "liba-" + System.currentTimeMillis())
        main.postDelayed({ if (speaking) { speaking = false; onSpoken() } }, 4000L + text.length * 120L) // safety net if TTS never reports
    }
    private fun onSpoken() {
        if (!speaking && pendingListenAfterSpeech.not() && listenMode == "follow") return
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
    fun revealPage(show: Boolean) {
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
        webHost?.let { runCatching { wm.removeView(it) } }; web?.destroy(); web = null; pageReady = false
        setupWeb(); showLabel("הדף קרס – טוען מחדש", 4000)
    }
    private fun reloadPage(why: String) {
        val now = SystemClock.elapsedRealtime(); if (now - lastReloadAt < 90000) return
        lastReloadAt = now; pageReady = false; pageLoadedAt = now; status = "טוען מחדש ($why)"
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
            cm.registerDefaultNetworkCallback(object : ConnectivityManager.NetworkCallback() {
                override fun onAvailable(n: Network) { main.post { if (!pageReady) reloadPage("רשת חזרה") } }
            })
        } catch (e: Exception) { Log.w(LibaWeb.TAG, "network watch: $e") }
    }

    // ---------- update check ----------
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
        pulse?.cancel(); d.scaleX = 1f; d.scaleY = 1f
        val bg = d.background as GradientDrawable
        when (s) {
            State.IDLE -> { bg.setColors(intArrayOf(Color.WHITE, Color.parseColor("#7DF9FF"), Color.parseColor("#8A5CFF"))); d.text = "ל" }
            State.WAKE -> { bg.setColors(intArrayOf(Color.parseColor("#B8FBFF"), Color.parseColor("#3FBDB9"), Color.parseColor("#2C3140"))); d.text = "ל"; pulseDot(1.06f, 1400) }
            State.OFFLINE -> { bg.setColors(intArrayOf(Color.parseColor("#5B6478"), Color.parseColor("#2C3140"), Color.parseColor("#1A1E28"))); d.text = "…" }
            State.LISTENING -> { bg.setColors(intArrayOf(Color.WHITE, Color.parseColor("#FF5C8A"), Color.parseColor("#8A1F3A"))); d.text = "🎙"; pulseDot(1.15f, 500) }
            State.SPEAKING -> { bg.setColors(intArrayOf(Color.WHITE, Color.parseColor("#5CFFB0"), Color.parseColor("#0B6E6D"))); d.text = "🔊" }
            State.RINGING -> { bg.setColors(intArrayOf(Color.WHITE, Color.parseColor("#FFB454"), Color.parseColor("#C9491D"))); d.text = "☎"; pulseDot(1.35f, 300) }
            State.SENDING -> { bg.setColors(intArrayOf(Color.WHITE, Color.parseColor("#7DF9FF"), Color.parseColor("#2C3140"))); d.text = "↑" }
        }
    }
    private fun pulseDot(to: Float, ms: Long) {
        val d = dot ?: return
        pulse = ObjectAnimator.ofFloat(d, "scaleX", 1f, to).apply { duration = ms; repeatMode = ValueAnimator.REVERSE; repeatCount = ValueAnimator.INFINITE; addUpdateListener { d.scaleY = d.scaleX }; start() }
    }
    private fun setupBubble() {
        val root = FrameLayout(this); val size = dp(62f).toInt()
        val d = TextView(this).apply {
            text = "ל"; setTextColor(Color.parseColor("#04050A")); textSize = 26f; gravity = Gravity.CENTER
            background = GradientDrawable().apply { shape = GradientDrawable.OVAL; gradientType = GradientDrawable.RADIAL_GRADIENT; gradientRadius = dp(40f)
                setColors(intArrayOf(Color.WHITE, Color.parseColor("#7DF9FF"), Color.parseColor("#8A5CFF"))); setStroke(dp(1f).toInt(), Color.parseColor("#66FFFFFF")) }
            elevation = dp(8f)
        }
        val l = TextView(this).apply {
            setTextColor(Color.WHITE); textSize = 15f; setPadding(dp(14f).toInt(), dp(8f).toInt(), dp(14f).toInt(), dp(8f).toInt()); maxWidth = dp(250f).toInt()
            background = GradientDrawable().apply { cornerRadius = dp(16f); setColor(Color.parseColor("#E60A0C16")); setStroke(dp(1f).toInt(), Color.parseColor("#337DF9FF")) }
            visibility = View.GONE; textDirection = View.TEXT_DIRECTION_RTL
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
        val longPress = Runnable { if (!moved) { moved = true; openMain() } }
        d.setOnTouchListener { _, ev ->
            when (ev.actionMasked) {
                MotionEvent.ACTION_DOWN -> { sx = ev.rawX; sy = ev.rawY; ox = lp.x; oy = lp.y; moved = false; downAt = SystemClock.uptimeMillis(); main.postDelayed(longPress, 600); true }
                MotionEvent.ACTION_MOVE -> { val dx = sx - ev.rawX; val dy = ev.rawY - sy
                    if (abs(dx) > dp(6f) || abs(dy) > dp(6f)) { moved = true; main.removeCallbacks(longPress) }
                    lp.x = (ox + dx).toInt(); lp.y = (oy + dy).toInt(); wm.updateViewLayout(root, lp); true }
                MotionEvent.ACTION_UP, MotionEvent.ACTION_CANCEL -> { main.removeCallbacks(longPress); if (!moved && SystemClock.uptimeMillis() - downAt < 600) onTap(); true }
                else -> false
            }
        }
    }
    private fun openMain() { startActivity(Intent(this, MainActivity::class.java).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)) }
    private var labelHide: Runnable? = null
    private fun showLabel(text: String, ms: Long) {
        val l = label ?: return; l.text = text; l.visibility = View.VISIBLE
        labelHide?.let { main.removeCallbacks(it) }; labelHide = Runnable { l.visibility = View.GONE }.also { main.postDelayed(it, ms) }
    }
    private fun onTap() {
        when {
            listening && listenMode != "wake" -> sr?.stopListening()
            tts?.isSpeaking == true -> { tts?.stop(); idleOrWake() }
            !pageReady -> { showLabel(status, 6000); web?.let { LibaWeb.hello(it) }; if (status.startsWith("הדף לא")) reloadPage("לחיצה") }
            else -> startListening("cmd")
        }
    }

    // ---------- speech in ----------
    private val muteStreams = intArrayOf(AudioManager.STREAM_SYSTEM, AudioManager.STREAM_MUSIC)
    private fun muteSystem() { if (systemMuted) return; val am = getSystemService(AUDIO_SERVICE) as AudioManager; if (am.isMusicActive) return; muteStreams.forEach { try { am.adjustStreamVolume(it, AudioManager.ADJUST_MUTE, 0) } catch (e: Exception) {} }; systemMuted = true }
    private fun unmuteSystem() { if (!systemMuted) return; val am = getSystemService(AUDIO_SERVICE) as AudioManager; muteStreams.forEach { try { am.adjustStreamVolume(it, AudioManager.ADJUST_UNMUTE, 0) } catch (e: Exception) {} }; systemMuted = false }
    private fun wakeLoop() { if (!heyOn || listening || speaking || tts?.isSpeaking == true) return; startListening("wake") }
    private fun startListening(mode: String) {
        if (listening) return
        if (speaking && mode != "cmd") return
        if (!ensureMicFgs()) return
        if (!SpeechRecognizer.isRecognitionAvailable(this)) { showLabel("אין זיהוי דיבור בטלפון (צריך את אפליקציית Google)", 5000); return }
        if (mode != "wake") tts?.stop()
        if (sr == null) sr = SpeechRecognizer.createSpeechRecognizer(this).also { it.setRecognitionListener(recListener) }
        val i = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
            putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
            putExtra(RecognizerIntent.EXTRA_LANGUAGE, "he-IL"); putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true)
            putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS, if (mode == "wake") 1200L else 1500L)
            if (mode == "wake") { putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_MINIMUM_LENGTH_MILLIS, 30000L); putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_POSSIBLY_COMPLETE_SILENCE_LENGTH_MILLIS, 30000L) }
        }
        listening = true; listenMode = mode
        if (mode == "wake") { muteSystem(); setState(State.WAKE) } else { unmuteSystem(); setState(State.LISTENING); showLabel(if (mode == "follow") "…" else "מקשיב…", 15000) }
        sr?.startListening(i)
    }
    private fun stripWake(t: String): Pair<Boolean, String> {
        val low = t.trim()
        for (w in WAKE.sortedByDescending { it.length }) { val i = low.indexOf(w); if (i >= 0) return true to (low.substring(0, i) + low.substring(i + w.length)).trim().trim(',', '.', '،') }
        return false to low
    }
    private val recListener = object : RecognitionListener {
        override fun onReadyForSpeech(p: Bundle?) {}
        override fun onBeginningOfSpeech() {}
        override fun onRmsChanged(v: Float) {}
        override fun onBufferReceived(b: ByteArray?) {}
        override fun onEndOfSpeech() {}
        override fun onEvent(t: Int, p: Bundle?) {}
        override fun onPartialResults(p: Bundle?) {
            val t = p?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)?.firstOrNull() ?: return
            if (listenMode == "wake") { if (WAKE.any { t.contains(it) }) { showLabel("כן?", 3000) } } else if (t.isNotBlank()) showLabel(t, 15000)
        }
        override fun onError(e: Int) { listening = false
            if (listenMode == "wake") { errStreak++; if (e == SpeechRecognizer.ERROR_RECOGNIZER_BUSY || e == SpeechRecognizer.ERROR_CLIENT) { sr?.destroy(); sr = null }
                main.postDelayed({ wakeLoop() }, if (speaking) 1500 else if (errStreak > 5) 5000 else 400); return }
            errStreak = 0
            if (listenMode == "follow" && (e == SpeechRecognizer.ERROR_NO_MATCH || e == SpeechRecognizer.ERROR_SPEECH_TIMEOUT)) { idleOrWake(); return }
            showLabel(when (e) { SpeechRecognizer.ERROR_NO_MATCH, SpeechRecognizer.ERROR_SPEECH_TIMEOUT -> "לא שמעתי כלום"; SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS -> "אין הרשאת מיקרופון"; SpeechRecognizer.ERROR_NETWORK -> "אין אינטרנט לזיהוי"; else -> "שגיאת מיקרופון ($e)" }, 3000)
            idleOrWake() }
        override fun onResults(r: Bundle?) { listening = false; errStreak = 0
            var t = r?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)?.firstOrNull()?.trim().orEmpty()
            if (listenMode == "wake") {
                val (hit, rest) = stripWake(t)
                if (!hit) { main.postDelayed({ wakeLoop() }, 250); return }
                if (rest.length < 2) { pendingListenAfterSpeech = true; speak("כן?"); return }
                t = rest
            }
            if (t.isEmpty()) { if (listenMode == "follow") idleOrWake() else { showLabel("לא שמעתי כלום", 3000); idleOrWake() }; return }
            handleUtterance(t) }
    }

    // ---------- local commands, then send ----------
    private fun handleUtterance(t: String) {
        val n = t.replace("?", "").trim()
        when {
            n in listOf("חזור", "תחזור", "תחזור על זה", "עוד פעם", "מה אמרת", "מה") && lastSaid.isNotEmpty() -> { speak(lastSaid); return }
            n in listOf("מה הסטטוס", "סטטוס", "מה קורה", "מה המצב", "מה עם המשימות", "משימות") -> { speak(localStatus()); return }
            n in listOf("שקט", "תשתוק", "עצור", "די", "ביטול", "בטל") -> { tts?.stop(); sentAt = 0; lastSaid = ""; heyOff(); setState(State.IDLE); showLabel("שקט. מילת ההפעלה כבויה.", 3000); return }
            !pageReady -> { speak("אני לא מחובר לדף כרגע. $status"); return }
        }
        Prefs.log(this, "me", t); sentAt = SystemClock.elapsedRealtime()
        setState(State.SENDING); showLabel("→ $t", 6000)
        try { ToneGenerator(AudioManager.STREAM_NOTIFICATION, 60).let { it.startTone(ToneGenerator.TONE_PROP_ACK, 120); main.postDelayed({ it.release() }, 300) } } catch (e: Exception) {}
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
    override fun onReady() { main.post { if (!pageReady) { pageReady = true; status = "מחובר. לחץ על הבועה ודבר."; idleOrWake(); showLabel("ליבה מחוברת.", 3000)
        Prefs.crash(this)?.let { c -> web?.let { LibaWeb.sendCrash(it, "c-" + System.currentTimeMillis(), packageManager.getPackageInfo(packageName, 0).versionName ?: "?", c) } } } } }
    fun heyOff() { heyOn = false; Prefs.setHey(this, false); if (listening && listenMode == "wake") { try { sr?.cancel() } catch (e: Exception) {}; listening = false }; unmuteSystem() }
    override fun onCmd(cmd: String) { main.post { when (cmd) { "hey_off" -> { heyOff(); showLabel("מילת ההפעלה כובתה מרחוק", 4000) }; "hey_on" -> { heyOn = true; Prefs.setHey(this, true); wakeLoop() }; "reload" -> web?.reload() } } }
    override fun onCrashSaved(id: String) { main.post { Prefs.clearCrash(this); showLabel("דוח הקריסה נשלח לליבה", 4000) } }
    override fun onTasks(summary: String, n: Int, blocked: Int) { main.post { taskSummary = summary; taskBlocked = blocked; if (n > 0) status = "מחובר · $n משימות" + (if (blocked > 0) " · $blocked מחכות לך" else "") } }
    override fun onPageTap() { main.post { web?.let { LibaWeb.simulateTap(it) } } }
    override fun onSent(text: String) { main.post { status = "נשלח, מחכה לתשובה…"; setState(State.IDLE); showLabel("נשלח. מחכה…", 30000); armWaitReminders(); if (heyOn) wakeLoop() } }
    override fun onError(text: String, reason: String) { main.post { sentAt = 0
        val why = when {
            reason.contains("consent") -> "הדף צריך אישור חד פעמי. לחיצה ארוכה עליי, כבה בועה, שלח הודעה אחת מהדף ואשר."
            reason.contains("no_session") -> "אין סשן של קלוד שמאזין עכשיו."
            reason.contains("writers_only") || reason.contains("forbidden") || reason.contains("not_granted") -> "אין הרשאה לשלוח מהחשבון הזה."
            reason.contains("rate") -> "יותר מדי מהר. חכה רגע."
            reason.isBlank() -> "" else -> "סיבה: $reason" }
        showLabel("לא נשלח" + (if (reason.isNotBlank()) " · $reason" else ""), 8000); speak("לא הצלחתי לשלוח. $why") } }
    override fun onSay(text: String, kind: String, options: List<String>) { main.post {
        sentAt = 0; status = "מחובר."; waitTimer?.let { main.removeCallbacks(it) }
        Prefs.log(this, "liba", text)
        val ask = options.isNotEmpty() || kind == "stuck" || kind == "call" || kind == "ask"
        val spoken = text + if (options.isNotEmpty()) ". " + options.joinToString(", או ") + "?" else ""
        showLabel(text, 20000)
        if (kind == "call" || kind == "stuck") { setState(State.RINGING); ring(); main.postDelayed({ pendingListenAfterSpeech = ask; speak(spoken) }, 2200) }
        else { pendingListenAfterSpeech = ask; speak(spoken) }
    } }
    private fun ring() {
        unmuteSystem()
        try { val tg = ToneGenerator(AudioManager.STREAM_NOTIFICATION, 90); tg.startTone(ToneGenerator.TONE_SUP_RINGTONE, 1800); main.postDelayed({ tg.release() }, 2000) } catch (e: Exception) {}
        val v = getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
        v.vibrate(VibrationEffect.createWaveform(longArrayOf(0, 300, 150, 300, 150, 300), -1))
    }

    override fun onDestroy() {
        running = false; instance = null; main.removeCallbacksAndMessages(null); unmuteSystem()
        try { sr?.destroy() } catch (e: Exception) {}
        tts?.stop(); tts?.shutdown()
        bubble?.let { runCatching { wm.removeView(it) } }; webHost?.let { runCatching { wm.removeView(it) } }; web?.destroy()
        super.onDestroy()
    }
}
