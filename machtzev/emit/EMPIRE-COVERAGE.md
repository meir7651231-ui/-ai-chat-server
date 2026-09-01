# 🗺️ מד-שלמות מול האימפריה — יכולות-לוגיקה שנחצבו למדף

## maor
- פונקציות-מקור: **1022** · נחצבו: **626** (61%)
- פערים: 396 — אימפיורי-מתוכנן 242 · **פער-לוגיקה-אמיתי 154**
- כיסוי-לוגיקה-טהורה: **80%** (626/780)

### פערי-לוגיקה אמיתיים (קבצי-lib/pure, ממוין)

- `src/components/home/homeData.ts` (20): courseActiveOn, todaySessions, eventsOnDate, birthdaysOn, homeStats, recentFamilies, digestLines, monthlySeries, monthDonationSum, credSummary, courseOccupancies, weightedMonthlyIncome, courseMetrics, credHistogram, credTodayTrend, credNeedsBoost, dueContacts, punchLow, carouselItems, careCounts
- `src/components/calendar/calLib.ts` (16): fmtD, hpOf, orgBlockError, roomClashError, eventOccursOn, allowItem, dayItems, initialHebMode, buildGregorianGrid, buildHebrewGrid, softClashSuffix, nextOccurIso, icsWindowEvents, quickDate, upcomingItems, upcomingRows
- `src/components/supporters/planned.ts` (9): isOpenPlan, openPlans, pendingIls, pendingUsd, plannedNextDate, overduePlans, nextUpcomingPlan, addMonthsClamped, planCharges
- `src/components/timer/cashLib.ts` (9): changeBreakdown, denomTint, denomLabel, countsTotal, expectedDrawer, drawerDiff, cashSuggestions, filterCashSuggest, payerSuggestions
- `src/components/platform/teamIntel.ts` (8): trendOf, workerIntel, teamIntel, teamSummary, quietWorkers, goalProgress, teamCsvRows, agoLabel
- `src/components/courses/ops.ts` (6): coursesToday, debtors, punchLowList, dropoutRisk, opsKpis, opsTotal
- `src/components/public/portal.ts` (6): portalValid, portalMessage, portalChannels, portalHasChannels, portalChatLine, parsePortalChat
- `src/types/domain.ts` (6): pushDelLog, mergeDelLogs, pushAudit, emptyDb, emptyMember, emptyFamily
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

## buildsmart
- פונקציות-מקור: **791** · נחצבו: **189** (24%)
- פערים: 602 — אימפיורי-מתוכנן 438 · **פער-לוגיקה-אמיתי 164**
- כיסוי-לוגיקה-טהורה: **54%** (189/353)

### פערי-לוגיקה אמיתיים (קבצי-lib/pure, ממוין)

