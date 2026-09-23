// 🧽 לוטש ע"י מנוע-המטרות (data-lift v3) — דאטה/מודל/תבנית הורמו ל-props לפי מטרתם, אל תערוך ידנית.
// מוצא: screens__catalog_screen:_AccRow (בנייה-חכמה main) · צרור-2 · מודל-שוטח: 4 שדות · props-שורש: label, label2, onTap, name, emoji, why, price, label3, label4
// התוכן: new/dart-data-bs/auto/screens__catalog_screen_content.dart
import 'package:flutter/material.dart';
import '../ds/ds.dart';
import '../ds/ds_atoms.dart';
import 'bs_tokens.dart';
import 'package:buildsmart/logic/money_format.dart';

class AccRow extends StatelessWidget {
  AccRow({required this.label, required this.label2, required this.name, required this.emoji, required this.why, required this.price, required this.onTap, required this.label3, required this.label4, 
    
    required this.selected,
    required this.qty,
    required this.onQtyChanged,
    this.onToggle,
    this.activeMatch,});
  final String label;
  final String label2;
  final String name;
  final String emoji;
  final String why;
  final int? price;
  final VoidCallback onTap;
  final String label3;
  final String label4;
  final bool selected;
  final int qty;
  final ValueChanged<bool>? onToggle; // null = must item (always on)
  final ValueChanged<int> onQtyChanged;
  final List<String>? activeMatch;

  bool get _isHit =>
      activeMatch == null || activeMatch!.any((m) => name.contains(m));

  @override
  Widget build(BuildContext context) {
    final hit = _isHit;
    return AnimatedOpacity(
      duration: const Duration(milliseconds: 200),
      opacity: activeMatch == null ? 1.0 : (hit ? 1.0 : 0.3),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        margin: const EdgeInsets.only(bottom: 10),
        decoration: hit && activeMatch != null
            ? BoxDecoration(
                borderRadius: BorderRadius.circular(10),
                border: Border.all(
                  color: dsWear(context, DsAtomColors.autoAccRow1, (l) => l.warn).withAlpha(115),
                  width: 1.5),
              )
            : null,
        padding: hit && activeMatch != null
            ? const EdgeInsets.all(6)
            : EdgeInsets.zero,
        child: Row(
          children: [
            // Checkbox / lock — ≥48dp tap target around the 24dp box (a11y);
            // the visible square stays 24dp.
            GestureDetector(
              behavior: HitTestBehavior.opaque,
              onTap: () => onToggle?.call(!selected),
              child: SizedBox(
                width: 48,
                height: 48,
                child: Center(
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 150),
                    width: 24,
                    height: 24,
                    decoration: BoxDecoration(
                      color: selected
                          ? dsWear(context, BsTokens.brand, (l) => l.accent)
                          : dsWear(context, DsAtomColors.autoAccRow2, (l) => l.ink),
                      borderRadius: BorderRadius.circular(6),
                      border: Border.all(
                        color: selected
                            ? dsWear(context, BsTokens.brand, (l) => l.accent)
                            : dsWear(context, DsAtomColors.autoAccRow3, (l) => l.ink),
                      ),
                    ),
                    child: selected
                        ? Icon(Icons.check,
                            color: dsWear(context, DsAtomColors.autoAccRow4, (l) => l.onAccent), size: 13)
                        : null,
                  ),
                ),
              ),
            ),
            const SizedBox(width: 2),
            // Emoji + selected badge
            SizedBox(
              width: 36,
              height: 36,
              child: Stack(
                clipBehavior: Clip.none,
                children: [
                  Container(
                    width: 36,
                    height: 36,
                    decoration: BoxDecoration(
                      color: Theme.of(context).colorScheme.surfaceContainerHighest,
                      shape: BoxShape.circle,
                    ),
                    alignment: Alignment.center,
                    child:
                        Text(emoji, style: const TextStyle(fontSize: 16)),
                  ),
                  if (selected)
                    Positioned(
                      right: -2,
                      bottom: -2,
                      child: Container(
                        width: 16,
                        height: 16,
                        decoration: BoxDecoration(
                          color: dsWear(context, BsTokens.success, (l) => l.success),
                          shape: BoxShape.circle,
                          border: Border.all(
                            color: dsWear(context, DsAtomColors.autoAccRow4, (l) => l.onAccent),
                            width: 1.5,
                          ),
                        ),
                        alignment: Alignment.center,
                        child: Icon(
                          Icons.check,
                          color: dsWear(context, DsAtomColors.autoAccRow4, (l) => l.onAccent),
                          size: 10,
                        ),
                      ),
                    ),
                ],
              ),
            ),
            const SizedBox(width: 10),
            // Name + why
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          name,
                          style: TextStyle(
                            color: dsWear(context, BsTokens.inkLight, (l) => l.ink),
                            fontSize: 13,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ),
                      Semantics(
                        button: true,
                        label: label,
                        child: GestureDetector(
                          behavior: HitTestBehavior.opaque,
                          onTap: onTap,
                          // ≥48dp tap target around the small ⓘ (a11y),
                          // without enlarging the visible glyph.
                          child: SizedBox(
                            width: 48,
                            height: 48,
                            child: Center(
                              child: Icon(
                                Icons.info_outline,
                                color: dsWear(context, BsTokens.brand, (l) => l.accent),
                                size: 16,
                              ),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                  Text(
                    why,
                    style: TextStyle(
                      color: dsWear(context, DsAtomColors.autoAccRow5, (l) => l.muted),
                      fontSize: 11,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 8),
            // Price + mini stepper
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  price != null
                      ? '₪${groupThousands(price! * qty)}'
                      : label2,
                  style: TextStyle(
                    color: selected
                        ? dsWear(context, BsTokens.brand, (l) => l.accent)
                        : dsWear(context, DsAtomColors.autoAccRow6, (l) => l.faint),
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: 4),
                Container(
                  decoration: BoxDecoration(
                    color: dsWear(context, DsAtomColors.autoAccRow7, (l) => l.chipBg),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      _MiniQtyBtn(
                        icon: Icons.remove,
                        onTap: qty > 1
                            ? () => onQtyChanged(qty - 1)
                            : null,
                       label3: label3, label4: label4),
                      SizedBox(
                        width: 22,
                        child: Text(
                          '$qty',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            color: dsWear(context, BsTokens.inkLight, (l) => l.ink),
                            fontSize: 12,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ),
                      _MiniQtyBtn(
                        icon: Icons.add,
                        onTap: () => onQtyChanged(qty + 1),
                       label3: label3, label4: label4),
                    ],
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _MiniQtyBtn extends StatelessWidget {
  _MiniQtyBtn({required this.label3, required this.label4, required this.icon, required this.onTap});
  final String label3;
  final String label4;
  final IconData icon;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return Semantics(
      button: true,
      label: icon == Icons.add ? label3 : label4,
      child: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTap: onTap,
        // ≥48dp tap target (a11y) — the visible +/- glyph stays 12dp; only
        // the hit area (and the grey pill) grows.
        child: SizedBox(
          width: 48,
          height: 48,
          child: Center(
            child: Icon(
              icon,
              size: 12,
              color: onTap != null
                  ? dsWear(context, DsAtomColors.autoAccRow8, (l) => l.bg.withValues(alpha: 0.541))
                  : dsWear(context, DsAtomColors.autoAccRow9, (l) => l.ink),
            ),
          ),
        ),
      ),
    );
  }
}
