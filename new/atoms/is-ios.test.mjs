import { isIos } from './is-ios.mjs';
if (JSON.stringify(isIos()) !== "false") { console.error('✗ סטה'); process.exit(1); }
console.log('✓ is-ios: צילום-גטר — ירוק');
