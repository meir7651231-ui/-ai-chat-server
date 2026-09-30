// step shabbat-engine: the phone's Holy.kt against the page's zman.js, window by window. Run through: node tools/kt-test.mjs
import il.liba.app.*
import java.io.File

fun holyTests(windowsFile: String, moadimFile: String) {
    val mo = Regex("\"(\\d{4}-\\d{2}-\\d{2})\":\"([^\"]+)\"").findAll(File(moadimFile).readText()).associate { it.groupValues[1] to it.groupValues[2] }
    ok(mo.size == 168, "holy: the phone reads the same 168 yom tov days")
    val rows = File(windowsFile).readLines().filter { it.isNotBlank() }.map { it.split('\t') }   // city lat lon b from until what
    var worst = 0L; var n = 0; val miss = ArrayList<String>()
    for ((city, group) in rows.groupBy { it[0] }) {
        val p = Place(group[0][1].toDouble(), group[0][2].toDouble(), group[0][3].toInt())
        val mine = Holy.windows(1798848000000L, 1830124800000L, p, mo)   // 2027-01-02 .. 2027-12-30
        for (r in group) { n++; val w = mine.firstOrNull { kotlin.math.abs(it.from - r[4].toLong()) < 5000 }
            if (w == null || w.what != r[6]) miss.add(city + " " + r[4]) else worst = maxOf(worst, kotlin.math.abs(w.from - r[4].toLong()), kotlin.math.abs(w.until - r[5].toLong())) }
        ok(mine.size == group.size, "holy: $city - the phone finds ${mine.size} windows, the page ${group.size}")
    }
    ok(miss.isEmpty() && worst <= 1000, "holy: $n windows, the phone within ${worst} ms of the page, the same names" + (if (miss.isNotEmpty()) " - missing " + miss.take(3) else ""))
    val sat = 1799496000000L  // 2027-01-09 12:00 UTC, a Saturday
    ok(Holy.now(sat, Place(31.76904, 35.21633, 40), mo)?.what == "שבת" && Holy.now(sat + 3 * 86_400_000L, Place(31.76904, 35.21633, 40), mo) == null, "holy: Saturday noon is inside, Tuesday noon is not")
}
