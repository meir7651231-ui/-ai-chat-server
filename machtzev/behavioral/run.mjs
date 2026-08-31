#!/usr/bin/env node
// 🏅 רתמת-זהב · בדיקות-התנהגות על אפליקציה-מחוללת ("מתקמפל"≠"עובד"): מזריקה את
// אטומי-ה-DS + הבדיקות לפרויקט-flutter (buildsmart) ומריצה flutter test. מוכיח את
// מוח-הריצה (AppStore) ואת לולאת טופס→שמירה→טבלה על האטומים האמיתיים.
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
const HERE = new URL('.', import.meta.url).pathname;
const DS = path.join(HERE, '../../new/dart-ui-bs/ds');
const APP = '/home/user/buildsmart/app_flutter';
const gen = path.join(APP, 'test/_gen');
fs.mkdirSync(gen, { recursive: true });
for (const f of ['ds', 'ds_field', 'ds_store', 'ds_persist_stub', 'ds_persist_web']) fs.copyFileSync(path.join(DS, `${f}.dart`), path.join(gen, `${f}.dart`));
for (const t of fs.readdirSync(HERE).filter((f) => f.endsWith('_test.dart'))) fs.copyFileSync(path.join(HERE, t), path.join(APP, 'test', t));
try {
  execSync('flutter test test/gen_store_behavior_test.dart test/gen_widget_behavior_test.dart', { cwd: APP, stdio: 'inherit', env: { ...process.env, PATH: `/home/user/flutter/bin:${process.env.PATH}` } });
} finally {
  fs.rmSync(gen, { recursive: true, force: true });
  for (const t of fs.readdirSync(HERE).filter((f) => f.endsWith('_test.dart'))) fs.rmSync(path.join(APP, 'test', t), { force: true });
}
