// בדיקת-חוזה · connectionMethodLabel — מייבאת אך ורק את האטום-שלה (חוק-4).
// DoD (דיבר-12): dart run --enable-asserts new/dart/connection_method_label_test.dart ⇒ exit 0.
import 'connection_method_label.dart';

class _Prod {
  final String sku;
  const _Prod(this.sku);
}

// sku → קצוות, או חסר (⇒ null, כמו kVerifiedSpecs[sku]==null → install_engine.dart:132-133).
final Map<String, List<ConnEnd>> _ends = {
  'BM': [const ConnEnd(EndType.bspMale, '1/2"')],
  'BF': [const ConnEnd(EndType.bspFemale, '1/2"')],
  'PX': [const ConnEnd(EndType.pexPress, '20')],
  'CU': [const ConnEnd(EndType.copperPress, '22')],
  'DR': [const ConnEnd(EndType.drainOpening, '110')],
  'HD32a': [const ConnEnd(EndType.hdpeCompression, '32')],
  'HD32b': [const ConnEnd(EndType.hdpeCompression, '32')],
  'BM2': [const ConnEnd(EndType.bspMale, '1/2"')], // זכר-מול-זכר: אין התאמה
  // 'RAW' — חסר ⇒ null.
};

List<ConnEnd>? _endsOf(_Prod p) => _ends[p.sku];

String _lbl(String a, String b) =>
    connectionMethodLabel(_Prod(a), _Prod(b), endsOf: _endsOf);

void _eq(String got, String want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got="$got" want="$want"');
}

void main() {
  var n = 0;

  // ── legacy (ללא-trade) — ביט-זהה ל-snapshot הישן ─────────────────────────
  _eq(_lbl('BM', 'BF'), 'תבריג + PTFE', '1 bsp male↔female');            n++;
  _eq(_lbl('PX', 'PX'), 'Press / טבעת כיווץ', '2 pex press');           n++;
  _eq(_lbl('CU', 'CU'), 'Press / O-ring', '3 copper press');            n++;
  _eq(_lbl('DR', 'DR'), 'כיסוי ניקוז', '4 drain opening');              n++;
  _eq(_lbl('HD32a', 'HD32b'), 'אום הידוק (compression)', '5 pipe-shared'); n++;
  _eq(_lbl('BM', 'RAW'), '', '6 no spec ⇒ empty');                      n++;
  _eq(_lbl('BM', 'BM2'), '', '7 male↔male ⇒ no match ⇒ empty');         n++;

  // ── תפר-s41 (trade) ──────────────────────────────────────────────────────
  // #8 — trade לא-plumbing, specOf מחזיר spec לשני הצדדים ⇒ resolve verbatim.
  _eq(
      connectionMethodLabel(
        const _Prod('BM'),
        const _Prod('BF'),
        endsOf: _endsOf,
        trade: TradeResolution<_Prod>(
          tradeId: 'electrical',
          specOf: (p) => p.sku, // spec לא-null לכל sku
          resolve: (a, b) => 'ריתוך',
        ),
      ),
      'ריתוך',
      '8 trade resolve');
  n++;

  // #9 — trade לא-plumbing, spec=null לצד-אחד ⇒ '' (לא-נופל ל-legacy).
  _eq(
      connectionMethodLabel(
        const _Prod('BM'),
        const _Prod('BF'), // legacy היה מחזיר 'תבריג + PTFE' — אך spec-null גובר
        endsOf: _endsOf,
        trade: TradeResolution<_Prod>(
          tradeId: 'electrical',
          specOf: (p) => p.sku == 'BM' ? null : p.sku,
          resolve: (a, b) => 'ריתוך',
        ),
      ),
      '',
      '9 trade null-spec ⇒ empty, not legacy');
  n++;

  // #10 — trade לא-plumbing, resolve זורק ⇒ kill-switch ⇒ נפילה ל-legacy.
  _eq(
      connectionMethodLabel(
        const _Prod('PX'),
        const _Prod('PX'),
        endsOf: _endsOf,
        trade: TradeResolution<_Prod>(
          tradeId: 'electrical',
          specOf: (p) => p.sku,
          resolve: (a, b) => throw StateError('resolver boom'),
        ),
      ),
      'Press / טבעת כיווץ',
      '10 resolver throw ⇒ legacy fallback');
  n++;

  // #11 — trade.tradeId=='plumbing' ⇒ התפר מדולג לגמרי (R1-2), גם עם specOf-זורק.
  _eq(
      connectionMethodLabel(
        const _Prod('PX'),
        const _Prod('PX'),
        endsOf: _endsOf,
        trade: TradeResolution<_Prod>(
          tradeId: 'plumbing',
          specOf: (p) => throw StateError('must never be called'),
          resolve: (a, b) => 'לא-אמור-לרוץ',
        ),
      ),
      'Press / טבעת כיווץ',
      '11 plumbing never delegates ⇒ legacy');
  n++;

  assert(_lbl('BM', 'BF') == 'תבריג + PTFE', 'assert-live guard');
  print('OK connectionMethodLabel: $n asserts passed');
}
