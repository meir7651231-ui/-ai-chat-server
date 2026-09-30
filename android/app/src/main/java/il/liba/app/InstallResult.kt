package il.liba.app

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.pm.PackageInstaller

/** step verified-install: Android's own answer to the install session - said in words instead of "האפליקציה לא הותקנה" */
class InstallResultReceiver : BroadcastReceiver() {
    override fun onReceive(c: Context, i: Intent) {
        val st = i.getIntExtra(PackageInstaller.EXTRA_STATUS, -999)
        if (st == PackageInstaller.STATUS_PENDING_USER_ACTION) {
            @Suppress("DEPRECATION") val confirm = i.getParcelableExtra<Intent>(Intent.EXTRA_INTENT)
            if (confirm != null) runCatching { c.startActivity(confirm.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)) }.onFailure { Trace.e(Trace.Code.E_INTENT_OPEN, "confirm:" + it.javaClass.simpleName) }
            return
        }
        val why = UpdateTrust.installed(st, i.getStringExtra(PackageInstaller.EXTRA_STATUS_MESSAGE))
        if (why != null) { Trace.e(Trace.Code.E_INSTALL_SIG, "status:" + st); BubbleService.instance?.installSaid("ההתקנה לא הצליחה: $why.") }
    }
}
