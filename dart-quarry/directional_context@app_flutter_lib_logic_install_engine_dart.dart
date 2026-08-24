// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _directionalContext — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/install_engine.dart:181-446 (266 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): lineComplianceChecklist, specOf, systemCoherence, completion, toSet, contains, where, lineIsSupply, lineInstallReminders, flowRole, productSystems
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
String _directionalContext(List<LipskeyCatalogProduct> chain, int i) {
  final up = i > 0 ? chain[i - 1].nameHe : null;
  final down = i < chain.length - 1 ? chain[i + 1].nameHe : null;
  if (up != null && down != null) return 'בין "$up" ל-"$down"';
  if (down != null) return 'בכניסת הקו (לפני "$down")';
  if (up != null) return 'ביציאת הקו (אחרי "$up")';
  return 'בקו';
}

/// Detects the safety/durability components a hot line requires and whether the
/// current chain includes them — turning expert review into an automatic gate.
///
/// [trade]: optional s41 authored-trade delegation seam — see [TradeResolution].
List<LineCheck> lineComplianceChecklist(
  List<LipskeyCatalogProduct> chain,
  int tempC,
  Set<String> accessories, {
  TradeResolution? trade,
}) {
  // s41 delegation seam — same R1-2 unconditional runtime guard as
  // connectionMethodLabel: plumbing NEVER enters the resolver. v1 semantics
  // for an AUTHORED trade: its checklist IS its rule violations — completion
  // issues plus a system-coherence breach — returned as unsatisfied checks
  // (no violations → empty checklist). Unknown skus (null spec) are skipped.
  if (trade != null && trade.tradeId != 'plumbing') {
    try {
      final line = <ProductConnectorSpec>[
        for (final p in chain)
          if (trade.specOf(p.sku) case final s?) s,
      ];
      final coherence = trade.resolver.systemCoherence(line);
      final mixedSku = coherence.offendingSku;
      return <LineCheck>[
        for (final issue in trade.resolver.completion(line))
          LineCheck(
            issue.whyHe,
            false,
            issue.whyHe,
            severity: switch (issue.severity) {
              RuleSeverity.critical => CheckSeverity.critical,
              RuleSeverity.warning => CheckSeverity.warning,
              RuleSeverity.info => CheckSeverity.info,
            },
          ),
        if (!coherence.coherent)
          LineCheck(
            'ערבוב מערכות (אספקה/ניקוז)',
            false,
            mixedSku == null
                ? 'הקו מערבב יותר ממערכת אחת'
                : 'הקו מערבב יותר ממערכת אחת — רכיב חורג: $mixedSku',
            severity: CheckSeverity.critical,
          ),
      ];
    } on Object {
      // Kill-switch (plan addition-B): any resolver failure falls through to
      // the legacy plumbing checklist below — silently, by design (no print).
    }
  }

  final skus = chain.map((p) => p.sku).toSet();
  final mats = chain.map(productMaterial).whereType<String>().toSet();
  bool has(Set<String> ok) => skus.any(ok.contains);
  bool acc(String s) => accessories.contains(s);

  final hot    = tempC >= _kHotThresholdC;
  final hasPex = mats.contains('PEX');
  final recirc = skus.contains('HW-PUMP-25') || skus.contains('HW-TEE-RECIRC');
  // Galvanic risk: a copper-group metal joined to an iron-group metal
  // (see _galvanicallyDissimilar) — catches brass↔steel and any↔stainless.
  final dissimilar = _galvanicallyDissimilar(mats);
  // Count BOTH synthetic and real catalog ball valves as shutoffs.
  final isolationCount = chain
      .where((p) =>
          _kIsolationValveSkus.contains(p.sku) ||
          ((p.productType == 'ברז' || p.productType == 'ברז גן') &&
              (p.categoryHe == 'ברזי מעבר' ||
                  p.categoryHe == 'ברזי ניל' ||
                  p.categoryHe == 'ברזי דלי')))
      .length;

  final hasCommercialPump = skus.contains('HW-PUMP-40');
  // Recognise BOTH synthetic hot-water SKUs AND real catalog products by
  // type/category — a "מחלק" (distribution manifold) or shower head from
  // the regular Lipskey catalog also needs TMTV anti-scald in a hot line.
  final hasManifoldOrShower = has({
        'HW-MANIFOLD-3', 'HW-MANIFOLD-4', 'HW-MANIFOLD-6',
        'HW-SHOWER-HEAD',
        'HW-TMTV-32', 'HW-TMTV-25', 'HW-TMTV-20', 'HW-TMTV-15',
      }) ||
      chain.any((p) =>
          p.productType == 'מחלק' ||
          p.productType == 'ראש מקלחת' ||
          p.productType == 'מקלח' ||
          p.categoryHe == 'מחלקים' ||
          p.categoryHe == 'ראשי מקלחת' ||
          p.categoryHe == 'מערכות אמבטיה' ||
          p.categoryHe == 'ערכות רחצה');

  // Supply-side compliance only applies to a pressurised supply line — a
  // gravity drainage line (traps + drain pipe) doesn't take an isolation valve.
  final isSupply = lineIsSupply(chain);
  // A garden tap / hose outlet can back-siphon dirty water into the potable
  // supply; code requires a vacuum-breaker (anti-siphon) device. No such product
  // exists in the catalog yet, so this surfaces the requirement (warning) instead
  // of silently passing — it cannot be auto-satisfied (no SKU to insert).
  final hasGardenOutlet = chain.any((p) => p.categoryHe == 'ברזי גן' || p.categoryHe == 'ציוד גן');

  return [
    if (isSupply)
      LineCheck(
          recirc
              ? 'ברז ניתוק ×3 (כניסת דוד + אחרי משאבה + מניפולד)'
              : 'ברז ניתוק לתחזוקה',
          recirc ? isolationCount >= 3 : isolationCount >= 1,
          'בידוד אזורי לתחזוקה',
          severity: CheckSeverity.critical),
    if (isSupply && hasGardenOutlet)
      LineCheck('שובר-ואקום למניעת זרימה-חוזרת', false,
          'ברז-גן/חיבור-צינור דורש הגנה מפני זרימה-חוזרת למי-שתייה — '
          'אין מק"ט בקטלוג, יש לספק בנפרד',
          severity: CheckSeverity.warning),
    // One check PER directional device: name it + where it sits, so the installer
    // can orient EACH valve for flow. The engine can't reject a backwards mount
    // (a check valve's two ends are modelled identically) — but it pinpoints
    // which valve, and between which two parts, to orient.
    for (var i = 0; i < chain.length; i++)
      if (_isDirectionalDevice(chain[i]))
        LineCheck('כיוון התקנה: ${chain[i].nameHe}', false,
            'שסתום חד-כיווני ${_directionalContext(chain, i)} — '
            'התקן בכיוון-הזרימה (אוריינטציה אינה מאומתת אוטומטית)',
            severity: CheckSeverity.warning),
    if (recirc) ...[
      LineCheck('שסתום אל-חזור', has({'HW-CHECK-15'}),
          'מונע זרימה הפוכה בלולאה', severity: CheckSeverity.critical),
      LineCheck('שסתום מאזן / TRV', has({'HW-BALANCE-15'}),
          'איזון הלולאה', severity: CheckSeverity.critical),
      LineCheck('מפוח אוויר', has({'HW-AIRVENT'}),
          'פליטת אוויר בלולאה', severity: CheckSeverity.warning),
    ],
    if (dissimilar)
      LineCheck('רקורד דיאלקטרי', has({'HW-DIELECTRIC-15'}),
          'הפרדה גלוונית בין מתכות', severity: CheckSeverity.critical),
    if (hasPex)
      LineCheck('מפצה התפשטות PEX', has({'HW-EXP-COMP-20'}),
          'PEX מתרחב בחום', severity: CheckSeverity.warning),
    if (hot)
      LineCheck('שסתום פורק לחץ (PRV)', has({'HW-PRV-34'}),
          'מערכת חמה סגורה', severity: CheckSeverity.critical),
    if (hot)
      LineCheck('כלי התפשטות (Bladder Tank)',
          has({'HW-BTANK-35', 'HW-BTANK-18', 'HW-EXPVESSEL'}),
          'ממברנת EPDM מפרידה N₂ ממים — חובה בכל קו חם סגור',
          severity: CheckSeverity.critical),
    if (hasCommercialPump) ...[
      LineCheck('מסנן Y (הגנת משאבה)',
          has({'HW-YSTR-40', 'HW-YSTR-32', 'HW-YSTR-15'}),
          'מונע חלקיקים מלפגוע במשאבה', severity: CheckSeverity.warning),
      LineCheck('מחבר גמיש (ספיגת רעידות)',
          has({'HW-FLEX-40', 'HW-FLEX-32'}),
          'מבודד רעידות המשאבה מהצנרת', severity: CheckSeverity.warning),
    ],
    if (hasManifoldOrShower)
      LineCheck('ברז ערבוב נגד כוויה (TMTV)',
          has({'HW-TMTV-32', 'HW-TMTV-25', 'HW-TMTV-20', 'HW-TMTV-15'}),
          'מגביל את המים ל-45°C ביציאה כדי למנוע כוויה',
          severity: CheckSeverity.critical),
    if (hasCommercialPump && hasManifoldOrShower)
      LineCheck('שסתום מאזן לכל ענף (Balancing Valve)',
          has({'HW-BALANCE-25', 'HW-BALANCE-20', 'HW-BALANCE-15'}),
          'מאזן לחץ בין ענפים במערכת מסחרית', severity: CheckSeverity.warning),
    if (hasCommercialPump && hot)
      LineCheck('מעקף חום נגד חיידק לגיונלה (EN 806)',
          has({'HW-DISINFECT'}),
          'פסטור 70°C/3 דקות אחת לשבוע', severity: CheckSeverity.critical),
    if (recirc)
      LineCheck('נקודת דגימת מים (לגיונלה)',
          has({'HW-SAMPLE'}),
          'נדרש לבדיקות מים תקתיות', severity: CheckSeverity.warning),
    if (hot)
      LineCheck('בידוד תרמי', acc('HW-INSUL'),
          'הפסדי חום + סכנת כוויות', severity: CheckSeverity.warning),
    LineCheck('חבקים/תמיכת צנרת', acc('HW-CLIP'),
        'קיבוע ושיפוע', severity: CheckSeverity.info),
    LineCheck('איטום מעברים (Press/PTFE/O-ring)', acc('HW-SEALANT'),
        'אטימות כל מעבר', severity: CheckSeverity.info),
  ];
}

