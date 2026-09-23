// 🛗 הורם ע"י מנוע-המדף v2 (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__lipskey_product_sheet:_PickerOption (בנייה-חכמה main) · Stateless
import 'package:flutter/material.dart';
import '../ds/ds_atoms.dart';

class PickerOption extends StatelessWidget {
  const PickerOption({
    required this.value,
    required this.isSelected,
    required this.onTap,
  });

  final String value;
  final bool isSelected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
        decoration: BoxDecoration(
          color: isSelected
              ? DsAtomColors.autoPickerOption1.withValues(alpha: 0.2)
              : DsAtomColors.autoPickerOption2,
          borderRadius: BorderRadius.circular(6),
          border: Border.all(
            color:
                isSelected ? DsAtomColors.autoPickerOption1 : DsAtomColors.autoPickerOption3,
            width: isSelected ? 1.5 : 1.0,
          ),
        ),
        child: Text(
          value,
          style: TextStyle(
            color:
                isSelected ? DsAtomColors.autoPickerOption1 : DsAtomColors.autoPickerOption4,
            fontSize: 12,
            fontWeight: isSelected ? FontWeight.w700 : FontWeight.w400,
          ),
        ),
      ),
    );
  }
}
