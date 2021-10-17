import { SCRITTIES_LOG } from "./config/log";
import { SCRITTIES_SETTINGS } from "./config/settings";
import { resourceToResourceMapping } from "./ref/res-to-res";
import { farm } from "./scripts/actions/farm";
import { hunt } from "./scripts/actions/hunt";
import { observe } from "./scripts/actions/observe";
import { useUpResources } from "./scripts/use-resources/general";

SCRITTIES_LOG.observe = true;
let observeInterval = setInterval(observe, 2000);

SCRITTIES_LOG.farm = true;
SCRITTIES_SETTINGS.farm = true;
let farmInterval = setInterval(farm, 2000);

SCRITTIES_LOG.catpower.hunt = true;
SCRITTIES_SETTINGS.catpower.hunt = true;
SCRITTIES_LOG.catpower.parchment = false;
SCRITTIES_SETTINGS.catpower.parchment = false;
let huntInterval = setInterval(hunt, 5000);

SCRITTIES_LOG.crafting.capPrevention = true;
resourceToResourceMapping.splice(0, 1);
resourceToResourceMapping.splice(4);
let useResourcesInterval = setInterval(() => {
    // builder();
    // minerals();
    useUpResources();
}, 1 * 1000);