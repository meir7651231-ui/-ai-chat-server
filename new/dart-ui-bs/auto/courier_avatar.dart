// 🛗 הורם ע"י מנוע-המדף (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__courier_profile_screen:_CourierAvatar (בנייה-חכמה main)
// משרת-גם (זהה-מבנית): screens__worker_profile_screen:_ProfileAvatar
import 'package:flutter/material.dart';

class CourierAvatar extends StatelessWidget {
  const CourierAvatar({required this.photo, required this.size});

  final String? photo;
  final double size;

  @override
  Widget build(BuildContext context) {
    // Dual-render (A14): data-URL מפוענח מקומית; כתובת `https://…` שהועלתה
    // (kCloudPhotos ON) נטענת מ-R2 — שניהם דרך [imageProviderForRef]. אין תמונה
    // / payload פגום → אווטאר ברירת-המחדל.
    final provider = imageProviderForRef(photo);
    if (provider != null) {
      return ClipOval(
        child: Image(
          image: provider,
          width: size,
          height: size,
          fit: BoxFit.cover,
          gaplessPlayback: true,
          // payload פגום / טעינה שנכשלה → אווטאר ברירת-המחדל, לעולם לא קריסה.
          errorBuilder: (_, __, ___) => _fallback(),
        ),
      );
    }
    return _fallback();
  }

  Widget _fallback() => Container(
    width: size,
    height: size,
    alignment: Alignment.center,
    decoration: const BoxDecoration(
      color: Color(0xFFFFF0E3),
      shape: BoxShape.circle,
    ),
    // דקורטיבי: השם המלא נקרא ממש לידו.
    child: ExcludeSemantics(
      child: Text('🛵', style: TextStyle(fontSize: size * 0.46)),
    ),
  );
}
