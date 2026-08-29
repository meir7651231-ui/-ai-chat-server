// 🏗️ חולל ע"י המנוע-המרכיב (gen-screen) — אל תערוך ידנית; ערוך את המניפסט.
// מקור: screens__catalog_screen.manifest.json · המסך = דאטה; הקוד הזה = חיווט-בלבד (חוק-2).
// שערים/callbacks/טוקנים מוזרקים ע"י הלוח — אפס-IO, אפס-תוכן, אפס-הכרעות כאן.
import 'package:flutter/material.dart';
import '../dart-ui-bs/auto/acc_row.dart';
import '../dart-ui-bs/auto/axis_chip.dart';
import '../dart-ui-bs/auto/catalog_count_badge.dart';
import '../dart-ui-bs/auto/chip_wrap.dart';
import '../dart-ui-bs/auto/company_catalog_import_card.dart';
import '../dart-ui-bs/auto/empty_section.dart';
import '../dart-ui-bs/auto/facet_chip.dart';
import '../dart-ui-bs/auto/facet_row.dart';
import '../dart-ui-bs/auto/mini_qty_btn.dart';
import '../dart-ui-bs/auto/saved_version_chip.dart';
import '../dart-ui-bs/auto/section_header.dart';
import '../dart-ui-bs/auto/sheet_section.dart';
import '../dart-ui-bs/auto/tree_coming_soon.dart';
import '../dart-ui-bs/auto/value_chip.dart';
import '../dart-data-bs/auto/screens__catalog_screen_content.dart';

/// טוקני-העיצוב שהמסך צורך — הלוח מזרים מקטלוג-הטוקנים.
class CatalogScreenTokens {
  const CatalogScreenTokens({required this.color});
  final Color color;
}

class CatalogScreenComposed extends StatelessWidget {
  const CatalogScreenComposed({required this.onDelete, required this.onLoad, required this.onQtyChanged, required this.onTap, required this.onToggle, required this.activeMatch, required this.child, required this.count, required this.desc, required this.emoji, required this.expanded, required this.icon, required this.isSelected, required this.label, required this.name, required this.options, required this.price, required this.qty, required this.selected, required this.selected2, required this.text, required this.title, required this.value, required this.why, required this.t, super.key});

  final VoidCallback onDelete;
  final VoidCallback onLoad;
  final VoidCallback onQtyChanged;
  final VoidCallback onTap;
  final VoidCallback onToggle;
  final List<String>? activeMatch;
  final Widget child;
  final int count;
  final String desc;
  final String emoji;
  final bool expanded;
  final IconData icon;
  final bool isSelected;
  final String label;
  final String name;
  final List<String> options;
  final int? price;
  final int qty;
  final String? selected;
  final bool selected2;
  final String text;
  final String title;
  final String value;
  final String why;
  final CatalogScreenTokens t;

  @override
  Widget build(BuildContext context) => ListView(
        padding: const EdgeInsets.only(bottom: 24),
        children: [
          const SizedBox(height: 8),
          CompanyCatalogImportCard(
            label: company_catalog_import_card_label,
            label2: company_catalog_import_card_label2,
            label3: company_catalog_import_card_label3,
            label4: company_catalog_import_card_label4,
            onTap: onTap,
          ),
          SectionHeader(
            title: title,
          ),
          EmptySection(
            fallback: empty_section_fallback,
            emoji: emoji,
            label: label,
          ),
          FacetRow(
            label2: facet_row_label2,
            label: label,
            desc: desc,
            count: count,
            onTap: onTap,
          ),
          TreeComingSoon(
            fallback: tree_coming_soon_fallback,
            fallback2: tree_coming_soon_fallback2,
            title: title,
            emoji: emoji,
          ),
          CatalogCountBadge(
            label: label,
            count: count,
            color: t.color,
          ),
          SheetSection(
            title: title,
            value: value,
            expanded: expanded,
            onToggle: onToggle,
            child: child,
          ),
          ChipWrap(
            options: options,
            selected: selected,
          ),
          SavedVersionChip(
            message: saved_version_chip_message,
            label2: saved_version_chip_label2,
            message2: saved_version_chip_message2,
            label3: saved_version_chip_label3,
            label: label,
            onLoad: onLoad,
            onDelete: onDelete,
          ),
          AccRow(
            label: acc_row_label,
            label2: acc_row_label2,
            name: name,
            emoji: emoji,
            why: why,
            price: price,
            onTap: onTap,
            label3: acc_row_label3,
            label4: acc_row_label4,
            selected: selected2,
            qty: qty,
            onToggle: onToggle,
            onQtyChanged: onQtyChanged,
            activeMatch: activeMatch,
          ),
          MiniQtyBtn(
            label: mini_qty_btn_label,
            label2: mini_qty_btn_label2,
            icon: icon,
            onTap: onTap,
          ),
          ValueChip(
            text: text,
          ),
          AxisChip(
            label: label,
            isSelected: isSelected,
            onTap: onTap,
          ),
          FacetChip(
            label: label,
            count: count,
            isSelected: isSelected,
            onTap: onTap,
          ),
        ],
      );
}
