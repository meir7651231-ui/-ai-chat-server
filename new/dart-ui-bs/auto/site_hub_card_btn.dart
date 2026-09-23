// 🛗 הורם ע"י מנוע-המדף v2 (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__site_hub_screen:_CardBtn (בנייה-חכמה main) · צרור-3
import 'package:flutter/material.dart';
import '../ds/ds.dart';
import 'bs_tokens.dart';

class SiteHubCardBtn extends StatelessWidget {
  const SiteHubCardBtn({required this.label, required this.onTap});
  final String label;
  final VoidCallback onTap;
  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.only(top: 9),
        child: SizedBox(
          width: double.infinity,
          child: OutlinedButton(
            onPressed: onTap,
            style: OutlinedButton.styleFrom(
              foregroundColor: _kBrandDark(context),
              side: BorderSide(color: _kBrand(context)),
              padding: const EdgeInsets.symmetric(vertical: 9),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(9),
              ),
            ),
            child: Text(
              label,
              style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 12),
            ),
          ),
        ),
      );
}

const _kBrandDark0 = BsTokens.brandDark;

Color _kBrandDark(BuildContext context) => dsWear(context, BsTokens.brandDark, (l) => l.accentDark);   // לובש עור · _kBrandDark0 = הערך-הכהה

const _kBrand0 = BsTokens.brand;

Color _kBrand(BuildContext context) => dsWear(context, BsTokens.brand, (l) => l.accent);   // לובש עור · _kBrand0 = הערך-הכהה
