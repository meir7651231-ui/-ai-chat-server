# כיסוי-שקעים (cover · G3) — שחזור טבלת-ATOM הידנית

**top-1: 19/58** (תצוגה 14/28 · לוגיקה 5/30) · **top-3: 28/58** (תצוגה 18/28 · לוגיקה 10/30)

| op | ביד | המנוע (top-1) | top-3 | ✓ |
|---|---|---|---|---|
| magnitude→stat | BareStat | KpiTile | KpiTile · ProgressRing · StatHero | ✗ |
| headline→stat | KpiTile | KpiTile | KpiTile · ProgressRing · StatHero | ✓ |
| hero→stat | stat_hero | StatHero | StatHero · KpiTile · ProgressRing | ✗ |
| ratio→ratio | StatRow | StatRow | StatRow · CreditBar · ProgressStatRow | ✓ |
| compare→bars | NeonBars | DsBars | DsBars · NeonBars · StatBlock | ≈ |
| diff→stat | BareStat | KpiTile | KpiTile · ProgressRing · StatHero | ✗ |
| fact→fact | StatusChip | DsChip | DsChip · DsEmpty · StatusChip | ≈ |
| group→group | DsSection | DsSection | DsSection · SectionHeader · AnimatedEmpty | ✓ |
| identity→identity | MediaRow | DsScaffold | DsScaffold · GlassListTile · HeroHeader | ✗ |
| action→action | SoftButton | DsPrimaryButton | DsPrimaryButton · GlassButton · GradButton | ✗ |
| search→field | DsSearch | DsSearch | DsSearch · DsToggleTile · PremiumToggle | ✓ |
| match→transform | smartFilter | smartScore | smartScore · studentHistoryText · candidateSupportersForCharge | ✗ |
| filter→filter | FilterChipPill | FilterChipPill | FilterChipPill · PresetChip · SeverityChip | ✓ |
| predicate→predicate | finderMatches | matchSegment | matchSegment · lockKey · makeupEligibility | ✗ |
| serialize→transform | toCsv | csvEscape | csvEscape · visibleEventsForDesignations · assistantIntentPrompt | ✗ |
| switch→switch | SegmentedSwitch | SegmentedSwitch | SegmentedSwitch · ForgeCheckPop · ForgePickerOptionsPanelSelection | ✓ |
| role→format | roleOf | canGrantedAction | canGrantedAction · donCalMonthLine · norm | ✗ |
| grant→predicate | canGrantedAction | canGrantedAction | canGrantedAction · kindPlural · docSkey | ✓ |
| alert→alert | AlertBanner | AlertBanner | AlertBanner · ToastCard · DsNote | ✓ |
| expiry→collection | expiringIntakes | isContiguousSubsequence | isContiguousSubsequence · nextClosure · spotlightBox | ✗ |
| capital→measure | warehouseValue | assistantIntentPrompt | assistantIntentPrompt · connectionFailReason · isSizeToken | ✗ |
| table→table | DsTable | DsTable | DsTable · ForgeModalDialog · ForgeSplitControl | ✓ |
| panel→panel | GlassCard | DsCardElevated | DsCardElevated · DsCardGlass · DsCardGradient | ✗ |
| timeline→timeline | TimelineItem | TimelineItem | TimelineItem · ForgeDatePills | ✓ |
| empty→empty | EmptyState | EmptyStateCard | EmptyStateCard · SearchEmptyState · EmptyState | ≈ |
| trend→trend | TrendStat | TrendStat | TrendStat · DsDiffRow · PremiumStat | ✓ |
| ring→stat | ProgressRing | KpiTile | KpiTile · ProgressRing · StatHero | ≈ |
| gauge→stat | GaugeMeter | KpiTile | KpiTile · ProgressRing · StatHero | ✗ |
| bars→bars | DsBars | Sparkline | Sparkline · DonutChart · BarChart | ✗ |
| avatar→identity | AvatarTile | AvatarTile | AvatarTile · GlassListTile · HeroHeader | ✓ |
| expand→expand | ExpandableTile | ExpandableTile | ExpandableTile · FeaturePanel · RegressionBody | ✓ |
| field→field | DsField | SearchField | SearchField · DsSearch · DsToggleTile | ✗ |
| enumfield→field | DsEnumField | SearchField | SearchField · DsSearch · DsToggleTile | ✗ |
| board→board | DsBoard | DsBoard | DsBoard | ✓ |
| primary→action | DsPrimaryButton | DsPrimaryButton | DsPrimaryButton · GlassButton · GradButton | ✓ |
| queue→collection | cockpitQueue | blockReason | blockReason · cockpitHokTasks · isDone | ✗ |
| progress→summary | cockpitProgress | blockReason | blockReason · isDone · donCalMonthLine | ✗ |
| sheet→transform | sheetSummary | sheetSummary | sheetSummary · presentsInMonth · sheetRoster | ✓ |
| makeup→collection | pendingMakeups | makeupEligibility | makeupEligibility · pendingMakeups · presentsInMonth | ≈ |
| balance→measure | payBal | payBal | payBal · balanceOf · payCredit | ✓ |
| paidstatus→format | enrollmentPaidStatus | payBal | payBal · balanceOf · payCredit | ✗ |
| hok→collection | hokDue | hokRecordedThisMonth | hokRecordedThisMonth · cockpitHokTasks · detectRecurringHok | ✗ |
| clash→format | scheduleClashText | minToHM | minToHM · roomInfoLabel · weeklyRoomSessions | ✗ |
| slots→collection | buildSlots | buildSlots | buildSlots · roomInfoLabel · scheduleClashText | ✓ |
| block→format | blockReason | holidayOf | holidayOf · blockReason · auditLine | ≈ |
| holiday→format | holidayOf | holidayOf | holidayOf · blockReason · roomInfoLabel | ✓ |
| weekly→collection | weeklyRoomSessions | roomInfoLabel | roomInfoLabel · weeklyRoomSessions · minToHM | ≈ |
| sessions→collection | sessionsOf | roomInfoLabel | roomInfoLabel · minToHM · buildSlots | ✗ |
| enrol→measure | enrollCount | courseDateError | courseDateError · blockReason · enrollCount | ≈ |
| wait→collection | waitlistFor | courseDateError | courseDateError · roomsNow · blockReason | ✗ |
| byteacher→collection | coursesOfTeacher | assistantIntentPrompt | assistantIntentPrompt · deliveriesOfDay · connectionFailReason | ✗ |
| whoami→format | teacherIdOf | isSuperAdmin | isSuperAdmin · donCalMonthLine · doneTodayFor | ✗ |
| cert→format | certExpiryStatus | ayinAdvanceLabel | ayinAdvanceLabel · ayinActionVisible · assistantIntentPrompt | ✗ |
| contact→format | waLink | formatIsraeliPhone | formatIsraeliPhone · studentHistoryText · fixPhone | ✗ |
| recipients→collection | bulkWaRecipients | offerNewFamily | offerNewFamily · chargeDedupKey · normPhone | ✗ |
| template→format | renderTemplate | assistantIntentPrompt | assistantIntentPrompt · connectionFailReason · isoToday | ✗ |
| parse→collection | parseCsv | advanceStatus | advanceStatus · spanCorrection · reenrollListText | ✗ |
| trendengine→summary | trendFromScan | churnFromScan | churnFromScan · trendFromScan · studentHistoryText | ≈ |
