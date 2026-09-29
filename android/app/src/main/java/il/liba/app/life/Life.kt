package il.liba.app.life

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.SystemClock
import androidx.core.content.ContextCompat
import il.liba.app.BubbleService
import il.liba.app.Prefs
import il.liba.app.Trace

/**
 * step one-life: the one owner of "is ליבה alive". Before it there was no boot receiver at all - after a restart, or
 * after installing an update, the bubble stayed dead until Meir opened the app by hand.
 *  - BOOT_COMPLETED and MY_PACKAGE_REPLACED bring the bubble back, if Meir left it on (Prefs.on).
 *    LOCKED_BOOT_COMPLETED is left out on purpose: before the first unlock the prefs, the WebView and the login
 *    are not readable, so a start there could only fail.
 *  - A revive alarm every ~15 minutes (inexact, so the system batches it) restarts a service the OS killed.
 *    The service starts as specialUse (allowed from these broadcasts) and upgrades to microphone when used.
 */
class LifeReceiver : BroadcastReceiver() {
    override fun onReceive(c: Context, i: Intent) {
        val why = when (i.action) { Intent.ACTION_BOOT_COMPLETED -> "boot"; Intent.ACTION_MY_PACKAGE_REPLACED -> "updated"; Life.REVIVE -> "revive"; else -> return }
        Life.arm(c)
        if (!Prefs.on(c)) return
        if (BubbleService.running) return
        try { ContextCompat.startForegroundService(c, Intent(c, BubbleService::class.java).putExtra("why", why)) }
        catch (e: Exception) { Trace.e(Trace.Code.E_FGS_START, "$why:" + e.javaClass.simpleName) }
    }
}

object Life {
    const val REVIVE = "il.liba.app.REVIVE"
    private const val EVERY = 15 * 60 * 1000L
    /** idempotent: the same PendingIntent replaces the previous alarm */
    fun arm(c: Context) {
        val am = c.getSystemService(AlarmManager::class.java) ?: return
        val pi = PendingIntent.getBroadcast(c, 7, Intent(c, LifeReceiver::class.java).setAction(REVIVE), PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT)
        runCatching { am.setInexactRepeating(AlarmManager.ELAPSED_REALTIME_WAKEUP, SystemClock.elapsedRealtime() + EVERY, EVERY, pi) }
            .onFailure { Trace.e(Trace.Code.E_FGS_START, "arm:" + it.javaClass.simpleName) }
    }
}
