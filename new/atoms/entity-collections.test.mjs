import * as m from './entity-collections.mjs';
const SNAP = {"ENTITY_COLLECTIONS":"[\"families\",\"courses\",\"enrollments\",\"events\",\"rooms\",\"teachers\",\"supporters\",\"tzCoordinators\",\"tzBoxes\",\"tzCampaigns\",\"tzEvents\",\"shopItems\",\"shopProducts\",\"shopStores\",\"shopCriteria\",\"shopAssignments\",\"shopEvents\",\"shopIntakes\",\"volunteers\",\"distributionDays\",\"deliveries\",\"tasks\",\"warehouse\"]"};
let f = 0;
for (const [k, s] of Object.entries(SNAP)) if (JSON.stringify(m[k]) !== s) { console.error('✗ ' + k + ' סטה מהצילום'); f = 1; }
if (f) process.exit(1); console.log('✓ entity-collections: צילום-ערך תואם — ירוק');
