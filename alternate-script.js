import { SCRITTIES_SETTINGS } from "./config/settings";
import { resourceToResourceMapping } from "./ref/res-to-res";
import { farm } from "./scripts/actions/farm";
import { hunt } from "./scripts/actions/hunt";
import { observe } from "./scripts/actions/observe";
import { useUpResources } from "./scripts/use-resources/general";
import { upgrade } from "./scripts/actions/upgrade";
import { constructionAutoUpgrades } from "./ref/upgrade-mapping";


// SCRITTIES_LOG.catpower.hunt = true;
// SCRITTIES_LOG.catpower.parchment = true;
let huntInterval = setInterval(hunt, 5000);

// SCRITTIES_LOG.farm = true;
SCRITTIES_SETTINGS.farm = true;
let farmInterval = setInterval(farm, 2000);

// SCRITTIES_LOG.observe = true;
let observeInterval = null;
if (!game.workshop.get('seti').researched) {
    observeInterval = setInterval(observe, 2000);
}

resourceToResourceMapping.splice(5);
let useResourcesInterval = setInterval(() => {
    // builder(game.bldTab, cathBuildHierarchy, 'CATH_BUILD_LastGroupReached');
    // builder(game.spaceTab, spaceBuildHierarchy, 'SPACE_BUILD_LastGroupReached');
    useUpResources();
    // gold(1 * 1000);
}, 1 * 1000);

constructionAutoUpgrades.splice(0, 3);
constructionAutoUpgrades.splice(5);
let upgradeInterval = setInterval(upgrade, 2 * 1000);
