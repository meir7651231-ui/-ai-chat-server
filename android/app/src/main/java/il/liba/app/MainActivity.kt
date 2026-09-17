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
        findViewById<Button>(R.id.reveal).setOnClickListener { BubbleService.instance?.revealPage(true); moveTaskToBack(true) }
        update.setOnClickListener { Prefs.updateUrl(this)?.let { startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(it))) } }
        val hey = findViewById<Switch>(R.id.hey); val conv = findViewById<Switch>(R.id.conv)
        hey.isChecked = Prefs.hey(this); conv.isChecked = Prefs.conv(this)
        hey.setOnCheckedChangeListener { _, v -> Prefs.setHey(this, v); BubbleService.instance?.applyPrefs() }
        conv.setOnCheckedChangeListener { _, v -> Prefs.setConv(this, v); BubbleService.instance?.applyPrefs() }
        requestRuntimePermissions()
    }

    override fun onResume() { super.onResume(); h.post(tick) }
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
        web.visibility = if (running) View.GONE else View.VISIBLE
        logWrap.visibility = if (running) View.VISIBLE else View.GONE
        if (running) { val t = Prefs.logText(this); if (logView.text.toString() != t) { logView.text = t; logWrap.post { logWrap.fullScroll(View.FOCUS_DOWN) } } }
        val crash = Prefs.crash(this)
        if (crash != null && !running) { logWrap.visibility = View.VISIBLE; web.visibility = View.GONE; logView.text = "קריסה אחרונה (לחיצה ארוכה = העתק, ואז שלח לליבה):\n\n" + crash; logView.setOnLongClickListener { (getSystemService(CLIPBOARD_SERVICE) as android.content.ClipboardManager).setPrimaryClip(android.content.ClipData.newPlainText("crash", crash)); Prefs.clearCrash(this); true } }
        status.text = when {
            crash != null && !running -> "האפליקציה קרסה. הפרטים למעלה. לחץ 'הפעל בועה' כדי לנסות שוב."
            !micOk() -> "צריך הרשאת מיקרופון"
            !overlayOk() -> "צריך הרשאה להצגה מעל אפליקציות אחרות"
            running -> BubbleService.status
            else -> "התחבר ל‑claude.ai למעלה (פעם אחת), ואז הפעל את הבועה."
        }
        val ver = try { packageManager.getPackageInfo(packageName, 0).versionName } catch (e: Exception) { "?" }
        status.text = "ליבה $ver · " + status.text
        toggle.text = when { !micOk() -> "אשר מיקרופון"; !overlayOk() -> "אשר הצגה מעל אפליקציות"; running -> "כבה בועה"; else -> "הפעל בועה" }
        update.visibility = if (Prefs.updateUrl(this) != null) View.VISIBLE else View.GONE
        findViewById<Button>(R.id.reveal).visibility = if (running) View.VISIBLE else View.GONE
    }

    private fun onToggle() {
        when {
            !micOk() -> requestRuntimePermissions()
            !overlayOk() -> startActivity(Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, Uri.parse("package:$packageName")))
            BubbleService.running -> { stopService(Intent(this, BubbleService::class.java)); h.postDelayed({ web.loadUrl(getString(R.string.artifact_url)); refresh() }, 500) }
            else -> {
                web.loadUrl("about:blank")
                ContextCompat.startForegroundService(this, Intent(this, BubbleService::class.java))
                h.postDelayed({ refresh(); moveTaskToBack(true) }, 800)
            }
        }
        refresh()
    }

    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<out String>, grantResults: IntArray) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults); refresh()
    }
}
