import { hunt } from "./scripts/actions/hunt";
import { observe } from "./scripts/actions/observe";
import { builder } from "./scripts/actions/build";
import { setupCloudSaving } from "./scripts/actions/cloud-save";
import { upgrade } from "./scripts/actions/upgrade";
import { culture } from "./scripts/use-resources/culture";
import { useUpResources } from "./scripts/use-resources/general";
import { gold } from "./scripts/use-resources/gold";
import { faith } from "./scripts/use-resources/faith";
import { sacrifice } from "./scripts/actions/sacrifice";
import { cathBuildHierarchy } from "./ref/cath-build-hierarchy";
import { SCRITTIES_LOG } from "./config/log";
import { spaceBuildHierarchy } from "./ref/space-build-hierarchy";
import { researchCondition } from "./scripts/utility/conditions";
import { farm } from "./scripts/actions/farm";
import { antimatter } from './scripts/use-resources/antimatter';
import { combust } from "./scripts/actions/combust";

let huntInterval = setInterval(hunt, 5000);
let faithInterval = setInterval(faith, 5000);
let sacrificeInterval = setInterval(sacrifice, 30*1000);

let observeInterval = null;
if (!game.workshop.get('seti').researched) {
    observeInterval = setInterval(observe, 2000);
}

let cultureInterval = setInterval(culture, 5000);
let antimatterInterval = setInterval(antimatter, 30*1000);

// jQuery.expr[':'].icontains = function(a, i, m) {
//     return jQuery(a).text().toUpperCase()
//             .indexOf(m[3].toUpperCase()) >= 0;
// };

let farmInterval = setInterval(farm, 10000);

let useResourcesInterval = setInterval(() => {
    builder(game.bldTab, cathBuildHierarchy, 'CATH_BUILD_LastGroupReached');
    builder(game.spaceTab, spaceBuildHierarchy, 'SPACE_BUILD_LastGroupReached');
    useUpResources();
    gold(1 * 1000);
}, 1 * 1000);

let upgradeInterval = setInterval(upgrade, 2 * 1000);

let combustInterval = setInterval(combust, 3 * 60 * 1000);

// let cloudSaveInterval = setupCloudSaving();