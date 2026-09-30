package il.liba.app

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.provider.Settings
import android.view.View
import android.webkit.WebView
import android.widget.Button
import android.widget.ScrollView
import android.widget.Switch
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat

private const val LOCKED = "השיחה נעולה. לחץ כאן כדי לפתוח - טביעת אצבע או קוד המסך."

class MainActivity : AppCompatActivity() {
    private lateinit var web: WebView
    private lateinit var status: TextView
    private lateinit var toggle: Button
    private lateinit var update: Button
    private lateinit var logWrap: ScrollView
    private lateinit var logView: TextView
    private val h = Handler(Looper.getMainLooper())
    private val tick = object : Runnable { override fun run() { refresh(); h.postDelayed(this, 2000) } }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        web = findViewById(R.id.web); status = findViewById(R.id.status); toggle = findViewById(R.id.toggle); update = findViewById(R.id.update)
        logWrap = findViewById(R.id.logWrap); logView = findViewById(R.id.log)
        LibaWeb.setup(web, null)
        if (!BubbleService.running) web.loadUrl(getString(R.string.artifact_url))
        toggle.setOnClickListener { onToggle() }
        findViewById<Button>(R.id.reveal).setOnClickListener { val p = problem(); if (p != null) repair(p) else { BubbleService.instance?.revealPage(true); moveTaskToBack(true) } }
        update.setOnClickListener { BubbleService.instance?.installUpdate() ?: Prefs.updateUrl(this)?.let { startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(it))) } }
        val hey = findViewById<Switch>(R.id.hey); val conv = findViewById<Switch>(R.id.conv)
        hey.isChecked = Prefs.hey(this); conv.isChecked = Prefs.conv(this)
        hey.setOnCheckedChangeListener { _, v -> Prefs.setHey(this, v); BubbleService.instance?.applyPrefs() }
        conv.setOnCheckedChangeListener { _, v -> Prefs.setConv(this, v); BubbleService.instance?.applyPrefs() }
        requestRuntimePermissions()
        handleShare(intent); askCal(intent)
    }
    override fun onNewIntent(intent: Intent?) { super.onNewIntent(intent); handleShare(intent); askCal(intent) }
    /** step calendar-sense: Meir said "תקראי את היומן שלי" - Android's own dialog asks him */
    private fun askCal(i: Intent?) { if (i?.getBooleanExtra("askCal", false) == true && !il.liba.app.sense.CalSense.granted(this)) ActivityCompat.requestPermissions(this, arrayOf(android.Manifest.permission.READ_CALENDAR), 7) }
    // step 63: "שתף" → ליבה. Text or link shared from any app becomes a message to the channel.
    private fun handleShare(i: Intent?) {
        if (i?.action != Intent.ACTION_SEND) return
        val t = (i.getStringExtra(Intent.EXTRA_TEXT) ?: "").trim(); val subj = (i.getStringExtra(Intent.EXTRA_SUBJECT) ?: "").trim()
        if (t.isEmpty() && subj.isEmpty()) return
        val msg = "שיתפתי איתך: " + (if (subj.isNotEmpty() && !t.contains(subj)) "$subj – " else "") + t
        val svc = BubbleService.instance
        if (svc != null && BubbleService.running) { svc.sendShared(msg); h.postDelayed({ moveTaskToBack(true) }, 400) }
        else { Prefs.setPendingShare(this, msg); status.text = "השיתוף נשמר – הפעל את הבועה ותגיד 'תטפל בזה'." }
        intent = Intent(this, MainActivity::class.java)
    }

    override fun onResume() { super.onResume(); h.post(tick) }
    // keystore-vault: the conversation on the screen asks for Meir's finger or code; five minutes, and gone when he leaves
    private var unlockedUntil = 0L
    private fun unlocked() = android.os.SystemClock.elapsedRealtime() < unlockedUntil
    override fun onStop() { super.onStop(); unlockedUntil = 0L }
    private fun unlocked5() { unlockedUntil = android.os.SystemClock.elapsedRealtime() + 5 * 60_000L; refresh() }
    private fun unlock() {
        val km = getSystemService(KEYGUARD_SERVICE) as android.app.KeyguardManager
        if (!km.isDeviceSecure) { unlocked5(); return } // a phone with no lock at all: there is nothing to ask with
        if (Build.VERSION.SDK_INT >= 29) {
            val b = android.hardware.biometrics.BiometricPrompt.Builder(this).setTitle("לפתוח את השיחה").setSubtitle("מה שנאמר לליבה נעול")
            if (Build.VERSION.SDK_INT >= 30) b.setAllowedAuthenticators(android.hardware.biometrics.BiometricManager.Authenticators.BIOMETRIC_STRONG or android.hardware.biometrics.BiometricManager.Authenticators.DEVICE_CREDENTIAL)
            else @Suppress("DEPRECATION") b.setDeviceCredentialAllowed(true)
            b.build().authenticate(android.os.CancellationSignal(), mainExecutor, object : android.hardware.biometrics.BiometricPrompt.AuthenticationCallback() {
                override fun onAuthenticationSucceeded(r: android.hardware.biometrics.BiometricPrompt.AuthenticationResult?) { unlocked5() } })
        } else { @Suppress("DEPRECATION") val i = km.createConfirmDeviceCredentialIntent("ליבה", "לפתוח את השיחה"); if (i == null) unlocked5() else @Suppress("DEPRECATION") startActivityForResult(i, 9) }
    }
    override fun onPause() { super.onPause(); h.removeCallbacks(tick) }

    private fun micOk() = ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO) == PackageManager.PERMISSION_GRANTED
    private fun overlayOk() = Settings.canDrawOverlays(this)

    private fun requestRuntimePermissions() {
        val wanted = mutableListOf(Manifest.permission.RECORD_AUDIO)
        if (Build.VERSION.SDK_INT >= 33) wanted += Manifest.permission.POST_NOTIFICATIONS
        val missing = wanted.filter { ContextCompat.checkSelfPermission(this, it) != PackageManager.PERMISSION_GRANTED }
        if (missing.isNotEmpty()) ActivityCompat.requestPermissions(this, missing.toTypedArray(), 1)
    }

    private fun refresh() {
        val running = BubbleService.running
        findViewById<View>(R.id.webWrap).visibility = if (running) View.GONE else View.VISIBLE
        logWrap.visibility = if (running) View.VISIBLE else View.GONE
        if (running) { val t = if (unlocked()) Prefs.logText(this) else LOCKED; if (logView.text.toString() != t) { logView.text = t; logWrap.post { logWrap.fullScroll(View.FOCUS_DOWN) } }
            logView.setOnClickListener { if (!unlocked()) unlock() }
            findViewById<TextView>(R.id.tasks).text = BubbleService.tasksSummary.ifBlank { "אין משימות פתוחות" } }
        findViewById<OrbView>(R.id.orb).set(if (running && BubbleService.pageOk) OrbView.Mode.IDLE else if (running) OrbView.Mode.WAKE else OrbView.Mode.OFFLINE, OrbView.CYAN)
        findViewById<TextView>(R.id.dot).apply { text = if (running && BubbleService.pageOk) "● מחובר" else if (running) "● מתחבר" else "● כבוי"; setTextColor(android.graphics.Color.parseColor(if (running && BubbleService.pageOk) "#5CFFB0" else "#5B6478")) }
        val crash = Prefs.crash(this)
        if (crash != null && !running) { logWrap.visibility = View.VISIBLE; findViewById<View>(R.id.webWrap).visibility = View.GONE; logView.text = if (unlocked()) "קריסה אחרונה (היא נשלחת לליבה כשהבועה עולה; לחיצה ארוכה = למחוק):\n\n" + crash else "האפליקציה קרסה. הפרטים נעולים - לחץ כאן כדי לראות (טביעת אצבע או קוד). הם נשלחים לליבה בכל מקרה."
            logView.setOnClickListener { if (!unlocked()) unlock() }; logView.setOnLongClickListener { if (unlocked()) { Prefs.clearCrash(this); refresh() }; true } } // keystore-vault: no clipboard
        status.text = when {
            crash != null && !running -> "האפליקציה קרסה. הפרטים למעלה. לחץ 'הפעל בועה' כדי לנסות שוב."
            !micOk() -> "צריך הרשאת מיקרופון"
            !overlayOk() -> "צריך הרשאה להצגה מעל אפליקציות אחרות"
            running -> BubbleService.status
            else -> "התחבר ל‑claude.ai למעלה (פעם אחת), ואז הפעל את הבועה."
        }
        // step 97: first-run guide – which of the three steps is next
        val stage = when { running -> 3; micOk() && overlayOk() -> 3; !web.url.isNullOrBlank() && web.url != "about:blank" && (micOk() || overlayOk()) -> 2; else -> 1 }
        listOf(R.id.s1, R.id.s2, R.id.s3).forEachIndexed { i, id -> findViewById<TextView>(id).apply { setTextColor(android.graphics.Color.parseColor(if (i + 1 <= stage) "#7DF9FF" else "#9AA3B8")); setBackgroundResource(if (i + 1 <= stage) R.drawable.chip_step_on else R.drawable.chip_step) } }
        findViewById<View>(R.id.steps).visibility = if (running) View.GONE else View.VISIBLE
        val ver = try { packageManager.getPackageInfo(packageName, 0).versionName } catch (e: Exception) { "?" }
        status.text = "ליבה $ver · " + status.text
        toggle.text = when { !micOk() -> "אשר מיקרופון"; !overlayOk() -> "אשר הצגה מעל אפליקציות"; running -> "כבה בועה"; else -> "הפעל בועה" }
        update.visibility = if (Prefs.updateUrl(this) != null) View.VISIBLE else View.GONE
        val prob = problem()
        findViewById<Button>(R.id.reveal).apply { visibility = if (running || prob != null) View.VISIBLE else View.GONE; text = if (prob != null) "תקן: " + PROBLEM_HE[prob] else "הצג את הדף החי" }
        if (running) status.text = status.text.toString() + "\n" + lineStatus()
    }

    /** health-console: the first thing wrong on the line, in the order that matters - and its one-tap repair.
     *  Three lines of text and one button; not a dashboard. */
    private fun notifOk() = Build.VERSION.SDK_INT < 33 || ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) == PackageManager.PERMISSION_GRANTED
    private fun problem(): String? = when {
        !micOk() -> "mic"; !overlayOk() -> "overlay"; BubbleService.running && BubbleService.needsLogin -> "login"
        BubbleService.running && !BubbleService.pageOk -> "page"; !batteryOk() -> "battery"; !notifOk() -> "notif"; else -> null }
    private val PROBLEM_HE = mapOf("mic" to "המיקרופון", "overlay" to "ההרשאה לבועה", "login" to "ההתחברות ל-claude", "page" to "הדף", "battery" to "הפטור מחיסכון בסוללה", "notif" to "ההתראות")
    private val SILENCE_HE = mapOf("app-killed" to "המערכת סגרה אותי", "turned-off" to "כיבית אותי")
    private fun repair(p: String) { runCatching { when (p) {
        "mic", "notif" -> requestRuntimePermissions()
        "overlay" -> startActivity(Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, Uri.parse("package:$packageName")))
        "login" -> { BubbleService.instance?.revealPage(true); moveTaskToBack(true) }
        "page" -> BubbleService.instance?.repairReload()
        "battery" -> startActivity(Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS, Uri.parse("package:$packageName")))
        else -> Unit
    } }; h.postDelayed({ refresh() }, 800) }
    private fun lineStatus(): String {
        val a = if (!BubbleService.running) "הקו: הבועה כבויה" else if (BubbleService.needsLogin) "הקו: מנותקת מ-claude" else if (BubbleService.pageOk) "הקו: מחוברת" else "הקו: מתחברת לדף…"
        val miss = listOfNotNull(if (!micOk()) "מיקרופון" else null, if (!overlayOk()) "בועה" else null, if (!batteryOk()) "פטור סוללה" else null, if (!notifOk()) "התראות" else null)
        val b = if (miss.isEmpty()) "הרשאות: הכול מאושר" else "חסר: " + miss.joinToString(", ")
        val c = BubbleService.lastSilence.let { if (it.isEmpty()) "שתיקה אחרונה: אין" else "שתיקה אחרונה: " + (SILENCE_HE[it] ?: it) }
        return "$a\n$b\n$c"
    }
    private fun batteryOk() = getSystemService(android.os.PowerManager::class.java)?.isIgnoringBatteryOptimizations(packageName) != false

    private fun onToggle() {
        when {
            !micOk() -> requestRuntimePermissions()
            !overlayOk() -> startActivity(Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, Uri.parse("package:$packageName")))
            /* one-life: without the battery exemption a Samsung kills the service and nothing brings it back for long;
               asked once, never forced - declining still starts the bubble */
            !batteryOk() && !Prefs.batteryAsked(this) -> { Prefs.setBatteryAsked(this, true)
                runCatching { startActivity(Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS, Uri.parse("package:$packageName"))) } }
            BubbleService.running -> { Prefs.setOn(this, false); stopService(Intent(this, BubbleService::class.java)); h.postDelayed({ web.loadUrl(getString(R.string.artifact_url)); refresh() }, 500) }
            else -> {
                web.loadUrl("about:blank")
                ContextCompat.startForegroundService(this, Intent(this, BubbleService::class.java))
                h.postDelayed({ refresh(); moveTaskToBack(true) }, 800)
            }
        }
        refresh()
    }

    @Deprecated("the platform keyguard path, API 26-28") override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        @Suppress("DEPRECATION") super.onActivityResult(requestCode, resultCode, data); if (requestCode == 9 && resultCode == RESULT_OK) unlocked5() }
    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<out String>, grantResults: IntArray) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults); refresh()
        if (requestCode == 7 && il.liba.app.sense.CalSense.granted(this)) il.liba.app.sense.CalSense.start(this)
    }
}