- `lib/data/related_info.dart` (30): catalogProductForSku, catalogProductForSmart, brandIsMetallic, needsConnectionSpec, compatibleProductsCount, compatibleProductsFor, verifiedEndsCountFor, compatibleProductsForEnd, connectionExplainHe, chainEdgeLabelHe, lineStructureText, gapAdviceHe, variantSiblingsCountFor, variantSiblingsOf, complianceWhyHe, priceFor, installToolsFor, installTipsFor, systemSafetyNoteHe, frequentlyPairedTypesFor, connectionWarningHe, pairConnectionWarningHe, deepLinkFor, acceptanceChecklistFor, safetyKitItems, chainArrowText, adapterSuggestionFor, connectionNeedsHe, discoveryTagsFor, smartCardSummaryHe
- `lib/atoms/finder_model.dart` (6): productsForGroup, categoryCounts, groupCount, letterOptions, wallOptions, subsFor
- `lib/data/variant_families.dart` (6): kindOf, allVariantFamilies, sizeStructurePattern, productFrame, productCanonicalKey, genderPattern
- `lib/domain/seeds/plumbing_trade_seed.dart` (6): plumbingTrade, plumbingSystems, plumbingProductSpecs, plumbingCompatRules, plumbingCompletionRules, buildPlumbingSeed
- `lib/theme/config_theme.dart` (6): cfgBrand, cfgSurface, cfgInk, cfgRadius, cfgFontScale, combinedTextScale
- `lib/data/phaseb_seeds.dart` (5): ganttSpan, budgetPct, buildIndexDeltaPct, roiValue, invoiceSplit
- `lib/data/repositories/supplier_onboarding.dart` (5): suggestFacets, validateDraft, draftToProductDoc, resolveBarcodeToSku, draftToInventory
- `lib/logic/workflow_engine.dart` (5): wfFeatureLabel, wfItemLabel, wfUnitLabel, wfRevertPatch, wfNormName
- `lib/config/org_config.dart` (4): decodeOrgConfig, encodeOrgConfig, featureEnabled, elementShown
- `lib/data/company_catalog_import.dart` (4): companyCatalogTemplateCsv, parseCompanyCatalogCsv, encodeCompanyCatalog, decodeCompanyCatalog
- `lib/data/repositories/store_inventory.dart` (4): c1Inventory, seedC1Stores, seedC1Inventory, storeComparison
- `lib/data/catalog_tree.dart` (3): findCatalogNode, allLeaves, categoryPathFor
- `lib/data/repositories/verified_spec_seed.dart` (3): c1SliceSpecs, verifiedSpecFromDoc, seedC1SliceSpecs
- `lib/atoms/home_atoms.dart` (2): atomChipRow, atomChip
- `lib/data/catalog_lens.dart` (2): multiMemberFamilySkus, groupByLens
- `lib/data/company_categories.dart` (2): companyCategorySections, companyDepartments
- `lib/data/company_spec_bridge.dart` (2): companySpecFor, registerCompanySpecs
- `lib/data/contractor_seeds.dart` (2): bestStore, caToday
- `lib/data/csv_kernel.dart` (2): parseCsvRecords, tokenizeCsvAutodetect
- `lib/data/customer_import.dart` (2): customerCatalogTemplateCsv, parseCustomerCsv
- `lib/data/edge/edge_http.dart` (2): makeEdgeHttpSend, makeEdgeHttpRequest
- `lib/data/edge/filtered_mode.dart` (2): applyFilteredModeValue, bootstrapFilteredModeFromUrl
- `lib/data/family_specs.dart` (2): familySpecFor, registerFamilySpecs
- `lib/data/lipskey_catalog.dart` (2): lipskeyConnectionSizes, lipskeyWordIndex
- `lib/data/polyroll_specs.dart` (2): polyrollSpecFor, registerPolyrollSpecs
- `lib/data/product_images.dart` (2): productImageUrl, resolveProductImage
- `lib/data/repositories/recipe_seed.dart` (2): recipeFromDoc, seedAllRecipes
- `lib/data/supplier_data.dart` (2): haulInfo, vehicleCanCarry
- `lib/data/task_skus_local.dart` (2): productsForTask, catalogSiblingsFor
- `lib/logic/studio/action_catalog.dart` (2): actionCatalogIds, matchScreenId
- `lib/logic/studio/edit_intent.dart` (2): dryCountScope, buildScopeEdit
- `lib/config/access_lock.dart` (1): fetchAccessPasswordHash
- `lib/config/org_modules.dart` (1): moduleForScreen
- `lib/config/screen_labels_he.dart` (1): normalizeScreen
- `lib/config/screen_registry.dart` (1): keyboardLayoutKey
- `lib/config/vertical_packs.dart` (1): verticalPackById
- `lib/data/catalog_source.dart` (1): setCompanyCatalog
- `lib/data/edge/edge_kv_stub.dart` (1): makeEdgeKvStore
- `lib/data/menu_trees.dart` (1): projectsTree
- `lib/data/persona_data.dart` (1): tasksForWorker
- `lib/data/repositories/catalog_local.dart` (1): catalogRepo
- `lib/data/repositories/catalog_migration.dart` (1): seedAllVerifiedSpecs
- `lib/data/repositories/catalog_slice.dart` (1): c1SliceProducts
- `lib/data/repositories/finance_local.dart` (1): financeRepo
- `lib/data/repositories/orders_local.dart` (1): debugOrdersScopeField
- `lib/data/repositories/server_rollout.dart` (1): rolloutBucket
- `lib/data/repositories/users_repository.dart` (1): withOwnerApproval
- `lib/data/score_band.dart` (1): scoreBandColors
- `lib/data/smart_tree.dart` (1): smartProductForSku
- `lib/logic/ai_hub_logic.dart` (1): computeAnalyticsInsights
- `lib/logic/category_division.dart` (1): isCatalogDept
- `lib/logic/equipment_stock_join.dart` (1): availabilityFor
- `lib/logic/finance_report_pdf.dart` (1): buildFinanceReportPdf
- `lib/logic/fuzzy_match.dart` (1): fuzzyTolerance
- `lib/logic/studio/component_palette.dart` (1): componentHe
- `lib/logic/studio/config_op.dart` (1): configOpToJson
- `lib/logic/studio/rules_model.dart` (1): matchRuleActionId
- `lib/logic/system_division.dart` (1): filterBySystem
- `lib/test_harness/runner.dart` (1): runRegression
- `lib/test_harness/tests/behavior.dart` (1): testBehavior
- `lib/test_harness/tests/buttons.dart` (1): testButtons
- `lib/test_harness/tests/cart.dart` (1): testCart
- `lib/test_harness/tests/catalog.dart` (1): testCatalog
- `lib/test_harness/tests/dsync.dart` (1): testDsync
- `lib/test_harness/tests/dupes.dart` (1): testDupes
- `lib/test_harness/tests/engine.dart` (1): testEngine
- `lib/test_harness/tests/finder.dart` (1): testFinder
- `lib/test_harness/tests/products.dart` (1): testProducts
- `lib/test_harness/tests/sections.dart` (1): testSections
- `lib/test_harness/tests/settings.dart` (1): testSettings
- `lib/test_harness/tests/tabs.dart` (1): testTabs
- `lib/theme/app_theme.dart` (1): bsSuccess

## yoman
- פונקציות-מקור: **33** · נחצבו: **3** (9%)
- פערים: 30 — אימפיורי-מתוכנן 0 · **פער-לוגיקה-אמיתי 30**
- כיסוי-לוגיקה-טהורה: **9%** (3/33)

### פערי-לוגיקה אמיתיים (קבצי-lib/pure, ממוין)

- `/engine.js` (18): el, paras, srcLine, tag, whyBox, runhead, renderMasthead, renderFront, renderCards, renderBriefs, renderTwoup, renderSupplement, renderOpinion, renderForecast, renderColophon, fail, boot, render
- `/verify.mjs` (12): allContent, bad, makeValidator, check, resolveMaybe, partSchema, walkStrings, collectUrls, partInjection, islandHtml, startServer, partSmoke

