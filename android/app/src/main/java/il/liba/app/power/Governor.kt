package il.liba.app.power

import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.BatteryManager
import android.os.PowerManager

/** step duty-governor on the device: reads the phone's state, keeps the gear, says when it changed */
object Governor {
    @Volatile var tier = Tier.FULL; private set
    @Volatile private var since = System.currentTimeMillis()
    @Volatile var budgetPct = 0.0
    fun state(c: Context, projPct: Double?): PowerState {
        val bm = c.getSystemService(Context.BATTERY_SERVICE) as BatteryManager; val pm = c.getSystemService(Context.POWER_SERVICE) as PowerManager
        val i = c.registerReceiver(null, IntentFilter(Intent.ACTION_BATTERY_CHANGED)); val st = i?.getIntExtra(BatteryManager.EXTRA_STATUS, -1) ?: -1
        val temp = i?.getIntExtra(BatteryManager.EXTRA_TEMPERATURE, Int.MIN_VALUE)?.takeIf { it != Int.MIN_VALUE }?.let { it / 10.0 }
        return PowerState(projPct, budgetPct, bm.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY), st == BatteryManager.BATTERY_STATUS_CHARGING || st == BatteryManager.BATTERY_STATUS_FULL,
            pm.isInteractive, pm.isDeviceIdleMode, temp)
    }
    /** (from, to, why) when the gear changed, else null */
    fun tick(c: Context, projPct: Double?, now: Long = System.currentTimeMillis()): Triple<Tier, Tier, String>? {
        val s = runCatching { state(c, projPct) }.getOrNull() ?: return null
        val (t, why) = GovernorCore.choose(s, tier, since, now); if (t == tier) return null
        val from = tier; tier = t; since = now; return Triple(from, t, why)
    }
    fun admit(j: Job) = GovernorCore.admit(tier, j)
}