/// Site reminders that remain advisory (not auto-trackable line-items).
List<String> lineInstallReminders() => const [
      'שיפוע לקטע אופקי ארוך',
      'נקודת בדיקה/גישה לתחזוקה',
    ];

// ── compatibility logic ───────────────────────────────────────────────────────

// ── plumbing-system classification (engineering logic) ────────────────────────
// A built line must stay within ONE physical system. Supply (pressurised brass/
// copper/PEX) and drainage (gravity HDPE/PVC) only meet *inside* a fixture, so a
// valid path's products must all share at least one common system.

// NOTE: 'אביזרי תבריג' (threaded fittings) is intentionally NOT here — it mixes
// brass supply nipples/bushings with PVC drainage branches, so it is classified
// per-SKU by its actual ends (see productSystems fallback).
const _supplyCats = {
  'אביזרי נחושת', 'מחברי NTM', 'מחברי HDPE', 'ברזי מעבר', 'ברזי ניל',
  'ברזי קיר', 'ברזי כיור', 'ברזי מטבח', 'ברזי גן', 'ברזי אמבטיה', 'ברזי מקלחת',
  'ברזי דלי', 'ציוד גן', 'צינורות מקלחת',
  'זרועות דוש', 'מזלפי יד', 'ראשי מקלחת', 'מחלקים', 'נקודות מים',
  'מכשירי לחץ', 'אביזרי ברזים', 'אביזרי מקלחת', 'מנגנונים',
  'מערכות שטיפה',
};
// NOTE: 'צינורות גמישים' (braided supply hoses + spiral drain hoses) and
// 'אל חזור' (brass supply check valves + sewage backflow valves) are mixed
// categories — classified per-SKU by their ends, like 'אביזרי תבריג'.
//
// 'מחברי HDPE' is SUPPLY — these are HDPE PN16 pressure fittings for
// potable water lines, NOT drainage. The EndType.hdpeCompression enum is
// overloaded for any push-fit socket, so the WaterSystem of a single end is
// now resolved against the parent spec's material in [VerifiedSpec.endSystems]
// (see lipskey_verified_connections.dart).
const _drainCats = {
  'אביזרי שקע-תקע', 'צינורות אפורות', 'צינורות PP', 'ברכיים',
  'מסעפים וחיבורי אסלה', 'זקיף אסלה', 'מחסומים גלויים', 'מחסומי רצפה',
  'מאספי רצפה', 'מאספים וקולטים', 'תעלות ניקוז', 'סיפונים', 'מכסים ורשתות',
  'כיסויים', 'ניקוז גג', 'אביזרי ביוב',
};
const _fixtureCats = {
  'אסלות וכיורים', 'מושבי אסלה', 'אביזרי אסלה', 'מערכות אמבטיה', 'ערכות רחצה',
  'חלקים סניטריים', 'אביזרי חדר רחצה', 'התקנה נמוכה', 'התקנה גבוהה',
  'התקנה צמודה', 'דיורים ופיות',
};
const _structuralCats = {
  'חבקי תליה', 'חבקי צינור', 'עוגנים ובנדים', 'כלי עבודה', 'מצופים',
  'ידיות אחיזה', 'ארונות מחלק',
};

