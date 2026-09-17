package il.liba.app

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.provider.Settings
import android.webkit.WebView
import android.widget.Button
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat

class MainActivity : AppCompatActivity() {
    private lateinit var web: WebView
    private lateinit var status: TextView
    private lateinit var toggle: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        web = findViewById(R.id.web); status = findViewById(R.id.status); toggle = findViewById(R.id.toggle)
        LibaWeb.setup(web, null)
        web.loadUrl(getString(R.string.artifact_url))
        toggle.setOnClickListener { onToggle() }
        requestRuntimePermissions()
    }

    override fun onResume() { super.onResume(); refresh() }

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
        status.text = when {
            !micOk() -> "צריך הרשאת מיקרופון"
            !overlayOk() -> "צריך הרשאה להצגה מעל אפליקציות אחרות"
            running -> "הבועה פועלת. אפשר לסגור את המסך הזה."
            else -> "התחבר ל‑claude.ai למעלה (פעם אחת), ואז הפעל את הבועה."
        }
        toggle.text = when {
            !micOk() -> "אשר מיקרופון"
            !overlayOk() -> "אשר הצגה מעל אפליקציות"
            running -> "כבה בועה"
            else -> "הפעל בועה"
        }
    }

    private fun onToggle() {
        when {
            !micOk() -> requestRuntimePermissions()
            !overlayOk() -> startActivity(Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, Uri.parse("package:$packageName")))
            BubbleService.running -> { stopService(Intent(this, BubbleService::class.java)); web.loadUrl(getString(R.string.artifact_url)) }
            else -> {
                web.loadUrl("about:blank") // one page instance only – the service owns the live one
                ContextCompat.startForegroundService(this, Intent(this, BubbleService::class.java))
                web.postDelayed({ refresh(); moveTaskToBack(true) }, 800)
            }
        }
        refresh()
    }

    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<out String>, grantResults: IntArray) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults); refresh()
    }
}
