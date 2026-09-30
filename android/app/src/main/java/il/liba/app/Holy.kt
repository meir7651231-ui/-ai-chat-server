package il.liba.app

import kotlin.math.*

/**
 * step shabbat-engine: sunset and nightfall offline (NOAA), and the holy windows - every run of Saturdays and yom tov
 * (Israel) from candle lighting the evening before until nightfall of the last day. The same algorithm as the page's
 * zman.js, checked against it (tests/kt) and against a year of published times (tests/zman.test.js). No network.
 */
data class Place(val lat: Double, val lon: Double, val b: Int)
data class HolyWindow(val from: Long, val until: Long, val what: String)

object Holy {
    private fun r(d: Double) = d * PI / 180; private fun g(x: Double) = x * 180 / PI
    /** minutes after UTC midnight when the sun is `angle` degrees below the horizon, going down */
    fun event(y: Int, m: Int, d: Int, lat: Double, lon: Double, angle: Double): Double? {
        var min = 720.0
        repeat(2) {
            val jd = utc(y, m, d) / 864e5 + 2440587.5 + min / 1440; val t = (jd - 2451545) / 36525
            val l0 = ((280.46646 + t * (36000.76983 + t * 0.0003032)) % 360 + 360) % 360
            val mm = 357.52911 + t * (35999.05029 - 0.0001537 * t); val e = 0.016708634 - t * (0.000042037 + 0.0000001267 * t)
            val c = sin(r(mm)) * (1.914602 - t * (0.004817 + 0.000014 * t)) + sin(r(2 * mm)) * (0.019993 - 0.000101 * t) + sin(r(3 * mm)) * 0.000289
            val om = 125.04 - 1934.136 * t; val lam = l0 + c - 0.00569 - 0.00478 * sin(r(om))
            val eps = 23 + (26 + (21.448 - t * (46.815 + t * (0.00059 - t * 0.001813))) / 60) / 60 + 0.00256 * cos(r(om))
            val dec = asin(sin(r(eps)) * sin(r(lam))); val yy = tan(r(eps / 2)).pow(2)
            val eqt = 4 * g(yy * sin(2 * r(l0)) - 2 * e * sin(r(mm)) + 4 * e * yy * sin(r(mm)) * cos(2 * r(l0)) - 0.5 * yy * yy * sin(4 * r(l0)) - 1.25 * e * e * sin(2 * r(mm)))
            val cosH = cos(r(90 + angle)) / (cos(r(lat)) * cos(dec)) - tan(r(lat)) * tan(dec)
            if (cosH < -1 || cosH > 1) return null
            min = 720 - 4 * lon - eqt + 4 * g(acos(cosH))
        }
        return min
    }
    fun utc(y: Int, m: Int, d: Int): Long = java.time.LocalDate.of(y, m, d).toEpochDay() * 86_400_000L
    private fun at(y: Int, m: Int, d: Int, min: Double) = utc(y, m, d) + (min * 60000).roundToLong()
    fun sunset(y: Int, m: Int, d: Int, p: Place) = event(y, m, d, p.lat, p.lon, 0.833)?.let { at(y, m, d, it) }
    fun tzeit(y: Int, m: Int, d: Int, p: Place) = event(y, m, d, p.lat, p.lon, 8.5)?.let { at(y, m, d, it) }

    fun windows(fromMs: Long, toMs: Long, p: Place, moadim: Map<String, String>): List<HolyWindow> {
        val day = 86_400_000L
        fun ymd(t: Long) = java.time.LocalDate.ofEpochDay(Math.floorDiv(t, day))
        fun holy(t: Long) = ymd(t).dayOfWeek == java.time.DayOfWeek.SATURDAY || moadim.containsKey(ymd(t).toString())
        val out = ArrayList<HolyWindow>()
        var d = Math.floorDiv(fromMs, day) * day - day
        while (d <= toMs + day) {
            if (!holy(d) || holy(d - day)) { d += day; continue }
            var e = d; while (holy(e + day)) e += day
            val pd = ymd(d - day); val ld = ymd(e)
            val from = (sunset(pd.year, pd.monthValue, pd.dayOfMonth, p) ?: 0L) - p.b * 60_000L
            val until = tzeit(ld.year, ld.monthValue, ld.dayOfMonth, p) ?: (e + day)
            val names = LinkedHashSet<String>(); var x = d; while (x <= e) { names.add(moadim[ymd(x).toString()] ?: "שבת"); x += day }
            if (until > fromMs && from < toMs) out.add(HolyWindow(from, until, names.joinToString(" ו")))
            d = e + day
        }
        return out
    }
    fun now(now: Long, p: Place, moadim: Map<String, String>): HolyWindow? = windows(now - 3 * 86_400_000L, now + 86_400_000L, p, moadim).firstOrNull { now in it.from until it.until }
}
