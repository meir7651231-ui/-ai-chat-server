# 🗺️ מד-שלמות מול האימפריה — יכולות-לוגיקה שנחצבו למדף

## maor
- פונקציות-מקור: **1022** · נחצבו: **620** (61%)
- פערים: 402 — אימפיורי-מתוכנן 247 · **פער-לוגיקה-אמיתי 155**
- כיסוי-לוגיקה-טהורה: **80%** (620/775)

### פערי-לוגיקה אמיתיים (קבצי-lib/pure, ממוין)

- `src/components/home/homeData.ts` (20): courseActiveOn, todaySessions, eventsOnDate, birthdaysOn, homeStats, recentFamilies, digestLines, monthlySeries, monthDonationSum, credSummary, courseOccupancies, weightedMonthlyIncome, courseMetrics, credHistogram, credTodayTrend, credNeedsBoost, dueContacts, punchLow, carouselItems, careCounts
- `src/components/calendar/calLib.ts` (16): fmtD, hpOf, orgBlockError, roomClashError, eventOccursOn, allowItem, dayItems, initialHebMode, buildGregorianGrid, buildHebrewGrid, softClashSuffix, nextOccurIso, icsWindowEvents, quickDate, upcomingItems, upcomingRows
- `src/components/supporters/planned.ts` (9): isOpenPlan, openPlans, pendingIls, pendingUsd, plannedNextDate, overduePlans, nextUpcomingPlan, addMonthsClamped, planCharges
- `src/components/timer/cashLib.ts` (9): changeBreakdown, denomTint, denomLabel, countsTotal, expectedDrawer, drawerDiff, cashSuggestions, filterCashSuggest, payerSuggestions
- `src/components/platform/teamIntel.ts` (8): trendOf, workerIntel, teamIntel, teamSummary, quietWorkers, goalProgress, teamCsvRows, agoLabel
- `src/types/domain.ts` (7): emptyAyin, pushDelLog, mergeDelLogs, pushAudit, emptyDb, emptyMember, emptyFamily
- `src/components/courses/ops.ts` (6): coursesToday, debtors, punchLowList, dropoutRisk, opsKpis, opsTotal
- `src/components/public/portal.ts` (6): portalValid, portalMessage, portalChannels, portalHasChannels, portalChatLine, parsePortalChat
- `src/components/builder/wizardLib.ts` (5): wizardDiff, diffCount, filterFeatureRows, groupFeatures, integrationMatches
- `src/components/courses/teacher.ts` (5): teacherCourses, teacherAgenda, teacherMakeups, teacherKpis, teacherMonthCsvRows
- `src/components/wall/wallData.ts` (5): fmtIls, buildPodium, buildWeek, birthdaysToday, buildWallData
- `src/components/builder/handoff.ts` (4): liveAddons, removedFeatures, buildHandoffHtml, downloadTextFile
- `src/components/courses/collection.ts` (4): collectionList, collectionTotal, collectionCsvRows, collectionMessage
- `src/components/courses/broadcast.ts` (3): classContacts, defaultClassMessage, classPhonesText
- `src/components/supporters/segments.ts` (3): requestSupportersSegment, takeSupportersSegment, atRiskIdSet
- `src/lib/lock.ts` (3): readPinFails, notePinFail, clearPinFails
- `src/components/builder/sections.ts` (2): featureModuleKey, featureEffectiveOn
- `src/components/courses/dashboard.ts` (2): courseDashboard, dashboardCsvRows
- `src/components/courses/parent.ts` (2): parentCard, parentCardText
- `src/components/courses/retention.ts` (2): dropoutInsights, interventionPrompt
- `src/components/home/morningBrief.ts` (2): morningBrief, briefSpeechText
- `src/components/platform/rolePresets.ts` (2): presetModules, presetMatches
- `src/components/supporters/hebTiming.ts` (2): hebSeasonOf, hebTimingTasks
- `src/components/supporters/quietHours.ts` (2): contactWindow, localQuiet
- `src/components/supporters/seasonality.ts` (2): seasonality, donorRhythm
- `src/components/supporters/signals.ts` (2): donorSignals, portfolioSignals
- `src/components/supporters/tierMigration.ts` (2): tierAsOf, tierMigration
- `src/components/supporters/timemachine.ts` (2): churnAtOffset, timeMachine
- `src/components/supporters/universe3d.ts` (2): donorUniverse, project
- `src/lib/ids.ts` (2): makeId, deviceTag
- `src/components/reports/csv.ts` (1): downloadText
- `src/components/settings/helpers.ts` (1): fmtDateTime
- `src/components/supporters/askMaor.ts` (1): askMaor
- `src/components/supporters/intel.ts` (1): shiftIso
- `src/components/supporters/intelExport.ts` (1): intelCsvRows
- `src/components/supporters/pareto.ts` (1): paretoReport
- `src/components/supporters/ranks.ts` (1): donorRanks
- `src/components/supporters/retention.ts` (1): acquisitionCohorts
- `src/components/useArmed.ts` (1): useArmed
- `src/lib/appCheck.ts` (1): initAppCheck
- `src/lib/netcheck.ts` (1): netCheckTargets
- `src/lib/originGuard.ts` (1): runOriginGuard
- `src/lib/search.ts` (1): scoreTerm
- `src/lib/three-scene.ts` (1): mountBrainScene

