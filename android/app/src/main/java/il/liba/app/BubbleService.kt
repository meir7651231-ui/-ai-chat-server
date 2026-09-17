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
import android.os.*
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import android.speech.tts.TextToSpeech
import android.speech.tts.UtteranceProgressListener
import android.util.Log
import android.util.TypedValue
import android.view.*
import android.webkit.WebView
import android.widget.FrameLayout
import android.widget.TextView
import androidx.core.app.NotificationCompat
import java.util.Locale
import kotlin.math.abs

class BubbleService : Service(), LibaWeb.Bridge {
    companion object { @Volatile var running = false; const val CH = "liba" }

    private lateinit var wm: WindowManager
    private val main = Handler(Looper.getMainLooper())
    private var web: WebView? = null
    private var webHost: FrameLayout? = null
    private var bubble: FrameLayout? = null
    private var dot: TextView? = null
    private var label: TextView? = null
    private var bubbleLp: WindowManager.LayoutParams? = null
    private var tts: TextToSpeech? = null
    private var ttsReady = false
    private var sr: SpeechRecognizer? = null
    private var listening = false
    private var pulse: ObjectAnimator? = null
    private var pendingListenAfterSpeech = false
    private var pageReady = false

    private fun dp(v: Float) = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, v, resources.displayMetrics)

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onCreate() {
        super.onCreate()
        running = true
        wm = getSystemService(Context.WINDOW_SERVICE) as WindowManager
        startForegroundNotif()
        setupTts()
        setupWeb()
        setupBubble()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int = START_STICKY

    // ---------- notification ----------
    private fun startForegroundNotif() {
        val nm = getSystemService(NotificationManager::class.java)
        if (Build.VERSION.SDK_INT >= 26) nm.createNotificationChannel(NotificationChannel(CH, "ליבה", NotificationManager.IMPORTANCE_LOW))
        val pi = PendingIntent.getActivity(this, 0, Intent(this, MainActivity::class.java), PendingIntent.FLAG_IMMUTABLE)
        val n = NotificationCompat.Builder(this, CH).setSmallIcon(R.drawable.ic_notif).setContentTitle("ליבה מאזינה")
            .setContentText("לחץ על הבועה כדי לדבר").setContentIntent(pi).setOngoing(true).setSilent(true).build()
        if (Build.VERSION.SDK_INT >= 29) startForeground(1, n, ServiceInfo.FOREGROUND_SERVICE_TYPE_MICROPHONE) else startForeground(1, n)
    }

    // ---------- TTS ----------
    private fun setupTts() {
        tts = TextToSpeech(this) { st ->
            if (st == TextToSpeech.SUCCESS) {
                val r = tts?.setLanguage(Locale("he", "IL"))
                ttsReady = r != TextToSpeech.LANG_MISSING_DATA && r != TextToSpeech.LANG_NOT_SUPPORTED
                tts?.setSpeechRate(1.25f)
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
        if (!ttsReady) { showLabel(text, 8000); onSpoken(); return }
        setState(State.SPEAKING)
        tts?.speak(text, TextToSpeech.QUEUE_FLUSH, null, "liba-" + System.currentTimeMillis())
    }
    private fun onSpoken() {
        if (pendingListenAfterSpeech) { pendingListenAfterSpeech = false; startListening() } else setState(State.IDLE)
    }

    // ---------- hidden WebView (the live ליבה page) ----------
    private fun setupWeb() {
        val host = FrameLayout(this).apply { clipChildren = true; clipToPadding = true }
        val w = WebView(this)
        LibaWeb.setup(w, this)
        // A real-sized viewport inside a 1px window: lazy iframes only load when they are "in view".
        val dm = resources.displayMetrics
        host.addView(w, FrameLayout.LayoutParams(dm.widthPixels.coerceAtLeast(720), dm.heightPixels.coerceAtLeast(1280)))
        val lp = WindowManager.LayoutParams(dp(1f).toInt(), dp(1f).toInt(), WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE, PixelFormat.TRANSLUCENT)
        lp.gravity = Gravity.TOP or Gravity.START; lp.alpha = 0.01f
        wm.addView(host, lp)
        w.loadUrl(getString(R.string.artifact_url))
        web = w; webHost = host
    }

    // ---------- bubble ----------
    private enum class State { IDLE, LISTENING, SPEAKING, RINGING, SENDING, OFFLINE }
    private fun setState(s: State) {
        val d = dot ?: return
        pulse?.cancel(); d.scaleX = 1f; d.scaleY = 1f
        val bg = d.background as GradientDrawable
        when (s) {
            State.IDLE -> { bg.setColors(intArrayOf(Color.WHITE, Color.parseColor("#7DF9FF"), Color.parseColor("#8A5CFF"))); d.text = "ל" }
            State.OFFLINE -> { bg.setColors(intArrayOf(Color.parseColor("#5B6478"), Color.parseColor("#2C3140"), Color.parseColor("#1A1E28"))); d.text = "…" }
            State.LISTENING -> { bg.setColors(intArrayOf(Color.WHITE, Color.parseColor("#FF5C8A"), Color.parseColor("#8A1F3A"))); d.text = "🎙" ; pulseDot(1.15f, 500) }
            State.SPEAKING -> { bg.setColors(intArrayOf(Color.WHITE, Color.parseColor("#5CFFB0"), Color.parseColor("#0B6E6D"))); d.text = "🔊" }
            State.RINGING -> { bg.setColors(intArrayOf(Color.WHITE, Color.parseColor("#FFB454"), Color.parseColor("#C9491D"))); d.text = "☎"; pulseDot(1.35f, 300) }
            State.SENDING -> { bg.setColors(intArrayOf(Color.WHITE, Color.parseColor("#7DF9FF"), Color.parseColor("#2C3140"))); d.text = "↑" }
        }
    }
    private fun pulseDot(to: Float, ms: Long) {
        val d = dot ?: return
        pulse = ObjectAnimator.ofFloat(d, "scaleX", 1f, to).apply { duration = ms; repeatMode = ValueAnimator.REVERSE; repeatCount = ValueAnimator.INFINITE
            addUpdateListener { d.scaleY = d.scaleX }; start() }
    }

    private fun setupBubble() {
        val root = FrameLayout(this)
        val size = dp(62f).toInt()
        val d = TextView(this).apply {
            text = "ל"; setTextColor(Color.parseColor("#04050A")); textSize = 26f; gravity = Gravity.CENTER
            background = GradientDrawable().apply { shape = GradientDrawable.OVAL; gradientType = GradientDrawable.RADIAL_GRADIENT; gradientRadius = dp(40f)
                setColors(intArrayOf(Color.WHITE, Color.parseColor("#7DF9FF"), Color.parseColor("#8A5CFF"))); setStroke(dp(1f).toInt(), Color.parseColor("#66FFFFFF")) }
            elevation = dp(8f)
        }
        val l = TextView(this).apply {
            setTextColor(Color.WHITE); textSize = 15f; setPadding(dp(14f).toInt(), dp(8f).toInt(), dp(14f).toInt(), dp(8f).toInt()); maxWidth = dp(240f).toInt()
            background = GradientDrawable().apply { cornerRadius = dp(16f); setColor(Color.parseColor("#E60A0C16")); setStroke(dp(1f).toInt(), Color.parseColor("#337DF9FF")) }
            visibility = View.GONE; textDirection = View.TEXT_DIRECTION_RTL
        }
        root.addView(d, FrameLayout.LayoutParams(size, size).apply { gravity = Gravity.TOP or Gravity.END })
        root.addView(l, FrameLayout.LayoutParams(FrameLayout.LayoutParams.WRAP_CONTENT, FrameLayout.LayoutParams.WRAP_CONTENT).apply { gravity = Gravity.TOP or Gravity.END; topMargin = size + dp(6f).toInt() })
        val lp = WindowManager.LayoutParams(WindowManager.LayoutParams.WRAP_CONTENT, WindowManager.LayoutParams.WRAP_CONTENT, WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS, PixelFormat.TRANSLUCENT)
        lp.gravity = Gravity.TOP or Gravity.END; lp.x = dp(12f).toInt(); lp.y = dp(160f).toInt()
        wm.addView(root, lp)
        bubble = root; dot = d; label = l; bubbleLp = lp
        setState(State.OFFLINE)

        // drag / tap / long-press
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
        val l = label ?: return
        l.text = text; l.visibility = View.VISIBLE
        labelHide?.let { main.removeCallbacks(it) }
        labelHide = Runnable { l.visibility = View.GONE }.also { main.postDelayed(it, ms) }
    }

    @Volatile var pageState = "טוען את הדף…"
    override fun onPage(url: String) { main.post {
        pageState = when {
            url.startsWith("error:") -> "הדף לא נטען: " + url.removePrefix("error:")
            url.contains("/login") || url.contains("auth") -> "צריך להתחבר ל‑claude.ai – לחיצה ארוכה עליי, כבה בועה, התחבר, הפעל שוב"
            url.contains("/artifact/") -> "הדף נטען, מחכה שהוא יתחבר…"
            else -> "נטען: " + url.take(60)
        }
        if (!pageReady) showLabel(pageState, 6000)
        web?.let { LibaWeb.hello(it) }
    } }

    private fun onTap() {
        when {
            listening -> sr?.stopListening()
            tts?.isSpeaking == true -> { tts?.stop(); setState(State.IDLE) }
            !pageReady -> { showLabel(pageState, 6000); web?.let { LibaWeb.hello(it); if (pageState.startsWith("הדף לא")) it.reload() } }
            else -> startListening()
        }
    }

    // ---------- speech in ----------
    private fun startListening() {
        if (listening) return
        if (!SpeechRecognizer.isRecognitionAvailable(this)) { showLabel("אין זיהוי דיבור בטלפון (צריך את אפליקציית Google)", 5000); return }
        tts?.stop()
        if (sr == null) sr = SpeechRecognizer.createSpeechRecognizer(this).also { it.setRecognitionListener(recListener) }
        val i = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
            putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
            putExtra(RecognizerIntent.EXTRA_LANGUAGE, "he-IL"); putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true)
            putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS, 1500L)
        }
        listening = true; setState(State.LISTENING); showLabel("מקשיב…", 15000)
        sr?.startListening(i)
    }
    private val recListener = object : RecognitionListener {
        override fun onReadyForSpeech(p: Bundle?) {}
        override fun onBeginningOfSpeech() {}
        override fun onRmsChanged(v: Float) {}
        override fun onBufferReceived(b: ByteArray?) {}
        override fun onEndOfSpeech() {}
        override fun onPartialResults(p: Bundle?) { p?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)?.firstOrNull()?.let { if (it.isNotBlank()) showLabel(it, 15000) } }
        override fun onEvent(t: Int, p: Bundle?) {}
        override fun onError(e: Int) { listening = false; setState(State.IDLE)
            showLabel(when (e) { SpeechRecognizer.ERROR_NO_MATCH, SpeechRecognizer.ERROR_SPEECH_TIMEOUT -> "לא שמעתי כלום"; SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS -> "אין הרשאת מיקרופון"; SpeechRecognizer.ERROR_NETWORK -> "אין אינטרנט לזיהוי"; else -> "שגיאת מיקרופון ($e)" }, 3000) }
        override fun onResults(r: Bundle?) { listening = false
            val t = r?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)?.firstOrNull()?.trim().orEmpty()
            if (t.isEmpty()) { setState(State.IDLE); showLabel("לא שמעתי כלום", 3000); return }
            setState(State.SENDING); showLabel("→ $t", 6000)
            web?.let { LibaWeb.sendInput(it, t) } }
    }

    // ---------- bridge (from the page) ----------
    override fun onReady() { main.post { if (!pageReady) { pageReady = true; setState(State.IDLE); showLabel("ליבה מחוברת. לחץ עליי ודבר.", 4000) } } }
    override fun onSent(text: String) { main.post { setState(State.IDLE); showLabel("נשלח. מחכה לתשובה…", 30000) } }
    override fun onTap() { main.post { web?.let { LibaWeb.simulateTap(it) } } }
    override fun onError(text: String, reason: String) { main.post { setState(State.IDLE)
        val why = when {
            reason.contains("consent") -> "הדף צריך אישור חד פעמי. לחיצה ארוכה עליי, שלח הודעה אחת מהדף, ואשר."
            reason.contains("no_session") -> "אין סשן של קלוד שמאזין עכשיו."
            reason.contains("writers_only") || reason.contains("forbidden") || reason.contains("not_granted") -> "אין הרשאה לשלוח מהחשבון הזה."
            reason.contains("rate") -> "יותר מדי מהר. חכה רגע."
            reason.contains("gesture") || reason.contains("invalid") -> "השליחה דורשת נגיעה בדף. נסה שוב."
            reason.isBlank() -> ""
            else -> "סיבה: $reason"
        }
        showLabel("לא נשלח" + (if (reason.isNotBlank()) " · $reason" else ""), 8000)
        speak("לא הצלחתי לשלוח. $why") } }
    override fun onSay(text: String, kind: String, options: List<String>) { main.post {
        val ask = options.isNotEmpty() || kind == "stuck" || kind == "call" || kind == "ask"
        val spoken = text + if (options.isNotEmpty()) ". " + options.joinToString(", או ") + "?" else ""
        showLabel(text, 20000)
        if (kind == "call" || kind == "stuck") {
            setState(State.RINGING); ring()
            main.postDelayed({ pendingListenAfterSpeech = ask; speak(spoken) }, 2200)
        } else { pendingListenAfterSpeech = ask; speak(spoken) }
    } }
    private fun ring() {
        try { val tg = ToneGenerator(AudioManager.STREAM_NOTIFICATION, 90); tg.startTone(ToneGenerator.TONE_SUP_RINGTONE, 1800); main.postDelayed({ tg.release() }, 2000) } catch (e: Exception) {}
        val v = getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
        if (Build.VERSION.SDK_INT >= 26) v.vibrate(VibrationEffect.createWaveform(longArrayOf(0, 300, 150, 300, 150, 300), -1)) else @Suppress("DEPRECATION") v.vibrate(1200)
    }

    override fun onDestroy() {
        running = false
        try { sr?.destroy() } catch (e: Exception) {}
        tts?.stop(); tts?.shutdown()
        bubble?.let { runCatching { wm.removeView(it) } }
        webHost?.let { runCatching { wm.removeView(it) } }
        web?.destroy()
        super.onDestroy()
    }
}
