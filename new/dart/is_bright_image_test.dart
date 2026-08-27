import 'is_bright_image.dart';

// stub-אמת לשקע imageBrightness — מפה קטנה + null⇒-1, חסר⇒255 (התנהגות המקור).
const Map<String, int> _bright = {'dark.jpg': 30, 'mid.jpg': 100};
int imageBrightness(String? path) {
  if (path == null) return -1;
  return _bright[path] ?? 255;
}

void main() {
  // 30 < 100 ⇒ שחור, לא-שמיש.
  assert(isBrightImage('dark.jpg', imageBrightness: imageBrightness) == false);
  // 100 >= 100 ⇒ שמיש (על-הסף).
  assert(isBrightImage('mid.jpg', imageBrightness: imageBrightness) == true);
  // חסר ⇒ 255 ⇒ בהיר.
  assert(isBrightImage('unknown.jpg', imageBrightness: imageBrightness) == true);
  // null ⇒ -1 ⇒ לא-שמיש.
  assert(isBrightImage(null, imageBrightness: imageBrightness) == false);
  print('isBrightImage OK');
}
