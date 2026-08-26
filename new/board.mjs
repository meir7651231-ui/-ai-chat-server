/** ⚡ לוח-האם (motherboard) — הקובץ היחיד במערכת שמחבר קופסאות (LAW חוק-3).
 *  מייבא אך-ורק מ-boxes/ (המשטרה: board מייבא רק box ⇒ אחרת exit 1). שום חיבור
 *  בין-קופסתי חי מחוצה לו. כאן, ורק כאן, מוזרקים ה-IO והזהות (חוק-6): שעון,
 *  קונפיג-ארגון, מיילי-על — קונפיגורציית-הצבה, לא אטומים.
 *
 *  פרוסת-התורמים המשולבת (donor slice): date-util·config·supporters·empowerment·
 *  dedup·search — שש קופסאות שנפגשות כאן לחוויה-אחת. השעון (date-util) והקונפיג
 *  (config) מחווטים חוצה-קופסאות אל supporters ו-empowerment; dedup/search כלים.
 */
import * as configBox from './boxes/lib-config.mjs';
import * as dateUtil from './boxes/date-util.mjs';
import * as supportersBox from './boxes/supporters.mjs';
import * as empowerment from './boxes/empowerment.mjs';
import * as dedupBox from './boxes/dedup.mjs';
import * as searchBox from './boxes/search.mjs';
import * as familiesBox from './boxes/families.mjs';
import * as diaryBox from './boxes/diary.mjs';
import * as reportsBox from './boxes/reports.mjs';
import * as hebrewBox from './boxes/hebrew.mjs';
import * as waBox from './boxes/wa.mjs';
import * as auditBox from './boxes/audit.mjs';

/** מרכיב את הלוח מהצבה נתונה. placement = חיווט-הצבה (חוק-6):
 *  · config      — קונפיג-הארגון הגולמי (יעבור normalizeConfig של קופסת-config).
 *  · clockIso    — שקע-שעון () => 'YYYY-MM-DD'. חסר ⇒ שעון-המכונה דרך date-util.
 *  · rate        — שער-דולר לחישובי-הקוקפיט (ברירת-מחדל 3.7). */
export function makeBoard(placement = {}) {
  // ── IO/זהות — מוזרקים כאן בלבד (חוק-6) ──
  const config = configBox.normalizeConfig(placement.config ?? {}) ?? { ...configBox.DEFAULT_CONFIG };
  const clockIso = placement.clockIso ?? (() => dateUtil.isoToday());
  const today = () => clockIso();
  // שעון-כ-Date (נגזר משעון-הלוח) — לצרכני-Date (ageOf/holidayOf/runAudit). מקור-אמת יחיד.
  const todayDate = () => new Date(today() + 'T12:00:00');
  const rate = placement.rate ?? 3.7;

  // ── חיווט חוצה-קופסתי: config-box → כל צרכני-המונחים ──
  const term = (key, fb) => configBox.termOf(config, key, fb);
  const feature = (key) => configBox.featureOn(config, key);

  // ── חיווט חוצה-קופסתי: date-util(שעון) + config → supporters-box ──
  const sup = {
    ils: supportersBox.supIls,
    usd: supportersBox.supUsd,
    count: supportersBox.supCount,
    last: supportersBox.supLast,
    tier: supportersBox.supTier,
    // supDonEvents/orgCalEntries מקבלים את הקונפיג של ההצבה (מונחים פר-ארגון)
    donEvents: (sp) => supportersBox.supDonEvents(sp, config),
    orgCalEntries: (sups) => supportersBox.orgCalEntries(sups),
    // hok — השעון של הלוח מוזרק (מקור-אמת יחיד לתאריך-היום)
    hokDue: (sups) => supportersBox.hokDue(sups, today()),
    hokMonthlyTotal: (sups) => supportersBox.hokMonthlyTotal(sups, rate, today()),
  };

  // ── חיווט חוצה-קופסתי: date-util(שעון) → empowerment-box (הקוקפיט) ──
  const cockpit = {
    atRisk: (sups) => empowerment.cockpitAtRisk(sups, today()),
    queue: (sups) => empowerment.cockpitQueue(sups, today(), rate),
    kpis: (sups) => empowerment.cockpitKpis(sups, today(), rate),
    calls: (sups) => empowerment.cockpitCalls(sups, today(), rate),
    thanks: (sups) => empowerment.cockpitThanks(sups, today()),
    feed: (sups, limit) => empowerment.cockpitFeed(sups, limit),
    segments: (sups) => empowerment.segmentCounts(sups, today(), rate),
    donorIntel: (sp) => empowerment.donorIntel(sp, today(), rate),
    csvRows: (queue) => empowerment.cockpitCsvRows(queue),
    workText: (queue) => empowerment.cockpitWorkListText(queue),
  };

  // ── כלים חוצי-מודול (dedup/search) — נחשפים כמות-שהם ──
  const dedup = {
    supporterGroups: (sups) => dedupBox.findSupporterDupGroups(sups),
    familyGroups: (fams) => dedupBox.findDuplicateGroups(fams),
    mergeSupporters: (keeper, losers) => dedupBox.mergeSupportersGroup(keeper, losers),
  };
  const search = (q, items, getTerms, limit) => searchBox.search(q, items, getTerms, limit);

  // ── פרוסת-משפחות: families-box (config→מונחים, שעון→גיל) ──
  const families = {
    tier: (score) => familiesBox.tierOf(score),
    age: (birth) => familiesBox.ageOf(birth, todayDate()),
    live: (db, fam) => familiesBox.famLiveEnrollments(db, fam),
    finderAxes: () => familiesBox.finderAxes(config),
    finderMatches: (db, locks) => familiesBox.finderMatches(db, locks),
  };

  // ── פרוסת-יומן-חדרים: diary-box (config→חדר-inline, שעון→תאריך) ──
  const diary = {
    blockReason: (d) => diaryBox.blockReason(d),
    weeklySessions: (db, roomId, iso) => diaryBox.weeklyRoomSessions(db, roomId, iso),
    slots: (db, room, iso, blocked, cleaningOn = true) => diaryBox.buildSlots(db, room, iso, blocked, config, cleaningOn),
  };

  // ── פרוסת-דוחות: reports-box (טהור; טווחי-תאריך) ──
  const reports = {
    inRange: reportsBox.inRange,
    paidOf: reportsBox.paidOf,
    balanceOf: reportsBox.balanceOf,
    monthKey: reportsBox.monthKey,
    monthLabel: reportsBox.monthLabel,
  };

  // ── פרוסת-לוח-עברי: hebrew-box ──
  const hebrew = {
    dateFull: (iso) => hebrewBox.hebDateFull(iso),
    holiday: (d) => hebrewBox.holidayOf(d),
    today: () => hebrewBox.hebDateFull(today()),
  };

  // ── פרוסת-וואטסאפ: wa-box (config→שם-ארגון) ──
  const wa = {
    link: (phone, text) => waBox.waLink(phone, text),
    delivery: (famName) => waBox.waDeliveryText(config.orgName, famName, config),
  };

  // ── פרוסת-ביקורת: audit-box (config+שעון מוזרקים) ──
  const audit = {
    run: (db, extra = true) => auditBox.runAudit(db, today(), extra, config, todayDate()),
    report: (issues) => auditBox.auditReportLines(config.orgName, issues, dateUtil.isoLocal(todayDate())),
  };

  return { config, today, rate, term, feature, sup, cockpit, dedup, search, families, diary, reports, hebrew, wa, audit };
}