/// TERMINAL devices: a trap, a floor/roof drain, or a draw-off tap each serves a
/// SINGLE fixture. Like a toilet/sink, a terminal may only sit at a line ENDPOINT
/// — never spliced mid-line, and never two-on-one-line (a second trap downstream
/// is a double-trap; two taps in series is two fixtures on one feed — both
/// physically invalid). flowRole() maps these to FlowRole.fixture so the existing
/// "fixtures are endpoint-only" machinery covers them too. They are NOT in
/// _fixtureCats because productSystems() must still pin them to one system
/// (drainage taps→drainage, supply taps→supply), not span both.
/// Shower chain (E8): a HEAD (ראשי מקלחת) and a HAND-SPRAYER (מזלפי יד) are
/// dead-end spray OUTLETS — terminals. But the ARM (זרועות דוש) and the MIXER
/// (ברזי מקלחת) are in-line: the legitimate line is mixer→arm→head, so they stay
/// connectors (otherwise mixer+head = two terminals would block the real chain).
/// Deliberately EXCLUDED (genuinely in-line): ברזי מעבר (ball/stop valves),
/// אל חזור (check valves — directional, handled by the flow-direction model).
const _terminalCats = {
  // drainage terminals (one per fixture; the body is not a through-fitting)
  'סיפונים', 'מחסומים גלויים', 'מחסומי רצפה', 'מאספי רצפה',
  'תעלות ניקוז', 'ניקוז גג', 'מאספים וקולטים',
  // supply draw-off taps + shower spray outlets (terminal — the line ends here)
  'ברזי מטבח', 'ברזי כיור', 'ברזי קיר', 'ברזי אמבטיה', 'ברזי גן', 'ברזי דלי',
  'ראשי מקלחת', 'מזלפי יד',
};

const _allSystems = {WaterSystem.supply, WaterSystem.drainage};

/// The plumbing systems a product belongs to, by engineering logic:
/// clear categories pin one system; fixtures + structural span both; ambiguous
/// categories fall back to the actual connector ends (per-SKU, by context).
