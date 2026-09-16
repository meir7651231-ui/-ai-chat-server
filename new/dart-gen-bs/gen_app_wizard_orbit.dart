// ✨ חולל ע"י מנוע-הרינדור (render-ds) — אשף-הבעלים של האפליקציה. אל תערוך ידנית.
// הרכבה מעל אטומי-המדף בלבד (אפס קוד-חדש): wizard-industries · vertical-packs ·
// wizard-steps · empty-wizard · wizard-step-error + שקעיו · switch_row · ds/*.
// חוק-הבעלים: כל ספק ⇒ שתי האפשרויות נבנות ⇒ מתג דלוק כברירת-מחדל.
// "המצאה" = אפשרות שהוצעה לבעלים ואין לה מקור (אפיון או קובץ-אטום). כל מתג נושא
// את מקורו בתווית שלו, והסרגל-החי סופר — 0 המצאות.
import '../dart-data-bs/auto/gen_app_wizard_orbit_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-maor/vertical-packs.dart' as vp;
import '../dart-maor/wizard-industries.dart' as wi;
import '../dart-maor/wizard-steps.dart' as ws;
import '../dart-maor/empty-wizard.dart' as ew;
import '../dart-maor/wizard-step-error.dart' as wse;
import '../dart-data-maor/wizard-step-error-sockets.dart' as wset;
import '../dart-maor/advance-status.dart';
import '../dart-maor/fmt-date.dart';
import '../dart-maor/format-israeli-phone.dart';
import '../dart-maor/gen-join-code.dart';
import '../dart-maor/norm-email.dart';
import '../dart-maor/norm-phone.dart';
import '../dart-maor/normalize-phone.dart';
import '../dart-maor/phone-key.dart';
import '../dart-maor/phone-region.dart';
import '../dart-ui-bs/auto/switch_row.dart';
import '../dart-ui-bs/ds/ds_date_field.dart';
import '../dart-ui-bs/ds/ds_field.dart';
import '../dart-ui-bs/ds/ds_number_field.dart';
import '../dart-ui-bs/ds/ds_toggle_tile.dart';
import '../dart/angle_digits.dart';
import '../dart/f_money.dart';
import '../dart/group_thousands.dart';
import '../dart/namespace_of.dart';
import '../dart/p39_elbow_model.dart';
import '../dart/p53_adapter_model.dart';
import '../dart/p54_adapter_model.dart';
import '../dart/p55_adapter_model.dart';
import '../dart/weather_icon_for.dart';
import 'package:flutter/material.dart';

/// מספר-האפשרויות שאין להן מקור — חייב 0 (נמדד בזמן-החילול, לא מוצהר).
const int _kInventions = 0;
const int _kScreens = 39;
/// מדדי-מתגי-השדות פר-ישות (הסרגל החי סופר מהם).
const List<List<int>> _kFieldOpts = [[442, 443, 444, 445, 446, 447, 448, 449, 450], [451, 452, 453, 454, 455, 456, 457, 458], [459, 460, 461, 462, 463, 464, 465, 466, 467, 468, 469, 470], [471, 472, 473, 474, 475, 476, 477, 478, 479, 480], [481, 482, 483, 484, 485, 486, 487, 488], [489, 490, 491, 492, 493, 494, 495, 496, 497], [498, 499, 500, 501, 502, 503, 504], [505, 506, 507, 508, 509, 510, 511, 512, 513], [514, 515, 516, 517, 518, 519, 520], [521, 522, 523, 524, 525, 526, 527], [528, 529, 530, 531, 532, 533, 534], [535, 536, 537, 538, 539, 540], [541, 542, 543, 544, 545, 546, 547], [548, 549, 550, 551, 552, 553, 554], [555, 556, 557, 558, 559, 560, 561], [562, 563, 564, 565, 566, 567, 568], [569, 570, 571, 572, 573, 574, 575, 576], [577, 578, 579, 580, 581, 582, 583, 584], [585, 586, 587, 588, 589, 590, 591], [592, 593, 594, 595, 596, 597, 598], [599, 600, 601, 602, 603, 604, 605], [606, 607, 608, 609, 610, 611, 612], [613, 614, 615, 616, 617, 618, 619], [620, 621, 622, 623, 624, 625, 626], [627, 628, 629, 630, 631, 632], [633, 634, 635, 636, 637], [638, 639, 640, 641, 642, 643], [644, 645, 646, 647, 648, 649, 650], [651, 652, 653, 654, 655, 656, 657]];

class GenAppWizardOrbitScreen extends StatefulWidget {
  const GenAppWizardOrbitScreen({super.key});

  @override
  State<GenAppWizardOrbitScreen> createState() => _GenAppWizardOrbitScreenState();
}

class _GenAppWizardOrbitScreenState extends State<GenAppWizardOrbitScreen> {
  /// מצב-האפס מהאטום empty-wizard — שדה industry הוא שלב-התחום.
  final Map<String, dynamic> _w = ew.emptyWizard();
  /// כל מתג דלוק כברירת-מחדל: הבעלים מכבה את המיותר, לא מדליק את החסר.
  final List<bool> _on = List<bool>.filled(658, true);
  /// ערכי-ניסיון פר-שדה — מזינים את מנועי-החוקים החיים.
  final Map<int, String> _t = {};
  int _step = 0;

  /// 13 תחומי-העסק מהמדף: wizardIndustries(verticalPacks) — מקור-אמת יחיד.
  static final List<Map<String, dynamic>> _industries = wi.wizardIndustries(vp.verticalPacks);

  /// שקע-ולידציה שאינו נקרא: שלב-החשבון (4) של חוזה-המקור אינו חלק מאשף-זה.
  static dynamic _noSignUp(dynamic a, dynamic b, dynamic c, dynamic d, dynamic e, dynamic f) => null;

  /// ולידציה מהמדף. שלב-התחום = שלב 0 של החוזה (wizard-step-error). כל שלב אחר
  /// נמסר מעל גבול-החוזה (wizardSteps) ⇒ ענף-ברירת-המחדל של האטום מחזיר null —
  /// שלבי-הישויות והשדות הם רשות, כי הכל דלוק מראש.
  String? _err() => wse.wizardStepError(
      _step == 0 ? 0 : ws.wizardSteps, _w, _noSignUp, wset.wizardStepError_T) as String?;

  int get _liveFields => _kFieldOpts.fold(0, (n, g) => n + g.where((i) => _on[i]).length);
  int get _liveEntities => _kFieldOpts.where((g) => g.any((i) => _on[i])).length;

  Widget _live(String label, String out) => Padding(
        padding: const EdgeInsets.only(top: 2, bottom: 6),
        child: Container(
          width: double.infinity,
          padding: const EdgeInsets.all(11),
          decoration: BoxDecoration(color: DsTokens.accentSoft, borderRadius: BorderRadius.circular(DsTokens.rSm)),
          child: Row(children: [
            const Icon(Icons.bolt, size: 15, color: DsTokens.accentDark),
            const SizedBox(width: 7),
            Expanded(child: Text('$label · $out', style: const TextStyle(color: DsTokens.accentDark, fontSize: 13, fontWeight: FontWeight.w700))),
          ]),
        ),
      );

