// 🛗 הורם ע"י מנוע-המדף v2 (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__budget_screen:_NumBox (בנייה-חכמה main) · צרור-3
import 'package:flutter/material.dart';
import '../ds/ds.dart';
import '../ds/ds_atoms.dart';
import 'bs_tokens.dart';

class NumBox extends StatelessWidget {
  NumBox(
      {required this.value,
      required this.label,
      required this.onTap,
      this.color = _ink0});
  final String value;
  final String label;
  final Color color;
  final VoidCallback onTap;
  @override
  Widget build(BuildContext context) => Expanded(
        child: Padding(
          padding: EdgeInsets.symmetric(horizontal: 3),
          child: InkWell(
            borderRadius: BorderRadius.circular(12),
            onTap: onTap,
            child: Container(
              padding: EdgeInsets.symmetric(vertical: 14),
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.surface,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: dsWear(context, DsAtomColors.autoNumBox1, (l) => l.ink)),
              ),
              child: Column(
                children: [
                  Text(value,
                      style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                          color: color)),
                  SizedBox(height: 2),
                  Text(label,
                      style: TextStyle(fontSize: 11, color: _muted(context))),
                ],
              ),
            ),
          ),
        ),
      );
}

const _ink0 = BsTokens.inkLight;

Color _ink(BuildContext context) => dsWear(context, BsTokens.inkLight, (l) => l.ink);   // לובש עור · _ink0 = הערך-הכהה


Color _muted(BuildContext context) => dsWear(context, DsAtomColors.autoNumBox2, (l) => l.muted);   // לובש עור · _muted0 = הערך-הכהה