  Widget _bar() => IntrinsicHeight(
        child: Row(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
          Expanded(child: DsStat(label: gen_app_wizard_orbit_c1445, value: _liveEntities.toString(), sub: gen_app_wizard_orbit_c1446, glyph: '🗂️')),
          const SizedBox(width: 12),
          Expanded(child: DsStat(label: gen_app_wizard_orbit_c1447, value: _liveFields.toString(), sub: gen_app_wizard_orbit_c1448, glyph: '🔤')),
          const SizedBox(width: 12),
          Expanded(child: DsStat(label: gen_app_wizard_orbit_c1449, value: '$_kScreens', sub: gen_app_wizard_orbit_c1450, glyph: '🖥️')),
          const SizedBox(width: 12),
          Expanded(child: DsStat(label: gen_app_wizard_orbit_c1451, value: '$_kInventions', sub: gen_app_wizard_orbit_c1452, glyph: '🚫')),
        ]),
      );

  List<Widget> _s0() => [
        if (_err() != null) DsEmpty(label: _err()!),
        if ((_w['industry'] as String).isNotEmpty) DsChip(label: _w['industry'] as String, tone: 1),
        for (final p in _industries)
          DsNavTile(
            glyph: p['emoji'] as String,
            title: p['label'] as String,
            sub: p['sub'] as String,
            onTap: () => setState(() => _w['industry'] = p['id']),
          ),
      ];
  List<Widget> _s1() => [
        DsSection(title: gen_app_wizard_orbit_c5, children: [
          SwitchRow(label: gen_app_wizard_orbit_c1, value: _on[0], onChanged: (v) => setState(() => _on[0] = v)),
          if (_on[0]) DsField(label: gen_app_wizard_orbit_c2, hint: '', value: _t[0] ?? '', onChanged: (v) => setState(() => _t[0] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c3, value: _on[1], onChanged: (v) => setState(() => _on[1] = v)),
          if (_on[1] && (_t[0] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c4, namespaceOf((_t[0] ?? ''))),
        ]),
        DsSection(title: gen_app_wizard_orbit_c8, children: [
          SwitchRow(label: gen_app_wizard_orbit_c6, value: _on[2], onChanged: (v) => setState(() => _on[2] = v)),
          if (_on[2]) DsField(label: gen_app_wizard_orbit_c7, hint: '', value: _t[1] ?? '', onChanged: (v) => setState(() => _t[1] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c21, children: [
          SwitchRow(label: gen_app_wizard_orbit_c9, value: _on[3], onChanged: (v) => setState(() => _on[3] = v)),
          if (_on[3]) DsField(label: gen_app_wizard_orbit_c10, hint: '', value: _t[2] ?? '', onChanged: (v) => setState(() => _t[2] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c11, value: _on[4], onChanged: (v) => setState(() => _on[4] = v)),
          if (_on[4] && (_t[2] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c12, formatIsraeliPhone((_t[2] ?? ''))),
          SwitchRow(label: gen_app_wizard_orbit_c13, value: _on[5], onChanged: (v) => setState(() => _on[5] = v)),
          if (_on[5] && (_t[2] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c14, normalizePhone((_t[2] ?? ''))),
          SwitchRow(label: gen_app_wizard_orbit_c15, value: _on[6], onChanged: (v) => setState(() => _on[6] = v)),
          if (_on[6] && (_t[2] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c16, normPhone((_t[2] ?? ''))),
          SwitchRow(label: gen_app_wizard_orbit_c17, value: _on[7], onChanged: (v) => setState(() => _on[7] = v)),
          if (_on[7] && (_t[2] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c18, phoneKey((_t[2] ?? ''))),
          SwitchRow(label: gen_app_wizard_orbit_c19, value: _on[8], onChanged: (v) => setState(() => _on[8] = v)),
          if (_on[8] && (_t[2] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c20, phoneRegion((_t[2] ?? ''))),
        ]),
        DsSection(title: gen_app_wizard_orbit_c26, children: [
          SwitchRow(label: gen_app_wizard_orbit_c22, value: _on[9], onChanged: (v) => setState(() => _on[9] = v)),
          if (_on[9]) DsField(label: gen_app_wizard_orbit_c23, hint: '', value: _t[3] ?? '', onChanged: (v) => setState(() => _t[3] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c24, value: _on[10], onChanged: (v) => setState(() => _on[10] = v)),
          if (_on[10] && (_t[3] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c25, normEmail((_t[3] ?? ''))),
        ]),
        DsSection(title: gen_app_wizard_orbit_c29, children: [
          SwitchRow(label: gen_app_wizard_orbit_c27, value: _on[11], onChanged: (v) => setState(() => _on[11] = v)),
          if (_on[11]) DsField(label: gen_app_wizard_orbit_c28, hint: '', value: _t[4] ?? '', onChanged: (v) => setState(() => _t[4] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c32, children: [
          SwitchRow(label: gen_app_wizard_orbit_c30, value: _on[12], onChanged: (v) => setState(() => _on[12] = v)),
          if (_on[12]) DsField(label: gen_app_wizard_orbit_c31, hint: '', value: _t[5] ?? '', onChanged: (v) => setState(() => _t[5] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c37, children: [
          SwitchRow(label: gen_app_wizard_orbit_c33, value: _on[13], onChanged: (v) => setState(() => _on[13] = v)),
          if (_on[13]) DsNumberField(label: gen_app_wizard_orbit_c34),
          SwitchRow(label: gen_app_wizard_orbit_c35, value: _on[14], onChanged: (v) => setState(() => _on[14] = v)),
          if (_on[14]) DsField(label: gen_app_wizard_orbit_c36, hint: '', value: _t[6] ?? '', onChanged: (v) => setState(() => _t[6] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c40, children: [
          SwitchRow(label: gen_app_wizard_orbit_c38, value: _on[15], onChanged: (v) => setState(() => _on[15] = v)),
          if (_on[15]) DsField(label: gen_app_wizard_orbit_c39, hint: '', value: _t[7] ?? '', onChanged: (v) => setState(() => _t[7] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c47, children: [
          SwitchRow(label: gen_app_wizard_orbit_c41, value: _on[16], onChanged: (v) => setState(() => _on[16] = v)),
          if (_on[16]) DsToggleTile(label: gen_app_wizard_orbit_c42),
          SwitchRow(label: gen_app_wizard_orbit_c43, value: _on[17], onChanged: (v) => setState(() => _on[17] = v)),
          if (_on[17]) DsField(label: gen_app_wizard_orbit_c44, hint: '', value: _t[8] ?? '', onChanged: (v) => setState(() => _t[8] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c45, value: _on[18], onChanged: (v) => setState(() => _on[18] = v)),
          if (_on[18] && (_t[8] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c46, advanceStatus((_t[8] ?? ''))),
        ]),
        SwitchRow(label: gen_app_wizard_orbit_c48, value: _on[19], onChanged: (v) => setState(() => _on[19] = v)),
        if (_on[19]) DsWorkflow(steps: const [gen_app_wizard_orbit_c49, gen_app_wizard_orbit_c50, gen_app_wizard_orbit_c51, gen_app_wizard_orbit_c52, gen_app_wizard_orbit_c53, gen_app_wizard_orbit_c54, gen_app_wizard_orbit_c55], current: 0),
      ];
  List<Widget> _s2() => [
        DsSection(title: gen_app_wizard_orbit_c61, children: [
          SwitchRow(label: gen_app_wizard_orbit_c57, value: _on[20], onChanged: (v) => setState(() => _on[20] = v)),
          if (_on[20]) DsField(label: gen_app_wizard_orbit_c58, hint: '', value: _t[9] ?? '', onChanged: (v) => setState(() => _t[9] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c59, value: _on[21], onChanged: (v) => setState(() => _on[21] = v)),
          if (_on[21] && (_t[9] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c60, namespaceOf((_t[9] ?? ''))),
        ]),
        DsSection(title: gen_app_wizard_orbit_c64, children: [
          SwitchRow(label: gen_app_wizard_orbit_c62, value: _on[22], onChanged: (v) => setState(() => _on[22] = v)),
          if (_on[22]) DsField(label: gen_app_wizard_orbit_c63, hint: '', value: _t[10] ?? '', onChanged: (v) => setState(() => _t[10] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c75, children: [
          SwitchRow(label: gen_app_wizard_orbit_c65, value: _on[23], onChanged: (v) => setState(() => _on[23] = v)),
          if (_on[23]) DsNumberField(label: gen_app_wizard_orbit_c66),
          SwitchRow(label: gen_app_wizard_orbit_c67, value: _on[24], onChanged: (v) => setState(() => _on[24] = v)),
          if (_on[24]) DsField(label: gen_app_wizard_orbit_c68, hint: '', value: _t[11] ?? '', onChanged: (v) => setState(() => _t[11] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c69, value: _on[25], onChanged: (v) => setState(() => _on[25] = v)),
          if (_on[25] && (_t[11] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c70, groupThousands((int.tryParse(_t[11] ?? '') ?? 0))),
          SwitchRow(label: gen_app_wizard_orbit_c71, value: _on[26], onChanged: (v) => setState(() => _on[26] = v)),
          if (_on[26] && (_t[11] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c72, phoneKey((_t[11] ?? ''))),
          SwitchRow(label: gen_app_wizard_orbit_c73, value: _on[27], onChanged: (v) => setState(() => _on[27] = v)),
          if (_on[27] && (_t[11] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c74, phoneRegion((_t[11] ?? ''))),
        ]),
        DsSection(title: gen_app_wizard_orbit_c78, children: [
          SwitchRow(label: gen_app_wizard_orbit_c76, value: _on[28], onChanged: (v) => setState(() => _on[28] = v)),
          if (_on[28]) DsField(label: gen_app_wizard_orbit_c77, hint: '', value: _t[12] ?? '', onChanged: (v) => setState(() => _t[12] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c91, children: [
          SwitchRow(label: gen_app_wizard_orbit_c79, value: _on[29], onChanged: (v) => setState(() => _on[29] = v)),
          if (_on[29]) DsField(label: gen_app_wizard_orbit_c80, hint: '', value: _t[13] ?? '', onChanged: (v) => setState(() => _t[13] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c81, value: _on[30], onChanged: (v) => setState(() => _on[30] = v)),
          if (_on[30] && (_t[13] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c82, formatIsraeliPhone((_t[13] ?? ''))),
          SwitchRow(label: gen_app_wizard_orbit_c83, value: _on[31], onChanged: (v) => setState(() => _on[31] = v)),
          if (_on[31] && (_t[13] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c84, normalizePhone((_t[13] ?? ''))),
          SwitchRow(label: gen_app_wizard_orbit_c85, value: _on[32], onChanged: (v) => setState(() => _on[32] = v)),
          if (_on[32] && (_t[13] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c86, normPhone((_t[13] ?? ''))),
          SwitchRow(label: gen_app_wizard_orbit_c87, value: _on[33], onChanged: (v) => setState(() => _on[33] = v)),
          if (_on[33] && (_t[13] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c88, phoneKey((_t[13] ?? ''))),
          SwitchRow(label: gen_app_wizard_orbit_c89, value: _on[34], onChanged: (v) => setState(() => _on[34] = v)),
          if (_on[34] && (_t[13] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c90, phoneRegion((_t[13] ?? ''))),
        ]),
        DsSection(title: gen_app_wizard_orbit_c96, children: [
          SwitchRow(label: gen_app_wizard_orbit_c92, value: _on[35], onChanged: (v) => setState(() => _on[35] = v)),
          if (_on[35]) DsField(label: gen_app_wizard_orbit_c93, hint: '', value: _t[14] ?? '', onChanged: (v) => setState(() => _t[14] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c94, value: _on[36], onChanged: (v) => setState(() => _on[36] = v)),
          if (_on[36] && (_t[14] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c95, normEmail((_t[14] ?? ''))),
        ]),
        DsSection(title: gen_app_wizard_orbit_c99, children: [
          SwitchRow(label: gen_app_wizard_orbit_c97, value: _on[37], onChanged: (v) => setState(() => _on[37] = v)),
          if (_on[37]) DsField(label: gen_app_wizard_orbit_c98, hint: '', value: _t[15] ?? '', onChanged: (v) => setState(() => _t[15] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c102, children: [
          SwitchRow(label: gen_app_wizard_orbit_c100, value: _on[38], onChanged: (v) => setState(() => _on[38] = v)),
          if (_on[38]) DsField(label: gen_app_wizard_orbit_c101, hint: '', value: _t[16] ?? '', onChanged: (v) => setState(() => _t[16] = v)),
        ]),
      ];
  List<Widget> _s3() => [
        DsSection(title: gen_app_wizard_orbit_c114, children: [
          SwitchRow(label: gen_app_wizard_orbit_c104, value: _on[39], onChanged: (v) => setState(() => _on[39] = v)),
          if (_on[39]) DsNumberField(label: gen_app_wizard_orbit_c105),
          SwitchRow(label: gen_app_wizard_orbit_c106, value: _on[40], onChanged: (v) => setState(() => _on[40] = v)),
          if (_on[40]) DsField(label: gen_app_wizard_orbit_c107, hint: '', value: _t[17] ?? '', onChanged: (v) => setState(() => _t[17] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c108, value: _on[41], onChanged: (v) => setState(() => _on[41] = v)),
          if (_on[41] && (_t[17] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c109, groupThousands((int.tryParse(_t[17] ?? '') ?? 0))),
          SwitchRow(label: gen_app_wizard_orbit_c110, value: _on[42], onChanged: (v) => setState(() => _on[42] = v)),
          if (_on[42] && (_t[17] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c111, phoneKey((_t[17] ?? ''))),
          SwitchRow(label: gen_app_wizard_orbit_c112, value: _on[43], onChanged: (v) => setState(() => _on[43] = v)),
          if (_on[43] && (_t[17] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c113, phoneRegion((_t[17] ?? ''))),
        ]),
        DsSection(title: gen_app_wizard_orbit_c119, children: [
          SwitchRow(label: gen_app_wizard_orbit_c115, value: _on[44], onChanged: (v) => setState(() => _on[44] = v)),
          if (_on[44]) DsField(label: gen_app_wizard_orbit_c116, hint: '', value: _t[18] ?? '', onChanged: (v) => setState(() => _t[18] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c117, value: _on[45], onChanged: (v) => setState(() => _on[45] = v)),
          if (_on[45] && (_t[18] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c118, namespaceOf((_t[18] ?? ''))),
        ]),
        DsSection(title: gen_app_wizard_orbit_c122, children: [
          SwitchRow(label: gen_app_wizard_orbit_c120, value: _on[46], onChanged: (v) => setState(() => _on[46] = v)),
          if (_on[46]) DsField(label: gen_app_wizard_orbit_c121, hint: '', value: _t[19] ?? '', onChanged: (v) => setState(() => _t[19] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c125, children: [
          SwitchRow(label: gen_app_wizard_orbit_c123, value: _on[47], onChanged: (v) => setState(() => _on[47] = v)),
          if (_on[47]) DsField(label: gen_app_wizard_orbit_c124, hint: '', value: _t[20] ?? '', onChanged: (v) => setState(() => _t[20] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c128, children: [
          SwitchRow(label: gen_app_wizard_orbit_c126, value: _on[48], onChanged: (v) => setState(() => _on[48] = v)),
          if (_on[48]) DsField(label: gen_app_wizard_orbit_c127, hint: '', value: _t[21] ?? '', onChanged: (v) => setState(() => _t[21] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c133, children: [
          SwitchRow(label: gen_app_wizard_orbit_c129, value: _on[49], onChanged: (v) => setState(() => _on[49] = v)),
          if (_on[49]) DsNumberField(label: gen_app_wizard_orbit_c130),
          SwitchRow(label: gen_app_wizard_orbit_c131, value: _on[50], onChanged: (v) => setState(() => _on[50] = v)),
          if (_on[50]) DsField(label: gen_app_wizard_orbit_c132, hint: '', value: _t[22] ?? '', onChanged: (v) => setState(() => _t[22] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c136, children: [
          SwitchRow(label: gen_app_wizard_orbit_c134, value: _on[51], onChanged: (v) => setState(() => _on[51] = v)),
          if (_on[51]) DsField(label: gen_app_wizard_orbit_c135, hint: '', value: _t[23] ?? '', onChanged: (v) => setState(() => _t[23] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c151, children: [
          SwitchRow(label: gen_app_wizard_orbit_c137, value: _on[52], onChanged: (v) => setState(() => _on[52] = v)),
          if (_on[52]) DsNumberField(label: gen_app_wizard_orbit_c138),
          SwitchRow(label: gen_app_wizard_orbit_c139, value: _on[53], onChanged: (v) => setState(() => _on[53] = v)),
          if (_on[53]) DsField(label: gen_app_wizard_orbit_c140, hint: '', value: _t[24] ?? '', onChanged: (v) => setState(() => _t[24] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c141, value: _on[54], onChanged: (v) => setState(() => _on[54] = v)),
          if (_on[54] && (_t[24] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c142, angleDigits((_t[24] ?? ''))),
          SwitchRow(label: gen_app_wizard_orbit_c143, value: _on[55], onChanged: (v) => setState(() => _on[55] = v)),
          if (_on[55] && (_t[24] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c144, p39ElbowModel((_t[24] ?? ''))),
          SwitchRow(label: gen_app_wizard_orbit_c145, value: _on[56], onChanged: (v) => setState(() => _on[56] = v)),
          if (_on[56] && (_t[24] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c146, p53AdapterModel((_t[24] ?? ''))),
          SwitchRow(label: gen_app_wizard_orbit_c147, value: _on[57], onChanged: (v) => setState(() => _on[57] = v)),
          if (_on[57] && (_t[24] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c148, p54AdapterModel((_t[24] ?? ''))),
          SwitchRow(label: gen_app_wizard_orbit_c149, value: _on[58], onChanged: (v) => setState(() => _on[58] = v)),
          if (_on[58] && (_t[24] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c150, p55AdapterModel((_t[24] ?? ''))),
        ]),
        DsSection(title: gen_app_wizard_orbit_c156, children: [
          SwitchRow(label: gen_app_wizard_orbit_c152, value: _on[59], onChanged: (v) => setState(() => _on[59] = v)),
          if (_on[59]) DsNumberField(label: gen_app_wizard_orbit_c153),
          SwitchRow(label: gen_app_wizard_orbit_c154, value: _on[60], onChanged: (v) => setState(() => _on[60] = v)),
          if (_on[60]) DsField(label: gen_app_wizard_orbit_c155, hint: '', value: _t[25] ?? '', onChanged: (v) => setState(() => _t[25] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c163, children: [
          SwitchRow(label: gen_app_wizard_orbit_c157, value: _on[61], onChanged: (v) => setState(() => _on[61] = v)),
          if (_on[61]) DsDateField(label: gen_app_wizard_orbit_c158),
          SwitchRow(label: gen_app_wizard_orbit_c159, value: _on[62], onChanged: (v) => setState(() => _on[62] = v)),
          if (_on[62]) DsField(label: gen_app_wizard_orbit_c160, hint: '', value: _t[26] ?? '', onChanged: (v) => setState(() => _t[26] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c161, value: _on[63], onChanged: (v) => setState(() => _on[63] = v)),
          if (_on[63] && (_t[26] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c162, fmtDate((_t[26] ?? ''))),
        ]),
        DsSection(title: gen_app_wizard_orbit_c170, children: [
          SwitchRow(label: gen_app_wizard_orbit_c164, value: _on[64], onChanged: (v) => setState(() => _on[64] = v)),
          if (_on[64]) DsDateField(label: gen_app_wizard_orbit_c165),
          SwitchRow(label: gen_app_wizard_orbit_c166, value: _on[65], onChanged: (v) => setState(() => _on[65] = v)),
          if (_on[65]) DsField(label: gen_app_wizard_orbit_c167, hint: '', value: _t[27] ?? '', onChanged: (v) => setState(() => _t[27] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c168, value: _on[66], onChanged: (v) => setState(() => _on[66] = v)),
          if (_on[66] && (_t[27] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c169, fmtDate((_t[27] ?? ''))),
        ]),
        DsSection(title: gen_app_wizard_orbit_c177, children: [
          SwitchRow(label: gen_app_wizard_orbit_c171, value: _on[67], onChanged: (v) => setState(() => _on[67] = v)),
          if (_on[67]) DsToggleTile(label: gen_app_wizard_orbit_c172),
          SwitchRow(label: gen_app_wizard_orbit_c173, value: _on[68], onChanged: (v) => setState(() => _on[68] = v)),
          if (_on[68]) DsField(label: gen_app_wizard_orbit_c174, hint: '', value: _t[28] ?? '', onChanged: (v) => setState(() => _t[28] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c175, value: _on[69], onChanged: (v) => setState(() => _on[69] = v)),
          if (_on[69] && (_t[28] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c176, advanceStatus((_t[28] ?? ''))),
        ]),
        SwitchRow(label: gen_app_wizard_orbit_c178, value: _on[70], onChanged: (v) => setState(() => _on[70] = v)),
        if (_on[70]) DsWorkflow(steps: const [gen_app_wizard_orbit_c179, gen_app_wizard_orbit_c180, gen_app_wizard_orbit_c181, gen_app_wizard_orbit_c182, gen_app_wizard_orbit_c183, gen_app_wizard_orbit_c184], current: 0),
      ];
  List<Widget> _s4() => [
        DsSection(title: gen_app_wizard_orbit_c190, children: [
          SwitchRow(label: gen_app_wizard_orbit_c186, value: _on[71], onChanged: (v) => setState(() => _on[71] = v)),
          if (_on[71]) DsField(label: gen_app_wizard_orbit_c187, hint: '', value: _t[29] ?? '', onChanged: (v) => setState(() => _t[29] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c188, value: _on[72], onChanged: (v) => setState(() => _on[72] = v)),
          if (_on[72] && (_t[29] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c189, genJoinCode((_t[29] ?? ''))),
        ]),
        DsSection(title: gen_app_wizard_orbit_c195, children: [
          SwitchRow(label: gen_app_wizard_orbit_c191, value: _on[73], onChanged: (v) => setState(() => _on[73] = v)),
          if (_on[73]) DsField(label: gen_app_wizard_orbit_c192, hint: '', value: _t[30] ?? '', onChanged: (v) => setState(() => _t[30] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c193, value: _on[74], onChanged: (v) => setState(() => _on[74] = v)),
          if (_on[74] && (_t[30] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c194, namespaceOf((_t[30] ?? ''))),
        ]),
        DsSection(title: gen_app_wizard_orbit_c198, children: [
          SwitchRow(label: gen_app_wizard_orbit_c196, value: _on[75], onChanged: (v) => setState(() => _on[75] = v)),
          if (_on[75]) DsField(label: gen_app_wizard_orbit_c197, hint: '', value: _t[31] ?? '', onChanged: (v) => setState(() => _t[31] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c201, children: [
          SwitchRow(label: gen_app_wizard_orbit_c199, value: _on[76], onChanged: (v) => setState(() => _on[76] = v)),
          if (_on[76]) DsField(label: gen_app_wizard_orbit_c200, hint: '', value: _t[32] ?? '', onChanged: (v) => setState(() => _t[32] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c208, children: [
          SwitchRow(label: gen_app_wizard_orbit_c202, value: _on[77], onChanged: (v) => setState(() => _on[77] = v)),
          if (_on[77]) DsDateField(label: gen_app_wizard_orbit_c203),
          SwitchRow(label: gen_app_wizard_orbit_c204, value: _on[78], onChanged: (v) => setState(() => _on[78] = v)),
          if (_on[78]) DsField(label: gen_app_wizard_orbit_c205, hint: '', value: _t[33] ?? '', onChanged: (v) => setState(() => _t[33] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c206, value: _on[79], onChanged: (v) => setState(() => _on[79] = v)),
          if (_on[79] && (_t[33] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c207, fmtDate((_t[33] ?? ''))),
        ]),
        DsSection(title: gen_app_wizard_orbit_c215, children: [
          SwitchRow(label: gen_app_wizard_orbit_c209, value: _on[80], onChanged: (v) => setState(() => _on[80] = v)),
          if (_on[80]) DsDateField(label: gen_app_wizard_orbit_c210),
          SwitchRow(label: gen_app_wizard_orbit_c211, value: _on[81], onChanged: (v) => setState(() => _on[81] = v)),
          if (_on[81]) DsField(label: gen_app_wizard_orbit_c212, hint: '', value: _t[34] ?? '', onChanged: (v) => setState(() => _t[34] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c213, value: _on[82], onChanged: (v) => setState(() => _on[82] = v)),
          if (_on[82] && (_t[34] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c214, fmtDate((_t[34] ?? ''))),
        ]),
        DsSection(title: gen_app_wizard_orbit_c220, children: [
          SwitchRow(label: gen_app_wizard_orbit_c216, value: _on[83], onChanged: (v) => setState(() => _on[83] = v)),
          if (_on[83]) DsNumberField(label: gen_app_wizard_orbit_c217),
          SwitchRow(label: gen_app_wizard_orbit_c218, value: _on[84], onChanged: (v) => setState(() => _on[84] = v)),
          if (_on[84]) DsField(label: gen_app_wizard_orbit_c219, hint: '', value: _t[35] ?? '', onChanged: (v) => setState(() => _t[35] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c225, children: [
          SwitchRow(label: gen_app_wizard_orbit_c221, value: _on[85], onChanged: (v) => setState(() => _on[85] = v)),
          if (_on[85]) DsNumberField(label: gen_app_wizard_orbit_c222),
          SwitchRow(label: gen_app_wizard_orbit_c223, value: _on[86], onChanged: (v) => setState(() => _on[86] = v)),
          if (_on[86]) DsField(label: gen_app_wizard_orbit_c224, hint: '', value: _t[36] ?? '', onChanged: (v) => setState(() => _t[36] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c232, children: [
          SwitchRow(label: gen_app_wizard_orbit_c226, value: _on[87], onChanged: (v) => setState(() => _on[87] = v)),
          if (_on[87]) DsNumberField(label: gen_app_wizard_orbit_c227),
          SwitchRow(label: gen_app_wizard_orbit_c228, value: _on[88], onChanged: (v) => setState(() => _on[88] = v)),
          if (_on[88]) DsField(label: gen_app_wizard_orbit_c229, hint: '', value: _t[37] ?? '', onChanged: (v) => setState(() => _t[37] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c230, value: _on[89], onChanged: (v) => setState(() => _on[89] = v)),
          if (_on[89] && (_t[37] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c231, groupThousands((int.tryParse(_t[37] ?? '') ?? 0))),
        ]),
        DsSection(title: gen_app_wizard_orbit_c239, children: [
          SwitchRow(label: gen_app_wizard_orbit_c233, value: _on[90], onChanged: (v) => setState(() => _on[90] = v)),
          if (_on[90]) DsToggleTile(label: gen_app_wizard_orbit_c234),
          SwitchRow(label: gen_app_wizard_orbit_c235, value: _on[91], onChanged: (v) => setState(() => _on[91] = v)),
          if (_on[91]) DsField(label: gen_app_wizard_orbit_c236, hint: '', value: _t[38] ?? '', onChanged: (v) => setState(() => _t[38] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c237, value: _on[92], onChanged: (v) => setState(() => _on[92] = v)),
          if (_on[92] && (_t[38] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c238, advanceStatus((_t[38] ?? ''))),
        ]),
      ];
  List<Widget> _s5() => [
        DsSection(title: gen_app_wizard_orbit_c245, children: [
          SwitchRow(label: gen_app_wizard_orbit_c241, value: _on[93], onChanged: (v) => setState(() => _on[93] = v)),
          if (_on[93]) DsField(label: gen_app_wizard_orbit_c242, hint: '', value: _t[39] ?? '', onChanged: (v) => setState(() => _t[39] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c243, value: _on[94], onChanged: (v) => setState(() => _on[94] = v)),
          if (_on[94] && (_t[39] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c244, genJoinCode((_t[39] ?? ''))),
        ]),
        DsSection(title: gen_app_wizard_orbit_c248, children: [
          SwitchRow(label: gen_app_wizard_orbit_c246, value: _on[95], onChanged: (v) => setState(() => _on[95] = v)),
          if (_on[95]) DsField(label: gen_app_wizard_orbit_c247, hint: '', value: _t[40] ?? '', onChanged: (v) => setState(() => _t[40] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c251, children: [
          SwitchRow(label: gen_app_wizard_orbit_c249, value: _on[96], onChanged: (v) => setState(() => _on[96] = v)),
          if (_on[96]) DsField(label: gen_app_wizard_orbit_c250, hint: '', value: _t[41] ?? '', onChanged: (v) => setState(() => _t[41] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c256, children: [
          SwitchRow(label: gen_app_wizard_orbit_c252, value: _on[97], onChanged: (v) => setState(() => _on[97] = v)),
          if (_on[97]) DsDateField(label: gen_app_wizard_orbit_c253),
          SwitchRow(label: gen_app_wizard_orbit_c254, value: _on[98], onChanged: (v) => setState(() => _on[98] = v)),
          if (_on[98]) DsField(label: gen_app_wizard_orbit_c255, hint: '', value: _t[42] ?? '', onChanged: (v) => setState(() => _t[42] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c259, children: [
          SwitchRow(label: gen_app_wizard_orbit_c257, value: _on[99], onChanged: (v) => setState(() => _on[99] = v)),
          if (_on[99]) DsField(label: gen_app_wizard_orbit_c258, hint: '', value: _t[43] ?? '', onChanged: (v) => setState(() => _t[43] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c264, children: [
          SwitchRow(label: gen_app_wizard_orbit_c260, value: _on[100], onChanged: (v) => setState(() => _on[100] = v)),
          if (_on[100]) DsNumberField(label: gen_app_wizard_orbit_c261),
          SwitchRow(label: gen_app_wizard_orbit_c262, value: _on[101], onChanged: (v) => setState(() => _on[101] = v)),
          if (_on[101]) DsField(label: gen_app_wizard_orbit_c263, hint: '', value: _t[44] ?? '', onChanged: (v) => setState(() => _t[44] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c269, children: [
          SwitchRow(label: gen_app_wizard_orbit_c265, value: _on[102], onChanged: (v) => setState(() => _on[102] = v)),
          if (_on[102]) DsNumberField(label: gen_app_wizard_orbit_c266),
          SwitchRow(label: gen_app_wizard_orbit_c267, value: _on[103], onChanged: (v) => setState(() => _on[103] = v)),
          if (_on[103]) DsField(label: gen_app_wizard_orbit_c268, hint: '', value: _t[45] ?? '', onChanged: (v) => setState(() => _t[45] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c276, children: [
          SwitchRow(label: gen_app_wizard_orbit_c270, value: _on[104], onChanged: (v) => setState(() => _on[104] = v)),
          if (_on[104]) DsToggleTile(label: gen_app_wizard_orbit_c271),
          SwitchRow(label: gen_app_wizard_orbit_c272, value: _on[105], onChanged: (v) => setState(() => _on[105] = v)),
          if (_on[105]) DsField(label: gen_app_wizard_orbit_c273, hint: '', value: _t[46] ?? '', onChanged: (v) => setState(() => _t[46] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c274, value: _on[106], onChanged: (v) => setState(() => _on[106] = v)),
          if (_on[106] && (_t[46] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c275, advanceStatus((_t[46] ?? ''))),
        ]),
      ];
  List<Widget> _s6() => [
        DsSection(title: gen_app_wizard_orbit_c280, children: [
          SwitchRow(label: gen_app_wizard_orbit_c278, value: _on[107], onChanged: (v) => setState(() => _on[107] = v)),
          if (_on[107]) DsField(label: gen_app_wizard_orbit_c279, hint: '', value: _t[47] ?? '', onChanged: (v) => setState(() => _t[47] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c283, children: [
          SwitchRow(label: gen_app_wizard_orbit_c281, value: _on[108], onChanged: (v) => setState(() => _on[108] = v)),
          if (_on[108]) DsField(label: gen_app_wizard_orbit_c282, hint: '', value: _t[48] ?? '', onChanged: (v) => setState(() => _t[48] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c286, children: [
          SwitchRow(label: gen_app_wizard_orbit_c284, value: _on[109], onChanged: (v) => setState(() => _on[109] = v)),
          if (_on[109]) DsField(label: gen_app_wizard_orbit_c285, hint: '', value: _t[49] ?? '', onChanged: (v) => setState(() => _t[49] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c293, children: [
          SwitchRow(label: gen_app_wizard_orbit_c287, value: _on[110], onChanged: (v) => setState(() => _on[110] = v)),
          if (_on[110]) DsDateField(label: gen_app_wizard_orbit_c288),
          SwitchRow(label: gen_app_wizard_orbit_c289, value: _on[111], onChanged: (v) => setState(() => _on[111] = v)),
          if (_on[111]) DsField(label: gen_app_wizard_orbit_c290, hint: '', value: _t[50] ?? '', onChanged: (v) => setState(() => _t[50] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c291, value: _on[112], onChanged: (v) => setState(() => _on[112] = v)),
          if (_on[112] && (_t[50] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c292, fmtDate((_t[50] ?? ''))),
        ]),
        DsSection(title: gen_app_wizard_orbit_c300, children: [
          SwitchRow(label: gen_app_wizard_orbit_c294, value: _on[113], onChanged: (v) => setState(() => _on[113] = v)),
          if (_on[113]) DsNumberField(label: gen_app_wizard_orbit_c295),
          SwitchRow(label: gen_app_wizard_orbit_c296, value: _on[114], onChanged: (v) => setState(() => _on[114] = v)),
          if (_on[114]) DsField(label: gen_app_wizard_orbit_c297, hint: '', value: _t[51] ?? '', onChanged: (v) => setState(() => _t[51] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c298, value: _on[115], onChanged: (v) => setState(() => _on[115] = v)),
          if (_on[115] && (_t[51] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c299, groupThousands((int.tryParse(_t[51] ?? '') ?? 0))),
        ]),
        DsSection(title: gen_app_wizard_orbit_c305, children: [
          SwitchRow(label: gen_app_wizard_orbit_c301, value: _on[116], onChanged: (v) => setState(() => _on[116] = v)),
          if (_on[116]) DsNumberField(label: gen_app_wizard_orbit_c302),
          SwitchRow(label: gen_app_wizard_orbit_c303, value: _on[117], onChanged: (v) => setState(() => _on[117] = v)),
          if (_on[117]) DsField(label: gen_app_wizard_orbit_c304, hint: '', value: _t[52] ?? '', onChanged: (v) => setState(() => _t[52] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c308, children: [
          SwitchRow(label: gen_app_wizard_orbit_c306, value: _on[118], onChanged: (v) => setState(() => _on[118] = v)),
          if (_on[118]) DsField(label: gen_app_wizard_orbit_c307, hint: '', value: _t[53] ?? '', onChanged: (v) => setState(() => _t[53] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c313, children: [
          SwitchRow(label: gen_app_wizard_orbit_c309, value: _on[119], onChanged: (v) => setState(() => _on[119] = v)),
          if (_on[119]) DsDateField(label: gen_app_wizard_orbit_c310),
          SwitchRow(label: gen_app_wizard_orbit_c311, value: _on[120], onChanged: (v) => setState(() => _on[120] = v)),
          if (_on[120]) DsField(label: gen_app_wizard_orbit_c312, hint: '', value: _t[54] ?? '', onChanged: (v) => setState(() => _t[54] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c320, children: [
          SwitchRow(label: gen_app_wizard_orbit_c314, value: _on[121], onChanged: (v) => setState(() => _on[121] = v)),
          if (_on[121]) DsToggleTile(label: gen_app_wizard_orbit_c315),
          SwitchRow(label: gen_app_wizard_orbit_c316, value: _on[122], onChanged: (v) => setState(() => _on[122] = v)),
          if (_on[122]) DsField(label: gen_app_wizard_orbit_c317, hint: '', value: _t[55] ?? '', onChanged: (v) => setState(() => _t[55] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c318, value: _on[123], onChanged: (v) => setState(() => _on[123] = v)),
          if (_on[123] && (_t[55] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c319, advanceStatus((_t[55] ?? ''))),
        ]),
      ];
  List<Widget> _s7() => [
        DsSection(title: gen_app_wizard_orbit_c332, children: [
          SwitchRow(label: gen_app_wizard_orbit_c322, value: _on[124], onChanged: (v) => setState(() => _on[124] = v)),
          if (_on[124]) DsNumberField(label: gen_app_wizard_orbit_c323),
          SwitchRow(label: gen_app_wizard_orbit_c324, value: _on[125], onChanged: (v) => setState(() => _on[125] = v)),
          if (_on[125]) DsField(label: gen_app_wizard_orbit_c325, hint: '', value: _t[56] ?? '', onChanged: (v) => setState(() => _t[56] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c326, value: _on[126], onChanged: (v) => setState(() => _on[126] = v)),
          if (_on[126] && (_t[56] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c327, groupThousands((int.tryParse(_t[56] ?? '') ?? 0))),
          SwitchRow(label: gen_app_wizard_orbit_c328, value: _on[127], onChanged: (v) => setState(() => _on[127] = v)),
          if (_on[127] && (_t[56] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c329, phoneKey((_t[56] ?? ''))),
          SwitchRow(label: gen_app_wizard_orbit_c330, value: _on[128], onChanged: (v) => setState(() => _on[128] = v)),
          if (_on[128] && (_t[56] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c331, phoneRegion((_t[56] ?? ''))),
        ]),
        DsSection(title: gen_app_wizard_orbit_c335, children: [
          SwitchRow(label: gen_app_wizard_orbit_c333, value: _on[129], onChanged: (v) => setState(() => _on[129] = v)),
          if (_on[129]) DsField(label: gen_app_wizard_orbit_c334, hint: '', value: _t[57] ?? '', onChanged: (v) => setState(() => _t[57] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c338, children: [
          SwitchRow(label: gen_app_wizard_orbit_c336, value: _on[130], onChanged: (v) => setState(() => _on[130] = v)),
          if (_on[130]) DsField(label: gen_app_wizard_orbit_c337, hint: '', value: _t[58] ?? '', onChanged: (v) => setState(() => _t[58] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c343, children: [
          SwitchRow(label: gen_app_wizard_orbit_c339, value: _on[131], onChanged: (v) => setState(() => _on[131] = v)),
          if (_on[131]) DsNumberField(label: gen_app_wizard_orbit_c340),
          SwitchRow(label: gen_app_wizard_orbit_c341, value: _on[132], onChanged: (v) => setState(() => _on[132] = v)),
          if (_on[132]) DsField(label: gen_app_wizard_orbit_c342, hint: '', value: _t[59] ?? '', onChanged: (v) => setState(() => _t[59] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c346, children: [
          SwitchRow(label: gen_app_wizard_orbit_c344, value: _on[133], onChanged: (v) => setState(() => _on[133] = v)),
          if (_on[133]) DsField(label: gen_app_wizard_orbit_c345, hint: '', value: _t[60] ?? '', onChanged: (v) => setState(() => _t[60] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c351, children: [
          SwitchRow(label: gen_app_wizard_orbit_c347, value: _on[134], onChanged: (v) => setState(() => _on[134] = v)),
          if (_on[134]) DsDateField(label: gen_app_wizard_orbit_c348),
          SwitchRow(label: gen_app_wizard_orbit_c349, value: _on[135], onChanged: (v) => setState(() => _on[135] = v)),
          if (_on[135]) DsField(label: gen_app_wizard_orbit_c350, hint: '', value: _t[61] ?? '', onChanged: (v) => setState(() => _t[61] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c358, children: [
          SwitchRow(label: gen_app_wizard_orbit_c352, value: _on[136], onChanged: (v) => setState(() => _on[136] = v)),
          if (_on[136]) DsToggleTile(label: gen_app_wizard_orbit_c353),
          SwitchRow(label: gen_app_wizard_orbit_c354, value: _on[137], onChanged: (v) => setState(() => _on[137] = v)),
          if (_on[137]) DsField(label: gen_app_wizard_orbit_c355, hint: '', value: _t[62] ?? '', onChanged: (v) => setState(() => _t[62] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c356, value: _on[138], onChanged: (v) => setState(() => _on[138] = v)),
          if (_on[138] && (_t[62] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c357, advanceStatus((_t[62] ?? ''))),
        ]),
        SwitchRow(label: gen_app_wizard_orbit_c359, value: _on[139], onChanged: (v) => setState(() => _on[139] = v)),
        if (_on[139]) DsWorkflow(steps: const [gen_app_wizard_orbit_c360, gen_app_wizard_orbit_c361, gen_app_wizard_orbit_c362, gen_app_wizard_orbit_c363, gen_app_wizard_orbit_c364], current: 0),
      ];
  List<Widget> _s8() => [
        DsSection(title: gen_app_wizard_orbit_c376, children: [
          SwitchRow(label: gen_app_wizard_orbit_c366, value: _on[140], onChanged: (v) => setState(() => _on[140] = v)),
          if (_on[140]) DsNumberField(label: gen_app_wizard_orbit_c367),
          SwitchRow(label: gen_app_wizard_orbit_c368, value: _on[141], onChanged: (v) => setState(() => _on[141] = v)),
          if (_on[141]) DsField(label: gen_app_wizard_orbit_c369, hint: '', value: _t[63] ?? '', onChanged: (v) => setState(() => _t[63] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c370, value: _on[142], onChanged: (v) => setState(() => _on[142] = v)),
          if (_on[142] && (_t[63] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c371, groupThousands((int.tryParse(_t[63] ?? '') ?? 0))),
          SwitchRow(label: gen_app_wizard_orbit_c372, value: _on[143], onChanged: (v) => setState(() => _on[143] = v)),
          if (_on[143] && (_t[63] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c373, phoneKey((_t[63] ?? ''))),
          SwitchRow(label: gen_app_wizard_orbit_c374, value: _on[144], onChanged: (v) => setState(() => _on[144] = v)),
          if (_on[144] && (_t[63] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c375, phoneRegion((_t[63] ?? ''))),
        ]),
        DsSection(title: gen_app_wizard_orbit_c379, children: [
          SwitchRow(label: gen_app_wizard_orbit_c377, value: _on[145], onChanged: (v) => setState(() => _on[145] = v)),
          if (_on[145]) DsField(label: gen_app_wizard_orbit_c378, hint: '', value: _t[64] ?? '', onChanged: (v) => setState(() => _t[64] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c382, children: [
          SwitchRow(label: gen_app_wizard_orbit_c380, value: _on[146], onChanged: (v) => setState(() => _on[146] = v)),
          if (_on[146]) DsField(label: gen_app_wizard_orbit_c381, hint: '', value: _t[65] ?? '', onChanged: (v) => setState(() => _t[65] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c387, children: [
          SwitchRow(label: gen_app_wizard_orbit_c383, value: _on[147], onChanged: (v) => setState(() => _on[147] = v)),
          if (_on[147]) DsNumberField(label: gen_app_wizard_orbit_c384),
          SwitchRow(label: gen_app_wizard_orbit_c385, value: _on[148], onChanged: (v) => setState(() => _on[148] = v)),
          if (_on[148]) DsField(label: gen_app_wizard_orbit_c386, hint: '', value: _t[66] ?? '', onChanged: (v) => setState(() => _t[66] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c394, children: [
          SwitchRow(label: gen_app_wizard_orbit_c388, value: _on[149], onChanged: (v) => setState(() => _on[149] = v)),
          if (_on[149]) DsDateField(label: gen_app_wizard_orbit_c389),
          SwitchRow(label: gen_app_wizard_orbit_c390, value: _on[150], onChanged: (v) => setState(() => _on[150] = v)),
          if (_on[150]) DsField(label: gen_app_wizard_orbit_c391, hint: '', value: _t[67] ?? '', onChanged: (v) => setState(() => _t[67] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c392, value: _on[151], onChanged: (v) => setState(() => _on[151] = v)),
          if (_on[151] && (_t[67] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c393, fmtDate((_t[67] ?? ''))),
        ]),
        DsSection(title: gen_app_wizard_orbit_c399, children: [
          SwitchRow(label: gen_app_wizard_orbit_c395, value: _on[152], onChanged: (v) => setState(() => _on[152] = v)),
          if (_on[152]) DsDateField(label: gen_app_wizard_orbit_c396),
          SwitchRow(label: gen_app_wizard_orbit_c397, value: _on[153], onChanged: (v) => setState(() => _on[153] = v)),
          if (_on[153]) DsField(label: gen_app_wizard_orbit_c398, hint: '', value: _t[68] ?? '', onChanged: (v) => setState(() => _t[68] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c404, children: [
          SwitchRow(label: gen_app_wizard_orbit_c400, value: _on[154], onChanged: (v) => setState(() => _on[154] = v)),
          if (_on[154]) DsDateField(label: gen_app_wizard_orbit_c401),
          SwitchRow(label: gen_app_wizard_orbit_c402, value: _on[155], onChanged: (v) => setState(() => _on[155] = v)),
          if (_on[155]) DsField(label: gen_app_wizard_orbit_c403, hint: '', value: _t[69] ?? '', onChanged: (v) => setState(() => _t[69] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c407, children: [
          SwitchRow(label: gen_app_wizard_orbit_c405, value: _on[156], onChanged: (v) => setState(() => _on[156] = v)),
          if (_on[156]) DsField(label: gen_app_wizard_orbit_c406, hint: '', value: _t[70] ?? '', onChanged: (v) => setState(() => _t[70] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c414, children: [
          SwitchRow(label: gen_app_wizard_orbit_c408, value: _on[157], onChanged: (v) => setState(() => _on[157] = v)),
          if (_on[157]) DsToggleTile(label: gen_app_wizard_orbit_c409),
          SwitchRow(label: gen_app_wizard_orbit_c410, value: _on[158], onChanged: (v) => setState(() => _on[158] = v)),
          if (_on[158]) DsField(label: gen_app_wizard_orbit_c411, hint: '', value: _t[71] ?? '', onChanged: (v) => setState(() => _t[71] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c412, value: _on[159], onChanged: (v) => setState(() => _on[159] = v)),
          if (_on[159] && (_t[71] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c413, advanceStatus((_t[71] ?? ''))),
        ]),
        SwitchRow(label: gen_app_wizard_orbit_c415, value: _on[160], onChanged: (v) => setState(() => _on[160] = v)),
        if (_on[160]) DsWorkflow(steps: const [gen_app_wizard_orbit_c416, gen_app_wizard_orbit_c417, gen_app_wizard_orbit_c418, gen_app_wizard_orbit_c419], current: 0),
      ];
  List<Widget> _s9() => [
        DsSection(title: gen_app_wizard_orbit_c423, children: [
          SwitchRow(label: gen_app_wizard_orbit_c421, value: _on[161], onChanged: (v) => setState(() => _on[161] = v)),
          if (_on[161]) DsField(label: gen_app_wizard_orbit_c422, hint: '', value: _t[72] ?? '', onChanged: (v) => setState(() => _t[72] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c426, children: [
          SwitchRow(label: gen_app_wizard_orbit_c424, value: _on[162], onChanged: (v) => setState(() => _on[162] = v)),
          if (_on[162]) DsField(label: gen_app_wizard_orbit_c425, hint: '', value: _t[73] ?? '', onChanged: (v) => setState(() => _t[73] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c431, children: [
          SwitchRow(label: gen_app_wizard_orbit_c427, value: _on[163], onChanged: (v) => setState(() => _on[163] = v)),
          if (_on[163]) DsNumberField(label: gen_app_wizard_orbit_c428),
          SwitchRow(label: gen_app_wizard_orbit_c429, value: _on[164], onChanged: (v) => setState(() => _on[164] = v)),
          if (_on[164]) DsField(label: gen_app_wizard_orbit_c430, hint: '', value: _t[74] ?? '', onChanged: (v) => setState(() => _t[74] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c438, children: [
          SwitchRow(label: gen_app_wizard_orbit_c432, value: _on[165], onChanged: (v) => setState(() => _on[165] = v)),
          if (_on[165]) DsNumberField(label: gen_app_wizard_orbit_c433),
          SwitchRow(label: gen_app_wizard_orbit_c434, value: _on[166], onChanged: (v) => setState(() => _on[166] = v)),
          if (_on[166]) DsField(label: gen_app_wizard_orbit_c435, hint: '', value: _t[75] ?? '', onChanged: (v) => setState(() => _t[75] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c436, value: _on[167], onChanged: (v) => setState(() => _on[167] = v)),
          if (_on[167] && (_t[75] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c437, groupThousands((int.tryParse(_t[75] ?? '') ?? 0))),
        ]),
        DsSection(title: gen_app_wizard_orbit_c445, children: [
          SwitchRow(label: gen_app_wizard_orbit_c439, value: _on[168], onChanged: (v) => setState(() => _on[168] = v)),
          if (_on[168]) DsNumberField(label: gen_app_wizard_orbit_c440),
          SwitchRow(label: gen_app_wizard_orbit_c441, value: _on[169], onChanged: (v) => setState(() => _on[169] = v)),
          if (_on[169]) DsField(label: gen_app_wizard_orbit_c442, hint: '', value: _t[76] ?? '', onChanged: (v) => setState(() => _t[76] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c443, value: _on[170], onChanged: (v) => setState(() => _on[170] = v)),
          if (_on[170] && (_t[76] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c444, groupThousands((int.tryParse(_t[76] ?? '') ?? 0))),
        ]),
        DsSection(title: gen_app_wizard_orbit_c448, children: [
          SwitchRow(label: gen_app_wizard_orbit_c446, value: _on[171], onChanged: (v) => setState(() => _on[171] = v)),
          if (_on[171]) DsField(label: gen_app_wizard_orbit_c447, hint: '', value: _t[77] ?? '', onChanged: (v) => setState(() => _t[77] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c451, children: [
          SwitchRow(label: gen_app_wizard_orbit_c449, value: _on[172], onChanged: (v) => setState(() => _on[172] = v)),
          if (_on[172]) DsField(label: gen_app_wizard_orbit_c450, hint: '', value: _t[78] ?? '', onChanged: (v) => setState(() => _t[78] = v)),
        ]),
      ];
  List<Widget> _s10() => [
        DsSection(title: gen_app_wizard_orbit_c457, children: [
          SwitchRow(label: gen_app_wizard_orbit_c453, value: _on[173], onChanged: (v) => setState(() => _on[173] = v)),
          if (_on[173]) DsField(label: gen_app_wizard_orbit_c454, hint: '', value: _t[79] ?? '', onChanged: (v) => setState(() => _t[79] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c455, value: _on[174], onChanged: (v) => setState(() => _on[174] = v)),
          if (_on[174] && (_t[79] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c456, namespaceOf((_t[79] ?? ''))),
        ]),
        DsSection(title: gen_app_wizard_orbit_c460, children: [
          SwitchRow(label: gen_app_wizard_orbit_c458, value: _on[175], onChanged: (v) => setState(() => _on[175] = v)),
          if (_on[175]) DsField(label: gen_app_wizard_orbit_c459, hint: '', value: _t[80] ?? '', onChanged: (v) => setState(() => _t[80] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c463, children: [
          SwitchRow(label: gen_app_wizard_orbit_c461, value: _on[176], onChanged: (v) => setState(() => _on[176] = v)),
          if (_on[176]) DsField(label: gen_app_wizard_orbit_c462, hint: '', value: _t[81] ?? '', onChanged: (v) => setState(() => _t[81] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c470, children: [
          SwitchRow(label: gen_app_wizard_orbit_c464, value: _on[177], onChanged: (v) => setState(() => _on[177] = v)),
          if (_on[177]) DsDateField(label: gen_app_wizard_orbit_c465),
          SwitchRow(label: gen_app_wizard_orbit_c466, value: _on[178], onChanged: (v) => setState(() => _on[178] = v)),
          if (_on[178]) DsField(label: gen_app_wizard_orbit_c467, hint: '', value: _t[82] ?? '', onChanged: (v) => setState(() => _t[82] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c468, value: _on[179], onChanged: (v) => setState(() => _on[179] = v)),
          if (_on[179] && (_t[82] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c469, fmtDate((_t[82] ?? ''))),
        ]),
        DsSection(title: gen_app_wizard_orbit_c473, children: [
          SwitchRow(label: gen_app_wizard_orbit_c471, value: _on[180], onChanged: (v) => setState(() => _on[180] = v)),
          if (_on[180]) DsField(label: gen_app_wizard_orbit_c472, hint: '', value: _t[83] ?? '', onChanged: (v) => setState(() => _t[83] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c478, children: [
          SwitchRow(label: gen_app_wizard_orbit_c474, value: _on[181], onChanged: (v) => setState(() => _on[181] = v)),
          if (_on[181]) DsNumberField(label: gen_app_wizard_orbit_c475),
          SwitchRow(label: gen_app_wizard_orbit_c476, value: _on[182], onChanged: (v) => setState(() => _on[182] = v)),
          if (_on[182]) DsField(label: gen_app_wizard_orbit_c477, hint: '', value: _t[84] ?? '', onChanged: (v) => setState(() => _t[84] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c485, children: [
          SwitchRow(label: gen_app_wizard_orbit_c479, value: _on[183], onChanged: (v) => setState(() => _on[183] = v)),
          if (_on[183]) DsToggleTile(label: gen_app_wizard_orbit_c480),
          SwitchRow(label: gen_app_wizard_orbit_c481, value: _on[184], onChanged: (v) => setState(() => _on[184] = v)),
          if (_on[184]) DsField(label: gen_app_wizard_orbit_c482, hint: '', value: _t[85] ?? '', onChanged: (v) => setState(() => _t[85] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c483, value: _on[185], onChanged: (v) => setState(() => _on[185] = v)),
          if (_on[185] && (_t[85] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c484, advanceStatus((_t[85] ?? ''))),
        ]),
        SwitchRow(label: gen_app_wizard_orbit_c486, value: _on[186], onChanged: (v) => setState(() => _on[186] = v)),
        if (_on[186]) DsWorkflow(steps: const [gen_app_wizard_orbit_c487, gen_app_wizard_orbit_c488, gen_app_wizard_orbit_c489, gen_app_wizard_orbit_c490, gen_app_wizard_orbit_c491], current: 0),
      ];
  List<Widget> _s11() => [
        DsSection(title: gen_app_wizard_orbit_c495, children: [
          SwitchRow(label: gen_app_wizard_orbit_c493, value: _on[187], onChanged: (v) => setState(() => _on[187] = v)),
          if (_on[187]) DsField(label: gen_app_wizard_orbit_c494, hint: '', value: _t[86] ?? '', onChanged: (v) => setState(() => _t[86] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c502, children: [
          SwitchRow(label: gen_app_wizard_orbit_c496, value: _on[188], onChanged: (v) => setState(() => _on[188] = v)),
          if (_on[188]) DsDateField(label: gen_app_wizard_orbit_c497),
          SwitchRow(label: gen_app_wizard_orbit_c498, value: _on[189], onChanged: (v) => setState(() => _on[189] = v)),
          if (_on[189]) DsField(label: gen_app_wizard_orbit_c499, hint: '', value: _t[87] ?? '', onChanged: (v) => setState(() => _t[87] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c500, value: _on[190], onChanged: (v) => setState(() => _on[190] = v)),
          if (_on[190] && (_t[87] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c501, fmtDate((_t[87] ?? ''))),
        ]),
        DsSection(title: gen_app_wizard_orbit_c505, children: [
          SwitchRow(label: gen_app_wizard_orbit_c503, value: _on[191], onChanged: (v) => setState(() => _on[191] = v)),
          if (_on[191]) DsField(label: gen_app_wizard_orbit_c504, hint: '', value: _t[88] ?? '', onChanged: (v) => setState(() => _t[88] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c508, children: [
          SwitchRow(label: gen_app_wizard_orbit_c506, value: _on[192], onChanged: (v) => setState(() => _on[192] = v)),
          if (_on[192]) DsField(label: gen_app_wizard_orbit_c507, hint: '', value: _t[89] ?? '', onChanged: (v) => setState(() => _t[89] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c511, children: [
          SwitchRow(label: gen_app_wizard_orbit_c509, value: _on[193], onChanged: (v) => setState(() => _on[193] = v)),
          if (_on[193]) DsField(label: gen_app_wizard_orbit_c510, hint: '', value: _t[90] ?? '', onChanged: (v) => setState(() => _t[90] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c516, children: [
          SwitchRow(label: gen_app_wizard_orbit_c512, value: _on[194], onChanged: (v) => setState(() => _on[194] = v)),
          if (_on[194]) DsNumberField(label: gen_app_wizard_orbit_c513),
          SwitchRow(label: gen_app_wizard_orbit_c514, value: _on[195], onChanged: (v) => setState(() => _on[195] = v)),
          if (_on[195]) DsField(label: gen_app_wizard_orbit_c515, hint: '', value: _t[91] ?? '', onChanged: (v) => setState(() => _t[91] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c523, children: [
          SwitchRow(label: gen_app_wizard_orbit_c517, value: _on[196], onChanged: (v) => setState(() => _on[196] = v)),
          if (_on[196]) DsToggleTile(label: gen_app_wizard_orbit_c518),
          SwitchRow(label: gen_app_wizard_orbit_c519, value: _on[197], onChanged: (v) => setState(() => _on[197] = v)),
          if (_on[197]) DsField(label: gen_app_wizard_orbit_c520, hint: '', value: _t[92] ?? '', onChanged: (v) => setState(() => _t[92] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c521, value: _on[198], onChanged: (v) => setState(() => _on[198] = v)),
          if (_on[198] && (_t[92] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c522, advanceStatus((_t[92] ?? ''))),
        ]),
      ];
  List<Widget> _s12() => [
        DsSection(title: gen_app_wizard_orbit_c529, children: [
          SwitchRow(label: gen_app_wizard_orbit_c525, value: _on[199], onChanged: (v) => setState(() => _on[199] = v)),
          if (_on[199]) DsField(label: gen_app_wizard_orbit_c526, hint: '', value: _t[93] ?? '', onChanged: (v) => setState(() => _t[93] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c527, value: _on[200], onChanged: (v) => setState(() => _on[200] = v)),
          if (_on[200] && (_t[93] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c528, namespaceOf((_t[93] ?? ''))),
        ]),
        DsSection(title: gen_app_wizard_orbit_c532, children: [
          SwitchRow(label: gen_app_wizard_orbit_c530, value: _on[201], onChanged: (v) => setState(() => _on[201] = v)),
          if (_on[201]) DsField(label: gen_app_wizard_orbit_c531, hint: '', value: _t[94] ?? '', onChanged: (v) => setState(() => _t[94] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c545, children: [
          SwitchRow(label: gen_app_wizard_orbit_c533, value: _on[202], onChanged: (v) => setState(() => _on[202] = v)),
          if (_on[202]) DsField(label: gen_app_wizard_orbit_c534, hint: '', value: _t[95] ?? '', onChanged: (v) => setState(() => _t[95] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c535, value: _on[203], onChanged: (v) => setState(() => _on[203] = v)),
          if (_on[203] && (_t[95] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c536, formatIsraeliPhone((_t[95] ?? ''))),
          SwitchRow(label: gen_app_wizard_orbit_c537, value: _on[204], onChanged: (v) => setState(() => _on[204] = v)),
          if (_on[204] && (_t[95] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c538, normalizePhone((_t[95] ?? ''))),
          SwitchRow(label: gen_app_wizard_orbit_c539, value: _on[205], onChanged: (v) => setState(() => _on[205] = v)),
          if (_on[205] && (_t[95] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c540, normPhone((_t[95] ?? ''))),
          SwitchRow(label: gen_app_wizard_orbit_c541, value: _on[206], onChanged: (v) => setState(() => _on[206] = v)),
          if (_on[206] && (_t[95] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c542, phoneKey((_t[95] ?? ''))),
          SwitchRow(label: gen_app_wizard_orbit_c543, value: _on[207], onChanged: (v) => setState(() => _on[207] = v)),
          if (_on[207] && (_t[95] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c544, phoneRegion((_t[95] ?? ''))),
        ]),
        DsSection(title: gen_app_wizard_orbit_c548, children: [
          SwitchRow(label: gen_app_wizard_orbit_c546, value: _on[208], onChanged: (v) => setState(() => _on[208] = v)),
          if (_on[208]) DsField(label: gen_app_wizard_orbit_c547, hint: '', value: _t[96] ?? '', onChanged: (v) => setState(() => _t[96] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c555, children: [
          SwitchRow(label: gen_app_wizard_orbit_c549, value: _on[209], onChanged: (v) => setState(() => _on[209] = v)),
          if (_on[209]) DsNumberField(label: gen_app_wizard_orbit_c550),
          SwitchRow(label: gen_app_wizard_orbit_c551, value: _on[210], onChanged: (v) => setState(() => _on[210] = v)),
          if (_on[210]) DsField(label: gen_app_wizard_orbit_c552, hint: '', value: _t[97] ?? '', onChanged: (v) => setState(() => _t[97] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c553, value: _on[211], onChanged: (v) => setState(() => _on[211] = v)),
          if (_on[211] && (_t[97] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c554, groupThousands((int.tryParse(_t[97] ?? '') ?? 0))),
        ]),
        DsSection(title: gen_app_wizard_orbit_c562, children: [
          SwitchRow(label: gen_app_wizard_orbit_c556, value: _on[212], onChanged: (v) => setState(() => _on[212] = v)),
          if (_on[212]) DsToggleTile(label: gen_app_wizard_orbit_c557),
          SwitchRow(label: gen_app_wizard_orbit_c558, value: _on[213], onChanged: (v) => setState(() => _on[213] = v)),
          if (_on[213]) DsField(label: gen_app_wizard_orbit_c559, hint: '', value: _t[98] ?? '', onChanged: (v) => setState(() => _t[98] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c560, value: _on[214], onChanged: (v) => setState(() => _on[214] = v)),
          if (_on[214] && (_t[98] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c561, advanceStatus((_t[98] ?? ''))),
        ]),
      ];
  List<Widget> _s13() => [
        DsSection(title: gen_app_wizard_orbit_c568, children: [
          SwitchRow(label: gen_app_wizard_orbit_c564, value: _on[215], onChanged: (v) => setState(() => _on[215] = v)),
          if (_on[215]) DsField(label: gen_app_wizard_orbit_c565, hint: '', value: _t[99] ?? '', onChanged: (v) => setState(() => _t[99] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c566, value: _on[216], onChanged: (v) => setState(() => _on[216] = v)),
          if (_on[216] && (_t[99] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c567, namespaceOf((_t[99] ?? ''))),
        ]),
        DsSection(title: gen_app_wizard_orbit_c571, children: [
          SwitchRow(label: gen_app_wizard_orbit_c569, value: _on[217], onChanged: (v) => setState(() => _on[217] = v)),
          if (_on[217]) DsField(label: gen_app_wizard_orbit_c570, hint: '', value: _t[100] ?? '', onChanged: (v) => setState(() => _t[100] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c574, children: [
          SwitchRow(label: gen_app_wizard_orbit_c572, value: _on[218], onChanged: (v) => setState(() => _on[218] = v)),
          if (_on[218]) DsField(label: gen_app_wizard_orbit_c573, hint: '', value: _t[101] ?? '', onChanged: (v) => setState(() => _t[101] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c577, children: [
          SwitchRow(label: gen_app_wizard_orbit_c575, value: _on[219], onChanged: (v) => setState(() => _on[219] = v)),
          if (_on[219]) DsField(label: gen_app_wizard_orbit_c576, hint: '', value: _t[102] ?? '', onChanged: (v) => setState(() => _t[102] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c582, children: [
          SwitchRow(label: gen_app_wizard_orbit_c578, value: _on[220], onChanged: (v) => setState(() => _on[220] = v)),
          if (_on[220]) DsDateField(label: gen_app_wizard_orbit_c579),
          SwitchRow(label: gen_app_wizard_orbit_c580, value: _on[221], onChanged: (v) => setState(() => _on[221] = v)),
          if (_on[221]) DsField(label: gen_app_wizard_orbit_c581, hint: '', value: _t[103] ?? '', onChanged: (v) => setState(() => _t[103] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c585, children: [
          SwitchRow(label: gen_app_wizard_orbit_c583, value: _on[222], onChanged: (v) => setState(() => _on[222] = v)),
          if (_on[222]) DsField(label: gen_app_wizard_orbit_c584, hint: '', value: _t[104] ?? '', onChanged: (v) => setState(() => _t[104] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c592, children: [
          SwitchRow(label: gen_app_wizard_orbit_c586, value: _on[223], onChanged: (v) => setState(() => _on[223] = v)),
          if (_on[223]) DsToggleTile(label: gen_app_wizard_orbit_c587),
          SwitchRow(label: gen_app_wizard_orbit_c588, value: _on[224], onChanged: (v) => setState(() => _on[224] = v)),
          if (_on[224]) DsField(label: gen_app_wizard_orbit_c589, hint: '', value: _t[105] ?? '', onChanged: (v) => setState(() => _t[105] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c590, value: _on[225], onChanged: (v) => setState(() => _on[225] = v)),
          if (_on[225] && (_t[105] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c591, advanceStatus((_t[105] ?? ''))),
        ]),
        SwitchRow(label: gen_app_wizard_orbit_c593, value: _on[226], onChanged: (v) => setState(() => _on[226] = v)),
        if (_on[226]) DsWorkflow(steps: const [gen_app_wizard_orbit_c594, gen_app_wizard_orbit_c595, gen_app_wizard_orbit_c596, gen_app_wizard_orbit_c597], current: 0),
      ];
  List<Widget> _s14() => [
        DsSection(title: gen_app_wizard_orbit_c609, children: [
          SwitchRow(label: gen_app_wizard_orbit_c599, value: _on[227], onChanged: (v) => setState(() => _on[227] = v)),
          if (_on[227]) DsNumberField(label: gen_app_wizard_orbit_c600),
          SwitchRow(label: gen_app_wizard_orbit_c601, value: _on[228], onChanged: (v) => setState(() => _on[228] = v)),
          if (_on[228]) DsField(label: gen_app_wizard_orbit_c602, hint: '', value: _t[106] ?? '', onChanged: (v) => setState(() => _t[106] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c603, value: _on[229], onChanged: (v) => setState(() => _on[229] = v)),
          if (_on[229] && (_t[106] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c604, groupThousands((int.tryParse(_t[106] ?? '') ?? 0))),
          SwitchRow(label: gen_app_wizard_orbit_c605, value: _on[230], onChanged: (v) => setState(() => _on[230] = v)),
          if (_on[230] && (_t[106] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c606, phoneKey((_t[106] ?? ''))),
          SwitchRow(label: gen_app_wizard_orbit_c607, value: _on[231], onChanged: (v) => setState(() => _on[231] = v)),
          if (_on[231] && (_t[106] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c608, phoneRegion((_t[106] ?? ''))),
        ]),
        DsSection(title: gen_app_wizard_orbit_c612, children: [
          SwitchRow(label: gen_app_wizard_orbit_c610, value: _on[232], onChanged: (v) => setState(() => _on[232] = v)),
          if (_on[232]) DsField(label: gen_app_wizard_orbit_c611, hint: '', value: _t[107] ?? '', onChanged: (v) => setState(() => _t[107] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c615, children: [
          SwitchRow(label: gen_app_wizard_orbit_c613, value: _on[233], onChanged: (v) => setState(() => _on[233] = v)),
          if (_on[233]) DsField(label: gen_app_wizard_orbit_c614, hint: '', value: _t[108] ?? '', onChanged: (v) => setState(() => _t[108] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c618, children: [
          SwitchRow(label: gen_app_wizard_orbit_c616, value: _on[234], onChanged: (v) => setState(() => _on[234] = v)),
          if (_on[234]) DsField(label: gen_app_wizard_orbit_c617, hint: '', value: _t[109] ?? '', onChanged: (v) => setState(() => _t[109] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c623, children: [
          SwitchRow(label: gen_app_wizard_orbit_c619, value: _on[235], onChanged: (v) => setState(() => _on[235] = v)),
          if (_on[235]) DsNumberField(label: gen_app_wizard_orbit_c620),
          SwitchRow(label: gen_app_wizard_orbit_c621, value: _on[236], onChanged: (v) => setState(() => _on[236] = v)),
          if (_on[236]) DsField(label: gen_app_wizard_orbit_c622, hint: '', value: _t[110] ?? '', onChanged: (v) => setState(() => _t[110] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c630, children: [
          SwitchRow(label: gen_app_wizard_orbit_c624, value: _on[237], onChanged: (v) => setState(() => _on[237] = v)),
          if (_on[237]) DsDateField(label: gen_app_wizard_orbit_c625),
          SwitchRow(label: gen_app_wizard_orbit_c626, value: _on[238], onChanged: (v) => setState(() => _on[238] = v)),
          if (_on[238]) DsField(label: gen_app_wizard_orbit_c627, hint: '', value: _t[111] ?? '', onChanged: (v) => setState(() => _t[111] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c628, value: _on[239], onChanged: (v) => setState(() => _on[239] = v)),
          if (_on[239] && (_t[111] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c629, fmtDate((_t[111] ?? ''))),
        ]),
        DsSection(title: gen_app_wizard_orbit_c637, children: [
          SwitchRow(label: gen_app_wizard_orbit_c631, value: _on[240], onChanged: (v) => setState(() => _on[240] = v)),
          if (_on[240]) DsToggleTile(label: gen_app_wizard_orbit_c632),
          SwitchRow(label: gen_app_wizard_orbit_c633, value: _on[241], onChanged: (v) => setState(() => _on[241] = v)),
          if (_on[241]) DsField(label: gen_app_wizard_orbit_c634, hint: '', value: _t[112] ?? '', onChanged: (v) => setState(() => _t[112] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c635, value: _on[242], onChanged: (v) => setState(() => _on[242] = v)),
          if (_on[242] && (_t[112] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c636, advanceStatus((_t[112] ?? ''))),
        ]),
        SwitchRow(label: gen_app_wizard_orbit_c638, value: _on[243], onChanged: (v) => setState(() => _on[243] = v)),
        if (_on[243]) DsWorkflow(steps: const [gen_app_wizard_orbit_c639, gen_app_wizard_orbit_c640, gen_app_wizard_orbit_c641, gen_app_wizard_orbit_c642], current: 0),
      ];
  List<Widget> _s15() => [
        DsSection(title: gen_app_wizard_orbit_c648, children: [
          SwitchRow(label: gen_app_wizard_orbit_c644, value: _on[244], onChanged: (v) => setState(() => _on[244] = v)),
          if (_on[244]) DsField(label: gen_app_wizard_orbit_c645, hint: '', value: _t[113] ?? '', onChanged: (v) => setState(() => _t[113] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c646, value: _on[245], onChanged: (v) => setState(() => _on[245] = v)),
          if (_on[245] && (_t[113] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c647, genJoinCode((_t[113] ?? ''))),
        ]),
        DsSection(title: gen_app_wizard_orbit_c653, children: [
          SwitchRow(label: gen_app_wizard_orbit_c649, value: _on[246], onChanged: (v) => setState(() => _on[246] = v)),
          if (_on[246]) DsField(label: gen_app_wizard_orbit_c650, hint: '', value: _t[114] ?? '', onChanged: (v) => setState(() => _t[114] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c651, value: _on[247], onChanged: (v) => setState(() => _on[247] = v)),
          if (_on[247] && (_t[114] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c652, namespaceOf((_t[114] ?? ''))),
        ]),
        DsSection(title: gen_app_wizard_orbit_c656, children: [
          SwitchRow(label: gen_app_wizard_orbit_c654, value: _on[248], onChanged: (v) => setState(() => _on[248] = v)),
          if (_on[248]) DsField(label: gen_app_wizard_orbit_c655, hint: '', value: _t[115] ?? '', onChanged: (v) => setState(() => _t[115] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c661, children: [
          SwitchRow(label: gen_app_wizard_orbit_c657, value: _on[249], onChanged: (v) => setState(() => _on[249] = v)),
          if (_on[249]) DsDateField(label: gen_app_wizard_orbit_c658),
          SwitchRow(label: gen_app_wizard_orbit_c659, value: _on[250], onChanged: (v) => setState(() => _on[250] = v)),
          if (_on[250]) DsField(label: gen_app_wizard_orbit_c660, hint: '', value: _t[116] ?? '', onChanged: (v) => setState(() => _t[116] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c666, children: [
          SwitchRow(label: gen_app_wizard_orbit_c662, value: _on[251], onChanged: (v) => setState(() => _on[251] = v)),
          if (_on[251]) DsNumberField(label: gen_app_wizard_orbit_c663),
          SwitchRow(label: gen_app_wizard_orbit_c664, value: _on[252], onChanged: (v) => setState(() => _on[252] = v)),
          if (_on[252]) DsField(label: gen_app_wizard_orbit_c665, hint: '', value: _t[117] ?? '', onChanged: (v) => setState(() => _t[117] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c669, children: [
          SwitchRow(label: gen_app_wizard_orbit_c667, value: _on[253], onChanged: (v) => setState(() => _on[253] = v)),
          if (_on[253]) DsField(label: gen_app_wizard_orbit_c668, hint: '', value: _t[118] ?? '', onChanged: (v) => setState(() => _t[118] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c676, children: [
          SwitchRow(label: gen_app_wizard_orbit_c670, value: _on[254], onChanged: (v) => setState(() => _on[254] = v)),
          if (_on[254]) DsField(label: gen_app_wizard_orbit_c671, hint: '', value: _t[119] ?? '', onChanged: (v) => setState(() => _t[119] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c672, value: _on[255], onChanged: (v) => setState(() => _on[255] = v)),
          if (_on[255] && (_t[119] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c673, genJoinCode((_t[119] ?? ''))),
          SwitchRow(label: gen_app_wizard_orbit_c674, value: _on[256], onChanged: (v) => setState(() => _on[256] = v)),
          if (_on[256] && (_t[119] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c675, namespaceOf((_t[119] ?? ''))),
        ]),
      ];
  List<Widget> _s16() => [
        DsSection(title: gen_app_wizard_orbit_c682, children: [
          SwitchRow(label: gen_app_wizard_orbit_c678, value: _on[257], onChanged: (v) => setState(() => _on[257] = v)),
          if (_on[257]) DsField(label: gen_app_wizard_orbit_c679, hint: '', value: _t[120] ?? '', onChanged: (v) => setState(() => _t[120] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c680, value: _on[258], onChanged: (v) => setState(() => _on[258] = v)),
          if (_on[258] && (_t[120] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c681, namespaceOf((_t[120] ?? ''))),
        ]),
        DsSection(title: gen_app_wizard_orbit_c685, children: [
          SwitchRow(label: gen_app_wizard_orbit_c683, value: _on[259], onChanged: (v) => setState(() => _on[259] = v)),
          if (_on[259]) DsField(label: gen_app_wizard_orbit_c684, hint: '', value: _t[121] ?? '', onChanged: (v) => setState(() => _t[121] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c696, children: [
          SwitchRow(label: gen_app_wizard_orbit_c686, value: _on[260], onChanged: (v) => setState(() => _on[260] = v)),
          if (_on[260]) DsNumberField(label: gen_app_wizard_orbit_c687),
          SwitchRow(label: gen_app_wizard_orbit_c688, value: _on[261], onChanged: (v) => setState(() => _on[261] = v)),
          if (_on[261]) DsField(label: gen_app_wizard_orbit_c689, hint: '', value: _t[122] ?? '', onChanged: (v) => setState(() => _t[122] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c690, value: _on[262], onChanged: (v) => setState(() => _on[262] = v)),
          if (_on[262] && (_t[122] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c691, groupThousands((int.tryParse(_t[122] ?? '') ?? 0))),
          SwitchRow(label: gen_app_wizard_orbit_c692, value: _on[263], onChanged: (v) => setState(() => _on[263] = v)),
          if (_on[263] && (_t[122] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c693, phoneKey((_t[122] ?? ''))),
          SwitchRow(label: gen_app_wizard_orbit_c694, value: _on[264], onChanged: (v) => setState(() => _on[264] = v)),
          if (_on[264] && (_t[122] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c695, phoneRegion((_t[122] ?? ''))),
        ]),
        DsSection(title: gen_app_wizard_orbit_c699, children: [
          SwitchRow(label: gen_app_wizard_orbit_c697, value: _on[265], onChanged: (v) => setState(() => _on[265] = v)),
          if (_on[265]) DsField(label: gen_app_wizard_orbit_c698, hint: '', value: _t[123] ?? '', onChanged: (v) => setState(() => _t[123] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c704, children: [
          SwitchRow(label: gen_app_wizard_orbit_c700, value: _on[266], onChanged: (v) => setState(() => _on[266] = v)),
          if (_on[266]) DsDateField(label: gen_app_wizard_orbit_c701),
          SwitchRow(label: gen_app_wizard_orbit_c702, value: _on[267], onChanged: (v) => setState(() => _on[267] = v)),
          if (_on[267]) DsField(label: gen_app_wizard_orbit_c703, hint: '', value: _t[124] ?? '', onChanged: (v) => setState(() => _t[124] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c707, children: [
          SwitchRow(label: gen_app_wizard_orbit_c705, value: _on[268], onChanged: (v) => setState(() => _on[268] = v)),
          if (_on[268]) DsField(label: gen_app_wizard_orbit_c706, hint: '', value: _t[125] ?? '', onChanged: (v) => setState(() => _t[125] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c714, children: [
          SwitchRow(label: gen_app_wizard_orbit_c708, value: _on[269], onChanged: (v) => setState(() => _on[269] = v)),
          if (_on[269]) DsToggleTile(label: gen_app_wizard_orbit_c709),
          SwitchRow(label: gen_app_wizard_orbit_c710, value: _on[270], onChanged: (v) => setState(() => _on[270] = v)),
          if (_on[270]) DsField(label: gen_app_wizard_orbit_c711, hint: '', value: _t[126] ?? '', onChanged: (v) => setState(() => _t[126] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c712, value: _on[271], onChanged: (v) => setState(() => _on[271] = v)),
          if (_on[271] && (_t[126] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c713, advanceStatus((_t[126] ?? ''))),
        ]),
      ];
  List<Widget> _s17() => [
        DsSection(title: gen_app_wizard_orbit_c718, children: [
          SwitchRow(label: gen_app_wizard_orbit_c716, value: _on[272], onChanged: (v) => setState(() => _on[272] = v)),
          if (_on[272]) DsField(label: gen_app_wizard_orbit_c717, hint: '', value: _t[127] ?? '', onChanged: (v) => setState(() => _t[127] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c721, children: [
          SwitchRow(label: gen_app_wizard_orbit_c719, value: _on[273], onChanged: (v) => setState(() => _on[273] = v)),
          if (_on[273]) DsField(label: gen_app_wizard_orbit_c720, hint: '', value: _t[128] ?? '', onChanged: (v) => setState(() => _t[128] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c726, children: [
          SwitchRow(label: gen_app_wizard_orbit_c722, value: _on[274], onChanged: (v) => setState(() => _on[274] = v)),
          if (_on[274]) DsField(label: gen_app_wizard_orbit_c723, hint: '', value: _t[129] ?? '', onChanged: (v) => setState(() => _t[129] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c724, value: _on[275], onChanged: (v) => setState(() => _on[275] = v)),
          if (_on[275] && (_t[129] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c725, namespaceOf((_t[129] ?? ''))),
        ]),
        DsSection(title: gen_app_wizard_orbit_c729, children: [
          SwitchRow(label: gen_app_wizard_orbit_c727, value: _on[276], onChanged: (v) => setState(() => _on[276] = v)),
          if (_on[276]) DsField(label: gen_app_wizard_orbit_c728, hint: '', value: _t[130] ?? '', onChanged: (v) => setState(() => _t[130] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c736, children: [
          SwitchRow(label: gen_app_wizard_orbit_c730, value: _on[277], onChanged: (v) => setState(() => _on[277] = v)),
          if (_on[277]) DsDateField(label: gen_app_wizard_orbit_c731),
          SwitchRow(label: gen_app_wizard_orbit_c732, value: _on[278], onChanged: (v) => setState(() => _on[278] = v)),
          if (_on[278]) DsField(label: gen_app_wizard_orbit_c733, hint: '', value: _t[131] ?? '', onChanged: (v) => setState(() => _t[131] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c734, value: _on[279], onChanged: (v) => setState(() => _on[279] = v)),
          if (_on[279] && (_t[131] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c735, fmtDate((_t[131] ?? ''))),
        ]),
        DsSection(title: gen_app_wizard_orbit_c739, children: [
          SwitchRow(label: gen_app_wizard_orbit_c737, value: _on[280], onChanged: (v) => setState(() => _on[280] = v)),
          if (_on[280]) DsField(label: gen_app_wizard_orbit_c738, hint: '', value: _t[132] ?? '', onChanged: (v) => setState(() => _t[132] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c744, children: [
          SwitchRow(label: gen_app_wizard_orbit_c740, value: _on[281], onChanged: (v) => setState(() => _on[281] = v)),
          if (_on[281]) DsDateField(label: gen_app_wizard_orbit_c741),
          SwitchRow(label: gen_app_wizard_orbit_c742, value: _on[282], onChanged: (v) => setState(() => _on[282] = v)),
          if (_on[282]) DsField(label: gen_app_wizard_orbit_c743, hint: '', value: _t[133] ?? '', onChanged: (v) => setState(() => _t[133] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c751, children: [
          SwitchRow(label: gen_app_wizard_orbit_c745, value: _on[283], onChanged: (v) => setState(() => _on[283] = v)),
          if (_on[283]) DsToggleTile(label: gen_app_wizard_orbit_c746),
          SwitchRow(label: gen_app_wizard_orbit_c747, value: _on[284], onChanged: (v) => setState(() => _on[284] = v)),
          if (_on[284]) DsField(label: gen_app_wizard_orbit_c748, hint: '', value: _t[134] ?? '', onChanged: (v) => setState(() => _t[134] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c749, value: _on[285], onChanged: (v) => setState(() => _on[285] = v)),
          if (_on[285] && (_t[134] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c750, advanceStatus((_t[134] ?? ''))),
        ]),
        SwitchRow(label: gen_app_wizard_orbit_c752, value: _on[286], onChanged: (v) => setState(() => _on[286] = v)),
        if (_on[286]) DsWorkflow(steps: const [gen_app_wizard_orbit_c753, gen_app_wizard_orbit_c754, gen_app_wizard_orbit_c755], current: 0),
      ];
  List<Widget> _s18() => [
        DsSection(title: gen_app_wizard_orbit_c767, children: [
          SwitchRow(label: gen_app_wizard_orbit_c757, value: _on[287], onChanged: (v) => setState(() => _on[287] = v)),
          if (_on[287]) DsNumberField(label: gen_app_wizard_orbit_c758),
          SwitchRow(label: gen_app_wizard_orbit_c759, value: _on[288], onChanged: (v) => setState(() => _on[288] = v)),
          if (_on[288]) DsField(label: gen_app_wizard_orbit_c760, hint: '', value: _t[135] ?? '', onChanged: (v) => setState(() => _t[135] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c761, value: _on[289], onChanged: (v) => setState(() => _on[289] = v)),
          if (_on[289] && (_t[135] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c762, groupThousands((int.tryParse(_t[135] ?? '') ?? 0))),
          SwitchRow(label: gen_app_wizard_orbit_c763, value: _on[290], onChanged: (v) => setState(() => _on[290] = v)),
          if (_on[290] && (_t[135] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c764, phoneKey((_t[135] ?? ''))),
          SwitchRow(label: gen_app_wizard_orbit_c765, value: _on[291], onChanged: (v) => setState(() => _on[291] = v)),
          if (_on[291] && (_t[135] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c766, phoneRegion((_t[135] ?? ''))),
        ]),
        DsSection(title: gen_app_wizard_orbit_c770, children: [
          SwitchRow(label: gen_app_wizard_orbit_c768, value: _on[292], onChanged: (v) => setState(() => _on[292] = v)),
          if (_on[292]) DsField(label: gen_app_wizard_orbit_c769, hint: '', value: _t[136] ?? '', onChanged: (v) => setState(() => _t[136] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c773, children: [
          SwitchRow(label: gen_app_wizard_orbit_c771, value: _on[293], onChanged: (v) => setState(() => _on[293] = v)),
          if (_on[293]) DsField(label: gen_app_wizard_orbit_c772, hint: '', value: _t[137] ?? '', onChanged: (v) => setState(() => _t[137] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c776, children: [
          SwitchRow(label: gen_app_wizard_orbit_c774, value: _on[294], onChanged: (v) => setState(() => _on[294] = v)),
          if (_on[294]) DsField(label: gen_app_wizard_orbit_c775, hint: '', value: _t[138] ?? '', onChanged: (v) => setState(() => _t[138] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c781, children: [
          SwitchRow(label: gen_app_wizard_orbit_c777, value: _on[295], onChanged: (v) => setState(() => _on[295] = v)),
          if (_on[295]) DsDateField(label: gen_app_wizard_orbit_c778),
          SwitchRow(label: gen_app_wizard_orbit_c779, value: _on[296], onChanged: (v) => setState(() => _on[296] = v)),
          if (_on[296]) DsField(label: gen_app_wizard_orbit_c780, hint: '', value: _t[139] ?? '', onChanged: (v) => setState(() => _t[139] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c784, children: [
          SwitchRow(label: gen_app_wizard_orbit_c782, value: _on[297], onChanged: (v) => setState(() => _on[297] = v)),
          if (_on[297]) DsField(label: gen_app_wizard_orbit_c783, hint: '', value: _t[140] ?? '', onChanged: (v) => setState(() => _t[140] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c791, children: [
          SwitchRow(label: gen_app_wizard_orbit_c785, value: _on[298], onChanged: (v) => setState(() => _on[298] = v)),
          if (_on[298]) DsNumberField(label: gen_app_wizard_orbit_c786),
          SwitchRow(label: gen_app_wizard_orbit_c787, value: _on[299], onChanged: (v) => setState(() => _on[299] = v)),
          if (_on[299]) DsField(label: gen_app_wizard_orbit_c788, hint: '', value: _t[141] ?? '', onChanged: (v) => setState(() => _t[141] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c789, value: _on[300], onChanged: (v) => setState(() => _on[300] = v)),
          if (_on[300] && (_t[141] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c790, groupThousands((int.tryParse(_t[141] ?? '') ?? 0))),
        ]),
        DsSection(title: gen_app_wizard_orbit_c798, children: [
          SwitchRow(label: gen_app_wizard_orbit_c792, value: _on[301], onChanged: (v) => setState(() => _on[301] = v)),
          if (_on[301]) DsToggleTile(label: gen_app_wizard_orbit_c793),
          SwitchRow(label: gen_app_wizard_orbit_c794, value: _on[302], onChanged: (v) => setState(() => _on[302] = v)),
          if (_on[302]) DsField(label: gen_app_wizard_orbit_c795, hint: '', value: _t[142] ?? '', onChanged: (v) => setState(() => _t[142] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c796, value: _on[303], onChanged: (v) => setState(() => _on[303] = v)),
          if (_on[303] && (_t[142] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c797, advanceStatus((_t[142] ?? ''))),
        ]),
        SwitchRow(label: gen_app_wizard_orbit_c799, value: _on[304], onChanged: (v) => setState(() => _on[304] = v)),
        if (_on[304]) DsWorkflow(steps: const [gen_app_wizard_orbit_c800, gen_app_wizard_orbit_c801, gen_app_wizard_orbit_c802, gen_app_wizard_orbit_c803, gen_app_wizard_orbit_c804, gen_app_wizard_orbit_c805], current: 0),
      ];
  List<Widget> _s19() => [
        DsSection(title: gen_app_wizard_orbit_c809, children: [
          SwitchRow(label: gen_app_wizard_orbit_c807, value: _on[305], onChanged: (v) => setState(() => _on[305] = v)),
          if (_on[305]) DsField(label: gen_app_wizard_orbit_c808, hint: '', value: _t[143] ?? '', onChanged: (v) => setState(() => _t[143] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c812, children: [
          SwitchRow(label: gen_app_wizard_orbit_c810, value: _on[306], onChanged: (v) => setState(() => _on[306] = v)),
          if (_on[306]) DsField(label: gen_app_wizard_orbit_c811, hint: '', value: _t[144] ?? '', onChanged: (v) => setState(() => _t[144] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c815, children: [
          SwitchRow(label: gen_app_wizard_orbit_c813, value: _on[307], onChanged: (v) => setState(() => _on[307] = v)),
          if (_on[307]) DsField(label: gen_app_wizard_orbit_c814, hint: '', value: _t[145] ?? '', onChanged: (v) => setState(() => _t[145] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c818, children: [
          SwitchRow(label: gen_app_wizard_orbit_c816, value: _on[308], onChanged: (v) => setState(() => _on[308] = v)),
          if (_on[308]) DsField(label: gen_app_wizard_orbit_c817, hint: '', value: _t[146] ?? '', onChanged: (v) => setState(() => _t[146] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c825, children: [
          SwitchRow(label: gen_app_wizard_orbit_c819, value: _on[309], onChanged: (v) => setState(() => _on[309] = v)),
          if (_on[309]) DsDateField(label: gen_app_wizard_orbit_c820),
          SwitchRow(label: gen_app_wizard_orbit_c821, value: _on[310], onChanged: (v) => setState(() => _on[310] = v)),
          if (_on[310]) DsField(label: gen_app_wizard_orbit_c822, hint: '', value: _t[147] ?? '', onChanged: (v) => setState(() => _t[147] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c823, value: _on[311], onChanged: (v) => setState(() => _on[311] = v)),
          if (_on[311] && (_t[147] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c824, fmtDate((_t[147] ?? ''))),
        ]),
        DsSection(title: gen_app_wizard_orbit_c828, children: [
          SwitchRow(label: gen_app_wizard_orbit_c826, value: _on[312], onChanged: (v) => setState(() => _on[312] = v)),
          if (_on[312]) DsField(label: gen_app_wizard_orbit_c827, hint: '', value: _t[148] ?? '', onChanged: (v) => setState(() => _t[148] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c835, children: [
          SwitchRow(label: gen_app_wizard_orbit_c829, value: _on[313], onChanged: (v) => setState(() => _on[313] = v)),
          if (_on[313]) DsToggleTile(label: gen_app_wizard_orbit_c830),
          SwitchRow(label: gen_app_wizard_orbit_c831, value: _on[314], onChanged: (v) => setState(() => _on[314] = v)),
          if (_on[314]) DsField(label: gen_app_wizard_orbit_c832, hint: '', value: _t[149] ?? '', onChanged: (v) => setState(() => _t[149] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c833, value: _on[315], onChanged: (v) => setState(() => _on[315] = v)),
          if (_on[315] && (_t[149] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c834, advanceStatus((_t[149] ?? ''))),
        ]),
        SwitchRow(label: gen_app_wizard_orbit_c836, value: _on[316], onChanged: (v) => setState(() => _on[316] = v)),
        if (_on[316]) DsWorkflow(steps: const [gen_app_wizard_orbit_c837, gen_app_wizard_orbit_c838, gen_app_wizard_orbit_c839, gen_app_wizard_orbit_c840, gen_app_wizard_orbit_c841], current: 0),
      ];
  List<Widget> _s20() => [
        DsSection(title: gen_app_wizard_orbit_c853, children: [
          SwitchRow(label: gen_app_wizard_orbit_c843, value: _on[317], onChanged: (v) => setState(() => _on[317] = v)),
          if (_on[317]) DsNumberField(label: gen_app_wizard_orbit_c844),
          SwitchRow(label: gen_app_wizard_orbit_c845, value: _on[318], onChanged: (v) => setState(() => _on[318] = v)),
          if (_on[318]) DsField(label: gen_app_wizard_orbit_c846, hint: '', value: _t[150] ?? '', onChanged: (v) => setState(() => _t[150] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c847, value: _on[319], onChanged: (v) => setState(() => _on[319] = v)),
          if (_on[319] && (_t[150] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c848, groupThousands((int.tryParse(_t[150] ?? '') ?? 0))),
          SwitchRow(label: gen_app_wizard_orbit_c849, value: _on[320], onChanged: (v) => setState(() => _on[320] = v)),
          if (_on[320] && (_t[150] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c850, phoneKey((_t[150] ?? ''))),
          SwitchRow(label: gen_app_wizard_orbit_c851, value: _on[321], onChanged: (v) => setState(() => _on[321] = v)),
          if (_on[321] && (_t[150] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c852, phoneRegion((_t[150] ?? ''))),
        ]),
        DsSection(title: gen_app_wizard_orbit_c856, children: [
          SwitchRow(label: gen_app_wizard_orbit_c854, value: _on[322], onChanged: (v) => setState(() => _on[322] = v)),
          if (_on[322]) DsField(label: gen_app_wizard_orbit_c855, hint: '', value: _t[151] ?? '', onChanged: (v) => setState(() => _t[151] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c859, children: [
          SwitchRow(label: gen_app_wizard_orbit_c857, value: _on[323], onChanged: (v) => setState(() => _on[323] = v)),
          if (_on[323]) DsField(label: gen_app_wizard_orbit_c858, hint: '', value: _t[152] ?? '', onChanged: (v) => setState(() => _t[152] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c864, children: [
          SwitchRow(label: gen_app_wizard_orbit_c860, value: _on[324], onChanged: (v) => setState(() => _on[324] = v)),
          if (_on[324]) DsNumberField(label: gen_app_wizard_orbit_c861),
          SwitchRow(label: gen_app_wizard_orbit_c862, value: _on[325], onChanged: (v) => setState(() => _on[325] = v)),
          if (_on[325]) DsField(label: gen_app_wizard_orbit_c863, hint: '', value: _t[153] ?? '', onChanged: (v) => setState(() => _t[153] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c871, children: [
          SwitchRow(label: gen_app_wizard_orbit_c865, value: _on[326], onChanged: (v) => setState(() => _on[326] = v)),
          if (_on[326]) DsNumberField(label: gen_app_wizard_orbit_c866),
          SwitchRow(label: gen_app_wizard_orbit_c867, value: _on[327], onChanged: (v) => setState(() => _on[327] = v)),
          if (_on[327]) DsField(label: gen_app_wizard_orbit_c868, hint: '', value: _t[154] ?? '', onChanged: (v) => setState(() => _t[154] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c869, value: _on[328], onChanged: (v) => setState(() => _on[328] = v)),
          if (_on[328] && (_t[154] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c870, groupThousands((int.tryParse(_t[154] ?? '') ?? 0))),
        ]),
        DsSection(title: gen_app_wizard_orbit_c874, children: [
          SwitchRow(label: gen_app_wizard_orbit_c872, value: _on[329], onChanged: (v) => setState(() => _on[329] = v)),
          if (_on[329]) DsField(label: gen_app_wizard_orbit_c873, hint: '', value: _t[155] ?? '', onChanged: (v) => setState(() => _t[155] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c881, children: [
          SwitchRow(label: gen_app_wizard_orbit_c875, value: _on[330], onChanged: (v) => setState(() => _on[330] = v)),
          if (_on[330]) DsToggleTile(label: gen_app_wizard_orbit_c876),
          SwitchRow(label: gen_app_wizard_orbit_c877, value: _on[331], onChanged: (v) => setState(() => _on[331] = v)),
          if (_on[331]) DsField(label: gen_app_wizard_orbit_c878, hint: '', value: _t[156] ?? '', onChanged: (v) => setState(() => _t[156] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c879, value: _on[332], onChanged: (v) => setState(() => _on[332] = v)),
          if (_on[332] && (_t[156] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c880, advanceStatus((_t[156] ?? ''))),
        ]),
        SwitchRow(label: gen_app_wizard_orbit_c882, value: _on[333], onChanged: (v) => setState(() => _on[333] = v)),
        if (_on[333]) DsWorkflow(steps: const [gen_app_wizard_orbit_c883, gen_app_wizard_orbit_c884, gen_app_wizard_orbit_c885, gen_app_wizard_orbit_c886, gen_app_wizard_orbit_c887], current: 0),
      ];
  List<Widget> _s21() => [
        DsSection(title: gen_app_wizard_orbit_c891, children: [
          SwitchRow(label: gen_app_wizard_orbit_c889, value: _on[334], onChanged: (v) => setState(() => _on[334] = v)),
          if (_on[334]) DsField(label: gen_app_wizard_orbit_c890, hint: '', value: _t[157] ?? '', onChanged: (v) => setState(() => _t[157] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c894, children: [
          SwitchRow(label: gen_app_wizard_orbit_c892, value: _on[335], onChanged: (v) => setState(() => _on[335] = v)),
          if (_on[335]) DsField(label: gen_app_wizard_orbit_c893, hint: '', value: _t[158] ?? '', onChanged: (v) => setState(() => _t[158] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c897, children: [
          SwitchRow(label: gen_app_wizard_orbit_c895, value: _on[336], onChanged: (v) => setState(() => _on[336] = v)),
          if (_on[336]) DsField(label: gen_app_wizard_orbit_c896, hint: '', value: _t[159] ?? '', onChanged: (v) => setState(() => _t[159] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c900, children: [
          SwitchRow(label: gen_app_wizard_orbit_c898, value: _on[337], onChanged: (v) => setState(() => _on[337] = v)),
          if (_on[337]) DsField(label: gen_app_wizard_orbit_c899, hint: '', value: _t[160] ?? '', onChanged: (v) => setState(() => _t[160] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c907, children: [
          SwitchRow(label: gen_app_wizard_orbit_c901, value: _on[338], onChanged: (v) => setState(() => _on[338] = v)),
          if (_on[338]) DsDateField(label: gen_app_wizard_orbit_c902),
          SwitchRow(label: gen_app_wizard_orbit_c903, value: _on[339], onChanged: (v) => setState(() => _on[339] = v)),
          if (_on[339]) DsField(label: gen_app_wizard_orbit_c904, hint: '', value: _t[161] ?? '', onChanged: (v) => setState(() => _t[161] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c905, value: _on[340], onChanged: (v) => setState(() => _on[340] = v)),
          if (_on[340] && (_t[161] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c906, fmtDate((_t[161] ?? ''))),
        ]),
        DsSection(title: gen_app_wizard_orbit_c910, children: [
          SwitchRow(label: gen_app_wizard_orbit_c908, value: _on[341], onChanged: (v) => setState(() => _on[341] = v)),
          if (_on[341]) DsField(label: gen_app_wizard_orbit_c909, hint: '', value: _t[162] ?? '', onChanged: (v) => setState(() => _t[162] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c917, children: [
          SwitchRow(label: gen_app_wizard_orbit_c911, value: _on[342], onChanged: (v) => setState(() => _on[342] = v)),
          if (_on[342]) DsToggleTile(label: gen_app_wizard_orbit_c912),
          SwitchRow(label: gen_app_wizard_orbit_c913, value: _on[343], onChanged: (v) => setState(() => _on[343] = v)),
          if (_on[343]) DsField(label: gen_app_wizard_orbit_c914, hint: '', value: _t[163] ?? '', onChanged: (v) => setState(() => _t[163] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c915, value: _on[344], onChanged: (v) => setState(() => _on[344] = v)),
          if (_on[344] && (_t[163] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c916, advanceStatus((_t[163] ?? ''))),
        ]),
      ];
  List<Widget> _s22() => [
        DsSection(title: gen_app_wizard_orbit_c929, children: [
          SwitchRow(label: gen_app_wizard_orbit_c919, value: _on[345], onChanged: (v) => setState(() => _on[345] = v)),
          if (_on[345]) DsNumberField(label: gen_app_wizard_orbit_c920),
          SwitchRow(label: gen_app_wizard_orbit_c921, value: _on[346], onChanged: (v) => setState(() => _on[346] = v)),
          if (_on[346]) DsField(label: gen_app_wizard_orbit_c922, hint: '', value: _t[164] ?? '', onChanged: (v) => setState(() => _t[164] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c923, value: _on[347], onChanged: (v) => setState(() => _on[347] = v)),
          if (_on[347] && (_t[164] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c924, groupThousands((int.tryParse(_t[164] ?? '') ?? 0))),
          SwitchRow(label: gen_app_wizard_orbit_c925, value: _on[348], onChanged: (v) => setState(() => _on[348] = v)),
          if (_on[348] && (_t[164] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c926, phoneKey((_t[164] ?? ''))),
          SwitchRow(label: gen_app_wizard_orbit_c927, value: _on[349], onChanged: (v) => setState(() => _on[349] = v)),
          if (_on[349] && (_t[164] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c928, phoneRegion((_t[164] ?? ''))),
        ]),
        DsSection(title: gen_app_wizard_orbit_c932, children: [
          SwitchRow(label: gen_app_wizard_orbit_c930, value: _on[350], onChanged: (v) => setState(() => _on[350] = v)),
          if (_on[350]) DsField(label: gen_app_wizard_orbit_c931, hint: '', value: _t[165] ?? '', onChanged: (v) => setState(() => _t[165] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c935, children: [
          SwitchRow(label: gen_app_wizard_orbit_c933, value: _on[351], onChanged: (v) => setState(() => _on[351] = v)),
          if (_on[351]) DsField(label: gen_app_wizard_orbit_c934, hint: '', value: _t[166] ?? '', onChanged: (v) => setState(() => _t[166] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c938, children: [
          SwitchRow(label: gen_app_wizard_orbit_c936, value: _on[352], onChanged: (v) => setState(() => _on[352] = v)),
          if (_on[352]) DsField(label: gen_app_wizard_orbit_c937, hint: '', value: _t[167] ?? '', onChanged: (v) => setState(() => _t[167] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c941, children: [
          SwitchRow(label: gen_app_wizard_orbit_c939, value: _on[353], onChanged: (v) => setState(() => _on[353] = v)),
          if (_on[353]) DsField(label: gen_app_wizard_orbit_c940, hint: '', value: _t[168] ?? '', onChanged: (v) => setState(() => _t[168] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c948, children: [
          SwitchRow(label: gen_app_wizard_orbit_c942, value: _on[354], onChanged: (v) => setState(() => _on[354] = v)),
          if (_on[354]) DsDateField(label: gen_app_wizard_orbit_c943),
          SwitchRow(label: gen_app_wizard_orbit_c944, value: _on[355], onChanged: (v) => setState(() => _on[355] = v)),
          if (_on[355]) DsField(label: gen_app_wizard_orbit_c945, hint: '', value: _t[169] ?? '', onChanged: (v) => setState(() => _t[169] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c946, value: _on[356], onChanged: (v) => setState(() => _on[356] = v)),
          if (_on[356] && (_t[169] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c947, fmtDate((_t[169] ?? ''))),
        ]),
        DsSection(title: gen_app_wizard_orbit_c955, children: [
          SwitchRow(label: gen_app_wizard_orbit_c949, value: _on[357], onChanged: (v) => setState(() => _on[357] = v)),
          if (_on[357]) DsToggleTile(label: gen_app_wizard_orbit_c950),
          SwitchRow(label: gen_app_wizard_orbit_c951, value: _on[358], onChanged: (v) => setState(() => _on[358] = v)),
          if (_on[358]) DsField(label: gen_app_wizard_orbit_c952, hint: '', value: _t[170] ?? '', onChanged: (v) => setState(() => _t[170] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c953, value: _on[359], onChanged: (v) => setState(() => _on[359] = v)),
          if (_on[359] && (_t[170] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c954, advanceStatus((_t[170] ?? ''))),
        ]),
        SwitchRow(label: gen_app_wizard_orbit_c956, value: _on[360], onChanged: (v) => setState(() => _on[360] = v)),
        if (_on[360]) DsWorkflow(steps: const [gen_app_wizard_orbit_c957, gen_app_wizard_orbit_c958, gen_app_wizard_orbit_c959, gen_app_wizard_orbit_c960, gen_app_wizard_orbit_c961], current: 0),
      ];
  List<Widget> _s23() => [
        DsSection(title: gen_app_wizard_orbit_c969, children: [
          SwitchRow(label: gen_app_wizard_orbit_c963, value: _on[361], onChanged: (v) => setState(() => _on[361] = v)),
          if (_on[361]) DsDateField(label: gen_app_wizard_orbit_c964),
          SwitchRow(label: gen_app_wizard_orbit_c965, value: _on[362], onChanged: (v) => setState(() => _on[362] = v)),
          if (_on[362]) DsField(label: gen_app_wizard_orbit_c966, hint: '', value: _t[171] ?? '', onChanged: (v) => setState(() => _t[171] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c967, value: _on[363], onChanged: (v) => setState(() => _on[363] = v)),
          if (_on[363] && (_t[171] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c968, fmtDate((_t[171] ?? ''))),
        ]),
        DsSection(title: gen_app_wizard_orbit_c972, children: [
          SwitchRow(label: gen_app_wizard_orbit_c970, value: _on[364], onChanged: (v) => setState(() => _on[364] = v)),
          if (_on[364]) DsField(label: gen_app_wizard_orbit_c971, hint: '', value: _t[172] ?? '', onChanged: (v) => setState(() => _t[172] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c975, children: [
          SwitchRow(label: gen_app_wizard_orbit_c973, value: _on[365], onChanged: (v) => setState(() => _on[365] = v)),
          if (_on[365]) DsField(label: gen_app_wizard_orbit_c974, hint: '', value: _t[173] ?? '', onChanged: (v) => setState(() => _t[173] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c978, children: [
          SwitchRow(label: gen_app_wizard_orbit_c976, value: _on[366], onChanged: (v) => setState(() => _on[366] = v)),
          if (_on[366]) DsField(label: gen_app_wizard_orbit_c977, hint: '', value: _t[174] ?? '', onChanged: (v) => setState(() => _t[174] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c981, children: [
          SwitchRow(label: gen_app_wizard_orbit_c979, value: _on[367], onChanged: (v) => setState(() => _on[367] = v)),
          if (_on[367]) DsField(label: gen_app_wizard_orbit_c980, hint: '', value: _t[175] ?? '', onChanged: (v) => setState(() => _t[175] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c984, children: [
          SwitchRow(label: gen_app_wizard_orbit_c982, value: _on[368], onChanged: (v) => setState(() => _on[368] = v)),
          if (_on[368]) DsField(label: gen_app_wizard_orbit_c983, hint: '', value: _t[176] ?? '', onChanged: (v) => setState(() => _t[176] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c991, children: [
          SwitchRow(label: gen_app_wizard_orbit_c985, value: _on[369], onChanged: (v) => setState(() => _on[369] = v)),
          if (_on[369]) DsToggleTile(label: gen_app_wizard_orbit_c986),
          SwitchRow(label: gen_app_wizard_orbit_c987, value: _on[370], onChanged: (v) => setState(() => _on[370] = v)),
          if (_on[370]) DsField(label: gen_app_wizard_orbit_c988, hint: '', value: _t[177] ?? '', onChanged: (v) => setState(() => _t[177] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c989, value: _on[371], onChanged: (v) => setState(() => _on[371] = v)),
          if (_on[371] && (_t[177] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c990, advanceStatus((_t[177] ?? ''))),
        ]),
        SwitchRow(label: gen_app_wizard_orbit_c992, value: _on[372], onChanged: (v) => setState(() => _on[372] = v)),
        if (_on[372]) DsWorkflow(steps: const [gen_app_wizard_orbit_c993, gen_app_wizard_orbit_c994, gen_app_wizard_orbit_c995, gen_app_wizard_orbit_c996, gen_app_wizard_orbit_c997], current: 0),
      ];
  List<Widget> _s24() => [
        DsSection(title: gen_app_wizard_orbit_c1001, children: [
          SwitchRow(label: gen_app_wizard_orbit_c999, value: _on[373], onChanged: (v) => setState(() => _on[373] = v)),
          if (_on[373]) DsField(label: gen_app_wizard_orbit_c1000, hint: '', value: _t[178] ?? '', onChanged: (v) => setState(() => _t[178] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c1004, children: [
          SwitchRow(label: gen_app_wizard_orbit_c1002, value: _on[374], onChanged: (v) => setState(() => _on[374] = v)),
          if (_on[374]) DsField(label: gen_app_wizard_orbit_c1003, hint: '', value: _t[179] ?? '', onChanged: (v) => setState(() => _t[179] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c1011, children: [
          SwitchRow(label: gen_app_wizard_orbit_c1005, value: _on[375], onChanged: (v) => setState(() => _on[375] = v)),
          if (_on[375]) DsDateField(label: gen_app_wizard_orbit_c1006),
          SwitchRow(label: gen_app_wizard_orbit_c1007, value: _on[376], onChanged: (v) => setState(() => _on[376] = v)),
          if (_on[376]) DsField(label: gen_app_wizard_orbit_c1008, hint: '', value: _t[180] ?? '', onChanged: (v) => setState(() => _t[180] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1009, value: _on[377], onChanged: (v) => setState(() => _on[377] = v)),
          if (_on[377] && (_t[180] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c1010, fmtDate((_t[180] ?? ''))),
        ]),
        DsSection(title: gen_app_wizard_orbit_c1014, children: [
          SwitchRow(label: gen_app_wizard_orbit_c1012, value: _on[378], onChanged: (v) => setState(() => _on[378] = v)),
          if (_on[378]) DsField(label: gen_app_wizard_orbit_c1013, hint: '', value: _t[181] ?? '', onChanged: (v) => setState(() => _t[181] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c1017, children: [
          SwitchRow(label: gen_app_wizard_orbit_c1015, value: _on[379], onChanged: (v) => setState(() => _on[379] = v)),
          if (_on[379]) DsField(label: gen_app_wizard_orbit_c1016, hint: '', value: _t[182] ?? '', onChanged: (v) => setState(() => _t[182] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c1020, children: [
          SwitchRow(label: gen_app_wizard_orbit_c1018, value: _on[380], onChanged: (v) => setState(() => _on[380] = v)),
          if (_on[380]) DsField(label: gen_app_wizard_orbit_c1019, hint: '', value: _t[183] ?? '', onChanged: (v) => setState(() => _t[183] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c1023, children: [
          SwitchRow(label: gen_app_wizard_orbit_c1021, value: _on[381], onChanged: (v) => setState(() => _on[381] = v)),
          if (_on[381]) DsField(label: gen_app_wizard_orbit_c1022, hint: '', value: _t[184] ?? '', onChanged: (v) => setState(() => _t[184] = v)),
        ]),
      ];
  List<Widget> _s25() => [
        DsSection(title: gen_app_wizard_orbit_c1027, children: [
          SwitchRow(label: gen_app_wizard_orbit_c1025, value: _on[382], onChanged: (v) => setState(() => _on[382] = v)),
          if (_on[382]) DsField(label: gen_app_wizard_orbit_c1026, hint: '', value: _t[185] ?? '', onChanged: (v) => setState(() => _t[185] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c1030, children: [
          SwitchRow(label: gen_app_wizard_orbit_c1028, value: _on[383], onChanged: (v) => setState(() => _on[383] = v)),
          if (_on[383]) DsField(label: gen_app_wizard_orbit_c1029, hint: '', value: _t[186] ?? '', onChanged: (v) => setState(() => _t[186] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c1033, children: [
          SwitchRow(label: gen_app_wizard_orbit_c1031, value: _on[384], onChanged: (v) => setState(() => _on[384] = v)),
          if (_on[384]) DsField(label: gen_app_wizard_orbit_c1032, hint: '', value: _t[187] ?? '', onChanged: (v) => setState(() => _t[187] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c1036, children: [
          SwitchRow(label: gen_app_wizard_orbit_c1034, value: _on[385], onChanged: (v) => setState(() => _on[385] = v)),
          if (_on[385]) DsField(label: gen_app_wizard_orbit_c1035, hint: '', value: _t[188] ?? '', onChanged: (v) => setState(() => _t[188] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c1039, children: [
          SwitchRow(label: gen_app_wizard_orbit_c1037, value: _on[386], onChanged: (v) => setState(() => _on[386] = v)),
          if (_on[386]) DsField(label: gen_app_wizard_orbit_c1038, hint: '', value: _t[189] ?? '', onChanged: (v) => setState(() => _t[189] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c1046, children: [
          SwitchRow(label: gen_app_wizard_orbit_c1040, value: _on[387], onChanged: (v) => setState(() => _on[387] = v)),
          if (_on[387]) DsToggleTile(label: gen_app_wizard_orbit_c1041),
          SwitchRow(label: gen_app_wizard_orbit_c1042, value: _on[388], onChanged: (v) => setState(() => _on[388] = v)),
          if (_on[388]) DsField(label: gen_app_wizard_orbit_c1043, hint: '', value: _t[190] ?? '', onChanged: (v) => setState(() => _t[190] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1044, value: _on[389], onChanged: (v) => setState(() => _on[389] = v)),
          if (_on[389] && (_t[190] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c1045, advanceStatus((_t[190] ?? ''))),
        ]),
        SwitchRow(label: gen_app_wizard_orbit_c1047, value: _on[390], onChanged: (v) => setState(() => _on[390] = v)),
        if (_on[390]) DsWorkflow(steps: const [gen_app_wizard_orbit_c1048, gen_app_wizard_orbit_c1049, gen_app_wizard_orbit_c1050, gen_app_wizard_orbit_c1051, gen_app_wizard_orbit_c1052], current: 0),
      ];
  List<Widget> _s26() => [
        DsSection(title: gen_app_wizard_orbit_c1056, children: [
          SwitchRow(label: gen_app_wizard_orbit_c1054, value: _on[391], onChanged: (v) => setState(() => _on[391] = v)),
          if (_on[391]) DsField(label: gen_app_wizard_orbit_c1055, hint: '', value: _t[191] ?? '', onChanged: (v) => setState(() => _t[191] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c1059, children: [
          SwitchRow(label: gen_app_wizard_orbit_c1057, value: _on[392], onChanged: (v) => setState(() => _on[392] = v)),
          if (_on[392]) DsField(label: gen_app_wizard_orbit_c1058, hint: '', value: _t[192] ?? '', onChanged: (v) => setState(() => _t[192] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c1066, children: [
          SwitchRow(label: gen_app_wizard_orbit_c1060, value: _on[393], onChanged: (v) => setState(() => _on[393] = v)),
          if (_on[393]) DsDateField(label: gen_app_wizard_orbit_c1061),
          SwitchRow(label: gen_app_wizard_orbit_c1062, value: _on[394], onChanged: (v) => setState(() => _on[394] = v)),
          if (_on[394]) DsField(label: gen_app_wizard_orbit_c1063, hint: '', value: _t[193] ?? '', onChanged: (v) => setState(() => _t[193] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1064, value: _on[395], onChanged: (v) => setState(() => _on[395] = v)),
          if (_on[395] && (_t[193] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c1065, fmtDate((_t[193] ?? ''))),
        ]),
        DsSection(title: gen_app_wizard_orbit_c1071, children: [
          SwitchRow(label: gen_app_wizard_orbit_c1067, value: _on[396], onChanged: (v) => setState(() => _on[396] = v)),
          if (_on[396]) DsField(label: gen_app_wizard_orbit_c1068, hint: '', value: _t[194] ?? '', onChanged: (v) => setState(() => _t[194] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1069, value: _on[397], onChanged: (v) => setState(() => _on[397] = v)),
          if (_on[397] && (_t[194] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c1070, weatherIconFor((int.tryParse(_t[194] ?? '') ?? 0))),
        ]),
        DsSection(title: gen_app_wizard_orbit_c1078, children: [
          SwitchRow(label: gen_app_wizard_orbit_c1072, value: _on[398], onChanged: (v) => setState(() => _on[398] = v)),
          if (_on[398]) DsToggleTile(label: gen_app_wizard_orbit_c1073),
          SwitchRow(label: gen_app_wizard_orbit_c1074, value: _on[399], onChanged: (v) => setState(() => _on[399] = v)),
          if (_on[399]) DsField(label: gen_app_wizard_orbit_c1075, hint: '', value: _t[195] ?? '', onChanged: (v) => setState(() => _t[195] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1076, value: _on[400], onChanged: (v) => setState(() => _on[400] = v)),
          if (_on[400] && (_t[195] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c1077, advanceStatus((_t[195] ?? ''))),
        ]),
        SwitchRow(label: gen_app_wizard_orbit_c1079, value: _on[401], onChanged: (v) => setState(() => _on[401] = v)),
        if (_on[401]) DsWorkflow(steps: const [gen_app_wizard_orbit_c1080, gen_app_wizard_orbit_c1081, gen_app_wizard_orbit_c1082, gen_app_wizard_orbit_c1083, gen_app_wizard_orbit_c1084], current: 0),
      ];
  List<Widget> _s27() => [
        DsSection(title: gen_app_wizard_orbit_c1088, children: [
          SwitchRow(label: gen_app_wizard_orbit_c1086, value: _on[402], onChanged: (v) => setState(() => _on[402] = v)),
          if (_on[402]) DsField(label: gen_app_wizard_orbit_c1087, hint: '', value: _t[196] ?? '', onChanged: (v) => setState(() => _t[196] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c1093, children: [
          SwitchRow(label: gen_app_wizard_orbit_c1089, value: _on[403], onChanged: (v) => setState(() => _on[403] = v)),
          if (_on[403]) DsField(label: gen_app_wizard_orbit_c1090, hint: '', value: _t[197] ?? '', onChanged: (v) => setState(() => _t[197] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1091, value: _on[404], onChanged: (v) => setState(() => _on[404] = v)),
          if (_on[404] && (_t[197] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c1092, phoneRegion((_t[197] ?? ''))),
        ]),
        DsSection(title: gen_app_wizard_orbit_c1096, children: [
          SwitchRow(label: gen_app_wizard_orbit_c1094, value: _on[405], onChanged: (v) => setState(() => _on[405] = v)),
          if (_on[405]) DsField(label: gen_app_wizard_orbit_c1095, hint: '', value: _t[198] ?? '', onChanged: (v) => setState(() => _t[198] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c1101, children: [
          SwitchRow(label: gen_app_wizard_orbit_c1097, value: _on[406], onChanged: (v) => setState(() => _on[406] = v)),
          if (_on[406]) DsDateField(label: gen_app_wizard_orbit_c1098),
          SwitchRow(label: gen_app_wizard_orbit_c1099, value: _on[407], onChanged: (v) => setState(() => _on[407] = v)),
          if (_on[407]) DsField(label: gen_app_wizard_orbit_c1100, hint: '', value: _t[199] ?? '', onChanged: (v) => setState(() => _t[199] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c1104, children: [
          SwitchRow(label: gen_app_wizard_orbit_c1102, value: _on[408], onChanged: (v) => setState(() => _on[408] = v)),
          if (_on[408]) DsField(label: gen_app_wizard_orbit_c1103, hint: '', value: _t[200] ?? '', onChanged: (v) => setState(() => _t[200] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c1111, children: [
          SwitchRow(label: gen_app_wizard_orbit_c1105, value: _on[409], onChanged: (v) => setState(() => _on[409] = v)),
          if (_on[409]) DsToggleTile(label: gen_app_wizard_orbit_c1106),
          SwitchRow(label: gen_app_wizard_orbit_c1107, value: _on[410], onChanged: (v) => setState(() => _on[410] = v)),
          if (_on[410]) DsField(label: gen_app_wizard_orbit_c1108, hint: '', value: _t[201] ?? '', onChanged: (v) => setState(() => _t[201] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1109, value: _on[411], onChanged: (v) => setState(() => _on[411] = v)),
          if (_on[411] && (_t[201] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c1110, advanceStatus((_t[201] ?? ''))),
        ]),
        SwitchRow(label: gen_app_wizard_orbit_c1112, value: _on[412], onChanged: (v) => setState(() => _on[412] = v)),
        if (_on[412]) DsWorkflow(steps: const [gen_app_wizard_orbit_c1113, gen_app_wizard_orbit_c1114, gen_app_wizard_orbit_c1115, gen_app_wizard_orbit_c1116], current: 0),
      ];
  List<Widget> _s28() => [
        DsSection(title: gen_app_wizard_orbit_c1128, children: [
          SwitchRow(label: gen_app_wizard_orbit_c1118, value: _on[413], onChanged: (v) => setState(() => _on[413] = v)),
          if (_on[413]) DsNumberField(label: gen_app_wizard_orbit_c1119),
          SwitchRow(label: gen_app_wizard_orbit_c1120, value: _on[414], onChanged: (v) => setState(() => _on[414] = v)),
          if (_on[414]) DsField(label: gen_app_wizard_orbit_c1121, hint: '', value: _t[202] ?? '', onChanged: (v) => setState(() => _t[202] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1122, value: _on[415], onChanged: (v) => setState(() => _on[415] = v)),
          if (_on[415] && (_t[202] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c1123, groupThousands((int.tryParse(_t[202] ?? '') ?? 0))),
          SwitchRow(label: gen_app_wizard_orbit_c1124, value: _on[416], onChanged: (v) => setState(() => _on[416] = v)),
          if (_on[416] && (_t[202] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c1125, phoneKey((_t[202] ?? ''))),
          SwitchRow(label: gen_app_wizard_orbit_c1126, value: _on[417], onChanged: (v) => setState(() => _on[417] = v)),
          if (_on[417] && (_t[202] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c1127, phoneRegion((_t[202] ?? ''))),
        ]),
        DsSection(title: gen_app_wizard_orbit_c1131, children: [
          SwitchRow(label: gen_app_wizard_orbit_c1129, value: _on[418], onChanged: (v) => setState(() => _on[418] = v)),
          if (_on[418]) DsField(label: gen_app_wizard_orbit_c1130, hint: '', value: _t[203] ?? '', onChanged: (v) => setState(() => _t[203] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c1134, children: [
          SwitchRow(label: gen_app_wizard_orbit_c1132, value: _on[419], onChanged: (v) => setState(() => _on[419] = v)),
          if (_on[419]) DsField(label: gen_app_wizard_orbit_c1133, hint: '', value: _t[204] ?? '', onChanged: (v) => setState(() => _t[204] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c1139, children: [
          SwitchRow(label: gen_app_wizard_orbit_c1135, value: _on[420], onChanged: (v) => setState(() => _on[420] = v)),
          if (_on[420]) DsNumberField(label: gen_app_wizard_orbit_c1136),
          SwitchRow(label: gen_app_wizard_orbit_c1137, value: _on[421], onChanged: (v) => setState(() => _on[421] = v)),
          if (_on[421]) DsField(label: gen_app_wizard_orbit_c1138, hint: '', value: _t[205] ?? '', onChanged: (v) => setState(() => _t[205] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c1142, children: [
          SwitchRow(label: gen_app_wizard_orbit_c1140, value: _on[422], onChanged: (v) => setState(() => _on[422] = v)),
          if (_on[422]) DsField(label: gen_app_wizard_orbit_c1141, hint: '', value: _t[206] ?? '', onChanged: (v) => setState(() => _t[206] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c1149, children: [
          SwitchRow(label: gen_app_wizard_orbit_c1143, value: _on[423], onChanged: (v) => setState(() => _on[423] = v)),
          if (_on[423]) DsDateField(label: gen_app_wizard_orbit_c1144),
          SwitchRow(label: gen_app_wizard_orbit_c1145, value: _on[424], onChanged: (v) => setState(() => _on[424] = v)),
          if (_on[424]) DsField(label: gen_app_wizard_orbit_c1146, hint: '', value: _t[207] ?? '', onChanged: (v) => setState(() => _t[207] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1147, value: _on[425], onChanged: (v) => setState(() => _on[425] = v)),
          if (_on[425] && (_t[207] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c1148, fmtDate((_t[207] ?? ''))),
        ]),
        DsSection(title: gen_app_wizard_orbit_c1156, children: [
          SwitchRow(label: gen_app_wizard_orbit_c1150, value: _on[426], onChanged: (v) => setState(() => _on[426] = v)),
          if (_on[426]) DsToggleTile(label: gen_app_wizard_orbit_c1151),
          SwitchRow(label: gen_app_wizard_orbit_c1152, value: _on[427], onChanged: (v) => setState(() => _on[427] = v)),
          if (_on[427]) DsField(label: gen_app_wizard_orbit_c1153, hint: '', value: _t[208] ?? '', onChanged: (v) => setState(() => _t[208] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1154, value: _on[428], onChanged: (v) => setState(() => _on[428] = v)),
          if (_on[428] && (_t[208] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c1155, advanceStatus((_t[208] ?? ''))),
        ]),
        SwitchRow(label: gen_app_wizard_orbit_c1157, value: _on[429], onChanged: (v) => setState(() => _on[429] = v)),
        if (_on[429]) DsWorkflow(steps: const [gen_app_wizard_orbit_c1158, gen_app_wizard_orbit_c1159, gen_app_wizard_orbit_c1160, gen_app_wizard_orbit_c1161], current: 0),
      ];
  List<Widget> _s29() => [
        DsSection(title: gen_app_wizard_orbit_c1165, children: [
          SwitchRow(label: gen_app_wizard_orbit_c1163, value: _on[430], onChanged: (v) => setState(() => _on[430] = v)),
          if (_on[430]) DsField(label: gen_app_wizard_orbit_c1164, hint: '', value: _t[209] ?? '', onChanged: (v) => setState(() => _t[209] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c1168, children: [
          SwitchRow(label: gen_app_wizard_orbit_c1166, value: _on[431], onChanged: (v) => setState(() => _on[431] = v)),
          if (_on[431]) DsField(label: gen_app_wizard_orbit_c1167, hint: '', value: _t[210] ?? '', onChanged: (v) => setState(() => _t[210] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c1173, children: [
          SwitchRow(label: gen_app_wizard_orbit_c1169, value: _on[432], onChanged: (v) => setState(() => _on[432] = v)),
          if (_on[432]) DsNumberField(label: gen_app_wizard_orbit_c1170),
          SwitchRow(label: gen_app_wizard_orbit_c1171, value: _on[433], onChanged: (v) => setState(() => _on[433] = v)),
          if (_on[433]) DsField(label: gen_app_wizard_orbit_c1172, hint: '', value: _t[211] ?? '', onChanged: (v) => setState(() => _t[211] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c1178, children: [
          SwitchRow(label: gen_app_wizard_orbit_c1174, value: _on[434], onChanged: (v) => setState(() => _on[434] = v)),
          if (_on[434]) DsField(label: gen_app_wizard_orbit_c1175, hint: '', value: _t[212] ?? '', onChanged: (v) => setState(() => _t[212] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1176, value: _on[435], onChanged: (v) => setState(() => _on[435] = v)),
          if (_on[435] && (_t[212] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c1177, fMoney((num.tryParse(_t[212] ?? '') ?? 0))),
        ]),
        DsSection(title: gen_app_wizard_orbit_c1181, children: [
          SwitchRow(label: gen_app_wizard_orbit_c1179, value: _on[436], onChanged: (v) => setState(() => _on[436] = v)),
          if (_on[436]) DsField(label: gen_app_wizard_orbit_c1180, hint: '', value: _t[213] ?? '', onChanged: (v) => setState(() => _t[213] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c1184, children: [
          SwitchRow(label: gen_app_wizard_orbit_c1182, value: _on[437], onChanged: (v) => setState(() => _on[437] = v)),
          if (_on[437]) DsField(label: gen_app_wizard_orbit_c1183, hint: '', value: _t[214] ?? '', onChanged: (v) => setState(() => _t[214] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c1191, children: [
          SwitchRow(label: gen_app_wizard_orbit_c1185, value: _on[438], onChanged: (v) => setState(() => _on[438] = v)),
          if (_on[438]) DsToggleTile(label: gen_app_wizard_orbit_c1186),
          SwitchRow(label: gen_app_wizard_orbit_c1187, value: _on[439], onChanged: (v) => setState(() => _on[439] = v)),
          if (_on[439]) DsField(label: gen_app_wizard_orbit_c1188, hint: '', value: _t[215] ?? '', onChanged: (v) => setState(() => _t[215] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1189, value: _on[440], onChanged: (v) => setState(() => _on[440] = v)),
          if (_on[440] && (_t[215] ?? '').trim().isNotEmpty) _live(gen_app_wizard_orbit_c1190, advanceStatus((_t[215] ?? ''))),
        ]),
        SwitchRow(label: gen_app_wizard_orbit_c1192, value: _on[441], onChanged: (v) => setState(() => _on[441] = v)),
        if (_on[441]) DsWorkflow(steps: const [gen_app_wizard_orbit_c1193, gen_app_wizard_orbit_c1194, gen_app_wizard_orbit_c1195, gen_app_wizard_orbit_c1196, gen_app_wizard_orbit_c1197], current: 0),
      ];
  List<Widget> _s30() => [
        DsSection(title: gen_app_wizard_orbit_c1208, children: [
          SwitchRow(label: gen_app_wizard_orbit_c1199, value: _on[442], onChanged: (v) => setState(() => _on[442] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1200, value: _on[443], onChanged: (v) => setState(() => _on[443] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1201, value: _on[444], onChanged: (v) => setState(() => _on[444] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1202, value: _on[445], onChanged: (v) => setState(() => _on[445] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1203, value: _on[446], onChanged: (v) => setState(() => _on[446] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1204, value: _on[447], onChanged: (v) => setState(() => _on[447] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1205, value: _on[448], onChanged: (v) => setState(() => _on[448] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1206, value: _on[449], onChanged: (v) => setState(() => _on[449] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1207, value: _on[450], onChanged: (v) => setState(() => _on[450] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c1217, children: [
          SwitchRow(label: gen_app_wizard_orbit_c1209, value: _on[451], onChanged: (v) => setState(() => _on[451] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1210, value: _on[452], onChanged: (v) => setState(() => _on[452] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1211, value: _on[453], onChanged: (v) => setState(() => _on[453] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1212, value: _on[454], onChanged: (v) => setState(() => _on[454] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1213, value: _on[455], onChanged: (v) => setState(() => _on[455] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1214, value: _on[456], onChanged: (v) => setState(() => _on[456] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1215, value: _on[457], onChanged: (v) => setState(() => _on[457] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1216, value: _on[458], onChanged: (v) => setState(() => _on[458] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c1230, children: [
          SwitchRow(label: gen_app_wizard_orbit_c1218, value: _on[459], onChanged: (v) => setState(() => _on[459] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1219, value: _on[460], onChanged: (v) => setState(() => _on[460] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1220, value: _on[461], onChanged: (v) => setState(() => _on[461] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1221, value: _on[462], onChanged: (v) => setState(() => _on[462] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1222, value: _on[463], onChanged: (v) => setState(() => _on[463] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1223, value: _on[464], onChanged: (v) => setState(() => _on[464] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1224, value: _on[465], onChanged: (v) => setState(() => _on[465] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1225, value: _on[466], onChanged: (v) => setState(() => _on[466] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1226, value: _on[467], onChanged: (v) => setState(() => _on[467] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1227, value: _on[468], onChanged: (v) => setState(() => _on[468] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1228, value: _on[469], onChanged: (v) => setState(() => _on[469] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1229, value: _on[470], onChanged: (v) => setState(() => _on[470] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c1241, children: [
          SwitchRow(label: gen_app_wizard_orbit_c1231, value: _on[471], onChanged: (v) => setState(() => _on[471] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1232, value: _on[472], onChanged: (v) => setState(() => _on[472] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1233, value: _on[473], onChanged: (v) => setState(() => _on[473] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1234, value: _on[474], onChanged: (v) => setState(() => _on[474] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1235, value: _on[475], onChanged: (v) => setState(() => _on[475] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1236, value: _on[476], onChanged: (v) => setState(() => _on[476] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1237, value: _on[477], onChanged: (v) => setState(() => _on[477] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1238, value: _on[478], onChanged: (v) => setState(() => _on[478] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1239, value: _on[479], onChanged: (v) => setState(() => _on[479] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1240, value: _on[480], onChanged: (v) => setState(() => _on[480] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c1250, children: [
          SwitchRow(label: gen_app_wizard_orbit_c1242, value: _on[481], onChanged: (v) => setState(() => _on[481] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1243, value: _on[482], onChanged: (v) => setState(() => _on[482] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1244, value: _on[483], onChanged: (v) => setState(() => _on[483] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1245, value: _on[484], onChanged: (v) => setState(() => _on[484] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1246, value: _on[485], onChanged: (v) => setState(() => _on[485] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1247, value: _on[486], onChanged: (v) => setState(() => _on[486] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1248, value: _on[487], onChanged: (v) => setState(() => _on[487] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1249, value: _on[488], onChanged: (v) => setState(() => _on[488] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c1260, children: [
          SwitchRow(label: gen_app_wizard_orbit_c1251, value: _on[489], onChanged: (v) => setState(() => _on[489] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1252, value: _on[490], onChanged: (v) => setState(() => _on[490] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1253, value: _on[491], onChanged: (v) => setState(() => _on[491] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1254, value: _on[492], onChanged: (v) => setState(() => _on[492] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1255, value: _on[493], onChanged: (v) => setState(() => _on[493] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1256, value: _on[494], onChanged: (v) => setState(() => _on[494] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1257, value: _on[495], onChanged: (v) => setState(() => _on[495] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1258, value: _on[496], onChanged: (v) => setState(() => _on[496] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1259, value: _on[497], onChanged: (v) => setState(() => _on[497] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c1268, children: [
          SwitchRow(label: gen_app_wizard_orbit_c1261, value: _on[498], onChanged: (v) => setState(() => _on[498] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1262, value: _on[499], onChanged: (v) => setState(() => _on[499] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1263, value: _on[500], onChanged: (v) => setState(() => _on[500] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1264, value: _on[501], onChanged: (v) => setState(() => _on[501] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1265, value: _on[502], onChanged: (v) => setState(() => _on[502] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1266, value: _on[503], onChanged: (v) => setState(() => _on[503] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1267, value: _on[504], onChanged: (v) => setState(() => _on[504] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c1278, children: [
          SwitchRow(label: gen_app_wizard_orbit_c1269, value: _on[505], onChanged: (v) => setState(() => _on[505] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1270, value: _on[506], onChanged: (v) => setState(() => _on[506] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1271, value: _on[507], onChanged: (v) => setState(() => _on[507] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1272, value: _on[508], onChanged: (v) => setState(() => _on[508] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1273, value: _on[509], onChanged: (v) => setState(() => _on[509] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1274, value: _on[510], onChanged: (v) => setState(() => _on[510] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1275, value: _on[511], onChanged: (v) => setState(() => _on[511] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1276, value: _on[512], onChanged: (v) => setState(() => _on[512] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1277, value: _on[513], onChanged: (v) => setState(() => _on[513] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c1286, children: [
          SwitchRow(label: gen_app_wizard_orbit_c1279, value: _on[514], onChanged: (v) => setState(() => _on[514] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1280, value: _on[515], onChanged: (v) => setState(() => _on[515] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1281, value: _on[516], onChanged: (v) => setState(() => _on[516] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1282, value: _on[517], onChanged: (v) => setState(() => _on[517] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1283, value: _on[518], onChanged: (v) => setState(() => _on[518] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1284, value: _on[519], onChanged: (v) => setState(() => _on[519] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1285, value: _on[520], onChanged: (v) => setState(() => _on[520] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c1294, children: [
          SwitchRow(label: gen_app_wizard_orbit_c1287, value: _on[521], onChanged: (v) => setState(() => _on[521] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1288, value: _on[522], onChanged: (v) => setState(() => _on[522] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1289, value: _on[523], onChanged: (v) => setState(() => _on[523] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1290, value: _on[524], onChanged: (v) => setState(() => _on[524] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1291, value: _on[525], onChanged: (v) => setState(() => _on[525] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1292, value: _on[526], onChanged: (v) => setState(() => _on[526] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1293, value: _on[527], onChanged: (v) => setState(() => _on[527] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c1302, children: [
          SwitchRow(label: gen_app_wizard_orbit_c1295, value: _on[528], onChanged: (v) => setState(() => _on[528] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1296, value: _on[529], onChanged: (v) => setState(() => _on[529] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1297, value: _on[530], onChanged: (v) => setState(() => _on[530] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1298, value: _on[531], onChanged: (v) => setState(() => _on[531] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1299, value: _on[532], onChanged: (v) => setState(() => _on[532] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1300, value: _on[533], onChanged: (v) => setState(() => _on[533] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1301, value: _on[534], onChanged: (v) => setState(() => _on[534] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c1309, children: [
          SwitchRow(label: gen_app_wizard_orbit_c1303, value: _on[535], onChanged: (v) => setState(() => _on[535] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1304, value: _on[536], onChanged: (v) => setState(() => _on[536] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1305, value: _on[537], onChanged: (v) => setState(() => _on[537] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1306, value: _on[538], onChanged: (v) => setState(() => _on[538] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1307, value: _on[539], onChanged: (v) => setState(() => _on[539] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1308, value: _on[540], onChanged: (v) => setState(() => _on[540] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c1317, children: [
          SwitchRow(label: gen_app_wizard_orbit_c1310, value: _on[541], onChanged: (v) => setState(() => _on[541] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1311, value: _on[542], onChanged: (v) => setState(() => _on[542] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1312, value: _on[543], onChanged: (v) => setState(() => _on[543] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1313, value: _on[544], onChanged: (v) => setState(() => _on[544] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1314, value: _on[545], onChanged: (v) => setState(() => _on[545] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1315, value: _on[546], onChanged: (v) => setState(() => _on[546] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1316, value: _on[547], onChanged: (v) => setState(() => _on[547] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c1325, children: [
          SwitchRow(label: gen_app_wizard_orbit_c1318, value: _on[548], onChanged: (v) => setState(() => _on[548] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1319, value: _on[549], onChanged: (v) => setState(() => _on[549] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1320, value: _on[550], onChanged: (v) => setState(() => _on[550] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1321, value: _on[551], onChanged: (v) => setState(() => _on[551] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1322, value: _on[552], onChanged: (v) => setState(() => _on[552] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1323, value: _on[553], onChanged: (v) => setState(() => _on[553] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1324, value: _on[554], onChanged: (v) => setState(() => _on[554] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c1333, children: [
          SwitchRow(label: gen_app_wizard_orbit_c1326, value: _on[555], onChanged: (v) => setState(() => _on[555] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1327, value: _on[556], onChanged: (v) => setState(() => _on[556] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1328, value: _on[557], onChanged: (v) => setState(() => _on[557] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1329, value: _on[558], onChanged: (v) => setState(() => _on[558] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1330, value: _on[559], onChanged: (v) => setState(() => _on[559] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1331, value: _on[560], onChanged: (v) => setState(() => _on[560] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1332, value: _on[561], onChanged: (v) => setState(() => _on[561] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c1341, children: [
          SwitchRow(label: gen_app_wizard_orbit_c1334, value: _on[562], onChanged: (v) => setState(() => _on[562] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1335, value: _on[563], onChanged: (v) => setState(() => _on[563] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1336, value: _on[564], onChanged: (v) => setState(() => _on[564] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1337, value: _on[565], onChanged: (v) => setState(() => _on[565] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1338, value: _on[566], onChanged: (v) => setState(() => _on[566] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1339, value: _on[567], onChanged: (v) => setState(() => _on[567] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1340, value: _on[568], onChanged: (v) => setState(() => _on[568] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c1350, children: [
          SwitchRow(label: gen_app_wizard_orbit_c1342, value: _on[569], onChanged: (v) => setState(() => _on[569] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1343, value: _on[570], onChanged: (v) => setState(() => _on[570] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1344, value: _on[571], onChanged: (v) => setState(() => _on[571] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1345, value: _on[572], onChanged: (v) => setState(() => _on[572] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1346, value: _on[573], onChanged: (v) => setState(() => _on[573] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1347, value: _on[574], onChanged: (v) => setState(() => _on[574] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1348, value: _on[575], onChanged: (v) => setState(() => _on[575] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1349, value: _on[576], onChanged: (v) => setState(() => _on[576] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c1359, children: [
          SwitchRow(label: gen_app_wizard_orbit_c1351, value: _on[577], onChanged: (v) => setState(() => _on[577] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1352, value: _on[578], onChanged: (v) => setState(() => _on[578] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1353, value: _on[579], onChanged: (v) => setState(() => _on[579] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1354, value: _on[580], onChanged: (v) => setState(() => _on[580] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1355, value: _on[581], onChanged: (v) => setState(() => _on[581] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1356, value: _on[582], onChanged: (v) => setState(() => _on[582] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1357, value: _on[583], onChanged: (v) => setState(() => _on[583] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1358, value: _on[584], onChanged: (v) => setState(() => _on[584] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c1367, children: [
          SwitchRow(label: gen_app_wizard_orbit_c1360, value: _on[585], onChanged: (v) => setState(() => _on[585] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1361, value: _on[586], onChanged: (v) => setState(() => _on[586] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1362, value: _on[587], onChanged: (v) => setState(() => _on[587] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1363, value: _on[588], onChanged: (v) => setState(() => _on[588] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1364, value: _on[589], onChanged: (v) => setState(() => _on[589] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1365, value: _on[590], onChanged: (v) => setState(() => _on[590] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1366, value: _on[591], onChanged: (v) => setState(() => _on[591] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c1375, children: [
          SwitchRow(label: gen_app_wizard_orbit_c1368, value: _on[592], onChanged: (v) => setState(() => _on[592] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1369, value: _on[593], onChanged: (v) => setState(() => _on[593] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1370, value: _on[594], onChanged: (v) => setState(() => _on[594] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1371, value: _on[595], onChanged: (v) => setState(() => _on[595] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1372, value: _on[596], onChanged: (v) => setState(() => _on[596] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1373, value: _on[597], onChanged: (v) => setState(() => _on[597] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1374, value: _on[598], onChanged: (v) => setState(() => _on[598] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c1383, children: [
          SwitchRow(label: gen_app_wizard_orbit_c1376, value: _on[599], onChanged: (v) => setState(() => _on[599] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1377, value: _on[600], onChanged: (v) => setState(() => _on[600] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1378, value: _on[601], onChanged: (v) => setState(() => _on[601] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1379, value: _on[602], onChanged: (v) => setState(() => _on[602] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1380, value: _on[603], onChanged: (v) => setState(() => _on[603] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1381, value: _on[604], onChanged: (v) => setState(() => _on[604] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1382, value: _on[605], onChanged: (v) => setState(() => _on[605] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c1391, children: [
          SwitchRow(label: gen_app_wizard_orbit_c1384, value: _on[606], onChanged: (v) => setState(() => _on[606] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1385, value: _on[607], onChanged: (v) => setState(() => _on[607] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1386, value: _on[608], onChanged: (v) => setState(() => _on[608] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1387, value: _on[609], onChanged: (v) => setState(() => _on[609] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1388, value: _on[610], onChanged: (v) => setState(() => _on[610] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1389, value: _on[611], onChanged: (v) => setState(() => _on[611] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1390, value: _on[612], onChanged: (v) => setState(() => _on[612] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c1399, children: [
          SwitchRow(label: gen_app_wizard_orbit_c1392, value: _on[613], onChanged: (v) => setState(() => _on[613] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1393, value: _on[614], onChanged: (v) => setState(() => _on[614] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1394, value: _on[615], onChanged: (v) => setState(() => _on[615] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1395, value: _on[616], onChanged: (v) => setState(() => _on[616] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1396, value: _on[617], onChanged: (v) => setState(() => _on[617] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1397, value: _on[618], onChanged: (v) => setState(() => _on[618] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1398, value: _on[619], onChanged: (v) => setState(() => _on[619] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c1407, children: [
          SwitchRow(label: gen_app_wizard_orbit_c1400, value: _on[620], onChanged: (v) => setState(() => _on[620] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1401, value: _on[621], onChanged: (v) => setState(() => _on[621] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1402, value: _on[622], onChanged: (v) => setState(() => _on[622] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1403, value: _on[623], onChanged: (v) => setState(() => _on[623] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1404, value: _on[624], onChanged: (v) => setState(() => _on[624] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1405, value: _on[625], onChanged: (v) => setState(() => _on[625] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1406, value: _on[626], onChanged: (v) => setState(() => _on[626] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c1414, children: [
          SwitchRow(label: gen_app_wizard_orbit_c1408, value: _on[627], onChanged: (v) => setState(() => _on[627] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1409, value: _on[628], onChanged: (v) => setState(() => _on[628] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1410, value: _on[629], onChanged: (v) => setState(() => _on[629] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1411, value: _on[630], onChanged: (v) => setState(() => _on[630] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1412, value: _on[631], onChanged: (v) => setState(() => _on[631] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1413, value: _on[632], onChanged: (v) => setState(() => _on[632] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c1420, children: [
          SwitchRow(label: gen_app_wizard_orbit_c1415, value: _on[633], onChanged: (v) => setState(() => _on[633] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1416, value: _on[634], onChanged: (v) => setState(() => _on[634] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1417, value: _on[635], onChanged: (v) => setState(() => _on[635] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1418, value: _on[636], onChanged: (v) => setState(() => _on[636] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1419, value: _on[637], onChanged: (v) => setState(() => _on[637] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c1427, children: [
          SwitchRow(label: gen_app_wizard_orbit_c1421, value: _on[638], onChanged: (v) => setState(() => _on[638] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1422, value: _on[639], onChanged: (v) => setState(() => _on[639] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1423, value: _on[640], onChanged: (v) => setState(() => _on[640] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1424, value: _on[641], onChanged: (v) => setState(() => _on[641] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1425, value: _on[642], onChanged: (v) => setState(() => _on[642] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1426, value: _on[643], onChanged: (v) => setState(() => _on[643] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c1435, children: [
          SwitchRow(label: gen_app_wizard_orbit_c1428, value: _on[644], onChanged: (v) => setState(() => _on[644] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1429, value: _on[645], onChanged: (v) => setState(() => _on[645] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1430, value: _on[646], onChanged: (v) => setState(() => _on[646] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1431, value: _on[647], onChanged: (v) => setState(() => _on[647] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1432, value: _on[648], onChanged: (v) => setState(() => _on[648] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1433, value: _on[649], onChanged: (v) => setState(() => _on[649] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1434, value: _on[650], onChanged: (v) => setState(() => _on[650] = v)),
        ]),
        DsSection(title: gen_app_wizard_orbit_c1443, children: [
          SwitchRow(label: gen_app_wizard_orbit_c1436, value: _on[651], onChanged: (v) => setState(() => _on[651] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1437, value: _on[652], onChanged: (v) => setState(() => _on[652] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1438, value: _on[653], onChanged: (v) => setState(() => _on[653] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1439, value: _on[654], onChanged: (v) => setState(() => _on[654] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1440, value: _on[655], onChanged: (v) => setState(() => _on[655] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1441, value: _on[656], onChanged: (v) => setState(() => _on[656] = v)),
          SwitchRow(label: gen_app_wizard_orbit_c1442, value: _on[657], onChanged: (v) => setState(() => _on[657] = v)),
        ]),
      ];

  List<Widget> _body() {
    switch (_step) {
      case 0: return _s0();
      case 1: return _s1();
      case 2: return _s2();
      case 3: return _s3();
      case 4: return _s4();
      case 5: return _s5();
      case 6: return _s6();
      case 7: return _s7();
      case 8: return _s8();
      case 9: return _s9();
      case 10: return _s10();
      case 11: return _s11();
      case 12: return _s12();
      case 13: return _s13();
      case 14: return _s14();
      case 15: return _s15();
      case 16: return _s16();
      case 17: return _s17();
      case 18: return _s18();
      case 19: return _s19();
      case 20: return _s20();
      case 21: return _s21();
      case 22: return _s22();
      case 23: return _s23();
      case 24: return _s24();
      case 25: return _s25();
      case 26: return _s26();
      case 27: return _s27();
      case 28: return _s28();
      case 29: return _s29();
      case 30: return _s30();
    }
    return const [];
  }

  @override
  Widget build(BuildContext context) {
    return DsScaffold(
      title: gen_app_wizard_orbit_c1453,
      subtitle: gen_app_wizard_orbit_c1454,
      icon: '🧙',
      bottomBar: Row(children: [
        Expanded(child: DsPrimaryButton(label: gen_app_wizard_orbit_c1455, onTap: _step == 0 ? null : () => setState(() => _step--))),
        const SizedBox(width: 12),
        Expanded(child: DsPrimaryButton(label: gen_app_wizard_orbit_c1456, onTap: (_step >= 30 || _err() != null) ? null : () => setState(() => _step++))),
      ]),
      children: [
        DsWorkflow(steps: const [gen_app_wizard_orbit_c0, gen_app_wizard_orbit_c56, gen_app_wizard_orbit_c103, gen_app_wizard_orbit_c185, gen_app_wizard_orbit_c240, gen_app_wizard_orbit_c277, gen_app_wizard_orbit_c321, gen_app_wizard_orbit_c365, gen_app_wizard_orbit_c420, gen_app_wizard_orbit_c452, gen_app_wizard_orbit_c492, gen_app_wizard_orbit_c524, gen_app_wizard_orbit_c563, gen_app_wizard_orbit_c598, gen_app_wizard_orbit_c643, gen_app_wizard_orbit_c677, gen_app_wizard_orbit_c715, gen_app_wizard_orbit_c756, gen_app_wizard_orbit_c806, gen_app_wizard_orbit_c842, gen_app_wizard_orbit_c888, gen_app_wizard_orbit_c918, gen_app_wizard_orbit_c962, gen_app_wizard_orbit_c998, gen_app_wizard_orbit_c1024, gen_app_wizard_orbit_c1053, gen_app_wizard_orbit_c1085, gen_app_wizard_orbit_c1117, gen_app_wizard_orbit_c1162, gen_app_wizard_orbit_c1198, gen_app_wizard_orbit_c1444], current: _step),
        _bar(),
        ..._body(),
      ],
    );
  }
}
